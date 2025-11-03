'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useGeolocationVerification } from '@/hooks/useGeolocation';
import { useGetMedia } from '@/hooks/useMedia';

const GeolocationResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationResults, setVerificationResults] = useState<any>(null);

  const mediaId = searchParams.get('mediaId');
  const claimedLocation = searchParams.get('claimedLocation');

  const { data: mediaData, refetch } = useGetMedia();

  const geoMutation = useGeolocationVerification();

  const selectedMedia = mediaData?.media?.find((m) => m.id === mediaId);

  const handleBack = () => {
    router.push('/dashboard/geolocation');
  };

  //   useEffect(() => {
  //     if (!mediaId || !claimedLocation) {
  //       toast.error('Missing verification parameters');
  //       router.push('/dashboard/geolocation');
  //       return;
  //     }

  //     if (!selectedMedia) {
  //       setIsLoading(false);
  //       return;
  //     }

  //     geoMutation.mutate(
  //       { id: mediaId, claimedLocation: claimedLocation },
  //       {
  //         onSuccess: () => {
  //           refetch();
  //           setIsLoading(false);
  //           toast.success('Geolocation verification completed.');
  //         },
  //         onError: (error) => {
  //           setIsLoading(false);
  //           console.error('Error verifying timeline:', error);
  //           toast.error('Failed to verify timeline. Please try again.');
  //         },
  //       }
  //     );
  //   }, [claimedLocation, mediaId]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 p-8 bg-gray-100 min-h-screen">
        isloading...
      </div>
    );
  }

  if (!selectedMedia) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Media not found</h2>
        <p className="text-gray-600 mb-4">
          The requested media file could not be found.
        </p>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          onClick={handleBack}
        >
          Back to Geolocation
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 p-8 bg-gray-100 min-h-screen">
      result page
    </div>
  );
};

export default GeolocationResultPage;
