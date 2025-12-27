'use client';

import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/useAuth';
import { cn, validatePasswordStrength } from '@/lib/utils';
import { PasswordStrengthIndicator } from './passwordLengthIndicator';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);

  const registerMutation = useRegister();

  // Validate password on change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword) {
      const validation = validatePasswordStrength(newPassword);
      setPasswordErrors(validation.errors);
      setShowPasswordErrors(true);
    } else {
      setPasswordErrors([]);
      setShowPasswordErrors(false);
    }
  };

  // Handle Google OAuth sign-in
  const handleGoogleSignIn = () => {
    if (!agreedToTerms) {
      toast.error('You must agree to the Terms and Privacy Policy to continue');
      return;
    }

    // Redirect to backend OAuth endpoint
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';
    const oauthUrl = `${backendUrl}/api/auth/oauth/google?termsAgreed=true`;
    window.location.href = oauthUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!agreedToTerms) {
      toast.error('You must agree to the Terms to continue');
      return;
    }

    // Validate password strength before submission
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      setShowPasswordErrors(true);
      toast.error('Please fix password requirements before continuing');
      return;
    }

    registerMutation.mutate({ email, password, firstName, lastName });
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground text-balance max-w-sm">
          Get started with SafeguardMedia to verify and protect your content
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="hello@johndoe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={registerMutation.isPending}
            required
            className="transition-all"
          />
          <p className="text-xs text-muted-foreground leading-relaxed">
            We'll send a verification link to this address
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="firstname" className="text-sm font-medium">First name</Label>
            <Input
              id="firstname"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              disabled={registerMutation.isPending}
              required
              className="transition-all"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastname" className="text-sm font-medium">Last name</Label>
            <Input
              id="lastname"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              disabled={registerMutation.isPending}
              required
              className="transition-all"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              disabled={registerMutation.isPending}
              required
              className={cn(
                "pr-10 transition-all",
                showPasswordErrors && passwordErrors.length > 0 && "border-destructive focus-visible:ring-destructive"
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={registerMutation.isPending}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Use 8 or more characters with a mix of letters and numbers
          </p>
          {/* <PasswordStrengthIndicator password={password} show={!!password} /> */}

          {/* Password validation errors */}
          {showPasswordErrors && passwordErrors.length > 0 && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">
                  Password requirements not met
                </p>
              </div>
              <ul className="ml-6 space-y-1 text-xs text-destructive/90 list-disc">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:bg-muted/80">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              disabled={registerMutation.isPending}
              className="mt-0.5"
              required
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-relaxed cursor-pointer"
              >
                I agree to the Terms and Privacy Policy
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By creating an account, you agree to our{' '}
                <a
                  href="/terms"
                  className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          className={cn(
            "w-full shadow-md hover:shadow-lg transition-all",
            passwordErrors.length > 0
              ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          )}
          disabled={!agreedToTerms || registerMutation.isPending || passwordErrors.length > 0}
          title={passwordErrors.length > 0 ? "Please fix password requirements" : undefined}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating your account...
            </>
          ) : passwordErrors.length > 0 ? (
            <>
              <AlertCircle className="mr-2 h-4 w-4" />
              Fix password requirements
            </>
          ) : (
            "Create account"
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
          disabled={!agreedToTerms}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="mr-2 h-5 w-5"
            aria-hidden="true"
            focusable="false"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <a
          href="/auth/login"
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          Sign in
        </a>
      </div>
    </form>
  );
}
