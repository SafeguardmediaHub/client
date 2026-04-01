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

export type ForensicsFinding = {
  title: string;
  module: string;
  severity: string;
  confidence: number;
  description: string;
  timestamp_s?: number;
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
  };
}

interface StartForensicsParams {
  mediaId: string;
  mediaType: ForensicsMediaType;
  options?: FrameForensicsOptions;
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
    .then((response) => response.data.data.analysis);
}

function fetchForensicsDetail(
  analysisId: string,
): Promise<ForensicsAnalysisDetail> {
  return api
    .get(`/api/forensics/${analysisId}`)
    .then((response) => response.data.data.analysis);
}

function fetchForensicsStatus(
  analysisId: string,
): Promise<ForensicsStatusData> {
  return api
    .get(`/api/forensics/${analysisId}/status`)
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
