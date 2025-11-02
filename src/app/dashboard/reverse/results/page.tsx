'use client';

import { formatDate } from 'date-fns';
import { Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Media, useGetMedia } from '@/hooks/useMedia';

const ReverseLookupResultPage = () => {
  const router = useRouter();
  const searhParams = useSearchParams();

  const mediaId = searhParams.get('mediaId');

  const { data: mediaData, refetch, isLoading } = useGetMedia();

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
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Search Completed
            </h3>
            <p className="text-gray-600 text-sm">
              Found 47 matches across 4 search engines.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Search Coverage
            </h3>
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
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Distribution Timeline
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          7 total identical or similar copies of the media were found.
        </p>

        <div className="space-y-4">
          {/* {distributionItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900">{item.platform}</h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    {item.matchPercentage}
                  </span>
                </div>
              </div>

              <p className="text-gray-900 mb-4">{item.title}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Published: {item.publishedDate}</span>
                <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  View Source
                </button>
              </div>
            </div>
          ))} */}
        </div>

        <div className="mt-6 flex justify-center">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReverseLookupResultPage;
