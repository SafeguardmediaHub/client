import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

export interface VerifyTimelineResponse {
  success: boolean;
  message: string;
  data: {
    jobId: string;
    mediaId: string;
    status: 'processing' | 'success' | 'failed';
    estimatedTime: string;
  };
}

const verifyTimeline = async ({
  mediaId,
  claimedTakenAt,
}: {
  mediaId: string;
  claimedTakenAt: string;
}): Promise<VerifyTimelineResponse> => {
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

export const useTimeline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyTimeline,
  });
};
