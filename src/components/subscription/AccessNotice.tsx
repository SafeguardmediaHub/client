"use client";

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

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${classes}`}>
      <p className="font-semibold">{heading}</p>
      <p className="mt-1 leading-6">{message}</p>
    </div>
  );
}
