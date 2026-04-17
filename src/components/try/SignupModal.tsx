"use client";

import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAnonymousSession } from "./AnonymousSessionContext";

const BENEFITS = [
  "Save all 3 of your analysis results",
  "Run unlimited analyses",
  "Access all platform features",
  "Export reports and findings",
];

export function SignupModal() {
  const { showSignupModal, setShowSignupModal } = useAnonymousSession();

  return (
    <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border-slate-200 p-0 shadow-2xl shadow-slate-900/10">
        <div className="relative p-8">
          {/* Blobs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />

          <div className="relative">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/25">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                You&apos;ve used all 3 free analyses
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-slate-500">
                Create a free account to continue — your results will be saved.
              </DialogDescription>
            </div>

            <div className="mt-6 space-y-2">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setShowSignupModal(false)}
              >
                <Link href="/auth/signup">
                  Create free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-xl border-slate-200 text-slate-700"
                onClick={() => setShowSignupModal(false)}
              >
                <Link href="/auth/login">Log in to existing account</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
