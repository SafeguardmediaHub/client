import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export interface ReverseLookupResult {
  success: boolean;
  message: string;
  data: {
    jobId: string;
  };
}

const reverseLookup = async ({
  mediaId,
}: {
  mediaId: string;
}): Promise<ReverseLookupResult> => {
  const response = await api.post(
    '/api/reverse-lookup/search',
    { mediaId },
    { headers: { 'Content-Type': 'application/json' } }
  );

  return response.data;
};

export const useReverseLookup = () => {
  return useMutation({
    mutationFn: reverseLookup,
  });
};
