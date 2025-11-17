/** biome-ignore-all lint/suspicious/noExplicitAny: <> */


import { useMutation, useQuery } from '@tanstack/react-query';
import {
  analyzeContent,
  getClaimDetail,
  getJobStatus,
  verifyClaim,
} from '@/lib/api/fact-check';
import type {
  AnalyzeContentRequest,
  VerifyClaimRequest,
} from '@/types/fact-check';

export const useAnalyzeContent = () => {
  return useMutation({
    mutationFn: (payload: AnalyzeContentRequest) => analyzeContent(payload),
  });
};

export const useJobStatus = (
  jobId: string,
  options?: {
    pollingInterval?: number;
    enabled?: boolean;
  }
) => {
  const pollingInterval = options?.pollingInterval ?? 4000; // 4 seconds default

  console.log(
    '[useJobStatus] Initializing with jobId:',
    jobId,
    'enabled:',
    options?.enabled ?? !!jobId
  );

  return useQuery({
    queryKey: ['factCheckJob', jobId],
    queryFn: () => {
      console.log('[useJobStatus] Fetching job status for jobId:', jobId);
      return getJobStatus(jobId);
    },
    enabled: options?.enabled ?? !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      console.log(
        '[useJobStatus] Checking refetch interval. Current data:',
        data
      );

      if (!data?.data?.status) {
        console.log('[useJobStatus] No status yet, continuing to poll');
        return pollingInterval;
      }

      const status = data.data.status;
      console.log('[useJobStatus] Current status:', status);

      // Stop polling ONLY when status is completed or failed
      if (status === 'completed' || status === 'failed') {
        console.log('[useJobStatus] Status is', status, '- stopping polling');
        return false;
      }

      // Continue polling for all other statuses (prioritized, processing, etc.)
      console.log('[useJobStatus] Status is', status, '- continuing to poll');
      return pollingInterval;
    },
    retry: (failureCount, error) => {
      console.log(
        '[useJobStatus] Error occurred:',
        error,
        'Retry count:',
        failureCount
      );
      // Don't retry on 404 - job not found
      if ((error as any)?.response?.status === 404) {
        console.log('[useJobStatus] 404 error, not retrying');
        return false;
      }
      // Retry up to 3 times for other errors
      const shouldRetry = failureCount < 3;
      console.log('[useJobStatus] Should retry:', shouldRetry);
      return shouldRetry;
    },
    staleTime: 0, // Always fetch fresh data when queried
  });
};

export const useClaimDetail = (
  claimId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['claimDetail', claimId],
    queryFn: () => getClaimDetail(claimId),
    enabled: options?.enabled ?? !!claimId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useVerifyClaim = () => {
  return useMutation({
    mutationFn: (payload: VerifyClaimRequest) => verifyClaim(payload),
  });
};
