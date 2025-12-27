import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from '@/lib/api/dashboard';

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: getDashboardOverview,
    staleTime: 30000, // 30 seconds - dashboard data changes frequently
    refetchInterval: 60000, // Auto-refresh every minute
    refetchOnWindowFocus: true,
  });
};
