import { useQuery } from '@tanstack/react-query';
import { getBatchResults } from '@/lib/api/batch';
import type { BatchResultsParams } from '@/types/batch';

export const useBatchResults = (
  batchId: string,
  params?: BatchResultsParams,
  enabled = true
) => {
  return useQuery({
    queryKey: ['batchResults', batchId, params],
    queryFn: () => getBatchResults(batchId, params),
    enabled: enabled && !!batchId,
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });
};
