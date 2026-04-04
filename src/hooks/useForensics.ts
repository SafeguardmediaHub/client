import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  getDeniedStateFromError,
  invalidateSubscriptionUsage,
} from "@/lib/subscription-access";

export type ForensicsMediaType = "image" | "audio" | "video" | "frames";
export type FrameForensicsOptions = {
  sampling_mode?: string;
};

export type ForensicsTriggerType = "initial" | "rerun" | "retry";

export type ForensicsFreshness = {
  resultGeneratedAt?: string | null;
  rerunnable: boolean;
  triggerType?: ForensicsTriggerType;
};

export type ForensicsFinding = {
  title: string;
  module: string;
  severity: string;
  confidence: number;
  description: string;
  timestamp_s?: number;
};

export type ImageForensicsDetail = {
  userFriendlySummary?: {
    status?: string;
    trustLevel?: string;
    tamperingProbability?: string;
    issuesFound?: string[];
    positiveFindings?: string[];
    recommendation?: string;
    imageInfo?: {
      format?: string;
      dimensions?: string;
      fileSize?: number;
      hasGps?: boolean;
    };
    explanation?: {
      whatWeChecked?: string[];
      howToRead?: Record<string, string>;
    };
    note?: string;
    combinedHeatmapAvailable?: boolean;
  };
  assessment?: {
    analysisTimestamp?: string;
    analyzerVersion?: string;
    aiDetectionEnabled?: boolean;
    isVideoFrame?: boolean;
    status?: string;
    trustLevel?: string;
    tamperingProbability?: string;
    recommendation?: string;
    note?: string;
    overallAssessment?: {
      tamperingLikelihood?: number;
      verdict?: string;
      confidence?: string;
      note?: string;
    };
  };
  issues?: {
    issuesFound: string[];
    positiveFindings: string[];
  };
  checks?: {
    whatWeChecked: string[];
    howToRead: Record<string, string>;
  };
  metadata?: {
    filename?: string;
    fileSizeBytes?: number;
    fileSizeMb?: number;
    format?: string;
    dimensions?: string;
    mode?: string;
    created?: string;
    modified?: string;
    hasExif?: boolean;
    hasGps?: boolean;
  };
  manipulationDetection?: {
    ela?: {
      score?: number;
      interpretation?: string;
      artifactAvailable?: boolean;
    };
    noise?: {
      score?: number;
      interpretation?: string;
      artifactAvailable?: boolean;
    };
    copyMove?: {
      cloneScore?: number;
      matchesFound?: number;
      method?: string;
      interpretation?: string;
      keypointsDetected?: number;
      artifactAvailable?: boolean;
    };
    jpegCompression?: {
      format?: string;
      message?: string;
    };
    aiGenerated?: {
      enabled?: boolean;
      note?: string;
    };
  };
  enhancementAnalysis?: {
    histogramAnalysis?: {
      peaks?: number;
      meanBrightness?: number;
      stdBrightness?: number;
      interpretation?: string;
    };
    artifacts?: {
      enhancedLuminanceAvailable?: boolean;
      edgeDetectionAvailable?: boolean;
      frequencyAnalysisAvailable?: boolean;
    };
  };
  verification?: {
    md5?: string;
    sha1?: string;
    sha256?: string;
  };
  reverseSearch?: {
    imageHash?: string;
    dimensions?: string;
    searchEngines?: string[];
    instructions?: string;
    note?: string;
  };
  artifacts?: {
    combinedHeatmapAvailable?: boolean;
    elaHeatmapAvailable?: boolean;
    noiseHeatmapAvailable?: boolean;
    cloneHeatmapAvailable?: boolean;
    enhancedLuminanceAvailable?: boolean;
    edgeDetectionAvailable?: boolean;
    frequencyAnalysisAvailable?: boolean;
  };
};

