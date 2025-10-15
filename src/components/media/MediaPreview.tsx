'use client';

import { FileIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Media } from '@/hooks/useMedia';
import { getStatusColor } from '@/lib/utils';

interface MediaPreviewProps {
  media: Media;
  className?: string;
}

export function MediaPreview({ media, className }: MediaPreviewProps) {
  const [previewError, setPreviewError] = useState<{
    image: boolean;
    video: boolean;
    audio: boolean;
  }>({ image: false, video: false, audio: false });

  const renderMediaContent = () => {
    if (media.uploadType === 'general_image') {
      if (previewError.image) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-2">
              <FileIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">Image failed to load</p>
            </div>
          </div>
        );
      }

      return (
        <Image
          src={media.publicUrl || '/file.svg'}
          alt={media.filename}
          fill
          className="object-cover"
          onError={() => setPreviewError((p) => ({ ...p, image: true }))}
        />
      );
    }

    if (media.uploadType === 'video') {
      if (previewError.video) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-2">
              <FileIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">Video failed to load</p>
            </div>
          </div>
        );
      }

      return (
        <video
          src={media.publicUrl}
          poster={media.thumbnailUrl || '/file.svg'}
          controls
          className="w-full h-full object-cover"
          preload="metadata"
          onError={() => setPreviewError((p) => ({ ...p, video: true }))}
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (media.uploadType === 'audio') {
      if (previewError.audio) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-2">
              <FileIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">Audio failed to load</p>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <PlayIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <audio
                src={media.publicUrl}
                controls
                className="w-full max-w-xs min-w-[400px]"
                onError={() => setPreviewError((p) => ({ ...p, audio: true }))}
              >
                <track kind="captions" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-2">
          <FileIcon className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-sm text-gray-600">
            Preview not available for this file type
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="relative">
          <AspectRatio
            ratio={16 / 9}
            className="bg-muted rounded-lg overflow-hidden "
          >
            {renderMediaContent()}
          </AspectRatio>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(
                media.status
              )} flex-shrink-0`}
            >
              {media.status.charAt(0).toUpperCase() + media.status.slice(1)}
            </Badge>
          </div>

          {/* Quick Metadata Badges */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {media.uploadType === 'video' && media.metadata?.duration && (
              <Badge variant="secondary" className="text-xs">
                Duration: {media.metadata.duration}
              </Badge>
            )}
            {media.metadata?.resolution && (
              <Badge variant="outline" className="text-xs">
                {media.metadata.resolution}
              </Badge>
            )}
            {media.metadata?.codec && (
              <Badge variant="outline" className="text-xs">
                {media.metadata.codec}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
