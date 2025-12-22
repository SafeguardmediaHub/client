import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface VerifyTimelineJobResponse {
  success: boolean;
  message: string;
  data: {
    jobId: string;
    mediaId: string;
    status: 'processing' | 'success' | 'failed';
    estimatedTime: string;
  };
}

export type VerificationStatus =
  | 'idle'
  | 'processing'
  | 'partial'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface TimelineVerificationState {
  status: VerificationStatus;
  score?: number;
  classification?: string;
  timeline?: Array<{
    label: string;
    timestamp: string;
    source: string;
    _id?: string;
    id?: string;
  }>;
  sources?: Array<any>;
  flags?: string[];
  last_verified_at?: string;
  matches?: Array<{
    id: string;
    platform: string;
    url: string;
    link: string;
    thumbnailUrl?: string;
    thumbnail?: string;
    title: string;
    snippet?: string;
    confidence: number;
    source: string;
    sourceIcon?: string;
    searchEngine: string;
    foundAt: string;
    metadata?: any;
  }>;
  analysis?: {
    hasMetadata: boolean;
    metadataConsistent: boolean;
    earlierOnlineAppearance: boolean;
    spoofedMetadata: boolean;
  };
  metadata?: {
    extractedAt: string;
    confidence: number;
    possibleTampering: boolean;
    strippedMetadata: boolean;
    image?: {
      originalDateTime?: string;
      cameraMake?: string;
      cameraModel?: string;
      software?: string;
      dimensions?: string;
      gpsCoordinates?: any;
      cameraSettings?: any;
    };
    video?: any;
    analysis: {
      integrityScore: number;
      authenticityScore: number;
      completenessScore: number;
      missingFields?: string[];
      reasons?: string[];
    };
  };
  error?: string;
}

const verifyTimeline = async ({
  mediaId,
  claimedTakenAt,
}: {
  mediaId: string;
  claimedTakenAt: string;
}): Promise<VerifyTimelineJobResponse> => {
  const response = await api.post(
    `/api/timeline/verify/${mediaId}`,
    { claimedTakenAt },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return response.data;
};

const fetchVerificationResult = async (
  mediaId: string
): Promise<TimelineVerificationState> => {
  const response = await api.get(`/api/timeline/result/${mediaId}`);
  return response.data.data;
};

export const useTimeline = () => {
  return useMutation({
    mutationFn: verifyTimeline,
  });
};

export const useStartTimelineVerification = () => {
  return useMutation({
    mutationFn: verifyTimeline,
  });
};

export const useTimelineVerificationResult = (
  mediaId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['timeline-verification-result', mediaId],
    queryFn: () => fetchVerificationResult(mediaId),
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll every 10 seconds if still processing or partial
      if (data?.status === 'processing' || data?.status === 'partial') {
        return 10000;
      }
      // Stop polling if completed, failed, cancelled, or idle
      return false;
    },
    enabled: options?.enabled ?? !!mediaId,
    retry: (failureCount, error) => {
      // Don't retry on 404 - verification not found yet
      if ((error as any)?.response?.status === 404) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    staleTime: 0, // Always fetch fresh data when queried
  });
};
