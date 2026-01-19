'use client';

import { AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useJoinWaitlist } from '@/hooks/useWaitlist';
import type { UserType } from '@/lib/api/waitlist';
import { cn } from '@/lib/utils';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('');
  const [organization, setOrganization] = useState('');
  const [useCase, setUseCase] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const joinWaitlistMutation = useJoinWaitlist();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    // Basic email regex that requires a proper domain extension
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !userType) {
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!agreedToTerms) {
      return;
    }

    joinWaitlistMutation.mutate(
      {
        email,
        firstName,
        lastName,
        userType: userType ? (userType as UserType) : undefined,
        organization: organization || undefined,
        useCase: useCase || undefined,
        referralSource: referralSource || undefined,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          // Reset form
          setEmail('');
          setFirstName('');
          setLastName('');
          setUserType('');
          setOrganization('');
          setUseCase('');
          setReferralSource('');
          setAgreedToTerms(false);
        },
      },
    );
  };

  if (isSubmitted) {
    return (
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[hsl(220,40%,15%)] via-[hsl(220,35%,20%)] to-[hsl(220,40%,15%)]">
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(190,95%,55%)] to-[hsl(190,95%,45%)] mb-8 shadow-2xl shadow-[hsl(190,95%,55%)]/50">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            You're on the list!
          </h2>
          <p className="text-xl text-[hsl(190,95%,75%)] mb-8">
            We'll notify you as soon as our beta launches. Get ready to
            experience the future of media verification.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="border-[hsl(190,95%,55%)] text-[hsl(190,95%,55%)] hover:bg-[hsl(190,95%,55%)]/10"
          >
            Join Another Person
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[hsl(220,40%,15%)] via-[hsl(220,35%,20%)] to-[hsl(220,40%,15%)]">
      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      {/* Geometric Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(190,95%,55%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(190,95%,55%)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Diagonal Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-br from-[hsl(35,85%,60%)]/20 to-transparent transform skew-x-12 translate-x-1/4" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(190,95%,55%)]/10 border border-[hsl(190,95%,55%)]/30 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[hsl(190,95%,55%)]" />
            <span className="text-sm font-bold text-[hsl(190,95%,55%)] uppercase tracking-wider">
              Beta Launching Soon
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Join the
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(190,95%,55%)] via-[hsl(190,95%,65%)] to-[hsl(35,85%,60%)]">
              Waitlist
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Be among the first to experience our comprehensive media
            verification platform. Join the beta and help shape the future of
            digital trust.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(190,95%,55%)] via-[hsl(35,85%,60%)] to-[hsl(190,95%,55%)] rounded-3xl blur-2xl opacity-20 animate-pulse-slow" />

          <div className="relative space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white font-semibold">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={joinWaitlistMutation.isPending}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white font-semibold">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={joinWaitlistMutation.isPending}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50 h-12"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={handleEmailChange}
                disabled={joinWaitlistMutation.isPending}
                required
                className={cn(
                  'bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50 h-12',
                  emailError &&
                    'border-red-400 focus:border-red-400 focus:ring-red-400/50',
                )}
              />
              {emailError && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {emailError}
                </p>
              )}
            </div>

            {/* User Type */}
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-white font-semibold">
                I am a...
              </Label>
              <Select
                value={userType}
                onValueChange={setUserType}
                disabled={joinWaitlistMutation.isPending}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50 h-12">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Content Creator/Influencer">
                    Content Creator/Influencer
                  </SelectItem>
                  <SelectItem value="Journalist/Reporter">
                    Journalist/Reporter
                  </SelectItem>
                  <SelectItem value="Educator/Teacher">
                    Educator/Teacher
                  </SelectItem>
                  <SelectItem value="Researcher/Academic">
                    Researcher/Academic
                  </SelectItem>
                  <SelectItem value="Freelancer/Consultant">
                    Freelancer/Consultant
                  </SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Individual User">
                    Individual User
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Organization (Optional) */}
            <div className="space-y-2">
              <Label
                htmlFor="organization"
                className="text-white font-semibold"
              >
                Organization{' '}
                <span className="text-gray-400 text-sm font-normal">
                  (Optional)
                </span>
              </Label>
              <Input
                id="organization"
                type="text"
                placeholder="Your company or institution"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                disabled={joinWaitlistMutation.isPending}
                maxLength={100}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50 h-12"
              />
            </div>

            {/* Use Case (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="useCase" className="text-white font-semibold">
                How will you use SafeguardMedia?{' '}
                <span className="text-gray-400 text-sm font-normal">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="useCase"
                placeholder="Tell us about your verification needs..."
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                disabled={joinWaitlistMutation.isPending}
                maxLength={500}
                rows={3}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50 resize-none"
              />
              <p className="text-xs text-gray-400">
                {useCase.length}/500 characters
              </p>
            </div>

            {/* Referral Source (Optional) */}
            <div className="space-y-2">
              <Label
                htmlFor="referralSource"
                className="text-white font-semibold"
              >
                How did you hear about us?{' '}
                <span className="text-gray-400 text-sm font-normal">
                  (Optional)
                </span>
              </Label>
              <Input
                id="referralSource"
                type="text"
                placeholder="Google, Twitter, friend, etc."
                value={referralSource}
                onChange={(e) => setReferralSource(e.target.value)}
                disabled={joinWaitlistMutation.isPending}
                maxLength={100}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50 h-12"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked === true)
                }
                disabled={joinWaitlistMutation.isPending}
                required
                className="mt-0.5 border-white/30 data-[state=checked]:bg-[hsl(190,95%,55%)] data-[state=checked]:border-[hsl(190,95%,55%)]"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-300 leading-relaxed cursor-pointer"
              >
                I agree to receive updates about the SafeguardMedia beta and
                accept the{' '}
                <a
                  href="/terms"
                  className="text-[hsl(190,95%,55%)] underline underline-offset-2 hover:text-[hsl(190,95%,65%)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  className="text-[hsl(190,95%,55%)] underline underline-offset-2 hover:text-[hsl(190,95%,65%)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={
                !agreedToTerms ||
                !email ||
                !firstName ||
                !lastName ||
                !userType ||
                !!emailError ||
                joinWaitlistMutation.isPending
              }
              className={cn(
                'w-full h-14 text-lg font-bold rounded-xl transition-all duration-300',
                'bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(190,95%,45%)]',
                'hover:from-[hsl(190,95%,60%)] hover:to-[hsl(190,95%,50%)]',
                'shadow-lg shadow-[hsl(190,95%,55%)]/50 hover:shadow-xl hover:shadow-[hsl(190,95%,55%)]/60',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {joinWaitlistMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Joining Waitlist...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Join the Waitlist
                </>
              )}
            </Button>

            {/* Error Message */}
            {joinWaitlistMutation.isError && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-400">
                  {joinWaitlistMutation.error?.message ||
                    'Failed to join waitlist. Please try again.'}
                </p>
              </div>
            )}
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
