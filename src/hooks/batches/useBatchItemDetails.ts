import { useQuery } from '@tanstack/react-query';
import { getBatchItemDetails } from '@/lib/api/batch';

export const useBatchItemDetails = (
  batchId: string,
  itemId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ['batchItemDetails', batchId, itemId],
    queryFn: () => getBatchItemDetails(batchId, itemId),
    enabled: enabled && !!batchId && !!itemId,
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });
};
