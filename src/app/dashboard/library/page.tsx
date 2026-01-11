/** biome-ignore-all lint/performance/noImgElement: <> */

'use client';

import {
  AlertCircleIcon,
  EyeIcon,
  FileIcon,
  FilterIcon,
  LayoutGrid,
  List,
  RefreshCwIcon,
  SearchIcon,
  Sparkles,
  Trash2,
  UploadIcon,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MediaDetailsSheet } from '@/components/media';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Media, useDeleteMedia, useGetMedia } from '@/hooks/useMedia';
import { cn, getStatusColor, shortenFilename, timeAgo } from '@/lib/utils';
import { useAssistant } from '@/context/AssistantContext';
import type { AttachedMedia } from '@/types/assistant';

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [thumbnailErrorMap, setThumbnailErrorMap] = useState<
    Record<string, boolean>
  >({});
  const [page, setPage] = useState(1);
  const limit = 20;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Check if there are any processing items to enable smart polling
  const [hasProcessingItems, setHasProcessingItems] = useState(false);

  const { data, isError, isLoading, refetch, isFetching } = useGetMedia(
    {
      page,
      limit,
      type: filterType === 'all' ? undefined : filterType,
      sort: 'createdAt',
    },
    {
      // Enable polling only when there are items being processed
      refetchInterval: hasProcessingItems ? 3000 : false,
      refetchOnWindowFocus: true,
    }
  );

  const media = data?.media || [];
  const pagination = data?.pagination;

  // Update processing status whenever media changes
  useEffect(() => {
    const processing = media.some((item) => item.status === 'processing');
    setHasProcessingItems(processing);
  }, [media]);

  const deleteMedia = useDeleteMedia();
  const { attachMedia } = useAssistant();

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys when not typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && page > 1) {
        e.preventDefault();
        handlePageChange(page - 1);
      } else if (
        e.key === 'ArrowRight' &&
        pagination &&
        page < pagination.totalPages
      ) {
        e.preventDefault();
        handlePageChange(page + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, pagination]);

  const handleMediaClick = (media: Media) => {
    setSelectedMedia(media);
    setIsSheetOpen(true);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setPage(1);
  };

  const handleAskAI = (media: Media) => {
    // Convert Media to AttachedMedia
    const attachedMedia: AttachedMedia = {
      id: media.id,
      type: media.mimeType.startsWith('image/')
        ? 'image'
        : media.mimeType.startsWith('video/')
        ? 'video'
        : 'audio',
      thumbnailUrl: media.thumbnailUrl,
      filename: media.filename,
      mimeType: media.mimeType,
    };

    // Attach media and open assistant
    attachMedia(attachedMedia);
  };

  const hasActiveFilters = searchQuery || filterType !== 'all';

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side search on current page results
  const filteredMedia = media.filter((file) => {
    if (!searchQuery) return true;
    return (
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.metadata?.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];
    const { totalPages } = pagination;
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) {
      pages.push('ellipsis');
    }

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (page < totalPages - 2) {
      pages.push('ellipsis');
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  // const handleSelectFile = (fileId: string) => {
  //   setSelectedFiles((prev) =>
  //     prev.includes(fileId)
  //       ? prev.filter((id) => id !== fileId)
  //       : [...prev, fileId]
  //   );
  // };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-responsive-2xl font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-9">
            Media Library{' '}
          </h1>
          <p className="text-sm font-medium text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-[21px]">
            Your personal media library and file management{' '}
          </p>
        </div>

        <Button
          asChild
          className="h-10 px-6 bg-blue-600 hover:bg-blue-700 hover:shadow-lg rounded-xl flex-shrink-0 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
        >
          <Link href="/dashboard" aria-label="Upload new media files">
            <UploadIcon className="w-4 h-4 mr-2" />
            <span className="text-base font-medium text-white whitespace-nowrap">
              Upload Files
            </span>
          </Link>
        </Button>
      </div>

      {/* filters and controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Media Files
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {pagination?.total || 0} {pagination?.total === 1 ? 'file' : 'files'} total
                {hasActiveFilters && ` • ${filteredMedia.length} matching`}
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <X className="w-4 h-4 mr-1.5" />
                Clear filters
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search files by name or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-48 h-11 bg-gray-50 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-300">
                <FilterIcon className="w-4 h-4 mr-2 text-gray-600" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="border-gray-200 shadow-lg">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general_image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>

            {/* View toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:z-10',
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
                aria-label="Grid view"
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:z-10',
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
                aria-label="List view"
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator for pagination */}
      {isFetching && !isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200">
            <RefreshCwIcon className="w-4 h-4 animate-spin" />
            <span>Loading page {page}...</span>
          </div>
        </div>
      )}

      {/* grid/list */}
      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
          : 'flex flex-col gap-3'
      )}>
        {isLoading &&
          Array.from({ length: 8 }).map((_) => (
            <div
              className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md"
              key={crypto.randomUUID?.() ?? Math.random().toString(36)}
            >
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <div className="h-full w-full animate-shimmer" />
                </AspectRatio>
                <div className="absolute top-3 right-3">
                  <div className="h-6 w-20 rounded-md animate-shimmer" />
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="h-4 w-3/4 rounded animate-shimmer" />
                  <div className="flex gap-1.5 flex-shrink-0">
                    <div className="h-7 w-7 rounded-md animate-shimmer" />
                    <div className="h-7 w-7 rounded-md animate-shimmer" />
                  </div>
                </div>
                <div className="h-3 w-1/2 rounded animate-shimmer" />
              </div>
            </div>
          ))}

        {!isLoading &&
          !isError &&
          filteredMedia.length > 0 &&
          filteredMedia.map((file) =>
            viewMode === 'grid' ? (
              // Grid view card
              <div
                className="group flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300"
                key={file.id}
              >
                <div className="relative overflow-hidden">
                  <AspectRatio
                    ratio={16 / 9}
                    className="bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer"
                    onClick={() => handleMediaClick(file)}
                  >
                    {file.uploadType === 'video' ||
                    file.uploadType === 'audio' ? (
                      <Image
                        src={
                          thumbnailErrorMap[file.id]
                            ? '/Sound-Wave.svg'
                            : file.thumbnailUrl || '/Sound-Wave.svg'
                        }
                        alt="Thumbnail"
                        fill
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() =>
                          setThumbnailErrorMap((prev) => ({
                            ...prev,
                            [file.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <Image
                        src={
                          thumbnailErrorMap[file.id]
                            ? '/file.svg'
                            : file.publicUrl || '/Sound-Wave.svg'
                        }
                        alt="Image"
                        fill
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() =>
                          setThumbnailErrorMap((prev) => ({
                            ...prev,
                            [file.id]: true,
                          }))
                        }
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </AspectRatio>
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`px-2.5 py-1 text-xs font-medium rounded-md shadow-sm backdrop-blur-sm ${getStatusColor(
                        file.status
                      )}`}
                    >
                      {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900 text-sm truncate flex-1" title={file.filename}>
                      {shortenFilename(file.filename)}
                    </p>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleAskAI(file)}
                        className="p-1.5 rounded-md text-purple-600 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        aria-label="Ask AI Assistant"
                        title="Verify with AI"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMediaClick(file)}
                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="View details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMedia.mutate(file.id)}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label="Delete media"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {timeAgo(file.uploadedAt)}
                  </p>
                </div>
              </div>
            ) : (
              // List view card
              <div
                className="group flex items-center gap-4 border border-gray-200 rounded-lg bg-white p-4 transition-all duration-300 hover:shadow-lg hover:border-blue-300"
                key={file.id}
              >
                <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer"
                  onClick={() => handleMediaClick(file)}
                >
                  {file.uploadType === 'video' || file.uploadType === 'audio' ? (
                    <Image
                      src={
                        thumbnailErrorMap[file.id]
                          ? '/Sound-Wave.svg'
                          : file.thumbnailUrl || '/Sound-Wave.svg'
                      }
                      alt="Thumbnail"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={() =>
                        setThumbnailErrorMap((prev) => ({
                          ...prev,
                          [file.id]: true,
                        }))
                      }
                    />
                  ) : (
                    <Image
                      src={
                        thumbnailErrorMap[file.id]
                          ? '/file.svg'
                          : file.publicUrl || '/Sound-Wave.svg'
                      }
                      alt="Image"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={() =>
                        setThumbnailErrorMap((prev) => ({
                          ...prev,
                          [file.id]: true,
                        }))
                      }
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-gray-900 truncate" title={file.filename}>
                      {file.filename}
                    </p>
                    <Badge
                      className={`px-2.5 py-1 text-xs font-medium rounded-md shadow-sm flex-shrink-0 ${getStatusColor(
                        file.status
                      )}`}
                    >
                      {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{timeAgo(file.uploadedAt)}</span>
                    <span>•</span>
                    <span className="capitalize">{file.uploadType.replace('_', ' ')}</span>
                    {file.fileSize && (
                      <>
                        <span>•</span>
                        <span>{file.fileSize}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAskAI(file)}
                    className="p-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    aria-label="Ask AI Assistant"
                    title="Verify with AI"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMediaClick(file)}
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="View details"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteMedia.mutate(file.id)}
                    className="p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Delete media"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          )}
      </div>

      {!isLoading && isError && (
        <Card className="bg-white rounded-xl border border-[#d9d9d9] p-12">
          <CardContent className="p-0 text-center">
            <AlertCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] mb-2">
              Failed to load media files
            </h3>
            <p className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica] mb-6">
              There was an error loading your media library. Please try again.
            </p>
            <Button
              onClick={() => refetch()}
              className="h-10 px-6 bg-blue-600 hover:bg-blue-700 hover:shadow-lg rounded-xl cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              <span className="text-base font-medium text-white">Retry</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filteredMedia.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <FileIcon className="w-10 h-10 text-blue-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-2 border-white">
              <SearchIcon className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || filterType !== 'all' ? 'No files match your filters' : 'Your library is empty'}
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md text-center">
            {searchQuery || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
              : 'Start by uploading your first media file to begin verifying content for authenticity.'}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <Link href="/dashboard">
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Your First File
            </Link>
          </Button>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to{' '}
            {Math.min(page * limit, pagination.total)} of {pagination.total}{' '}
            files
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && handlePageChange(page - 1)}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    page === 1 && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNum, index) =>
                pageNum === 'ellipsis' ? (
                  <PaginationItem
                    key={`ellipsis-${index}`}
                    className="hidden sm:inline-flex"
                  >
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem
                    key={pageNum}
                    className="hidden sm:inline-flex"
                  >
                    <PaginationLink
                      isActive={pageNum === page}
                      onClick={() => handlePageChange(pageNum)}
                      className="cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    page < pagination.totalPages &&
                    handlePageChange(page + 1)
                  }
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    page === pagination.totalPages &&
                      'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-xs text-gray-400 mt-2">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">←</kbd>{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">→</kbd>{' '}
            to navigate pages
          </p>
        </div>
      )}

      {/* Media Details Sheet */}
      <MediaDetailsSheet
        media={selectedMedia}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
      </div>
    </div>
  );
};

export default LibraryPage;
