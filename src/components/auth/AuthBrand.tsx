"use client";

import { Shield } from "lucide-react";
import Link from "next/link";

export default function AuthBrand() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3 font-medium">
      <div className="relative">
        <div className="absolute -inset-1 rounded-xl bg-blue-600/50 blur-md transition duration-300 group-hover:bg-blue-500/60" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
          <Shield className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="leading-tight">
        <p className="font-semibold tracking-tight text-slate-900">
          Safeguardmedia
        </p>
        <p className="text-xs text-slate-500">Technologies</p>
      </div>
    </Link>
  );
}
