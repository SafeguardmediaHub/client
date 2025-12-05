/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
'use client';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Film,
  Globe,
  Image as ImageIcon,
  Info,
  Loader2,
  MapPin,
  Search,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FeatureInfoDialog, FEATURE_INFO } from '@/components/FeatureInfoDialog';
import MediaSelector from '@/components/media/MediaSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  type GeoVerificationResult,
  useDeleteGeoVerification,
  useStartGeoVerification,
  useUserGeoVerifications,
} from '@/hooks/useGeolocation';
import { type Media, useGetMedia } from '@/hooks/useMedia';
import { formatFileSize } from '@/lib/utils';

type PageState = 'idle' | 'selecting' | 'video-warning' | 'processing';

const GeolocationVerificationPage = () => {
  const [state, setState] = useState<PageState>('idle');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const router = useRouter();
  const startGeoMutation = useStartGeoVerification();
  const deleteMutation = useDeleteGeoVerification();

  // Show dialog on first visit
  useEffect(() => {
    setShowInfoDialog(true);
  }, []);
  const { data } = useGetMedia();
  const media = data?.media || [];

  // Fetch user's previous verifications
  const {
    data: verificationsData,
    isLoading: isLoadingVerifications,
  } = useUserGeoVerifications();

  // Use useMemo to create a stable reference for userVerifications
  const userVerifications = useMemo(
    () => verificationsData?.data?.verifications || [],
    [verificationsData?.data?.verifications]
  );

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

    setFilteredVerifications(filtered);
  }, [userVerifications, searchQuery, statusFilter, sortBy]);

  const handleMediaSelection = (mediaFile: Media) => {
    const selectedFile = media.find((file) => file.id === mediaFile.id);

    if (selectedFile) {
      // Check if it's a video or non-image file
      const isImage = selectedFile.mimeType.startsWith('image/');

      if (!isImage) {
        setSelectedMedia(selectedFile);
        setState('video-warning');
      } else {
        setSelectedMedia(selectedFile);
        setState('selecting');
      }
    }
  };

  const handleReset = () => {
    setState('idle');
    setSelectedMedia(null);
    setLocationInput('');
  };

  const handleStartGeoVerification = () => {
    if (!selectedMedia || !locationInput.trim()) return;

    setState('processing');

    startGeoMutation.mutate(
      { id: selectedMedia.id, claimedLocation: locationInput },
      {
        onSuccess: (response) => {
          if (response.success && response.data.verificationId) {
            toast.success('Verification started!');
            router.push(
              `/dashboard/geolocation/results?verificationId=${response.data.verificationId}`
            );
          }
        },
        onError: (error: any) => {
          console.error('Error initiating verification:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to start verification. Please try again.';
          toast.error(errorMessage);
          setState('selecting');
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
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>
      </div>

      {/* Main Content - Centered */}
      <div className="max-w-3xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-emerald-50 mb-4">
            <MapPin className="size-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Geolocation Verification
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Verify claimed locations by analyzing GPS metadata and cross-referencing
            coordinates
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInfoDialog(true)}
            className="cursor-pointer mt-4"
          >
            <Info className="size-4 mr-2" />
            How it works
          </Button>
        </div>

        <FeatureInfoDialog
          open={showInfoDialog}
          onOpenChange={setShowInfoDialog}
          featureInfo={FEATURE_INFO.geolocation}
        />

        {/* State: Idle - Show info cards and selector */}
        {state === 'idle' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Info Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Images Only Card */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ImageIcon className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Images Only
                      </h3>
                      <p className="text-sm text-blue-800 mb-3">
                        GPS metadata is typically found in images from cameras and
                        smartphones.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                          JPG with EXIF
                        </span>
                        <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                          PNG
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Got Videos Card */}
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Film className="size-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-emerald-900 mb-2">
                        Got Videos?
                      </h3>
                      <p className="text-sm text-emerald-800 mb-3">
                        Extract keyframes first, then verify their locations!
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Link href="/dashboard/keyframe">
                          <Video className="size-3 mr-1" />
                          Extract Keyframes
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Media Selector Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Select Image to Verify Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Media selector dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose from your library
                  </label>
                  <MediaSelector onSelect={handleMediaSelection} />
                </div>

                {/* Tip */}
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <span className="font-medium">Tip:</span> Only images with GPS
                    metadata can be verified. If you have videos, use the{' '}
                    <Link
                      href="/dashboard/keyframe"
                      className="underline font-medium hover:text-amber-900"
                    >
                      Keyframe Extraction
                    </Link>{' '}
                    feature first.
                  </div>
                </div>

                {/* How it works */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Globe className="size-4" />
                    How geolocation verification works
                  </h3>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Select an image from your library</li>
                    <li>Enter the claimed location to verify</li>
                    <li>We extract GPS coordinates from image metadata</li>
                    <li>Coordinates are cross-referenced with claimed location</li>
                    <li>View detailed results with map visualization</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* State: Video Warning */}
        {state === 'video-warning' && selectedMedia && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 border-amber-200 bg-amber-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                  <AlertCircle className="size-5 text-amber-600" />
                  Video Files Not Supported
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-500"
                >
                  <X className="size-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected file info */}
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Video className="size-8 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {selectedMedia.filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(Number(selectedMedia.fileSize))} •{' '}
                      {selectedMedia.mimeType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-3">
                <p className="text-sm text-amber-800 font-medium">
                  Geolocation verification requires images with GPS metadata.
                </p>
                <p className="text-sm text-amber-700">
                  To verify frames from your video:
                </p>
                <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside pl-2">
                  <li>Use the Keyframe Extraction tool to extract frames</li>
                  <li>Upload the extracted keyframes to your library</li>
                  <li>Return here and select the keyframe images</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  asChild
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link href="/dashboard/keyframe">
                    <Film className="size-4 mr-2" />
                    Go to Keyframe Extraction
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Select Different File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* State: Selecting - Image selected, need location */}
        {state === 'selecting' && selectedMedia && (
          <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Enter Claimed Location
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-500"
                >
                  <X className="size-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected media preview */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="size-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                    <img
                      src={selectedMedia.thumbnailUrl}
                      alt={selectedMedia.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate mb-1">
                      {selectedMedia.filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(Number(selectedMedia.fileSize))} • Image
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="size-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        Ready to verify
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label
                  htmlFor="location-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Claimed Location <span className="text-red-500">*</span>
                </label>
                <Input
                  id="location-input"
                  type="text"
                  placeholder="e.g., New York, USA or Times Square, Manhattan"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the location you want to verify against the GPS data
                </p>
              </div>

              {/* Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">What we'll do:</span> Extract GPS
                  coordinates from the image metadata and compare them with the
                  provided location to verify authenticity.
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleStartGeoVerification}
                  className="w-full"
                  disabled={
                    !locationInput.trim() || startGeoMutation.isPending
                  }
                >
                  <MapPin className="size-4 mr-2" />
                  Start Geolocation Verification
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                  disabled={startGeoMutation.isPending}
                >
                  Select Different Image
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* State: Processing */}
        {state === 'processing' && selectedMedia && (
          <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin text-emerald-600" />
                  Verifying Location...
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Media info */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={selectedMedia.thumbnailUrl}
                      alt={selectedMedia.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {selectedMedia.filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      Claimed: {locationInput}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="py-8 text-center">
                <Loader2 className="size-12 animate-spin text-emerald-600 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Extracting GPS data and verifying coordinates
                </p>
                <p className="text-xs text-gray-500">
                  This may take up to 30 seconds...
                </p>
              </div>

              {/* Live indicator */}
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-600">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                </span>
                Processing verification
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Verifications Table */}
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
                    toast.info('Pagination coming soon');
                  }}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeolocationVerificationPage;
