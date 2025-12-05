import { useQuery } from '@tanstack/react-query';
import { getBatch } from '@/lib/api/batch';
import { useBatchWebSocket } from './useBatchWebSocket';

export const useBatch = (batchId: string, enabled = true) => {
  // Use WebSocket for real-time updates
  const { isConnected: wsConnected, isSubscribed } = useBatchWebSocket(batchId, enabled);

  return useQuery({
    queryKey: ['batch', batchId],
    queryFn: () => getBatch(batchId),
    enabled: enabled && !!batchId,
    staleTime: 2000,
    refetchInterval: (query) => {
      // Only poll if WebSocket is not connected or subscribed
      if (wsConnected && isSubscribed) {
        return false; // WebSocket handles updates
      }

      // Fallback to polling if WebSocket unavailable
      const data = query.state.data;
      if (
        data?.status === 'PROCESSING' ||
        data?.status === 'UPLOADING'
      ) {
        return 2000; // Poll every 2 seconds
      }
      return false;
    },
    refetchOnWindowFocus: true,
  });
};
