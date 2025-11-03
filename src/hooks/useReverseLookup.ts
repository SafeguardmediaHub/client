import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export interface ReverseLookupResult {
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

const reverseLookup = async ({
  mediaId,
}: {
  mediaId: string;
}): Promise<ReverseLookupResult> => {
  console.log('starting reverse lookup for mediaId', mediaId);
  const response = await api.post(
    '/api/reverse-lookup/search',
    { mediaId, includeSocial: true, priority: 'high' },
    { headers: { 'Content-Type': 'application/json' } }
  );

  console.log('reverse lookup result', response.data);

  return response.data;
};

const reverseLookupResult = async ({ jobId }: { jobId: string }) => {
  const response = await api.get(`/api/reverse-lookup/result/${jobId}`);

  return response.data;
};

export const useReverseLookup = () => {
  return useMutation({
    mutationFn: reverseLookup,
  });
};
