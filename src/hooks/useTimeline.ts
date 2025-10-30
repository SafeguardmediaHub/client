import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

interface VerifyTimeline {
  success: boolean;
  message: string;
  data: {
    jobId: string;
    mediaId: string;
    status: 'processing' | 'success' | 'failed';
    estimatedTime: string;
  };
}

const verifyTimeline = async (mediaId: string): Promise<VerifyTimeline> => {
  const response = await api.post(
    '/api/timeline/verify',
    {},
    { params: { mediaId }, headers: { 'Content-Type': 'application/json' } }
  );

  console.log('this is the response', response.data);
  return response.data;
};

export const useTimelline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: string) => verifyTimeline(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMedia'] });
      toast.success('Timeline verified successfully.');
    },
    onError: (error) => {
      console.error('Error verifying timeline:', error);
      toast.error('Failed to verify timeline. Please try again.');
    },
  });
};
