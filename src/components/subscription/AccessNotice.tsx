"use client";

import { AlertTriangle, Lock } from "lucide-react";
import type { FeatureAccessState } from "@/lib/subscription-access";
import {
  getFeatureStateTitle,
  getFeatureToneClasses,
} from "@/lib/subscription-access";

type Tone = "feature" | "limit";

export function AccessNotice({
  state,
  message,
  tone = "feature",
  title,
}: {
  state?: FeatureAccessState;
  message: string;
  tone?: Tone;
  title?: string;
}) {
  const classes =
    tone === "limit"
      ? "border-red-200 bg-red-50 text-red-800"
      : state
        ? getFeatureToneClasses(state)
        : "border-slate-200 bg-slate-50 text-slate-700";

  const heading =
    title ||
    (tone === "limit"
      ? "Limit reached"
      : getFeatureStateTitle(
          state || {
            available: false,
            reason: "unknown",
            message: "Unavailable",
          },
        ));

  const Icon = tone === "limit" ? AlertTriangle : Lock;

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${classes}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-current/15 bg-white/60">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold tracking-[-0.01em]">{heading}</p>
          <p className="mt-1 leading-6 opacity-95">{message}</p>
        </div>
      </div>
    </div>
  );
}
