/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  type AllFeedbackParams,
  createFeedback,
  deleteFeedback,
  getAllFeedback,
  getFeedback,
  getFeedbackStats,
  type UpdateFeedbackPayload,
  updateFeedback,
} from '@/lib/api/feedback';

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
    onSuccess: (data) => {
      toast.success(data.message || 'Feedback submitted successfully!');
      // queryClient.invalidateQueries({ queryKey: ['feedbackList'] });
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

// New hooks for admin feedback
export const useAllFeedback = (params?: AllFeedbackParams) => {
  return useQuery({
    queryKey: ['allFeedback', params],
    queryFn: () => getAllFeedback(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeedbackStats = () => {
  return useQuery({
    queryKey: ['feedbackStats'],
    queryFn: getFeedbackStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeedback = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['feedback', id],
    queryFn: () => getFeedback(id),
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFeedbackPayload;
    }) => updateFeedback(id, payload),
    onSuccess: (data, variables) => {
      toast.success(data.message || 'Feedback updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedback', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['feedbackStats'] });
    },
    onError: (error: any) => {
      console.error('Failed to update feedback:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Failed to update feedback. Please try again.';
      toast.error(errorMessage);
    },
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeedback(id),
    onSuccess: (data) => {
      toast.success(data.message || 'Feedback deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedbackStats'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete feedback:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Failed to delete feedback. Please try again.';
      toast.error(errorMessage);
    },
  });
};
