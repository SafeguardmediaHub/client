import type { QueryClient } from "@tanstack/react-query";

export type ProductFeatureKey =
  | "deepfakeImage"
  | "deepfakeVideo"
  | "deepfakeAudio"
  | "forensicsImage"
  | "forensicsAudio"
  | "forensicsVideo"
  | "forensicsFrames"
  | "batchUpload"
  | "reverseLookup"
  | "claimResearch"
  | "factCheck"
  | "timelineVerification"
  | "c2pa"
  | "geolocationVerification";

export type FeatureAvailability = {
  globallyEnabled: boolean;
  tierAllowed: boolean;
  available: boolean;
};

export type UsageBucket = {
  used?: number;
  limit: number;
  percentage: number;
  unlimited?: boolean;
  active?: number;
};

export type SubscriptionUsageData = {
  tier: string;
  currentPeriod: {
    startDate: string;
    endDate: string;
  };
  usage: {
    files: UsageBucket;
    analyses: UsageBucket;
    batches: UsageBucket;
    concurrentBatches: UsageBucket;
  };
  featureAvailability: Partial<Record<ProductFeatureKey, FeatureAvailability>>;
};

export type FeatureAccessState = {
  available: boolean;
  reason: "disabled" | "plan" | "unknown" | null;
  message: string | null;
};

export type UsageThresholdState = "normal" | "warning" | "critical" | "reached";

export type UsageGateState = {
  allowed: boolean;
  reason: "limit" | null;
  message: string | null;
  remaining: number | null;
};

export type DenialState = {
  kind: "unavailable" | "plan" | "limit" | "unknown";
  message: string;
  feature?: string;
  used?: number;
  limit?: number;
  remaining?: number;
  resetsAt?: string;
};

export const subscriptionUsageQueryKey = ["subscription", "usage"] as const;

export function invalidateSubscriptionUsage(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: subscriptionUsageQueryKey });
}

export function getFeatureState(
  usageData: SubscriptionUsageData | undefined,
  feature: ProductFeatureKey,
): FeatureAccessState {
  const state = usageData?.featureAvailability?.[feature];

  if (!state) {
    return {
      available: false,
      reason: "unknown",
      message: "Unavailable",
    };
  }

  if (!state.globallyEnabled) {
    return {
      available: false,
      reason: "disabled",
      message: "Currently unavailable",
    };
  }

  if (!state.tierAllowed) {
    return {
      available: false,
      reason: "plan",
      message: "Not available on your plan",
    };
  }

  return {
    available: true,
    reason: null,
    message: null,
  };
}

export function getCombinedFeatureState(
  usageData: SubscriptionUsageData | undefined,
  features: ProductFeatureKey[],
): FeatureAccessState {
  if (features.length === 0) {
    return {
      available: false,
      reason: "unknown",
      message: "Unavailable",
    };
  }

  const states = features.map((feature) => getFeatureState(usageData, feature));

  if (states.some((state) => state.available)) {
    return {
      available: true,
      reason: null,
      message: null,
    };
  }

  if (states.some((state) => state.reason === "disabled")) {
    return {
      available: false,
      reason: "disabled",
      message: "Currently unavailable",
    };
  }

  if (states.every((state) => state.reason === "plan")) {
    return {
      available: false,
      reason: "plan",
      message: "Not available on your plan",
    };
  }

  return {
    available: false,
    reason: "unknown",
    message: "Unavailable",
  };
}

export function getUsageThreshold(bucket?: UsageBucket): UsageThresholdState {
  if (!bucket || bucket.unlimited) return "normal";
  if (bucket.limit <= 0) return "reached";
  if (bucket.used !== undefined && bucket.used >= bucket.limit)
    return "reached";
  if (bucket.percentage >= 95) return "critical";
  if (bucket.percentage >= 80) return "warning";
  return "normal";
}

export function getRemainingUsage(bucket?: UsageBucket) {
  if (!bucket || bucket.unlimited) return null;
  if (bucket.used === undefined) return bucket.limit;
  return Math.max(bucket.limit - bucket.used, 0);
}

