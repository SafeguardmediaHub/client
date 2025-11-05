/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import TimelineResult from '@/components/timelineResult';
import { useGetMedia } from '@/hooks/useMedia';
import { useTimeline } from '@/hooks/useTimeline';

function TimelineResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const mediaId = searchParams.get('mediaId');
  const claimedDate = searchParams.get('claimedDate');

  const { data: mediaData, refetch } = useGetMedia();
  const timelineMutation = useTimeline();

  const selectedMedia = mediaData?.media?.find((m) => m.id === mediaId);
  const hasTimelineData = selectedMedia?.timeline?.status === 'completed';

  useEffect(() => {
    if (!mediaId || !claimedDate) {
      toast.error('Missing verification parameters');
      router.push('/dashboard/timeline');
      return;
    }

    if (!selectedMedia) {
      setIsLoading(false);
      return;
    }

    // If we already have timeline data, don't start verification again
    if (hasTimelineData) {
      setIsLoading(false);
      return;
    }

    // Start verification automatically when page loads
    timelineMutation.mutate(
      {
        mediaId,
        claimedTakenAt: claimedDate,
      },
      {
        onSuccess: () => {
          // Refetch media data to get updated timeline info
          refetch();
          setIsLoading(false);
          toast.success('Timeline verification completed.');
        },
        onError: (error) => {
          setIsLoading(false);
          console.error('Error verifying timeline:', error);
          toast.error('Failed to verify timeline. Please try again.');
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId, claimedDate]);

  const handleBack = () => {
    router.push('/dashboard/timeline');
  };

  if (!mediaId || !claimedDate) {
    return null;
  }

  if (!selectedMedia && !isLoading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Media not found</h2>
        <p className="text-gray-600 mb-4">
          The requested media file could not be found.
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Timeline
        </button>
      </div>
    );
  }

  return (
    <TimelineResult
      data={selectedMedia?.timeline}
      media={selectedMedia || undefined}
      onBack={handleBack}
      claimedDate={claimedDate || ''}
    />
  );
}

export default function TimelineResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading timeline results...</p>
          </div>
        </div>
      }
    >
      <TimelineResultsContent />
    </Suspense>
  );
}
