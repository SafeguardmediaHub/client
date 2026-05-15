/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  getDeniedStateFromError,
  invalidateSubscriptionUsage,
} from "@/lib/subscription-access";

export type KeyframeExtractionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "partial"
  | "failed"
  | "expired";

export interface KeyframeTimeRange {
  startSeconds: number;
  endSeconds: number;
}

export interface KeyframeExtractionOptions {
  frameCount?: number;
  timeRange?: KeyframeTimeRange;
}

export interface ExtractKeyframesRequest {
  mediaId: string;
  frameCount?: number;
  timeRange?: KeyframeTimeRange;
}

export interface ExtractKeyframesResponse {
  extraction: {
    id: string;
    status: KeyframeExtractionStatus;
    sourceMediaId: string;
    requestedFrameCount: number;
    options: KeyframeExtractionOptions;
    createdAt: string;
  };
  job: {
    id: string;
    queued: true;
    estimatedProcessingTimeSeconds: number;
  };
}

export interface KeyframeFrame {
  frameMediaId: string;
  index: number;
  timestampSeconds: number;
  sizeBytes: number;
  signedUrl?: string;
  signedUrlExpiresInSeconds?: number;
  fileName?: string;
}

export interface KeyframeVideoMetadata {
  durationSeconds: number;
  width: number;
  height: number;
  fps: number;
  codec: string;
}

export interface KeyframeExtractionRecord {
  id: string;
  sourceMediaId: string;
  status: KeyframeExtractionStatus;
  effectiveStatus?: KeyframeExtractionStatus;
  requestedFrameCount: number;
  achievableFrameCount: number;
  actualFrameCount: number;
  options: KeyframeExtractionOptions;
  videoMetadata?: KeyframeVideoMetadata;
  errorInfo?: { code: string; message: string; details?: unknown };
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetKeyframeExtractionResponse {
  extraction: KeyframeExtractionRecord;
  frames: KeyframeFrame[];
  queue?: {
    tracked: boolean;
    jobId?: string;
    status?: string;
    progress?: number;
    attemptsMade?: number;
    error?: string;
  };
}

export interface KeyframeExtractionListItem {
  id: string;
  sourceMediaId: string;
  status: KeyframeExtractionStatus;
  effectiveStatus?: KeyframeExtractionStatus;
  requestedFrameCount: number;
  achievableFrameCount: number;
  actualFrameCount: number;
  options: KeyframeExtractionOptions;
  videoMetadata?: KeyframeVideoMetadata;
  createdAt: string;
  updatedAt: string;
  sourceMedia?: {
    id: string;
    filename: string;
    mimeType: string;
  };
}

export interface ListKeyframeExtractionsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListKeyframeExtractionsResponse {
  pagination: ListKeyframeExtractionsPagination;
  extractions: KeyframeExtractionListItem[];
}

const TERMINAL_STATUSES = new Set<KeyframeExtractionStatus>([
  "completed",
  "partial",
  "failed",
  "expired",
]);

export function isTerminalKeyframeStatus(
  status: KeyframeExtractionStatus | undefined,
): boolean {
  return status !== undefined && TERMINAL_STATUSES.has(status);
}

const extractKeyframes = async (
  body: ExtractKeyframesRequest,
): Promise<ExtractKeyframesResponse> => {
  const { data } = await api.post("/api/keyframes/extract", body);
  return data.data;
};

const fetchKeyframeStatus = async (
  id: string,
): Promise<GetKeyframeExtractionResponse> => {
  const { data } = await api.get(`/api/keyframes/${id}/status`);
  return data.data;
};

const fetchKeyframeExtraction = async (
  id: string,
): Promise<GetKeyframeExtractionResponse> => {
  const { data } = await api.get(`/api/keyframes/${id}`);
  return data.data;
};

const listKeyframeExtractions = async (params?: {
  page?: number;
  limit?: number;
  status?: KeyframeExtractionStatus;
  sourceMediaId?: string;
}): Promise<ListKeyframeExtractionsResponse> => {
  const { data } = await api.get("/api/keyframes", { params });
  return data.data;
};

const deleteKeyframeExtractionRequest = async (id: string) => {
  const { data } = await api.delete(`/api/keyframes/${id}`);
  return data;
};

const STATUS_POLL_INTERVAL_MS = 2000;
const COMPLETED_REFRESH_INTERVAL_MS = 45 * 60 * 1000;

export function useExtractKeyframes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ExtractKeyframesRequest) => extractKeyframes(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keyframeExtractions"] });
      invalidateSubscriptionUsage(queryClient);
    },
    onError: (error: any) => {
      const denied = getDeniedStateFromError(error);
      if (denied.kind === "limit") {
        invalidateSubscriptionUsage(queryClient);
      }

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = (error.response?.data as any)?.message as
          | string
          | undefined;

        if (status === 429) {
          toast.error(
            message ?? "Too many extractions, try again in a moment.",
          );
          return;
        }
        if (status === 413) {
          toast.error(
            message ?? "Video exceeds the maximum size for keyframe extraction.",
          );
          return;
        }
        if (status === 503) {
          toast.error(
            message ?? "Keyframe extraction is temporarily unavailable.",
          );
          return;
        }
        if (message) {
          toast.error(message);
          return;
        }
      }

      console.error("Error starting keyframe extraction:", error);
      toast.error("Failed to start keyframe extraction. Please try again.");
    },
  });
}

export function useKeyframeStatus(extractionId: string | undefined) {
  return useQuery({
    queryKey: ["keyframeStatus", extractionId],
    queryFn: () => fetchKeyframeStatus(extractionId as string),
    enabled: Boolean(extractionId),
    refetchInterval: (query) => {
      const data = query.state.data as
        | GetKeyframeExtractionResponse
        | undefined;
      const status =
        data?.extraction?.effectiveStatus ?? data?.extraction?.status;
      return isTerminalKeyframeStatus(status) ? false : STATUS_POLL_INTERVAL_MS;
    },
    refetchOnWindowFocus: false,
  });
}

export function useKeyframeExtraction(extractionId: string | undefined) {
  return useQuery({
    queryKey: ["keyframeExtraction", extractionId],
    queryFn: () => fetchKeyframeExtraction(extractionId as string),
    enabled: Boolean(extractionId),
    refetchInterval: COMPLETED_REFRESH_INTERVAL_MS,
    refetchOnWindowFocus: true,
    staleTime: 1000,
  });
}

export function useListKeyframeExtractions(params?: {
  page?: number;
  limit?: number;
  status?: KeyframeExtractionStatus;
  sourceMediaId?: string;
}) {
  return useQuery({
    queryKey: ["keyframeExtractions", params],
    queryFn: () => listKeyframeExtractions(params),
    placeholderData: keepPreviousData,
    staleTime: 1000,
  });
}

export function useDeleteKeyframeExtraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteKeyframeExtractionRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keyframeExtractions"] });
      toast.success("Extraction deleted successfully.");
    },
    onError: (error) => {
      console.error("Error deleting keyframe extraction:", error);
      toast.error("Failed to delete extraction. Please try again.");
    },
  });
}
