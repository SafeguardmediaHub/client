import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getTraceDistribution,
  getTraceResult,
  getTraceStatus,
  getTraceTimeline,
  initiateTrace,
  listMediaTraces,
  listUserTraces,
} from '@/lib/api/trace';
import type { InitiateTraceRequest } from '@/types/trace';

export const useInitiateTrace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mediaId,
      payload,
    }: {
      mediaId: string;
      payload: InitiateTraceRequest;
    }) => initiateTrace(mediaId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['mediaTraces', variables.mediaId],
      });
      toast.success('Social media trace initiated successfully!', {
        description: `Estimated completion: ~${data.data.estimatedCompletionSeconds}s`,
      });
    },
    onError: (error) => {
      console.error('Failed to initiate trace:', error);
      toast.error(
        `Failed to initiate trace: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    },
  });
};

export const useTraceStatus = (
  traceId: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number | ((data: any) => number | false);
  }
) => {
  return useQuery({
    queryKey: ['traceStatus', traceId],
    queryFn: () => getTraceStatus(traceId),
    enabled: options?.enabled ?? !!traceId,
    refetchInterval: (query) => {
      // Stop polling if status is terminal
      const status = query.state.data?.data?.status;
      if (
        status === 'completed' ||
        status === 'failed' ||
        status === 'no_results'
      ) {
        return false;
      }

      // Custom interval if provided
      if (typeof options?.refetchInterval === 'function') {
        return options.refetchInterval(query);
      }
      if (typeof options?.refetchInterval === 'number') {
        return options.refetchInterval;
      }

      // Default: exponential backoff
      // Start at 2s, then 5s, then 10s
      const pollCount = query.state.dataUpdateCount || 0;
      if (pollCount < 3) return 2000; // 2s for first 3 polls
      if (pollCount < 10) return 5000; // 5s for next 7 polls
      return 10000; // 10s thereafter
    },
    staleTime: 0, // Always fetch fresh data
  });
};

export const useTraceResult = (
  mediaId: string,
  traceId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['traceResult', mediaId, traceId],
    queryFn: () => getTraceResult(mediaId, traceId),
    enabled: options?.enabled ?? !!(mediaId && traceId),
    refetchInterval: (query) => {
      // Stop polling if status is terminal
      const status = query.state.data?.data?.status;
      if (
        status === 'completed' ||
        status === 'failed' ||
        status === 'no_results'
      ) {
        return false;
      }

      // Exponential backoff: 2s → 5s → 10s
      const pollCount = query.state.dataUpdateCount || 0;
      if (pollCount < 3) return 2000; // 2s for first 3 polls
      if (pollCount < 10) return 5000; // 5s for next 7 polls
      return 10000; // 10s thereafter
    },
    staleTime: 0, // Always fetch fresh data while polling
  });
};

export const useTraceDistribution = (
  traceId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['traceDistribution', traceId],
    queryFn: () => getTraceDistribution(traceId),
    enabled: options?.enabled ?? !!traceId,
  });
};

export const useTraceTimeline = (
  traceId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['traceTimeline', traceId],
    queryFn: () => getTraceTimeline(traceId),
    enabled: options?.enabled ?? !!traceId,
  });
};

export const useMediaTraces = (
  mediaId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['mediaTraces', mediaId],
    queryFn: () => listMediaTraces(mediaId),
    enabled: options?.enabled ?? !!mediaId,
    staleTime: 5000,
  });
};

export const useUserTraces = (
  params?: { limit?: number; skip?: number; status?: string },
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['userTraces', params],
    queryFn: () => listUserTraces(params),
    enabled: options?.enabled ?? true,
  });
};

