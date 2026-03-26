"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useJoinWaitlist } from "@/hooks/useWaitlist";
import type { UserType } from "@/lib/api/waitlist";
import { cn } from "@/lib/utils";

const accessBenefits = [
  "Early access to AI media detection workflows",
  "Authenticity and provenance verification tools",
  "A workspace built for high-trust investigations",
];

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("");
  const [organization, setOrganization] = useState("");
  const [useCase, setUseCase] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const joinWaitlistMutation = useJoinWaitlist();

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail && !validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !userType) {
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
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
          setEmail("");
          setFirstName("");
          setLastName("");
          setUserType("");
          setOrganization("");
          setUseCase("");
          setReferralSource("");
          setAgreedToTerms(false);
          setShowOptionalFields(false);
        },
      },
    );
  };

  if (isSubmitted) {
    return (
      <section
        id="waitlist"
        className="relative overflow-hidden bg-[hsl(220,40%,15%)] py-28"
      >
        <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(190,95%,55%)] to-[hsl(190,95%,45%)] shadow-2xl shadow-[hsl(190,95%,55%)]/30">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Access request received.
          </h2>
          <p className="mt-5 text-lg leading-8 text-cyan-100">
            We&apos;ll reach out as early access expands. You&apos;re now in the
            queue for product updates from Safeguardmedia Technologies.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="mt-8 border-cyan-400/50 bg-transparent text-cyan-100 hover:bg-cyan-400/10 hover:text-white"
          >
            Submit another request
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-gradient-to-br from-[hsl(220,40%,15%)] via-[hsl(220,35%,20%)] to-[hsl(220,40%,15%)] py-28"
    >
      <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(190,95%,55%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(190,95%,55%)_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>
      <div className="absolute right-0 top-0 h-full w-1/3 translate-x-1/4 skew-x-12 bg-gradient-to-br from-[hsl(35,85%,60%)]/20 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(190,95%,55%)]/30 bg-[hsl(190,95%,55%)]/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-[hsl(190,95%,55%)]" />
            <span className="text-sm font-bold uppercase tracking-wider text-[hsl(190,95%,55%)]">
              Request early access
            </span>
          </div>
          <h2 className="mt-6 text-5xl font-bold leading-tight text-white md:text-7xl">
            Join the
            <br />
            <span className="bg-gradient-to-r from-[hsl(190,95%,55%)] via-[hsl(190,95%,65%)] to-[hsl(35,85%,60%)] bg-clip-text text-transparent">
              Access List
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-gray-300">
            Request early access to the platform and tell us a little about the
            role or team you want to support with these verification workflows.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {accessBenefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-slate-200 backdrop-blur-sm"
            >
              {benefit}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-10"
        >
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-[hsl(190,95%,55%)] via-[hsl(35,85%,60%)] to-[hsl(190,95%,55%)] opacity-15 blur-2xl" />

          <div className="relative space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-semibold text-white">
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
                  className="h-12 border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-semibold text-white">
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
                  className="h-12 border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-white">
                Work Email
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
                  "h-12 border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50",
                  emailError &&
                    "border-red-400 focus:border-red-400 focus:ring-red-400/50",
                )}
              />
              {emailError && (
                <p className="flex items-center gap-1 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType" className="font-semibold text-white">
                Your Role
              </Label>
              <Select
                value={userType}
                onValueChange={setUserType}
                disabled={joinWaitlistMutation.isPending}
              >
                <SelectTrigger className="h-12 border-white/20 bg-white/10 text-white focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50">
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

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <button
                type="button"
                onClick={() => setShowOptionalFields((current) => !current)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <div>
                  <div className="text-sm font-semibold text-white">
                    Add more context
                  </div>
                  <div className="mt-1 text-sm text-slate-300">
                    Optional fields for team, use case, and referral details.
                  </div>
                </div>
                {showOptionalFields ? (
                  <ChevronUp className="h-5 w-5 text-slate-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-300" />
                )}
              </button>

              {showOptionalFields && (
                <div className="mt-5 space-y-6 border-t border-white/10 pt-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="organization"
                      className="font-semibold text-white"
                    >
                      Organization
                    </Label>
                    <Input
                      id="organization"
                      type="text"
                      placeholder="Your company or institution"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      disabled={joinWaitlistMutation.isPending}
                      maxLength={100}
                      className="h-12 border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="useCase"
                      className="font-semibold text-white"
                    >
                      How will you use Safeguardmedia Technologies?
                    </Label>
                    <Textarea
                      id="useCase"
                      placeholder="Tell us about your verification needs..."
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      disabled={joinWaitlistMutation.isPending}
                      maxLength={500}
                      rows={3}
                      className="resize-none border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50"
                    />
                    <p className="text-xs text-gray-400">
                      {useCase.length}/500 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="referralSource"
                      className="font-semibold text-white"
                    >
                      How did you hear about us?
                    </Label>
                    <Input
                      id="referralSource"
                      type="text"
                      placeholder="Referral, search, social media, etc."
                      value={referralSource}
                      onChange={(e) => setReferralSource(e.target.value)}
                      disabled={joinWaitlistMutation.isPending}
                      maxLength={100}
                      className="h-12 border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-[hsl(190,95%,55%)] focus:ring-[hsl(190,95%,55%)]/50"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked === true)
                }
                disabled={joinWaitlistMutation.isPending}
                required
                className="mt-0.5 border-white/30 data-[state=checked]:border-[hsl(190,95%,55%)] data-[state=checked]:bg-[hsl(190,95%,55%)]"
              />
              <Label
                htmlFor="terms"
                className="cursor-pointer text-sm leading-relaxed text-gray-300"
              >
                I agree to receive updates about the Safeguardmedia Technologies
                beta and accept the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[hsl(190,95%,55%)] underline underline-offset-2 hover:text-[hsl(190,95%,65%)]"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[hsl(190,95%,55%)] underline underline-offset-2 hover:text-[hsl(190,95%,65%)]"
                >
                  Privacy Policy
                </a>
                .
              </Label>
            </div>

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
                "h-14 w-full rounded-xl text-lg font-bold transition-all duration-300",
                "bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(190,95%,45%)]",
                "shadow-lg shadow-[hsl(190,95%,55%)]/35 hover:from-[hsl(190,95%,60%)] hover:to-[hsl(190,95%,50%)] hover:shadow-xl hover:shadow-[hsl(190,95%,55%)]/45",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {joinWaitlistMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending request...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Request Beta Access
                </>
              )}
            </Button>

            {joinWaitlistMutation.isError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-400">
                  {joinWaitlistMutation.error?.message ||
                    "Failed to submit your request. Please try again."}
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
