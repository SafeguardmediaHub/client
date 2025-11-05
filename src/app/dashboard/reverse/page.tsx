/** biome-ignore-all lint/performance/noImgElement: <> */
'use client';

import { MoreVertical, Search, UploadIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import MediaSelector from '@/components/media/MediaSelector';
import { Button } from '@/components/ui/button';
import { type Media, useGetMedia } from '@/hooks/useMedia';
import { useReverseLookup } from '@/hooks/useReverseLookup';
import { formatFileSize } from '@/lib/utils';

export interface SearchResult {
  id: string;
  source: string;
  url: string;
  similarity: number;
  publishDate: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  verified: boolean;
}

const ReverseLookupPage = () => {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const router = useRouter();
  const reverseLookupMutation = useReverseLookup();

  const { data, isLoading } = useGetMedia();
  const media = data?.media || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredVerifications, setFilteredVerifications] = useState<Media[]>(
    []
  );

  const handleMediaSelection = (mediaFile: Media) => {
    const selectedFile = media.find((file) => file.id === mediaFile.id);
    if (selectedFile) {
      setSelectedMedia(selectedFile);
    }
  };

  const handleNewSearch = () => {
    setSelectedMedia(null);
  };

  const handleStartReverseLookup = () => {
    if (!selectedMedia) return;

    reverseLookupMutation.mutate(
      { mediaId: selectedMedia.id },
      {
        onSuccess: (data) => {
          // Navigate to results page with both mediaId and jobId
          router.push(
            `/dashboard/reverse/results?mediaId=${selectedMedia.id}&jobId=${data.data.jobId}`
          );
        },
        onError: (error) => {
          console.error('Failed to start reverse lookup:', error);
          toast.error(
            `Failed to start reverse lookup: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
          // Could show error toast here
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {' '}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-gray-900 leading-9">
            Reverse Lookup
          </h1>
          <p className="text-sm font-medium text-gray-600 leading-[21px]">
            Trace the origin and history of media files across the internet to
            find original sources{' '}
          </p>
        </div>
        <Button
          asChild
          className="h-10 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl flex-shrink-0 cursor-pointer"
        >
          <Link href="/dashboard" aria-label="Upload new media files">
            <UploadIcon className="w-4 h-4 mr-2" />
            <span className="text-base font-medium text-white whitespace-nowrap">
              Upload Files
            </span>
          </Link>
        </Button>{' '}
      </div>

      {selectedMedia ? (
        <div className="flex flex-col p-8 border border-gray-300 rounded-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Selected Media for Reverse Search
            </h2>
            <p className="text-sm text-gray-500">
              Review the selected media file before starting the reverse search
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-sm font-medium text-green-800">
              Ready to start reverse search
            </span>
            <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded">
              1/1 Completed
            </span>
          </div>

          <div className="flex gap-8">
            <img
              src={selectedMedia.thumbnailUrl}
              alt={selectedMedia.filename}
              className="w-24 h-24 object-cover mb-4 border border-gray-200 rounded-md"
            />
            <div className="flex flex-col justify-center">
              <p className="font-semibold">{selectedMedia.filename}</p>
              <p className="text-muted-foreground">
                {formatFileSize(Number(selectedMedia.fileSize))}
              </p>
            </div>
          </div>
          <div className="flex gap-8">
            <Button
              className="flex-1 hover:cursor-pointer"
              onClick={handleStartReverseLookup}
              disabled={reverseLookupMutation.isPending}
            >
              {reverseLookupMutation.isPending
                ? 'Starting...'
                : 'Start reverse search'}
            </Button>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handleNewSearch}
              >
                Upload another file
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handleNewSearch}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                Select from previously uploaded files
              </p>
              <p className="text-sm text-gray-500">
                Choose a media file to search for its origin and distribution
              </p>
            </div>

            <MediaSelector onSelect={handleMediaSelection} />
          </div>
        </div>
      )}

      {/* <div className="pb-8">
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Verifications
          </h2>
          <div className="text-sm text-gray-500">
            Your recent verifications will appear here after analyzing media
            files
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="newest">Newest to Oldest</option>
                <option value="oldest">Oldest to Newest</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Media
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      File name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Original Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date First Seen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Similar Copies
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        Loading verifications...
                      </td>
                    </tr>
                  ) : filteredVerifications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No verifications found
                      </td>
                    </tr>
                  ) : (
                    filteredVerifications.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                            <img
                              src={item.thumbnailUrl}
                              alt={item.filename}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {item.filename}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {item.original_source}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">
                            {formatDate(item.date_first_seen)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 font-medium">
                            {item.similar_copies}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                className="px-6 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                variant="outline"
              >
                Load More
              </Button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ReverseLookupPage;
