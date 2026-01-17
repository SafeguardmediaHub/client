import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {explanationApi} from '@/lib/api/explanation';
import type {
  AnalysisFeatureType,
  ExplanationOptions,
  GenerateExplanationRequest,
} from '@/types/explanation';

export interface UseExplanationOptions {
  analysisId: string;
  featureType: AnalysisFeatureType;
  options?: ExplanationOptions;
  enabled?: boolean;
}

export function useExplanation({
  analysisId,
  featureType,
  options,
  enabled = true,
}: UseExplanationOptions) {
  const queryClient = useQueryClient();
  const [jobId, setJobId] = useState<string | null>(null);

  // 1. Try to get cached explanation
  const explanationQuery = useQuery({
    queryKey: ['explanation', analysisId, options],
    queryFn: async () => {
      try {
        const response = await explanationApi.getExplanation(
          analysisId,
          options,
        );
        return response.data;
      } catch (error: any) {
        // biome-ignore lint/suspicious/noExplicitAny: Axios error response access
        if ((error as any).response?.status === 404) {
          return null; // Not found, signal for generation
        }
        throw error;
      }
    },
    enabled: enabled && !!analysisId && !jobId, // Don't fetch if we have a job running
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // 2. Queue generation if not found (mutation)
  const generateMutation = useMutation({
    mutationFn: (request: GenerateExplanationRequest) =>
      explanationApi.generateExplanation(request),
    onSuccess: (data) => {
      setJobId(data.jobId);
    },
    onError: (error) => {
      console.error('Failed to generate explanation:', error);
      toast.error('Failed to start explanation generation');
    },
  });

  // 3. Poll for status if we have a job ID
  const jobStatusQuery = useQuery({
    queryKey: ['explanation-job', jobId],
    queryFn: () => explanationApi.getJobStatus(jobId ?? ''),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') {
        return false;
      }
      return 1000; // Poll every second
    },
    refetchIntervalInBackground: true,
  });

  // Effect to trigger generation if cache miss
  useEffect(() => {
    if (
      enabled &&
      explanationQuery.isFetched &&
      !explanationQuery.data &&
      !explanationQuery.error &&
      !generateMutation.isPending &&
      !jobId
    ) {
      // 404 from cache, start generation
      generateMutation.mutate({
        analysisId,
        featureType,
        options,
        priority: 'high',
      });
    }
  }, [
    enabled,
    explanationQuery.isFetched,
    explanationQuery.data,
    explanationQuery.error,
    generateMutation.isPending,
    jobId,
    analysisId,
    featureType,
    options,
    generateMutation.mutate,
  ]);

  // Effect to handle job completion
  useEffect(() => {
    if (
      jobStatusQuery.data?.status === 'completed' &&
      jobStatusQuery.data.result
    ) {
      // Update the main query cache with the result
      queryClient.setQueryData(
        ['explanation', analysisId, options],
        jobStatusQuery.data.result,
      );
      setJobId(null); // Stop polling
    }
  }, [jobStatusQuery.data, queryClient, analysisId, options]);

  // Derived state
  const isLoading =
    explanationQuery.isLoading ||
    generateMutation.isPending ||
    (!!jobId && jobStatusQuery.data?.status !== 'completed');

  const error =
    explanationQuery.error ||
    generateMutation.error ||
    (jobStatusQuery.data?.status === 'failed'
      ? new Error(jobStatusQuery.data.error)
      : null);

  const status = jobId
    ? jobStatusQuery.data?.status || 'processing'
    : explanationQuery.data
      ? 'completed'
      : 'idle';

  return {
    explanation: explanationQuery.data || jobStatusQuery.data?.result,
    isLoading,
    error,
    status,
    progress: jobStatusQuery.data?.progress,
    message: jobStatusQuery.data?.message,
    retry: explanationQuery.refetch,
  };
}
