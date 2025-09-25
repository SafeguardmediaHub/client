/** biome-ignore-all lint/performance/noImgElement: <explanation> */
'use client';

import {
  DownloadIcon,
  EyeIcon,
  FileIcon,
  FilterIcon,
  ImageIcon,
  SearchIcon,
  Trash2,
  UploadIcon,
  VideoIcon,
  XIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
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
import { mediaFiles } from '@/lib/data';
import type { MediaFile } from '@/types/media';

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: MediaFile['status']) => {
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

  const getMediaTypeIcon = (mediaType: MediaFile['mediaType']) => {
    switch (mediaType) {
      case 'video':
        return <VideoIcon className="w-5 h-5 text-[#5c5c5c]" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-[#5c5c5c]" />;
      default:
        return <FileIcon className="w-5 h-5 text-[#5c5c5c]" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-[#049d35]';
    if (score >= 70) return 'text-[#d5c70a]';
    if (score >= 50) return 'text-[#ff8c00]';
    return 'text-[#d50a0a]';
  };

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch =
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType = filterType === 'all' || file.mediaType === filterType;
    const matchesStatus =
      filterStatus === 'all' || file.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

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
          className="h-10 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl flex-shrink-0 cursor-pointer"
          aria-label="Upload new media files"
        >
          <UploadIcon className="w-4 h-4 mr-2" />
          <span className="text-base font-medium text-white whitespace-nowrap">
            Upload Files
          </span>
        </Button>
      </div>

      {/* state overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white rounded-xl border border-[#d9d9d9] p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f1f1f3] rounded-lg flex items-center justify-center">
                <FileIcon className="w-6 h-6 text-[#5c5c5c]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black [font-family:'Avenir_LT_Pro-Black',Helvetica]">
                  {mediaFiles.length}
                </div>
                <div className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Total Files
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-[#d9d9d9] p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e1feea] rounded-lg flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-[#049d35]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black [font-family:'Avenir_LT_Pro-Black',Helvetica]">
                  {mediaFiles.filter((f) => f.status === 'analyzed').length}
                </div>
                <div className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Analyzed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-[#d9d9d9] p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#fdfbe1] rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-[#d5c70a] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black [font-family:'Avenir_LT_Pro-Black',Helvetica]">
                  {mediaFiles.filter((f) => f.status === 'processing').length}
                </div>
                <div className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Processing
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-[#d9d9d9] p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#fee1e1] rounded-lg flex items-center justify-center">
                <XIcon className="w-6 h-6 text-[#d50a0a]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black [font-family:'Avenir_LT_Pro-Black',Helvetica]">
                  {mediaFiles.filter((f) => f.status === 'error').length}
                </div>
                <div className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Errors
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* filters and controls */}
      <Card className="bg-white rounded-xl border border-[#d9d9d9] p-6">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-[30px]">
                Media Files
              </h2>
              <div className="flex items-center gap-3">
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
              </div>
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
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
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
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFiles.map((file) => (
          <div
            className="flex flex-col gap-1 border border-gray-200 rounded-md  pb-6 shadow-md"
            key={file.id}
          >
            <div className="relative">
              <AspectRatio ratio={16 / 9} className="bg-muted cursor-pointer">
                <Image
                  src={file.thumbnailUrl}
                  alt="Photo by Drew Beamer"
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
              <p>{file.fileName}</p>
              <div className="flex gap-2 *:cursor-pointer">
                <EyeIcon className="text-blue-500" />
                <DownloadIcon className="" />
                <Trash2 className="text-red-500" />
              </div>
            </div>

            <p className="text-muted-foreground px-4">2 mins ago</p>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
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
