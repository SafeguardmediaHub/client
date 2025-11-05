import { useMutation } from '@tanstack/react-query';
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
    results: SearchResult[];
  };
}

const reverseLookup = async ({
  mediaId,
}: {
  mediaId: string;
}): Promise<InitiateReverseLookupResponse> => {
  console.log('starting reverse lookup for mediaId', mediaId);
  const response = await api.post(
    '/api/reverse-lookup/search',
    { mediaId, includeSocial: true, priority: 'high' },
    { headers: { 'Content-Type': 'application/json' } }
  );

  console.log('reverse lookup result', response.data);

  return response.data;
};

const reverseLookupResult = async ({
  jobId,
}: {
  jobId: string;
}): Promise<ReverseLookupResult> => {
  console.log('fetching results');
  const response = await api.get(`/api/reverse-lookup/result/${jobId}`);

  console.log('this is response', response.data);

  return response.data;
};

export const useReverseLookup = () => {
  return useMutation({
    mutationFn: reverseLookup,
  });
};

export const useReverseLookupResult = () => {
  return useMutation({
    mutationFn: reverseLookupResult,
  });
};
