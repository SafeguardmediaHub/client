/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
'use client';

import { formatDate } from 'date-fns';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { useGetMedia } from '@/hooks/useMedia';
import { useReverseLookupResult } from '@/hooks/useReverseLookup';

const ReverseLookupResultContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mediaId = searchParams.get('mediaId');
  const jobId = searchParams.get('jobId');

  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [visibleResults, setVisibleResults] = useState(8);

  const { data: mediaData, isLoading: isLoadingMedia } = useGetMedia();
  const selectedMedia = mediaData?.media?.find((m) => m.id === mediaId);

  // Fetch reverse lookup result with automatic polling
  const {
    data: resultData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useReverseLookupResult(jobId || '', {
    enabled: !!jobId,
  });

  const lookupStatus = resultData?.data?.status;

  // Update last refresh time when data changes
  useEffect(() => {
    if (resultData) {
      setLastRefreshTime(new Date());
    }
  }, [resultData]);

  // Show toast when reverse lookup completes
  useEffect(() => {
    if (lookupStatus === 'completed') {
      toast.success('Reverse lookup completed successfully!');
    } else if (lookupStatus === 'failed') {
      toast.error('Reverse lookup failed');
    }
  }, [lookupStatus]);

  const searchEngines = [
    { name: 'Google Images', checked: true },
    { name: 'Bing Visual Search', checked: true },
    { name: 'TinEye', checked: true },
    { name: 'Yandex', checked: true },
  ];

  const handleBack = () => {
    router.push('/dashboard/reverse');
  };

  const handleManualRefresh = () => {
    refetch();
    toast.info('Refreshing lookup status...');
  };

  const results = resultData?.data?.results || [];
  const displayedResults = results.slice(0, visibleResults);
  const hasMoreResults = results.length > visibleResults;

  const loadMoreResults = () => {
    setVisibleResults((prev) => Math.min(prev + 8, results.length));
  };

  // Error state - job not found
  if (isError) {
    const errorStatus = (error as any)?.response?.status;

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {errorStatus === 404
                ? 'Lookup Not Found'
                : 'Error Loading Lookup'}
            </h2>
            <p className="text-sm text-gray-600">
              {errorStatus === 404
                ? 'The requested reverse lookup could not be found. It may have been deleted or the link is invalid.'
                : 'An error occurred while loading the reverse lookup. Please try again.'}
            </p>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleManualRefresh}
                className="cursor-pointer"
              >
                Try Again
              </Button>
              <Button onClick={handleBack} className="cursor-pointer">
                Back to Reverse Lookup
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No job ID provided
  if (!jobId) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Missing Job ID
            </h2>
            <p className="text-sm text-gray-600">
              No job ID was provided. Please start a new reverse lookup.
            </p>
            <Button onClick={handleBack} className="mt-4 cursor-pointer">
              Start New Lookup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Initial loading state
  if (isLoading || isLoadingMedia) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900">
              Loading Reverse Lookup
            </h2>
            <p className="text-sm text-gray-600">
              Please wait while we fetch your lookup details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Media not found
  if (!selectedMedia) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Media Not Found
            </h2>
            <p className="text-sm text-gray-600">
              The requested media file could not be found.
            </p>
            <Button onClick={handleBack} className="mt-4 cursor-pointer">
              Back to Reverse Lookup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Processing/Queued state
  if (lookupStatus === 'queued' || lookupStatus === 'processing') {
    const estimatedTime = resultData?.data
      ? (resultData as any).data.estimatedTime
      : null;

    return (
      <div className="w-full flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Reverse Lookup
                </h1>
                <p className="text-sm text-gray-600">Job ID: {jobId}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="cursor-pointer"
              >
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
                  {lookupStatus === 'queued'
                    ? 'Lookup Queued'
                    : 'Processing Lookup'}
                </h2>
                <p className="text-gray-600">
                  {lookupStatus === 'queued'
                    ? 'Your reverse lookup is in the queue and will start processing shortly.'
                    : 'Your reverse lookup is currently being processed.'}
                </p>
              </div>

              {estimatedTime && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Estimated time: </span>~
                    {estimatedTime} seconds remaining
                  </p>
                </div>
              )}

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
          {/* <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              You can safely navigate away from this page. The lookup will
              continue processing in the background.
            </p>
          </div> */}
        </div>
      </div>
    );
  }

  // Failed state
  if (lookupStatus === 'failed') {
    return (
      <div className="w-full flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Reverse Lookup
                </h1>
                <p className="text-sm text-gray-600">Job ID: {jobId}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="cursor-pointer"
              >
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
                  Lookup Failed
                </h2>
                <p className="text-gray-600">
                  An error occurred during the reverse lookup process. Please
                  try again or contact support if the issue persists.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="cursor-pointer"
                >
                  Start New Lookup
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
  if (lookupStatus === 'completed' && resultData?.data) {
    return (
      <div className="w-full flex flex-col gap-6 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-8xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Reverse Lookup Results
                </h1>
                <p className="text-sm text-gray-600">
                  Found {results.length} matches across search engines
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  className="cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="cursor-pointer"
                >
                  Back
                </Button>
              </div>
            </div>
          </div>

          {/* Success Banner and Media Info - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Media Info - 2/3 width */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex gap-6">
                <img
                  src={selectedMedia.thumbnailUrl}
                  alt={selectedMedia.filename}
                  className="w-64 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Original Source
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">First Published</span>
                      <span className="text-gray-900 font-medium">
                        {formatDate(selectedMedia.uploadedAt, 'dd-MMM-yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source</span>
                      <span className="text-gray-900 font-medium">
                        User Library
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Banner - 1/3 width */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Search Completed
                  </h3>
                  <p className="text-sm text-green-800">
                    Found {results.length} matches across search engines
                  </p>
                  <div className="mt-3">
                    <span className="text-xs font-medium text-green-900">
                      Progress: {resultData.data.progress || 100}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Coverage */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Coverage
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {searchEngines.map((engine) => (
                <div key={engine.name} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{engine.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search Results */}

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Search Results
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {results.length} matches found across search engines
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col max-w-sm bg-gray-100 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="relative">
                        <AspectRatio
                          ratio={16 / 9}
                          className="bg-muted rounded-lg"
                        >
                          <img
                            src={item.thumbnailUrl || '/placeholder-image.png'}
                            alt={item.title}
                            className="h-full w-full rounded-t-md object-cover"
                          />
                        </AspectRatio>
                      </div>
                    </a>
                    <div className="p-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h5 className="mb-2 font-bold tracking-tight text-muted-foreground line-clamp-2">
                          Source:{' '}
                          <span className="text-gray-900">{item.source}</span>
                        </h5>
                      </a>
                    </div>

                    <div className="flex justify-center mb-4 mt-auto">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mx-3"
                        >
                          View Source
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No matches found across search engines.
              </div>
            )}

            {hasMoreResults && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={loadMoreResults}
                  variant="outline"
                  className="px-6 py-2 cursor-pointer"
                >
                  Load More ({results.length - visibleResults} remaining)
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="cursor-pointer"
            >
              New Lookup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback state
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Results
          </h2>
          <p className="text-sm text-gray-600">
            Please wait while we load the lookup results...
          </p>
        </div>
      </div>
    </div>
  );
};

const ReverseLookupResultPage = () => {
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
                Please wait while we load the lookup results...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ReverseLookupResultContent />
    </Suspense>
  );
};

export default ReverseLookupResultPage;
