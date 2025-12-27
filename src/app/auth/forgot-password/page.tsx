"use client";

import { CheckCircle2, GalleryVerticalEnd, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    forgotPassword(email, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
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
          <div className="w-full max-w-xs">
            {!isSubmitted ? (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
                  <p className="text-muted-foreground text-balance max-w-sm">
                    No worries! Enter your email address and we&apos;ll send you a link to reset your password
                  </p>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isPending}
                      className="transition-all"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <a
                    href="/auth/login"
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                  >
                    Back to sign in
                  </a>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
                  <p className="text-muted-foreground text-balance max-w-sm">
                    If an account with <span className="font-medium text-foreground">{email}</span> exists, we&apos;ve sent you a password reset link. Please check your inbox and spam folder.
                  </p>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Didn&apos;t receive the email?{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                  >
                    Try again
                  </button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <a
                    href="/auth/login"
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                  >
                    Back to sign in
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://plus.unsplash.com/premium_photo-1680608979589-e9349ed066d5?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="forgot password img"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
