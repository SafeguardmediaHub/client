/** biome-ignore-all lint/performance/noImgElement: <> */
'use client';

import {
  AlertCircleIcon,
  FileIcon,
  FilterIcon,
  RefreshCwIcon,
  SearchIcon,
  Trash2,
  UploadIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Media, useDeleteMedia, useGetMedia } from '@/hooks/useMedia';
import { shortenFilename, timeAgo } from '@/lib/utils';

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isError, isLoading, refetch } = useGetMedia();

  const media = data?.media || [];

  const deleteMedia = useDeleteMedia();

  // Ensure fresh data after navigation into this page (e.g., after uploads)
  useEffect(() => {
    // Fire and forget; errors are handled by query state
    void refetch();
  }, [refetch]);

  const getStatusColor = (status: Media['status']) => {
    switch (status) {
      case 'analyzed':
        return 'bg-[#e1feea] border-[#049d35] text-[#049d35]';
      case 'processing':
        return 'bg-[#fdfbe1] border-[#d5c70a] text-[#d5c70a]';
      case 'error':
        return 'bg-[#fee1e1] border-[#d50a0a] text-[#d50a0a]';
      case 'pending':
        return 'bg-[#e1f0fe] border-[#0a7bd5] text-[#0a7bd5]';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-600';
    }
  };

  // const getMediaTypeIcon = (mediaType: Media['uploadType']) => {
  //   switch (mediaType) {
  //     case 'video':
  //       return <VideoIcon className="w-5 h-5 text-[#5c5c5c]" />;
  //     case 'image':
  //       return <ImageIcon className="w-5 h-5 text-[#5c5c5c]" />;
  //     default:
  //       return <FileIcon className="w-5 h-5 text-[#5c5c5c]" />;
  //   }
  // };

  // const getConfidenceColor = (score: number) => {
  //   if (score >= 90) return 'text-[#049d35]';
  //   if (score >= 70) return 'text-[#d5c70a]';
  //   if (score >= 50) return 'text-[#ff8c00]';
  //   return 'text-[#d50a0a]';
  // };

  const filteredFiles = media.filter((file) => {
    const matchesSearch =
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.metadata.tags &&
        file.metadata.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    const matchesType = filterType === 'all' || file.uploadType === filterType;
    const matchesStatus =
      filterStatus === 'all' || file.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // const handleSelectFile = (fileId: string) => {
  //   setSelectedFiles((prev) =>
  //     prev.includes(fileId)
  //       ? prev.filter((id) => id !== fileId)
  //       : [...prev, fileId]
  //   );
  // };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((f) => f.id));
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-9">
            Media Library{' '}
          </h1>
          <p className="text-sm font-medium text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-[21px]">
            Your personal media library and file management{' '}
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

      {/* filters and controls */}
      <Card className="bg-white rounded-xl border border-[#d9d9d9] p-6">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-[30px]">
                Media Files
              </h2>
              {/* <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="h-10 px-4 border-[#d9d9d9] hover:bg-gray-50 cursor-pointer"
                  onClick={handleSelectAll}
                >
                  <span className="text-sm font-medium [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    {selectedFiles.length === filteredFiles.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </span>
                </Button>
                <Button
                  className="h-10 px-4 bg-blue-600 hover:bg-blue-500 cursor-pointer"
                  disabled={selectedFiles.length === 0}
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium text-white [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    Download ({selectedFiles.length})
                  </span>
                </Button>
              </div> */}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5c5c5c]" />
                  <Input
                    placeholder="Search files by name or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-[#f1f1f3] border-0 focus-visible:ring-0 [font-family:'Avenir_LT_Pro-Roman',Helvetica]"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48 h-12 bg-[#f1f1f3] border-0">
                  <FilterIcon className="w-4 h-4 mr-2 text-[#5c5c5c]" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general_image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>

              {/* <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48 h-12 bg-[#f1f1f3] border-0">
                  <FilterIcon className="w-4 h-4 mr-2 text-[#5c5c5c]" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="analyzed">Analyzed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              className="flex flex-col gap-1 border border-gray-200 rounded-md pb-6 shadow-md animate-pulse"
              key={crypto.randomUUID?.() ?? Math.random().toString(36)}
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
                <div className="flex gap-2">
                  <div className="h-4 w-4 bg-gray-300 rounded" />
                  <div className="h-4 w-4 bg-gray-300 rounded" />
                </div>
              </div>
              <div className="h-4 w-1/2 bg-gray-300 rounded px-4 mt-2" />
            </div>
          ))}

        {!isLoading &&
          !isError &&
          filteredFiles.length > 0 &&
          filteredFiles.map((file) => (
            <div
              className="flex flex-col gap-1 border border-gray-200 rounded-md  pb-6 shadow-md"
              key={file.id}
            >
              <div className="relative">
                <AspectRatio ratio={16 / 9} className="bg-muted cursor-pointer">
                  <Image
                    src={file.publicUrl}
                    alt="Image"
                    fill
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale rounded-t-md"
                  />
                </AspectRatio>
                <div className="absolute top-3 right-3">
                  <Badge
                    className={`px-2 py-0.5 text-xs rounded border ${getStatusColor(
                      file.status
                    )} flex-shrink-0`}
                  >
                    {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="w-full flex justify-between mt-4 px-4">
                <p>{shortenFilename(file.filename)}</p>
                <div className="flex gap-2 *:cursor-pointer">
                  {/* <EyeIcon className="text-blue-500" /> */}
                  <Trash2
                    className="text-red-500"
                    onClick={() => deleteMedia.mutate(file.id)}
                  />
                </div>
              </div>

              <p className="text-muted-foreground px-4">
                {timeAgo(file.uploadedAt)}
              </p>
            </div>
          ))}
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
              className="h-10 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer"
            >
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              <span className="text-base font-medium text-white">Retry</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filteredFiles.length === 0 && (
        <Card className="bg-white rounded-xl border border-[#d9d9d9] p-12">
          <CardContent className="p-0 text-center">
            <FileIcon className="w-12 h-12 text-[#5c5c5c] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] mb-2">
              No files found
            </h3>
            <p className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
              Try adjusting your search criteria or upload new files
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LibraryPage;
