'use client';

import { CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if there's an error from the OAuth flow
        const error = searchParams.get('error');
        if (error) {
          setStatus('error');
          setErrorMessage(decodeURIComponent(error));
          toast.error(`Authentication failed: ${decodeURIComponent(error)}`);
          return;
        }

        // Verify authentication by fetching user data
        const response = await api.get('/api/users/me');

        if (response.data?.data?.user) {
          setStatus('success');
          toast.success('Successfully signed in with Google!');

          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          throw new Error('Failed to verify authentication');
        }
      } catch (error) {
        console.error('OAuth verification error:', error);
        setStatus('error');
        setErrorMessage('Failed to verify authentication. Please try again.');
        toast.error('Authentication failed. Please try again.');
      }
    };

    verifyAuth();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {status === 'loading' && (
              <>
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Completing sign-in...
                </h2>
                <p className="text-sm text-gray-600">
                  Please wait while we verify your authentication
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="relative">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Sign-in successful!
                </h2>
                <p className="text-sm text-gray-600">
                  Redirecting you to the dashboard...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="relative">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Authentication failed
                </h2>
                <p className="text-sm text-gray-600">
                  {errorMessage || 'Something went wrong during sign-in'}
                </p>
                <div className="flex gap-3 mt-4 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/auth/login')}
                  >
                    Back to login
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Loading...
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <OAuthCallback />
    </Suspense>
  );
}
