/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
'use client';

import { format } from 'date-fns';
import {
  CheckCircleIcon,
  ClockIcon,
  UploadIcon,
  XCircleIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DatePickerDemo } from '@/components/date-picker';
import MediaSelector from '@/components/media/MediaSelector';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Media, useGetMedia } from '@/hooks/useMedia';
import { formatFileSize, timeAgo } from '@/lib/utils';

const TimelineVerificationPage = () => {
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

  const handleNewSearch = () => {
    setSelectedMedia(null);
    setClaimedDate(null);
  };

  const handleMediaSelection = (mediaFile: Media) => {
    const selectedFile = media.find((file) => file.id === mediaFile.id);
    if (selectedFile) {
      setSelectedMedia(selectedFile);
    }
  };

  const handleStartVerification = () => {
    if (!claimedDate || !selectedMedia) return;

    const shortDate = format(claimedDate, 'yyyy-MM-dd');

    router.push(
      `/dashboard/timeline/results?mediaId=${selectedMedia.id}&claimedDate=${shortDate}`
    );
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
    <div className="w-full flex flex-col gap-6 p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-gray-900 leading-9">
            Timeline Verification
          </h1>
          <p className="text-sm text-gray-600 leading-[21px]">
            Overview of your timeline verifications
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
        </Button>
      </div>

      {selectedMedia ? (
        <div className="flex flex-col p-8 border border-gray-300 rounded-sm">
          <div className="mb-4">
            <h3 className="text-md">
              Select the claimed date of the media file
            </h3>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4">
              <Image
                src={selectedMedia.thumbnailUrl}
                alt={selectedMedia.filename}
                width={64}
                height={64}
                className="object-cover mb-4 border border-gray-200 rounded-sm"
              />
              <div className="flex flex-col justify-center">
                <p className="font-semibold">{selectedMedia.filename}</p>
                <p className="text-muted-foreground">
                  {formatFileSize(Number(selectedMedia.fileSize))}
                </p>
              </div>
            </div>

            <div>
              <DatePickerDemo
                value={claimedDate}
                onChange={(date: Date | null) => setClaimedDate(date)}
              />
            </div>
          </div>

          <div className="flex gap-8">
            <Button
              className="flex-1 hover:cursor-pointer"
              onClick={handleStartVerification}
              disabled={!claimedDate}
            >
              Start timeline verification
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
                Choose a media file to verify its timeline
              </p>
            </div>
            <MediaSelector onSelect={handleMediaSelection} />
          </div>
        </div>
      )}

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
  );
};

export default TimelineVerificationPage;
