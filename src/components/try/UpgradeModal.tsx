"use client";

import { ArrowRight, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAnonymousSession } from "./AnonymousSessionContext";

export function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, meta } = useAnonymousSession();

  if (meta.mode !== "authenticated") return null;

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border-slate-200 p-0 shadow-2xl shadow-slate-900/10">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />

          <div className="relative">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/25">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                You&apos;ve used all your analyses this month
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-slate-500">
                Upgrade your plan to keep running analyses without waiting for
                your monthly quota to reset.
              </DialogDescription>
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-sm text-slate-700">
                  Upgrading gives you a higher monthly quota and access to
                  advanced features across all tools.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setShowUpgradeModal(false)}
              >
                <Link href="/dashboard">
                  View upgrade options
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-xl border-slate-200 text-slate-700"
                onClick={() => setShowUpgradeModal(false)}
              >
                Maybe later
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
