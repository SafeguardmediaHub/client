import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { retryBatchItems } from '@/lib/api/batch';
import type { RetryBatchItemsRequest } from '@/types/batch';

export const useRetryBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchId,
      data,
    }: {
      batchId: string;
      data: RetryBatchItemsRequest;
    }) => retryBatchItems(batchId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['batch', variables.batchId] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });

      toast.success('Retry started for failed items');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to retry batch items',
      );
    },
  });
};
