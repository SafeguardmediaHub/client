"use client";

import { cn } from "@/lib/utils";
import { useAnonymousSession } from "./AnonymousSessionContext";

export function TryCounter() {
  const { meta, isLoading } = useAnonymousSession();

  if (isLoading) {
    return <div className="h-7 w-36 animate-pulse rounded-full bg-slate-100" />;
  }

  if (meta.mode === "authenticated") {
    const { analysesRemaining, requiresUpgrade } = meta;
    const isExhausted = analysesRemaining === 0 || requiresUpgrade;
    const isLow = !isExhausted && analysesRemaining <= 5;

    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
          isExhausted
            ? "border-red-200 bg-red-50 text-red-700"
            : isLow
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-slate-200 bg-white text-slate-600",
        )}
      >
        <span className="hidden sm:inline">
          {isExhausted
            ? "No analyses left this month"
            : `${analysesRemaining} analyses left this month`}
        </span>
        <span className="sm:hidden">
          {isExhausted ? "0 left" : `${analysesRemaining} left`}
        </span>
      </div>
    );
  }

  // Anonymous mode
  const { triesRemaining } = meta;
  const used = 3 - triesRemaining;
  const isLast = triesRemaining === 1;
  const isExhausted = triesRemaining === 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
        isExhausted
          ? "border-red-200 bg-red-50 text-red-700"
          : isLast
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-white text-slate-600",
      )}
    >
      <span className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              i < used
                ? isExhausted
                  ? "bg-red-400"
                  : isLast
                    ? "bg-amber-400"
                    : "bg-blue-500"
                : "bg-slate-200",
            )}
          />
        ))}
      </span>
      <span className="hidden sm:inline">
        {isExhausted
          ? "No analyses left"
          : isLast
            ? "Last free analysis"
            : `${triesRemaining} of 3 free`}
      </span>
      <span className="sm:hidden">
        {isExhausted ? "0 left" : `${triesRemaining}/3`}
      </span>
    </div>
  );
}
