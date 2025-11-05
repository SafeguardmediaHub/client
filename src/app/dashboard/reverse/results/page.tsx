'use client';

import { formatDate } from 'date-fns';
import { Check, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { useGetMedia } from '@/hooks/useMedia';
import {
  type ReverseLookupResult,
  useReverseLookupResult,
} from '@/hooks/useReverseLookup';

const ReverseLookupResultPage = () => {
  const router = useRouter();
  const searhParams = useSearchParams();

  const mediaId = searhParams.get('mediaId');

  const { data: mediaData, refetch, isLoading } = useGetMedia();
  const reverseLookupResultMutation = useReverseLookupResult();

  const [resultData, setResultData] = useState<ReverseLookupResult | null>(
    null
  );
  const [hasChecked, setHasChecked] = useState(false);
  const [visibleResults, setVisibleResults] = useState(8);

  const jobId = searhParams.get('jobId');
  const selectedMedia = mediaData?.media?.find((m) => m.id === mediaId);

  const searchEngines = [
    { name: 'Google Images', checked: true },
    { name: 'Bing Visual Search', checked: true },
    { name: 'TinEye', checked: true },
    { name: 'Yandex', checked: true },
  ];

  const handleBack = () => {
    router.push('/dashboard/reverse');
  };

  const checkJobResult = () => {
    if (!jobId) return;

    setHasChecked(true);
    reverseLookupResultMutation.mutate(
      { jobId },
      {
        onSuccess: (data) => {
          setResultData(data);
        },
        onError: (error) => {
          console.error('Failed to get job result:', error);
        },
      }
    );
  };

  const results = resultData?.data.results || [];
  const displayedResults = results.slice(0, visibleResults);
  const hasMoreResults = results.length > visibleResults;

  const loadMoreResults = () => {
    setVisibleResults((prev) => Math.min(prev + 8, results.length));
  };

  if (isLoading) {
    return <div className="p-8">isloading...</div>;
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
          Back to Reverse
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 p-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                    {formatDate(selectedMedia.uploadedAt, 'dd-mmm-yyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source</span>
                  <span className="text-gray-900 font-medium">
                    User Library
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="mt-6 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                View Original Source
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {resultData?.data.status === 'completed' ? (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Search Completed
                </h3>
                <p className="text-gray-600 text-sm">
                  Found {resultData.data.results?.length || 0} matches across
                  search engines.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    Reverse Lookup Results
                  </h3>
                  <button
                    type="button"
                    onClick={checkJobResult}
                    disabled={reverseLookupResultMutation.isPending || !jobId}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        reverseLookupResultMutation.isPending
                          ? 'animate-spin'
                          : ''
                      }`}
                    />
                    {reverseLookupResultMutation.isPending
                      ? 'Checking...'
                      : 'Check Results'}
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {hasChecked ? (
                    resultData?.data.status ? (
                      <>
                        Status:{' '}
                        <span className="capitalize font-medium">
                          {resultData.data.status}
                        </span>
                        {resultData.data.status === 'processing' &&
                          ' - Analysis in progress...'}
                        {resultData.data.status === 'queued' &&
                          ' - Waiting to be processed...'}
                      </>
                    ) : (
                      'Click "Check Results" to see if your analysis is ready.'
                    )
                  ) : (
                    'Your reverse lookup is being processed. Click "Check Results" when ready.'
                  )}
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Search Coverage
            </h3>
            {resultData?.data.status === 'completed' ? (
              <div className="grid grid-cols-2 gap-4">
                {searchEngines.map((engine) => (
                  <div key={engine.name} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">{engine.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {searchEngines.map((engine) => (
                  <div key={engine.name} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Search Results
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {resultData?.data.status === 'completed'
            ? `${
                resultData.data.results?.length || 0
              } matches found across search engines.`
            : 'Results will appear here once the analysis is complete.'}
        </p>

        {resultData?.data.status === 'completed' ? (
          results.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedResults.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col max-w-sm bg-gray-100 border border-gray-200 rounded-lg shadow-sm"
                >
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
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

                    {/* <div className="flex items-center gap-2 mb-2">
                      {item.metadata?.sourceIcon && (
                        <img
                          src={item.metadata.sourceIcon}
                          alt={item.source}
                          className="w-4 h-4 rounded"
                        />
                      )}
                      <span className="text-sm font-semibold text-gray-700">
                        {item.source}
                      </span>
                    </div> */}

                    {/* <div className="text-xs text-gray-500 mb-3">
                      Published: {formatDate(item.publishedAt, 'MMM dd, yyyy')}
                    </div> */}
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
          )
        ) : (
          // Skeleton loaders in grid format
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <>
                key={index}
                className="flex flex-col max-w-sm bg-gray-200 border border-gray-200 rounded-lg shadow-sm animate-pulse"
              >
                <div className="relative">
                  <AspectRatio
                    ratio={16 / 9}
                    className="bg-gray-300 rounded-t-lg"
                  ></AspectRatio>
                </div>
                <div className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="flex justify-center mb-4 mt-auto">
                  <div className="h-8 bg-gray-300 rounded w-24 mx-3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {resultData?.data.status === 'completed' && hasMoreResults && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={loadMoreResults}
              variant="outline"
              className="px-6 py-2"
            >
              Load More ({results.length - visibleResults} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReverseLookupResultPage;
