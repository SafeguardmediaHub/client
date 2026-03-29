"use client";

import { Progress } from "@/components/ui/progress";
import {
  formatResetDate,
  formatUsageValue,
  getUsageThreshold,
  getUsageToneClasses,
  type UsageBucket,
} from "@/lib/subscription-access";

export function UsageSummaryBanner({
  bucket,
  label,
  resetAt,
}: {
  bucket?: UsageBucket;
  label: string;
  resetAt?: string;
}) {
  const threshold = getUsageThreshold(bucket);
  const progressValue = bucket?.unlimited
    ? 0
    : Math.min(bucket?.percentage ?? 0, 100);

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${getUsageToneClasses(
        threshold,
      )}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{label}</p>
            <p className="text-xs opacity-80">
              {formatUsageValue(bucket)} used
            </p>
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.14em] opacity-80">
            Resets {formatResetDate(resetAt)}
          </span>
        </div>
        {!bucket?.unlimited && (
          <Progress value={progressValue} className="h-2 bg-white/70" />
        )}
      </div>
    </div>
  );
}
