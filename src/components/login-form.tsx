'use client';

import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface LoginFormProps extends React.ComponentProps<'form'> {
  isAccountExistsError?: boolean;
}

export function LoginForm({
  className,
  isAccountExistsError,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    login(email, password);
    // Navigation is handled inside AuthContext on success
  };

  // Handle Google OAuth sign-in
  const handleGoogleSignIn = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';
    const oauthUrl = `${backendUrl}/api/auth/oauth/google`;
    window.location.href = oauthUrl;
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isAccountExistsError ? 'Account Exists' : 'Welcome back'}
        </h1>
        <p className="text-muted-foreground text-balance max-w-sm">
          {isAccountExistsError
            ? 'An account with this email already exists. Please sign in with your email and password to continue.'
            : 'Sign in to your account to continue verifying and protecting your content'}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoggingIn}
            required
            className="transition-all"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <a
              href="/auth/forgot-password"
              className="ml-auto text-sm font-medium text-primary underline-offset-4 hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoggingIn}
              required
              className="pr-10 transition-all"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoggingIn}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing you in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full hover:bg-gray-50 transition-colors"
          onClick={handleGoogleSignIn}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="mr-2 h-5 w-5"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Continue with Google
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <a
          href="/auth/signup"
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          Create account
        </a>
      </div>
    </form>
  );
}