export interface ForensicsAnalysisDetail {
  id: string;
  mediaId: string;
  fileName: string;
  originalFileName?: string;
  mediaType: "image" | "audio" | "video" | "frames";
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  status: "pending" | "processing" | "completed" | "failed" | "expired";
  analysisStartedAt?: string;
  analysisCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  freshness?: ForensicsFreshness;
  reusedExistingResult?: boolean;
  isFreshRun?: boolean;
  processing: {
    processingMode: "sync" | "async";
    processingMetadata?: {
      startTime?: string;
      endTime?: string;
      processingTimeMs?: number;
      gpuUsed?: boolean;
      memoryUsageMB?: number;
      cpuUsagePercent?: number;
    };
  };
  forensics: {
    verdict?: string;
    verdictLabel?: string;
    probability?: number;
    confidence?: number;
    findings: ForensicsFinding[];
    summary?: string;
    file?: {
      filename?: string;
      sha256?: string | null;
    };
    imageDetail?: ImageForensicsDetail;
  };
  errorInfo?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    retryCount: number;
  } | null;
}

export interface ForensicsStatusData {
  analysis: {
    id: string;
    mediaId: string;
    mediaType: "image" | "audio" | "video" | "frames";
    status: string;
    effectiveStatus: "pending" | "processing" | "completed" | "failed";
    resultGeneratedAt?: string | null;
    rerunnable?: boolean;
    triggerType?: ForensicsTriggerType;
    analysisStartedAt?: string;
    analysisCompletedAt?: string;
    createdAt: string;
    updatedAt: string;
    errorInfo?: {
      code?: string;
      message?: string;
    } | null;
  };
  processing: {
    processingMode?: string;
  };
  forensics: {
    verdict?: string;
    verdictLabel?: string;
    probability?: number;
    confidence?: number;
    findings: ForensicsFinding[];
    summary?: string;
    imageDetail?: ImageForensicsDetail;
  } | null;
}

export type ForensicsHistoryItem = {
  id: string;
  mediaId: string;
  mediaType: ForensicsMediaType;
  status: "pending" | "processing" | "completed" | "failed" | "expired";
  freshness?: ForensicsFreshness;
};

