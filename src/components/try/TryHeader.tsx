"use client";

import { Loader2, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAnonymousSession } from "./AnonymousSessionContext";
import { TryCounter } from "./TryCounter";

export function TryHeader() {
  const { meta } = useAnonymousSession();
  const router = useRouter();
  const [switching, setSwitching] = useState(false);

  async function switchToFullDashboard() {
    setSwitching(true);
    try {
      await api.patch("/api/users/me/preferences", { dashboardMode: "full" });
      router.push("/dashboard");
    } catch {
      toast.error("Failed to switch dashboard. Please try again.");
      setSwitching(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:gap-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2 sm:gap-2.5">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-blue-600/40 blur-md transition duration-300 group-hover:bg-blue-500/50" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>
          <span className="hidden text-sm font-semibold text-slate-900 sm:inline">
            Safeguardmedia
          </span>
        </Link>

        {/* Counter — centered */}
        <div className="flex min-w-0 flex-1 justify-center">
          <TryCounter />
        </div>

        {/* Auth buttons */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {meta.mode === "authenticated" ? (
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={switchToFullDashboard}
              disabled={switching}
            >
              {switching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Go to full dashboard"
              )}
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden text-slate-600 hover:text-slate-900 sm:inline-flex"
              >
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
