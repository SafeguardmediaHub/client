/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface SearchResult {
  id: string;
  platform: string;
  url: string;
  title: string;
  snippet?: string;
  thumbnailUrl: string;
  publishedAt: Date;
  confidence: number;
  source: string;
  searchEngine: string;
  foundAt: Date;
  metadata: {
    domain: string;
    scrapedAt: Date;
    contentType: string;
    engine: string;
    position: number;
    sourceIcon: string;
    aggregationIndex: number;
    deduplicationKey: string;
    author: string;
    imageCount: number;
    scrapingData: {
      statusCode: number;
      redirectCount: number;
      finalUrl: string;
      contentLength: number;
    };
  };
}

export interface InitiateReverseLookupResponse {
  success: boolean;
  message: string;
  data: {
    jobId: string;
    estimatedTime: number;
    status:
      | 'queued'
      | 'processing'
      | 'completed'
      | 'failed'
      | 'cancelled'
      | 'expired';
  };
}

export interface ReverseLookupResult {
  success: boolean;
  message: string;
  data: {
    jobId: string;
    status:
      | 'queued'
      | 'processing'
      | 'completed'
      | 'failed'
      | 'cancelled'
      | 'expired';
    progress: number;
    report?: {
      id: string;
      status:
        | 'pending'
        | 'generating'
        | 'completed'
        | 'failed'
        | 'not_generated';
      generatedAt?: string; // ISO Date string
      error?: string;
    };
    results: SearchResult[];
  };
}

export interface UserReverseLookup {
  _id: string;
  jobId: string;
  mediaId: {
    _id: string;
    originalFilename: string;
    fileExtension: string;
    thumbnailUrl: string;
  };
  userId: string;
  status:
    | 'queued'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'expired';
  progress: number;
  resultsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserReverseLookups {
  success: boolean;
  message: string;
  data: {
    lookups: UserReverseLookup[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

const reverseLookup = async ({
  mediaId,
}: {
  mediaId: string;
}): Promise<InitiateReverseLookupResponse> => {
  const response = await api.post(
    '/api/reverse-lookup/search',
    { mediaId, includeSocial: true, priority: 'high' },
    { headers: { 'Content-Type': 'application/json' } },
  );

  return response.data;
};

const reverseLookupResult = async (
  jobId: string,
): Promise<ReverseLookupResult> => {
  const response = await api.get(`/api/reverse-lookup/result/${jobId}`);

  return response.data;
};

export const downloadReport = async (jobId: string) => {
  console.log('downloading report for job id', jobId);

  const response = await api.get(
    `/api/reverse-lookup/result/${jobId}/report/download`,
  );

  const downloadUrl = response.data?.data?.downloadUrl;

  if (!downloadUrl) {
    console.log('Full response:', response.data);
    throw new Error('Download URL not found');
  }

  console.log('Download URL:', downloadUrl);

  // Trigger download using the same pattern as geolocation
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `Report-${jobId}.pdf`;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const shareReport = async (jobId: string, expiresIn = 7) => {
  const { data } = await api.post(`/api/reverse-lookup/result/${jobId}/share`, {
    expiresIn,
  });
  return data;
};

const fetchUserReverseLookups = async (): Promise<UserReverseLookups> => {
  const response = await api.get('/api/reverse-lookup/search');

  return response.data;
};

export const useReverseLookup = () => {
  return useMutation({
    mutationFn: reverseLookup,
  });
};

export const useReverseLookupResult = (
  jobId: string,
  options?: {
    pollingInterval?: number;
    enabled?: boolean;
  },
) => {
  const pollingInterval = options?.pollingInterval ?? 10000; // 10 seconds default

  return useQuery({
    queryKey: ['reverseLookupResult', jobId],
    queryFn: () => reverseLookupResult(jobId),
    enabled: options?.enabled ?? !!jobId,
    refetchInterval: (query) => {
      // Access the data from the query state
      const data = query.state.data;

      if (!data?.data?.status) {
        // If we don't have status yet, keep polling
        return pollingInterval;
      }

      const status = data.data.status;
      const reportStatus = data.data.report?.status;

      // Only poll when status is queued or processing
      if (['queued', 'processing'].includes(status)) {
        return pollingInterval;
      }

      // If job is completed but report is still generating, keep polling
      if (
        status === 'completed' &&
        reportStatus &&
        ['pending', 'generating'].includes(reportStatus)
      ) {
        return pollingInterval;
      }

      // Stop polling when completed, failed, cancelled, or expired
      return false;
    },
    retry: (failureCount, error) => {
      // Don't retry on 404 - job not found
      if ((error as any)?.response?.status === 404) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    staleTime: 0, // Always fetch fresh data when queried
  });
};

export const useUserReverseLookups = () => {
  return useQuery({
    queryKey: ['userReverseLookups'],
    queryFn: fetchUserReverseLookups,
    staleTime: 60 * 1000, // cache for 1 minute
  });
};
