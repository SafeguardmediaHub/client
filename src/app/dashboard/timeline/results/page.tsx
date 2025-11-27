/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
'use client';

import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import TimelineResult from '@/components/timelineResult';
import { Button } from '@/components/ui/button';
import { useGetMedia } from '@/hooks/useMedia';
import {
  useTimeline,
  useTimelineVerificationResult,
} from '@/hooks/useTimeline';

function TimelineResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasInitiated, setHasInitiated] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  const mediaId = searchParams.get('mediaId');
  const claimedDate = searchParams.get('claimedDate');

  const { data: mediaData } = useGetMedia();
  const timelineMutation = useTimeline();

  const selectedMedia = mediaData?.media?.find((m) => m.id === mediaId);

  // Poll for verification result
  const {
    data: verificationResult,
    isLoading: isLoadingResult,
    isFetching,
    refetch,
  } = useTimelineVerificationResult(mediaId || '', {
    enabled: hasInitiated,
  });

  const verificationStatus = verificationResult?.status;

  // Update last refresh time when data changes
  useEffect(() => {
    if (verificationResult) {
      setLastRefreshTime(new Date());
    }
  }, [verificationResult]);

  // Initiate verification on page load
  useEffect(() => {
    if (!mediaId || !claimedDate) {
      toast.error('Missing verification parameters');
      router.push('/dashboard/timeline');
      return;
    }

    if (!selectedMedia) {
      return;
    }

    // Check if already has completed timeline data
    if (selectedMedia?.timeline?.status === 'completed') {
      setHasInitiated(true);
      return;
    }

    // Start verification if not already initiated
    if (!hasInitiated && !timelineMutation.isPending) {
      timelineMutation.mutate({
        mediaId,
        claimedTakenAt: claimedDate,
      });
      setHasInitiated(true);
      toast.success('Timeline verification started');
    }
  }, [mediaId, claimedDate, selectedMedia, hasInitiated]);

  // Show toast when verification completes
  useEffect(() => {
    if (verificationStatus === 'completed') {
      toast.success('Timeline verification completed successfully!');
    } else if (verificationStatus === 'failed') {
      toast.error('Timeline verification failed');
    }
  }, [verificationStatus]);

  const handleBack = () => {
    router.push('/dashboard/timeline');
  };

  const handleManualRefresh = () => {
    refetch();
    toast.info('Refreshing verification status...');
  };

  // No mediaId or claimedDate
  if (!mediaId || !claimedDate) {
    return null;
  }

  // Initial loading state
  if (!selectedMedia || (isLoadingResult && !verificationResult)) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900">
              Loading Timeline Verification
            </h2>
            <p className="text-sm text-gray-600">
              Please wait while we fetch your verification details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Processing state
  if (verificationStatus === 'processing' || verificationStatus === 'partial') {
    return (
      <div className="w-full flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Timeline Verification
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedMedia.filename}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="cursor-pointer"
              >
                <ArrowLeft className="size-4 mr-1" />
                Back
              </Button>
            </div>
          </div>

          {/* Processing Status Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {verificationStatus === 'processing'
                    ? 'Processing Verification'
                    : 'Partial Results Available'}
                </h2>
                <p className="text-gray-600">
                  {verificationStatus === 'processing'
                    ? 'Your timeline verification is currently being processed.'
                    : 'Some results are available while processing continues.'}
                </p>
              </div>

              {/* Auto-refresh indicator */}
              <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isFetching ? 'animate-spin text-blue-600' : ''
                    }`}
                  />
                  <span>
                    {isFetching
                      ? 'Checking status...'
                      : 'Auto-refreshing every 10 seconds'}
                  </span>
                </div>
                <p className="text-xs">
                  Last updated: {lastRefreshTime.toLocaleTimeString()}
                </p>
              </div>

              {/* Manual refresh button */}
              <Button
                variant="outline"
                onClick={handleManualRefresh}
                disabled={isFetching}
                className="cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`}
                />
                {isFetching ? 'Refreshing...' : 'Refresh Now'}
              </Button>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              You can safely navigate away from this page. The verification will
              continue processing in the background.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (verificationStatus === 'failed') {
    return (
      <div className="w-full flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Timeline Verification
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedMedia.filename}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="cursor-pointer"
              >
                <ArrowLeft className="size-4 mr-1" />
                Back
              </Button>
            </div>
          </div>

          {/* Failed Status Card */}
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600">
                  {verificationResult?.error ||
                    'An error occurred during the timeline verification process. Please try again or contact support if the issue persists.'}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="cursor-pointer"
                >
                  Back to Timeline
                </Button>
                <Button
                  onClick={handleManualRefresh}
                  className="cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completed state - show results
  if (verificationStatus === 'completed' && verificationResult) {
    // Map verification result to the format expected by TimelineResult
    const mappedData = {
      status: 'completed',
      score: verificationResult.score,
      classification: verificationResult.classification,
      timeline: verificationResult.timeline || [],
      flags: verificationResult.flags || [],
      analysis: verificationResult.analysis || {
        hasMetadata: false,
        metadataConsistent: false,
        earlierOnlineAppearance: false,
        spoofedMetadata: false,
      },
      matches: (verificationResult.matches || []).map((match) => ({
        title: match.title,
        link: match.link,
        source: match.source,
        sourceIcon: match.sourceIcon,
        thumbnail: match.thumbnail || match.thumbnailUrl,
        confidence: match.confidence?.toString(),
      })),
      metadata: verificationResult.metadata || {
        extractedAt: new Date().toISOString(),
        analysis: {
          integrityScore: 0,
          authenticityScore: 0,
          completenessScore: 0,
        },
      },
    };

    // Create media object with timeline data for TimelineResult
    const mediaWithTimeline = {
      ...selectedMedia,
      timeline: mappedData,
    };

    return (
      <TimelineResult
        data={mappedData}
        media={mediaWithTimeline}
        onBack={handleBack}
        claimedDate={claimedDate || ''}
      />
    );
  }

  // Default/fallback state
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Results
          </h2>
          <p className="text-sm text-gray-600">
            Please wait while we load the verification results...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TimelineResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center text-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900">
                Loading Results
              </h2>
              <p className="text-sm text-gray-600">
                Please wait while we load the verification results...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <TimelineResultsContent />
    </Suspense>
  );
}
