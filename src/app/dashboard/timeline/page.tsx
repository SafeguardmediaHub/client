/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
'use client';

import { format } from 'date-fns';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  CheckCircleIcon,
  Clock,
  ClockIcon,
  Film,
  Image as ImageIcon,
  Loader2,
  Video,
  X,
  XCircleIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DatePickerDemo } from '@/components/date-picker';
import MediaSelector from '@/components/media/MediaSelector';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Media, useGetMedia } from '@/hooks/useMedia';
import { formatFileSize, timeAgo } from '@/lib/utils';

type PageState = 'idle' | 'selecting' | 'video-warning' | 'processing';

const TimelineVerificationPage = () => {
  const [state, setState] = useState<PageState>('idle');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [claimedDate, setClaimedDate] = useState<Date | null>(null);

  const router = useRouter();
  const { data, isLoading } = useGetMedia();
  const media = data?.media || [];

  const timelineVerifications = media.filter(
    (item) =>
      item.timeline?.status === 'completed' ||
      item.timeline?.status === 'failed'
  );

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
    setClaimedDate(null);
  };

  const handleStartVerification = () => {
    if (!claimedDate || !selectedMedia) return;

    setState('processing');

    const shortDate = format(claimedDate, 'yyyy-MM-dd');

    // Simulate processing for a moment, then navigate
    setTimeout(() => {
      router.push(
        `/dashboard/timeline/results?mediaId=${selectedMedia.id}&claimedDate=${shortDate}`
      );
    }, 1000);
  };

  const handleTimelineClick = (mediaItem: Media) => {
    const claimedDate = mediaItem.timeline?.timeline[0].timestamp;
    const queryParams = new URLSearchParams({
      mediaId: mediaItem.id,
    });

    if (claimedDate) {
      queryParams.append('claimedDate', claimedDate);
    }

    router.push(`/dashboard/timeline/results?${queryParams.toString()}`);
  };

  const getTimelineStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTimelineStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm border border-gray-200">
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
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-indigo-50 mb-4">
            <Clock className="size-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Timeline Verification
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Verify when media was created by analyzing temporal metadata and
            digital fingerprints
          </p>
        </div>

        {/* State: Idle - Show info cards and selector */}
        {state === 'idle' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Info Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Images & Videos Card */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ImageIcon className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Images & Videos
                      </h3>
                      <p className="text-sm text-blue-800 mb-3">
                        Temporal metadata is found in both images and videos from
                        digital cameras.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                          JPG
                        </span>
                        <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                          PNG
                        </span>
                        <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                          MP4
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Got Videos Card */}
              <Card className="border-indigo-200 bg-indigo-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 size-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Film className="size-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-indigo-900 mb-2">
                        Video Frames?
                      </h3>
                      <p className="text-sm text-indigo-800 mb-3">
                        Extract keyframes for more detailed temporal analysis!
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
                  Select Media to Verify Timeline
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
                    <span className="font-medium">Tip:</span> For video files, you
                    can also extract keyframes using the{' '}
                    <Link
                      href="/dashboard/keyframe"
                      className="underline font-medium hover:text-amber-900"
                    >
                      Keyframe Extraction
                    </Link>{' '}
                    feature for frame-by-frame analysis.
                  </div>
                </div>

                {/* How it works */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="size-4" />
                    How timeline verification works
                  </h3>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Select media from your library</li>
                    <li>Enter the claimed creation date</li>
                    <li>We analyze temporal metadata and digital signatures</li>
                    <li>Compare claimed date with extracted timestamps</li>
                    <li>View detailed chronological analysis</li>
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
                  Consider Keyframe Extraction
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
                  You can verify this video file, or extract keyframes for
                  frame-level analysis.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-amber-700 font-medium">
                    Option 1: Verify entire video
                  </p>
                  <p className="text-xs text-amber-700">
                    Quick analysis of video metadata
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-amber-700 font-medium">
                    Option 2: Extract keyframes first (recommended)
                  </p>
                  <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside pl-2">
                    <li>Extract individual frames from video</li>
                    <li>Analyze each frame's temporal data</li>
                    <li>Get more detailed timeline insights</li>
                  </ol>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setState('selecting')}
                  variant="outline"
                  className="flex-1"
                >
                  Continue with Video
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Link href="/dashboard/keyframe">
                    <Film className="size-4 mr-2" />
                    Extract Keyframes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* State: Selecting - Media selected, need date */}
        {state === 'selecting' && selectedMedia && (
          <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Enter Claimed Creation Date
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
                      {formatFileSize(Number(selectedMedia.fileSize))} •{' '}
                      {selectedMedia.mimeType.startsWith('image/')
                        ? 'Image'
                        : 'Video'}
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

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claimed Creation Date <span className="text-red-500">*</span>
                </label>
                <DatePickerDemo
                  value={claimedDate}
                  onChange={(date: Date | null) => setClaimedDate(date)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select the date when this media was supposedly created
                </p>
              </div>

              {/* Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">What we'll do:</span> Extract
                  temporal metadata from the file and compare it with your claimed
                  date to detect inconsistencies or tampering.
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleStartVerification}
                  className="w-full"
                  disabled={!claimedDate}
                >
                  <Clock className="size-4 mr-2" />
                  Start Timeline Verification
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  Select Different Media
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* State: Processing */}
        {state === 'processing' && selectedMedia && claimedDate && (
          <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin text-indigo-600" />
                  Analyzing Timeline...
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
                      Claimed: {format(claimedDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="py-8 text-center">
                <Loader2 className="size-12 animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Extracting temporal metadata and analyzing timeline
                </p>
                <p className="text-xs text-gray-500">
                  This may take a few moments...
                </p>
              </div>

              {/* Live indicator */}
              <div className="flex items-center justify-center gap-2 text-xs text-indigo-600">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-indigo-500" />
                </span>
                Processing verification
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Previous Timeline Verifications Section */}
      <Card className="bg-white rounded-xl border border-gray-200 p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-gray-900 leading-7">
                Previous Timeline Verifications
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View your completed timeline verification analyses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  className="flex flex-col gap-1 border border-gray-200 rounded-md pb-6 shadow-md animate-pulse"
                  key={`skeleton-${index}`}
                >
                  <div className="relative">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <div className="h-full w-full bg-gray-300 rounded-t-md" />
                    </AspectRatio>
                    <div className="absolute top-3 right-3">
                      <Badge className="px-2 py-0.5 text-xs rounded border bg-gray-300 text-gray-300 flex-shrink-0">
                        &nbsp;
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full flex justify-between mt-4 px-4">
                    <div className="h-4 w-3/4 bg-gray-300 rounded" />
                    <div className="h-4 w-4 bg-gray-300 rounded" />
                  </div>
                  <div className="h-4 w-1/2 bg-gray-300 rounded px-4 mt-2" />
                </div>
              ))}

            {!isLoading &&
              timelineVerifications.length > 0 &&
              timelineVerifications.map((item) => (
                <div
                  className="flex flex-col gap-1 border border-gray-200 rounded-md pb-6 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                  key={item.id}
                  onClick={() => handleTimelineClick(item)}
                >
                  <div className="relative">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <Image
                        src={item.thumbnailUrl || '/file.svg'}
                        alt={item.filename}
                        fill
                        className="h-full w-full object-cover rounded-t-md"
                      />
                    </AspectRatio>
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`px-2 py-0.5 text-xs rounded border flex items-center gap-1 ${getTimelineStatusColor(
                          item.timeline?.status || 'pending'
                        )}`}
                      >
                        {getTimelineStatusIcon(
                          item.timeline?.status || 'pending'
                        )}
                        {item.timeline?.status === 'completed'
                          ? 'Verified'
                          : item.timeline?.status === 'failed'
                          ? 'Failed'
                          : 'Processing'}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center mt-4 px-4">
                    <p className="font-medium text-sm truncate flex-1 mr-2">
                      {item.filename.length > 20
                        ? `${item.filename.substring(0, 20)}...`
                        : item.filename}
                    </p>
                    <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="px-4">
                    <p className="text-xs text-gray-500">
                      {timeAgo(item.timeline?.updatedAt || item.uploadedAt)}
                    </p>
                    {item.timeline?.matches && (
                      <p className="text-xs text-blue-600 mt-1">
                        {item.timeline.matches.length} matches found
                      </p>
                    )}
                  </div>
                </div>
              ))}

            {!isLoading && timelineVerifications.length === 0 && (
              <div className="col-span-full text-center py-12">
                <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Timeline Verifications Yet
                </h3>
                <p className="text-sm text-gray-600">
                  Start your first timeline verification by selecting a media
                  file above.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default TimelineVerificationPage;
