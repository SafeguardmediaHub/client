"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TryCounter } from "./TryCounter";

export function TryHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
        {/* Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-blue-600/40 blur-md transition duration-300 group-hover:bg-blue-500/50" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Safeguardmedia
            </span>
          </Link>
        </div>

        {/* Counter — centered */}
        <div className="flex flex-1 justify-center">
          <TryCounter />
        </div>

        {/* Auth buttons */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900"
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
        </div>
      </div>
    </header>
  );
}
