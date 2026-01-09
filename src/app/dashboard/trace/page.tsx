'use client';

import { AlertCircle, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import MediaSelector from '@/components/media/MediaSelector';
import { TraceCardLive } from '@/components/trace/TraceCardLive';
import { TraceInitiatePanel } from '@/components/trace/TraceInitiatePanel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Media } from '@/hooks/useMedia';
import { useInitiateTrace, useMediaTraces, useUserTraces } from '@/hooks/useTrace';
import { cn } from '@/lib/utils';
import type { InitiateTraceRequest, TraceListItem } from '@/types/trace';

const LoadingState = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

const TraceListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 bg-white border border-gray-200 rounded-lg">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-64 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

const TraceContent = () => {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showInitiatePanel, setShowInitiatePanel] = useState(false);

  const initiateTraceMutation = useInitiateTrace();
  const mediaTracesQuery = useMediaTraces(selectedMedia?.id || '', {
    enabled: !!selectedMedia?.id,
  });

  const handleMediaSelect = (media: Media) => {
    setSelectedMedia(media);
    setShowInitiatePanel(false);
  };

  const handleSubmitTrace = (data: InitiateTraceRequest) => {
    if (!selectedMedia) {
      toast.error('Please select a media file first');
      return;
    }

    initiateTraceMutation.mutate(
      {
        mediaId: selectedMedia.id,
        payload: data,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            setShowInitiatePanel(false);
            toast.success('Trace initiated successfully!', {
              description: 'Redirecting to trace details...',
            });
            // Navigate to trace details page
            router.push(
              `/dashboard/trace/${response.data.traceId}?mediaId=${selectedMedia.id}`
            );
          }
        },
        onError: (error) => {
          console.error('Failed to initiate trace:', error);
          toast.error(
            `Failed to initiate trace: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        },
      }
    );
  };

  const handleRetry = (_traceId: string) => {
    // TODO: Implement retry logic
    toast.info('Retry functionality will be implemented in Sprint 2');
  };

  const [viewMode, setViewMode] = useState<'media' | 'global'>('media');
  const userTracesQuery = useUserTraces({ limit: 20 }, {
    enabled: viewMode === 'global',
  });

  const traces = viewMode === 'media' 
    ? (mediaTracesQuery.data?.data?.traces || [])
    : (userTracesQuery.data?.data?.traces || []);

  const isLoading = viewMode === 'media' ? mediaTracesQuery.isLoading : userTracesQuery.isLoading;
  const isError = viewMode === 'media' ? mediaTracesQuery.isError : userTracesQuery.isError;
  const refetch = viewMode === 'media' ? mediaTracesQuery.refetch : userTracesQuery.refetch;

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-gray-900 leading-9">
            Social Media Tracing
          </h1>
          <p className="text-sm font-medium text-gray-600 leading-[21px]">
            Track and analyze the spread of your media across social platforms
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('media')}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-lg transition-all",
                viewMode === 'media' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Media Traces
            </button>
            <button
              onClick={() => setViewMode('global')}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-lg transition-all",
                viewMode === 'global' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              My History
            </button>
          </div>
          {selectedMedia && (
            <Button
              onClick={() => setShowInitiatePanel(!showInitiatePanel)}
              className="h-10 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl flex-shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 mr-2" />
              <span className="text-base font-medium text-white whitespace-nowrap">
                {showInitiatePanel ? 'Cancel' : 'New Trace'}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Media Selection (only in media mode when no media selected) */}
      {viewMode === 'media' && !selectedMedia ? (
        <div className="p-8 bg-white border border-gray-200 rounded-lg">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Select Media to Trace
            </h2>
            <p className="text-sm text-gray-600">
              Choose a media file from your library to start tracing its
              presence across social media platforms.
            </p>
          </div>

          <MediaSelector onSelect={handleMediaSelect} />

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              What is Social Media Tracing?
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Select a media file (image, video, or audio)</li>
              <li>
                Configure search parameters (platforms, depth, time range)
              </li>
              <li>Our system searches for appearances across social media</li>
              <li>
                View distribution graphs, timeline, and suspicious patterns
              </li>
              <li>Access forensic analysis and authenticity indicators</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selected Media Info (only in media mode) */}
          {viewMode === 'media' && selectedMedia && (
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={selectedMedia.thumbnailUrl}
                    alt={selectedMedia.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {selectedMedia.filename}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Type: {selectedMedia.mimeType} | Size:{' '}
                    {selectedMedia.fileSize}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMedia(null);
                      setShowInitiatePanel(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 mt-2"
                  >
                    Change Media
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Initiate Panel (only in media mode) */}
          {viewMode === 'media' && selectedMedia && showInitiatePanel && (
            <div className="p-8 bg-white border border-gray-200 rounded-lg">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Configure Social Media Trace
                </h2>
                <p className="text-sm text-gray-600">
                  Set up search parameters to trace your media across social
                  platforms.
                </p>
              </div>

              <TraceInitiatePanel
                mediaId={selectedMedia.id}
                onSubmit={handleSubmitTrace}
                isLoading={initiateTraceMutation.isPending}
              />
            </div>
          )}

          {/* Traces List */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {viewMode === 'media' ? 'Recent Media Traces' : 'Global Trace History'}
              </h2>
              <p className="text-sm text-gray-600">
                {viewMode === 'media' 
                  ? 'View and manage traces for this media file.'
                  : 'All social media traces performed by your account.'}
              </p>
            </div>

            {isLoading ? (
              <TraceListSkeleton />
            ) : isError ? (
              <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      Failed to Load Traces
                    </h3>
                    <p className="text-sm text-red-800 mb-4">
                      There was an error loading the traces.
                      Please try again.
                    </p>
                    <Button
                      onClick={() => refetch()}
                      variant="outline"
                      className="cursor-pointer border-red-300 hover:bg-red-100"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            ) : traces.length === 0 ? (
              <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Traces Found
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {viewMode === 'media' 
                    ? 'Start your first trace to track this media across social platforms.'
                    : 'No traces have been initiated yet.'}
                </p>
                {viewMode === 'media' && selectedMedia && (
                  <Button
                    onClick={() => setShowInitiatePanel(true)}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-500"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Start New Trace
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {traces.map((trace: TraceListItem) => (
                  <TraceCardLive
                    key={trace.traceId}
                    trace={trace}
                    onRetry={handleRetry}
                    enablePolling={
                      trace.status === 'pending' ||
                      trace.status === 'processing'
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      )}
    </div>
  );
};

const TracePage = () => {
  return (
    <Suspense fallback={<LoadingState message="Loading trace..." />}>
      <TraceContent />
    </Suspense>
  );
};

export default TracePage;
