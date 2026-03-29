import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  getDeniedStateFromError,
  invalidateSubscriptionUsage,
} from "@/lib/subscription-access";

export type AIMediaType = "image" | "video" | "audio";

export interface AnalysisQueueStatus {
  tracked: boolean;
  jobId?: string;
  status: string | null;
  progress?: number;
  attemptsMade?: number;
  error?: string;
}

export interface AnalysisStatusData {
  analysis: {
    id: string;
    mediaId: string;
    mediaType: AIMediaType;
    status: string;
    effectiveStatus: "pending" | "processing" | "completed" | "failed";
    predictedClass?: string;
    isDeepfake?: boolean;
    confidenceScore?: number;
    riskScore?: number;
    analysisStartedAt?: string;
    analysisCompletedAt?: string;
    errorInfo?: {
      message?: string;
      code?: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  processing: {
    processingMode?: string;
  };
  queue: AnalysisQueueStatus;
}

export interface AnalysisDetail {
  id: string;
  mediaId: string;
  fileName: string;
  originalFileName?: string;
  mediaType: AIMediaType;
  fileSize?: number;
  mimeType?: string;
  uploadDate: string;
  predictedClass?: string;
  isDeepfake?: boolean;
  confidenceScore?: number;
  deepfakeProbability?: number;
  realProbability?: number;
  aiGeneratedProbability?: number;
  riskScore?: number;
  thumbnailUrl?: string;
  previewUrl?: string;
  alternativePredictions?: Array<{
    className: string;
    probability: number;
  }>;
  modelInfo?: Record<string, unknown>;
  detectionFeatures?: Record<string, unknown>;
  processingMetadata?: Record<string, unknown>;
  imageQuality?: Record<string, unknown>;
  status: string;
  analysisStartedAt?: string;
  analysisCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface StartAnalysisParams {
  mediaId: string;
  mediaType: AIMediaType;
}

interface StartAnalysisResponse {
  analysis: AnalysisDetail;
  job?: {
    id: string;
    queued: boolean;
    estimatedProcessingTimeSeconds?: number;
  };
}

export function getAIMediaType(mimeType: string): AIMediaType | null {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return null;
}

const startAnalysis = async ({
  mediaId,
  mediaType,
}: StartAnalysisParams): Promise<StartAnalysisResponse> => {
  const { data } = await api.post(`/api/analysis/${mediaType}/deepfake`, {
    mediaId,
  });

  return data.data;
};

const fetchAnalysisStatus = async (
  analysisId: string,
): Promise<AnalysisStatusData> => {
  const { data } = await api.get(`/api/analysis/${analysisId}/status`);
  return data.data;
};

const fetchAnalysisDetail = async (
  analysisId: string,
): Promise<AnalysisDetail> => {
  const { data } = await api.get(`/api/analysis/${analysisId}`);
  return data.data.analysis;
};

export function useStartAIMediaDetection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysisHistory"] });
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

export function useAnalysisStatus(
  analysisId: string | null,
  options?: {
    enabled?: boolean;
    pollUntil?: number | null;
  },
) {
  return useQuery({
    queryKey: ["aiMediaDetection", "status", analysisId],
    queryFn: () => fetchAnalysisStatus(analysisId as string),
    enabled: Boolean(analysisId && options?.enabled),
    refetchInterval: (query) => {
      if (!analysisId || !options?.enabled) return false;
      if (options.pollUntil && Date.now() > options.pollUntil) return false;

      const effectiveStatus = query.state.data?.analysis.effectiveStatus;
      if (effectiveStatus === "completed" || effectiveStatus === "failed") {
        return false;
      }

      return 3000;
    },
    refetchOnWindowFocus: true,
  });
}

export function useAnalysisDetail(
  analysisId: string | null,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: ["aiMediaDetection", "detail", analysisId],
    queryFn: () => fetchAnalysisDetail(analysisId as string),
    enabled: Boolean(analysisId && options?.enabled),
    staleTime: 30000,
  });
}
