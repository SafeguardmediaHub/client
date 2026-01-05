/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createFeedback } from '@/lib/api/feedback';

interface CreateFeedbackPayload {
  type: string;
  rating: number;
  email?: string;
  description: string;
}

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFeedbackPayload) => createFeedback(payload),
    onSuccess: () => {
      toast.success('Feedback submitted successfully!');
      // Optionally invalidate any relevant queries if feedback impacts other data
      // e.g., queryClient.invalidateQueries({ queryKey: ['feedbackList'] });
    },
    onError: (error: any) => {
      console.error('Failed to submit feedback:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Failed to submit feedback. Please try again.';
      toast.error(errorMessage);
    },
  });
};
