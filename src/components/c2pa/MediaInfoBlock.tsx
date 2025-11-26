'use client';

import {
  Calendar,
  File,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  HardDrive,
} from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { MediaType } from '@/types/c2pa';

interface MediaInfoBlockProps {
  fileName: string;
  fileSize: number;
  mediaType?: MediaType;
  thumbnailUrl?: string;
  uploadedAt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const mediaTypeIcons: Record<
  MediaType,
  React.ComponentType<{ className?: string }>
> = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  document: FileText,
};

const mediaTypeLabels: Record<MediaType, string> = {
  image: 'Image',
  video: 'Video',
  audio: 'Audio',
  document: 'Document',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

const sizeConfig = {
  sm: {
    thumbnail: 'size-12',
    title: 'text-sm',
    details: 'text-xs',
    gap: 'gap-3',
  },
  md: {
    thumbnail: 'size-16',
    title: 'text-base',
    details: 'text-sm',
    gap: 'gap-4',
  },
  lg: {
    thumbnail: 'size-20',
    title: 'text-lg',
    details: 'text-sm',
    gap: 'gap-5',
  },
};

export function MediaInfoBlock({
  fileName,
  fileSize,
  mediaType = 'document',
  thumbnailUrl,
  uploadedAt,
  className,
  size = 'md',
}: MediaInfoBlockProps) {
  const config = sizeConfig[size];
  const MediaIcon = mediaTypeIcons[mediaType] || FileText;

  return (
    <div className={cn('flex items-center', config.gap, className)}>
      {/* Thumbnail */}
      <div
        className={cn(
          'relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0',
          config.thumbnail
        )}
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={fileName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <MediaIcon className="size-1/2 text-gray-400" />
          </div>
        )}
      </div>

      {/* File info */}
      <div className="min-w-0 flex-1">
        <h3 className={cn('font-medium text-gray-900 truncate', config.title)}>
          {fileName}
        </h3>
        <div
          className={cn(
            'flex items-center gap-3 text-gray-500 mt-1',
            config.details
          )}
        >
          {/* <span className="inline-flex items-center gap-1">
            <HardDrive className="size-3.5" />
            {formatFileSize(fileSize)}
          </span> */}
          <span className="inline-flex items-center gap-1">
            <File className="size-3.5" />
            {mediaTypeLabels[mediaType]}
          </span>
          {uploadedAt && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" />
              {formatDate(uploadedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function MediaInfoBlockSkeleton({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const config = sizeConfig[size];

  return (
    <div className={cn('flex items-center', config.gap, className)}>
      <Skeleton className={cn('rounded-lg', config.thumbnail)} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
