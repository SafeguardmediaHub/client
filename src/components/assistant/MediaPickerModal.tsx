'use client';

import { Search, X, Loader2, FileImage, FileVideo, FileAudio } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGetMedia, type Media } from '@/hooks/useMedia';
import type { AttachedMedia } from '@/types/assistant';
import { formatFileSize, timeAgo } from '@/lib/utils';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: AttachedMedia) => void;
}

export const MediaPickerModal = ({ isOpen, onClose, onSelect }: MediaPickerModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const { data, isLoading } = useGetMedia();
  const media = data?.media || [];

  // Filter media based on search query
  const filteredMedia = media.filter((item) => {
    if (!searchQuery) return true;
    return item.filename.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedMedia(null);
    }
  }, [isOpen]);

  const handleSelect = (item: Media) => {
    setSelectedMedia(item);
  };

  const handleConfirm = () => {
    if (!selectedMedia) return;

    // Convert Media to AttachedMedia
    const attachedMedia: AttachedMedia = {
      id: selectedMedia.id,
      type: selectedMedia.mimeType.startsWith('image/')
        ? 'image'
        : selectedMedia.mimeType.startsWith('video/')
        ? 'video'
        : 'audio',
      thumbnailUrl: selectedMedia.thumbnailUrl,
      filename: selectedMedia.filename,
      mimeType: selectedMedia.mimeType,
    };

    onSelect(attachedMedia);
    onClose();
  };

  const getMediaIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <FileImage className="w-5 h-5 text-blue-600" />;
    }
    if (mimeType.startsWith('video/')) {
      return <FileVideo className="w-5 h-5 text-purple-600" />;
    }
    return <FileAudio className="w-5 h-5 text-green-600" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold">Select Media to Verify</DialogTitle>
          <DialogDescription>
            Choose a media file from your library to attach to the conversation
          </DialogDescription>
        </DialogHeader>

        {/* Search bar */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors peer-focus:text-blue-500" />
            <Input
              placeholder="Search by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 peer transition-all duration-200 focus:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Media grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">Loading your media...</p>
              </div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in-0 duration-500">
              <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center animate-in zoom-in-50 duration-300">
                <FileImage className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {searchQuery ? 'No media found' : 'No media available'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Upload some media files to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMedia.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`group relative flex flex-col border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 animate-in fade-in-0 slide-in-from-bottom-4 ${
                    selectedMedia?.id === item.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards'
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    {item.mimeType.startsWith('image/') ? (
                      <Image
                        src={item.publicUrl || item.thumbnailUrl}
                        alt={item.filename}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getMediaIcon(item.mimeType)}
                      </div>
                    )}
                    {selectedMedia?.id === item.id && (
                      <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in-0 duration-200">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-200">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 text-left">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate mb-1">
                      {item.filename}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="capitalize">
                        {item.mimeType.split('/')[0]}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(Number(item.fileSize))}</span>
                      <span>•</span>
                      <span>{timeAgo(item.uploadedAt)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-all duration-200">
            {selectedMedia ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Selected: <span className="font-medium text-gray-900 dark:text-gray-100">{selectedMedia.filename}</span>
              </span>
            ) : (
              'Select a media file to continue'
            )}
          </p>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedMedia}
              className="transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              Attach Media
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
