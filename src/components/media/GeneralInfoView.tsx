'use client';

import {
  CalendarIcon,
  FileIcon,
  FileTextIcon,
  HardDriveIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Media } from '@/hooks/useMedia';
import { formatFileSize } from '@/lib/utils';
import { MediaReportGenerator } from './MediaReportGenerator';

interface GeneralInfoViewProps {
  media: Media;
}

export function GeneralInfoView({ media }: GeneralInfoViewProps) {
  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileTypeIcon = (uploadType: string) => {
    switch (uploadType) {
      case 'video':
        return <FileTextIcon className="w-4 h-4" />;
      case 'audio':
        return <HardDriveIcon className="w-4 h-4" />;
      default:
        return <FileIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {getFileTypeIcon(media.uploadType)}
            File Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-gray-500" />
            <span className="font-medium">File Name:</span>
            <span className="text-gray-700 truncate" title={media.filename}>
              {media.filename}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <HardDriveIcon className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Size:</span>
            <span className="text-gray-700">
              {formatFileSize(Number(media.fileSize))}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Uploaded:</span>
            <span className="text-gray-700">
              {formatDate(media.uploadedAt)}
            </span>
          </div>

          {/* <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Uploader:</span>
            <span className="text-gray-700">
              {media.user?.name || 'Unknown'}
            </span>
          </div> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            File Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Type:</span>
            <Badge variant="outline" className="text-xs">
              {media.uploadType.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">MIME Type:</span>
            <span className="text-gray-700 font-mono text-xs">
              {media.mimeType}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Visibility:</span>
            <Badge variant="outline" className="text-xs capitalize">
              {media.visibility}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge
              variant="outline"
              className={`text-xs ${getStatusColor(media.status)}`}
            >
              {media.status.charAt(0).toUpperCase() + media.status.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      {media.metadata?.tags && media.metadata.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {media.metadata.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Text (OCR) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Extracted Text (OCR)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
            {media.extractedText || 'No text available'}
          </div>
        </CardContent>
      </Card>

      {/* Media Report Generator */}
      <MediaReportGenerator mediaId={media.id} mediaName={media.filename} />
    </div>
  );
}

// Helper function to get status color (assuming it exists in utils)
function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'analyzed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'pending':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
