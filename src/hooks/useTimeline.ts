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

export type VerificationStatus = 'idle' | 'processing' | 'partial' | 'completed' | 'failed' | 'cancelled';

export interface TimelineVerificationState {
  status: VerificationStatus;
  progress: number;
  currentStage: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  data?: {
    timeline?: Array<{
      label: string;
      timestamp: string;
      source: string;
    }>;
    matches?: Array<{
      title: string;
      link: string;
      source: string;
      thumbnail?: string;
      sourceIcon?: string;
    }>;
    flags?: string[];
    analysis?: {
      hasMetadata: boolean;
      metadataConsistent: boolean;
      earlierOnlineAppearance: boolean;
      spoofedMetadata: boolean;
    };
    metadata?: {
      extractedAt: string;
      analysis: {
        integrityScore: number;
        authenticityScore: number;
        completenessScore: number;
      };
    };
  };
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

  console.log('this is the response', response.data);
  return response.data;
};

const fetchVerificationStatus = async (mediaId: string): Promise<TimelineVerificationState> => {
  const response = await api.get(`/api/timeline/status/${mediaId}`);
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

export const useTimelineVerificationStatus = (mediaId: string) => {
  return useQuery({
    queryKey: ['timeline-verification-status', mediaId],
    queryFn: () => fetchVerificationStatus(mediaId),
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll every 3 seconds if still processing or partial
      if (data?.status === 'processing' || data?.status === 'partial') {
        return 3000;
      }
      // Stop polling if completed, failed, cancelled, or idle
      return false;
    },
    enabled: !!mediaId,
  });
};
