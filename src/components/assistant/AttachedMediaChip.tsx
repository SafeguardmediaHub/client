'use client';

import { FileImage, FileVideo, FileAudio, X } from 'lucide-react';
import Image from 'next/image';
import type { AttachedMedia } from '@/types/assistant';

interface AttachedMediaChipProps {
  media: AttachedMedia;
  onRemove: () => void;
}

export const AttachedMediaChip = ({ media, onRemove }: AttachedMediaChipProps) => {
  const getMediaIcon = () => {
    switch (media.type) {
      case 'image':
        return <FileImage className="w-4 h-4 text-blue-600" />;
      case 'video':
        return <FileVideo className="w-4 h-4 text-purple-600" />;
      case 'audio':
        return <FileAudio className="w-4 h-4 text-green-600" />;
      default:
        return <FileImage className="w-4 h-4 text-gray-600" />;
    }
  };

  const truncateFilename = (filename: string, maxLength = 20) => {
    if (filename.length <= maxLength) return filename;
    const ext = filename.split('.').pop();
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    const truncated = nameWithoutExt.substring(0, maxLength - 3 - (ext?.length || 0));
    return `${truncated}...${ext}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-in slide-in-from-bottom-2 duration-200">
      {/* Thumbnail */}
      <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        {media.type === 'image' ? (
          <Image
            src={media.thumbnailUrl}
            alt={media.filename}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getMediaIcon()}
          </div>
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {media.type !== 'image' && getMediaIcon()}
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {truncateFilename(media.filename)}
          </p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
          {media.type}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
        aria-label="Remove attachment"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
