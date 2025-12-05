import { useQuery } from '@tanstack/react-query';
import { getBatchStats } from '@/lib/api/batch';

export const useBatchStats = () => {
  return useQuery({
    queryKey: ['batch-stats'],
    queryFn: getBatchStats,
    staleTime: 10000, // Consider fresh for 10 seconds
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
