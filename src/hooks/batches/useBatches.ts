import { useQuery } from '@tanstack/react-query';
import { getBatches } from '@/lib/api/batch';
import type { BatchListParams } from '@/types/batch';

export const useBatches = (params?: BatchListParams) => {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: () => getBatches(params),
    staleTime: 5000, // Consider data fresh for 5 seconds
    refetchOnWindowFocus: true,
  });
};
