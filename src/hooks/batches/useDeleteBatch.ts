import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteBatch } from '@/lib/api/batch';
import type { DeleteBatchRequest } from '@/types/batch';

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchId,
      options,
    }: {
      batchId: string;
      options?: DeleteBatchRequest;
    }) => deleteBatch(batchId, options),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch', variables.batchId] });
      queryClient.invalidateQueries({ queryKey: ['batch-stats'] });

      toast.success(
        variables.options?.permanent
          ? 'Batch permanently deleted'
          : 'Batch deleted (can be restored within 30 days)',
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete batch',
      );
    },
  });
};
