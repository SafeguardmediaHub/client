'use client';

import {
  ArrowRight,
  CheckCircle2,
  GalleryVerticalEnd,
  Loader2,
  Mail,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResendVerificationEmail, useVerifyEmail } from '@/hooks/useAuth';

type VerificationState =
  | 'verifying'
  | 'success'
  | 'error'
  | 'no-token'
  | 'request-email';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationState, setVerificationState] =
    useState<VerificationState>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const { mutate: verifyEmail } = useVerifyEmail();
  const { mutate: resendVerification, isPending: isResending } =
    useResendVerificationEmail();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setVerificationState('no-token');
      return;
    }

    // Trigger email verification
    verifyEmail(token, {
      onSuccess: () => {
        setVerificationState('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      },
      onError: (error: unknown) => {
        setVerificationState('error');
        let message =
          'Email verification failed. The link may be invalid or expired.';
        if (
          typeof error === 'object' &&
          error !== null &&
          // @ts-expect-error narrow runtime shape safely
          error.response &&
          // @ts-expect-error narrow runtime shape safely
          error.response.data &&
          // @ts-expect-error narrow runtime shape safely
          typeof error.response.data.message === 'string'
        ) {
          // @ts-expect-error see guards above
          message = error.response.data.message as string;
        }
        setErrorMessage(message);
      },
    });
  }, [searchParams, verifyEmail, router]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      validateEmail(value);
    }
  };

  const handleRequestVerification = () => {
    if (!validateEmail(email)) {
      return;
    }

    resendVerification(email, {
      onSuccess: () => {
        setVerificationState('success');
        setErrorMessage('');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      },
      onError: (error: unknown) => {
        let message = 'Failed to send verification email. Please try again.';
        if (
          typeof error === 'object' &&
          error !== null &&
          // @ts-expect-error narrow runtime shape safely
          error.response &&
          // @ts-expect-error narrow runtime shape safely
          error.response.data &&
          // @ts-expect-error narrow runtime shape safely
          typeof error.response.data.message === 'string'
        ) {
          // @ts-expect-error see guards above
          message = error.response.data.message as string;
        }
        setErrorMessage(message);
      },
    });
  };

  const handleNavigateToLogin = () => {
    router.push('/auth/login');
  };

  const handleResendVerification = () => {
    setVerificationState('request-email');
    setErrorMessage('');
    setEmail('');
    setEmailError('');
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Safeguard Media.
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            {/* Verifying State */}
            {verificationState === 'verifying' && (
              <div className="flex flex-col gap-6 text-center">
                <div className="flex justify-center">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-full">
                    <Loader2 className="size-12 text-blue-600 dark:text-blue-400 animate-spin" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Verifying Your Email
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Please wait while we verify your email address. This will
                    only take a moment.
                  </p>
                </div>
              </div>
            )}

            {/* Success State */}
            {verificationState === 'success' && (
              <div className="flex flex-col gap-6 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-full">
                    <CheckCircle2 className="size-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight text-green-900 dark:text-green-100">
                    {searchParams.get('token')
                      ? 'Email Verified Successfully!'
                      : 'Verification Email Sent!'}
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    {searchParams.get('token')
                      ? 'Your email has been verified. You will be redirected to the login page shortly.'
                      : 'A new verification link has been sent to your email address. Please check your inbox and click the link to verify your account.'}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={handleNavigateToLogin}
                    className="w-full cursor-pointer"
                  >
                    Continue to Login
                    <ArrowRight className="size-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground cursor-pointer">
                    Redirecting automatically in 3 seconds...
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {verificationState === 'error' && (
              <div className="flex flex-col gap-6 text-center">
                <div className="flex justify-center">
                  <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-full">
                    <XCircle className="size-12 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight text-red-900 dark:text-red-100">
                    Verification Failed
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    {errorMessage}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={handleResendVerification}
                    variant="outline"
                    className="w-full cursor-pointer"
                  >
                    <Mail className="size-4" />
                    Request New Verification Link
                  </Button>
                  <Button
                    onClick={handleNavigateToLogin}
                    variant="ghost"
                    className="w-full cursor-pointer"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            )}

            {/* No Token State */}
            {verificationState === 'no-token' && (
              <div className="flex flex-col gap-6 text-center">
                <div className="flex justify-center">
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-full">
                    <Mail className="size-12 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Invalid Verification Link
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    This verification link is invalid or incomplete. Please
                    check your email for the correct link or request a new
                    verification email.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={handleResendVerification}
                    className="w-full cursor-pointer"
                  >
                    <Mail className="size-4" />
                    Request Verification Link
                  </Button>
                  <Button
                    onClick={handleNavigateToLogin}
                    variant="outline"
                    className="w-full cursor-pointer"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            )}

            {/* Request Email State */}
            {verificationState === 'request-email' && (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-full">
                      <Mail className="size-12 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold tracking-tight">
                      Request Verification Email
                    </h1>
                    <p className="text-muted-foreground text-balance">
                      Enter your email address to receive a new verification
                      link.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={handleEmailChange}
                      className={
                        emailError
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : ''
                      }
                      required
                    />
                    {emailError && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {emailError}
                      </p>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errorMessage}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleRequestVerification}
                      disabled={isResending || !email}
                      className="w-full"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="size-4" />
                          Request Verification Link
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleNavigateToLogin}
                      variant="outline"
                      className="w-full"
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://plus.unsplash.com/premium_photo-1680608979589-e9349ed066d5?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Email verification"
          fill
          unoptimized
          className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-svh lg:grid-cols-2">
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-md">
                <div className="flex flex-col gap-6 text-center">
                  <div className="flex justify-center">
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-full">
                      <Loader2 className="size-12 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden lg:block" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
