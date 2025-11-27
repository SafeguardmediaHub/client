/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
'use client';

import { Search, Trash2, UploadIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import MediaSelector from '@/components/media/MediaSelector';
import { Button } from '@/components/ui/button';
import {
  type GeoVerificationResult,
  useDeleteGeoVerification,
  useStartGeoVerification,
  useUserGeoVerifications,
} from '@/hooks/useGeolocation';
import { type Media, useGetMedia } from '@/hooks/useMedia';
import { formatFileSize } from '@/lib/utils';

const GeolocationVerificationPage = () => {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const { data } = useGetMedia();
  const media = data?.media || [];

  const startGeoMutation = useStartGeoVerification();
  const deleteMutation = useDeleteGeoVerification();

  // Fetch user's previous verifications
  const {
    data: verificationsData,
    isLoading: isLoadingVerifications,
    refetch: refetchVerifications,
  } = useUserGeoVerifications();

  // Use useMemo to create a stable reference for userVerifications
  const userVerifications = useMemo(
    () => verificationsData?.data?.verifications || [],
    [verificationsData?.data?.verifications]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredVerifications, setFilteredVerifications] = useState<
    GeoVerificationResult['data'][]
  >([]);

  // Filter and sort verifications based on search, status, and sort order
  useEffect(() => {
    let filtered = [...userVerifications];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.mediaId.originalFilename.toLowerCase().includes(query) ||
          v.claimedLocation.raw.toLowerCase().includes(query) ||
          v._id.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((v) => {
        if (statusFilter === 'verified') {
          return v.verification.match === true;
        } else if (statusFilter === 'pending') {
          return (
            v.verification.status === 'queued' ||
            v.verification.status === 'processing'
          );
        } else if (statusFilter === 'failed') {
          return v.verification.status === 'failed';
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    console.log('this is filtered', filtered);
    setFilteredVerifications(filtered);
  }, [userVerifications, searchQuery, statusFilter, sortBy]);

  const handleMediaSelection = (mediaFile: Media) => {
    const selectedFile = media.find((file) => file.id === mediaFile.id);
    if (selectedFile) {
      setSelectedMedia(selectedFile);
    }
  };

  const handleNewSearch = () => {
    setSelectedMedia(null);
    setLocationInput('');
  };

  const handleStartGeoVerification = () => {
    if (!selectedMedia || !locationInput.trim()) return;

    startGeoMutation.mutate(
      { id: selectedMedia.id, claimedLocation: locationInput },
      {
        onSuccess: (response) => {
          if (response.success && response.data.verificationId) {
            // Refetch verifications to update the list
            refetchVerifications();

            // Redirect to results page with verificationId
            router.push(
              `/dashboard/geolocation/results?verificationId=${response.data.verificationId}`
            );
          }
        },
        onError: (error: any) => {
          console.error('Error initiating verification:', error);
          // Extract error message from backend response
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to start verification. Please try again.';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleViewVerification = (verificationId: string) => {
    router.push(
      `/dashboard/geolocation/results?verificationId=${verificationId}`
    );
  };

  const handleDelete = async (verificationId: string) => {
    try {
      await deleteMutation.mutateAsync(verificationId);
      toast.success('Verification deleted successfully');
      setDeletingId(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete verification';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
    });
  };

  const getStatusBadge = (verification: GeoVerificationResult['data']) => {
    const status = verification.verification.status;

    if (status === 'completed' || status === 'partial') {
      return verification.verification.match ? (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
          Verified
        </span>
      ) : (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
          Mismatch
        </span>
      );
    } else if (status === 'queued' || status === 'processing') {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
          Processing
        </span>
      );
    } else if (status === 'failed') {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
          Failed
        </span>
      );
    }

    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
        Unknown
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-gray-900 leading-9">
            Geolocation Verification
          </h1>
          <p className="text-sm font-medium text-gray-600 leading-[21px]">
            Verify the claimed location of media by analyzing GPS metadata and
            cross-referencing coordinates
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

          <div className="mt-6">
            <label
              htmlFor="location-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location to Verify
            </label>
            <input
              id="location-input"
              type="text"
              placeholder="Enter the claimed location (e.g., New York, USA)"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex gap-8 mt-6">
            <Button
              className="flex-1 hover:cursor-pointer"
              onClick={handleStartGeoVerification}
              disabled={!locationInput.trim() || startGeoMutation.isPending}
            >
              {startGeoMutation.isPending
                ? 'Starting Verification...'
                : 'Start Geolocation Verification'}
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
                Drag and drop to upload or click to browse files with location
                claims to verify GPS coordinates{' '}
              </p>
            </div>

            <MediaSelector onSelect={handleMediaSelection} />
          </div>
        </div>
      )}
      {/*  */}
      <div className="pb-8">
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Geolocations Verified
          </h2>
          <div className="text-sm text-gray-500">
            Your recent verifications will appear here after analysis
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
                <option value="pending">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      File name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Claimed Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Verified Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingVerifications ? (
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
                        {searchQuery || statusFilter !== 'all'
                          ? 'No verifications match your filters'
                          : 'No verifications found. Start your first verification above!'}
                      </td>
                    </tr>
                  ) : (
                    filteredVerifications.map((verification) => (
                      <tr
                        key={verification._id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewVerification(verification._id)}
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {verification.mediaId.originalFilename}
                          </p>
                          {/* {verification.mediaId.humanFileSize && (
                            <p className="text-xs text-gray-500">
                              {verification.mediaId.humanFileSize}
                            </p>
                          )} */}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 max-w-xs truncate">
                            {verification.claimedLocation.raw}
                          </p>
                          {verification.claimedLocation.parsed && (
                            <p className="text-xs text-gray-500">
                              {verification.claimedLocation.parsed.region},{' '}
                              {verification.claimedLocation.parsed.country}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(verification)}
                        </td>
                        <td className="px-6 py-4">
                          {verification.verification?.status === 'completed' ||
                          verification.verification?.status === 'partial' ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {verification.verification.confidence}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      verification.verification.confidence >= 80
                                        ? 'bg-green-600'
                                        : verification.verification
                                            .confidence >= 50
                                        ? 'bg-yellow-600'
                                        : 'bg-red-600'
                                    }`}
                                    style={{
                                      width: `${verification.verification.confidence}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">
                            {formatDate(verification.createdAt)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {deletingId === verification._id ? (
                            <div
                              className="flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(verification._id);
                                }}
                                disabled={deleteMutation.isPending}
                                className="text-xs cursor-pointer"
                              >
                                {deleteMutation.isPending
                                  ? 'Deleting...'
                                  : 'Confirm'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingId(null);
                                }}
                                className="cursor-pointer"
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewVerification(verification._id);
                                }}
                                className="cursor-pointer"
                              >
                                View Details
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingId(verification._id);
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {verificationsData?.data?.pagination?.hasNextPage && (
              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  className="px-6 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    // Implement pagination if needed
                    toast.info('Pagination coming soon');
                  }}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>{' '}
    </div>
  );
};

export default GeolocationVerificationPage;