export function getUsageGate(bucket?: UsageBucket): UsageGateState {
  if (!bucket || bucket.unlimited) {
    return {
      allowed: true,
      reason: null,
      message: null,
      remaining: null,
    };
  }

  const remaining = getRemainingUsage(bucket);

  if (remaining !== null && remaining <= 0) {
    return {
      allowed: false,
      reason: "limit",
      message: "Monthly limit reached",
      remaining,
    };
  }

  return {
    allowed: true,
    reason: null,
    message: null,
    remaining,
  };
}

export function formatUsageValue(bucket?: UsageBucket) {
  if (!bucket) return "Not available";
  if (bucket.unlimited) {
    return `${bucket.used ?? 0} / Unlimited`;
  }
  return `${bucket.used ?? 0} / ${bucket.limit}`;
}

export function formatResetDate(value?: string) {
  if (!value) return "Not available";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getUsageToneClasses(state: UsageThresholdState) {
  switch (state) {
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "critical":
    case "reached":
      return "border-red-200 bg-red-50 text-red-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function getFeatureToneClasses(state: FeatureAccessState) {
  if (state.available) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (state.reason === "plan") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}

export function getFeatureStateTitle(state: FeatureAccessState) {
  if (state.reason === "plan") {
    return "Plan restricted";
  }

  if (state.reason === "disabled") {
    return "Currently unavailable";
  }

  return "Unavailable";
}

export function getFeatureStateShortLabel(state: FeatureAccessState) {
  if (state.reason === "plan") {
    return "Plan";
  }

  if (state.reason === "disabled") {
    return "Off";
  }

  return "Unavailable";
}

export function getLimitReachedMessage(
  resourceLabel: "upload" | "analysis" | "batch",
  resetAt?: string,
  used?: number,
  limit?: number,
) {
  const resource = `${resourceLabel}${resourceLabel.endsWith("s") ? "" : ""}`;

  if (typeof used === "number" && typeof limit === "number") {
    return `You have reached your monthly ${resource} limit. Used ${used} of ${limit}. Your limit resets on ${formatResetDate(
      resetAt,
    )}.`;
  }

  return `You have reached your monthly ${resource} limit. Your limit resets on ${formatResetDate(
    resetAt,
  )}.`;
}

export function getDeniedStateFromError(error: unknown): DenialState {
  const status =
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    typeof error.response.status === "number"
      ? error.response.status
      : null;

  const responseData =
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null
      ? error.response.data
      : null;

  const data =
    responseData &&
    "data" in responseData &&
    typeof responseData.data === "object" &&
    responseData.data !== null
      ? responseData.data
      : null;

  const message =
    responseData &&
    "message" in responseData &&
    typeof responseData.message === "string"
      ? responseData.message
      : "This action could not be completed.";

  if (status === 503) {
    return {
      kind: "unavailable",
      message,
      feature:
        data && "feature" in data && typeof data.feature === "string"
          ? data.feature
          : undefined,
    };
  }

  if (status === 403) {
    return {
      kind: "plan",
      message,
      feature:
        data && "feature" in data && typeof data.feature === "string"
          ? data.feature
          : undefined,
    };
  }

  if (status === 429) {
    return {
      kind: "limit",
      message,
      feature:
        data && "feature" in data && typeof data.feature === "string"
          ? data.feature
          : undefined,
      used:
        data && "used" in data && typeof data.used === "number"
          ? data.used
          : undefined,
      limit:
        data && "limit" in data && typeof data.limit === "number"
          ? data.limit
          : undefined,
      remaining:
        data && "remaining" in data && typeof data.remaining === "number"
          ? data.remaining
          : undefined,
      resetsAt:
        data && "resetsAt" in data && typeof data.resetsAt === "string"
          ? data.resetsAt
          : undefined,
    };
  }

  return {
    kind: "unknown",
    message,
  };
}
