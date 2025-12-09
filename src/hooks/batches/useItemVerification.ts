import { useQuery } from '@tanstack/react-query';
import { getItemVerification } from '@/lib/api/batch';

export const useItemVerification = (
  batchId: string,
  itemId: string,
  verificationType: 'c2pa' | 'timeline' | 'geolocation' | 'factCheck' | 'deepfake',
  enabled = true
) => {
  return useQuery({
    queryKey: ['itemVerification', batchId, itemId, verificationType],
    queryFn: () => getItemVerification(batchId, itemId, verificationType),
    enabled: enabled && !!batchId && !!itemId && !!verificationType,
    staleTime: 60000, // Cache for 1 minute
    refetchOnWindowFocus: false,
  });
};
