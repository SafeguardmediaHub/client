'use client';

import { format } from 'date-fns';
import { UploadIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { DatePickerDemo } from '@/components/date-picker';
import MediaSelector from '@/components/media/MediaSelector';
import { Button } from '@/components/ui/button';
import { type Media, useGetMedia } from '@/hooks/useMedia';
import { useTimeline } from '@/hooks/useTimeline';
import { formatFileSize } from '@/lib/utils';
import type { PageState, SearchResult } from '../reverse/page';

const TimelineVerificationPage = () => {
  const [pageState, setPageState] = useState<PageState>('initial');
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [claimedDate, setClaimedDate] = useState<Date | null>(null);

  const { data, isLoading } = useGetMedia();
  const media = data?.media || [];

  const timelineMutation = useTimeline();

  const handleNewSearch = () => {
    setPageState('initial');
    setSearchProgress(0);
    setSearchResults([]);
    setSelectedMedia(null);
    setClaimedDate(null);
  };

  const handleMediaSelection = (mediaFile: Media) => {
    const selectedFile = media.find((file) => file.id === mediaFile.id);
    if (selectedFile) {
      setSelectedMedia(selectedFile);
      setPageState('uploaded');
    }
  };

  const handleStartVerification = () => {
    if (!claimedDate || !selectedMedia) return;

    const shortDate = format(claimedDate, 'dd-MM-yyyy');

    timelineMutation.mutate({
      mediaId: selectedMedia.id,
      claimedTakenAt: shortDate,
    });
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
    </div>
  );
};

export default TimelineVerificationPage;