export type ForensicsHistoryResponse = {
  analyses: ForensicsHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

interface StartForensicsParams {
  mediaId: string;
  mediaType: ForensicsMediaType;
  options?: FrameForensicsOptions;
}

function normalizeForensicsAnalysis(
  analysis: ForensicsAnalysisDetail,
  payload?: Record<string, unknown>,
): ForensicsAnalysisDetail {
  const payloadFreshness =
    payload && typeof payload.freshness === "object" && payload.freshness
      ? (payload.freshness as Record<string, unknown>)
      : null;

  const mergedFreshness =
    analysis.freshness || payloadFreshness
      ? {
          resultGeneratedAt:
            (analysis.freshness?.resultGeneratedAt ??
              (typeof payload?.resultGeneratedAt === "string"
                ? payload.resultGeneratedAt
                : undefined) ??
              (typeof payloadFreshness?.resultGeneratedAt === "string"
                ? payloadFreshness.resultGeneratedAt
                : undefined)) ||
            null,
          rerunnable:
            analysis.freshness?.rerunnable ??
            (typeof payload?.rerunnable === "boolean"
              ? payload.rerunnable
              : undefined) ??
            (typeof payloadFreshness?.rerunnable === "boolean"
              ? payloadFreshness.rerunnable
              : false),
          triggerType:
            analysis.freshness?.triggerType ??
            (typeof payload?.triggerType === "string"
              ? (payload.triggerType as ForensicsTriggerType)
              : undefined) ??
            (typeof payloadFreshness?.triggerType === "string"
              ? (payloadFreshness.triggerType as ForensicsTriggerType)
              : undefined),
        }
      : undefined;

  return {
    ...analysis,
    freshness: mergedFreshness,
    reusedExistingResult:
      analysis.reusedExistingResult ??
      (typeof payload?.reusedExistingResult === "boolean"
        ? payload.reusedExistingResult
        : undefined),
    isFreshRun:
      analysis.isFreshRun ??
      (typeof payload?.isFreshRun === "boolean"
        ? payload.isFreshRun
        : undefined),
  };
}

function startForensics({
  mediaId,
  mediaType,
  options,
}: StartForensicsParams): Promise<ForensicsAnalysisDetail> {
  return api
    .post(`/api/forensics/${mediaType}`, {
      mediaId,
      ...(options ? { options } : {}),
    })
    .then((response) =>
      normalizeForensicsAnalysis(
        response.data.data.analysis,
        response.data.data as Record<string, unknown>,
      ),
    );
}

function fetchForensicsDetail(
  analysisId: string,
): Promise<ForensicsAnalysisDetail> {
  return api
    .get(`/api/forensics/${analysisId}`)
    .then((response) =>
      normalizeForensicsAnalysis(
        response.data.data.analysis,
        response.data.data as Record<string, unknown>,
      ),
    );
}

function fetchForensicsStatus(
  analysisId: string,
): Promise<ForensicsStatusData> {
  return api
    .get(`/api/forensics/${analysisId}/status`)
    .then((response) => response.data.data);
}

function fetchLatestForensicsForMedia(
  mediaId: string,
  mediaType?: ForensicsMediaType,
): Promise<ForensicsAnalysisDetail | null> {
  const params = new URLSearchParams();
  if (mediaType) {
    params.set("mediaType", mediaType);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return api
    .get(`/api/forensics/media/${mediaId}/latest${suffix}`)
    .then((response) => {
      const analysis = response.data.data?.analysis;
      if (!analysis) return null;
      return normalizeForensicsAnalysis(
        analysis,
        response.data.data as Record<string, unknown>,
      );
    });
}

function fetchForensicsHistoryForMedia(
  mediaId: string,
  options?: {
    mediaType?: ForensicsMediaType;
    page?: number;
    limit?: number;
  },
): Promise<ForensicsHistoryResponse> {
  const params = new URLSearchParams();
  if (options?.mediaType) {
    params.set("mediaType", options.mediaType);
  }
  if (options?.page) {
    params.set("page", String(options.page));
  }
  if (options?.limit) {
    params.set("limit", String(options.limit));
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return api
    .get(`/api/forensics/media/${mediaId}/history${suffix}`)
    .then((response) => response.data.data);
}

export function getForensicsMediaType(
  mimeType: string,
): ForensicsMediaType | null {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  return null;
}

export function useStartForensics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startForensics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMedia"] });
      invalidateSubscriptionUsage(queryClient);
    },
    onError: (error) => {
      if (getDeniedStateFromError(error).kind === "limit") {
        invalidateSubscriptionUsage(queryClient);
      }
    },
  });
}

export function useForensicsDetail(
  analysisId: string | null,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: ["forensics", "detail", analysisId],
    queryFn: () => fetchForensicsDetail(analysisId as string),
    enabled: Boolean(analysisId && options?.enabled),
    staleTime: 30000,
  });
}

export function useForensicsStatus(
  analysisId: string | null,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: ["forensics", "status", analysisId],
    queryFn: () => fetchForensicsStatus(analysisId as string),
    enabled: Boolean(analysisId && options?.enabled),
    staleTime: 15000,
    refetchInterval: options?.enabled ? 4000 : false,
  });
}

export function useLatestForensicsForMedia(
  mediaId: string | null,
  mediaType?: ForensicsMediaType | null,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: ["forensics", "media", mediaId, "latest", mediaType],
    queryFn: () =>
      fetchLatestForensicsForMedia(mediaId as string, mediaType || undefined),
    enabled: Boolean(mediaId && options?.enabled),
    staleTime: 30000,
  });
}

export function useForensicsHistoryForMedia(
  mediaId: string | null,
  options?: {
    mediaType?: ForensicsMediaType | null;
    page?: number;
    limit?: number;
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: [
      "forensics",
      "media",
      mediaId,
      "history",
      options?.mediaType,
      options?.page ?? 1,
      options?.limit ?? 5,
    ],
    queryFn: () =>
      fetchForensicsHistoryForMedia(mediaId as string, {
        mediaType: options?.mediaType || undefined,
        page: options?.page,
        limit: options?.limit,
      }),
    enabled: Boolean(mediaId && options?.enabled),
    staleTime: 30000,
  });
}
