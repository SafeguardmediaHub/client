/** biome-ignore-all lint/performance/noImgElement: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/a11y/noLabelWithoutControl: <> */
'use client';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileImage,
  Film,
  Image as ImageIcon,
  Info,
  Loader2,
  ScanSearch,
  Upload,
  Video,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  FEATURE_INFO,
  FeatureInfoDialog,
} from '@/components/FeatureInfoDialog';
import MediaSelector from '@/components/media/MediaSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Media, useGetMedia } from '@/hooks/useMedia';
import { useReverseLookup } from '@/hooks/useReverseLookup';
import { formatFileSize } from '@/lib/utils';

type PageState = 'idle' | 'selecting' | 'video-warning' | 'processing';

const ReverseLookupPage = () => {
  const [state, setState] = useState<PageState>('idle');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const router = useRouter();
  const reverseLookupMutation = useReverseLookup();
  const { data } = useGetMedia();
  const media = data?.media || [];

  // Show dialog on first visit
  useEffect(() => {
    setShowInfoDialog(true);
  }, []);

  const handleMediaSelection = (mediaFile: Media) => {
    const selectedFile = media.find((file) => file.id === mediaFile.id);

    if (selectedFile) {
      // Check if it's a video or non-image file
      const isImage = selectedFile.mimeType.startsWith('image/');

      if (!isImage) {
        setSelectedMedia(selectedFile);
        setState('video-warning');
      } else {
        setSelectedMedia(selectedFile);
        setState('selecting');
      }
    }
  };

  const handleReset = () => {
    setState('idle');
    setSelectedMedia(null);
  };

  const handleStartReverseLookup = () => {
    if (!selectedMedia) return;

    setState('processing');

    reverseLookupMutation.mutate(
      { mediaId: selectedMedia.id },
      {
        onSuccess: (data) => {
          if (data.success && data.data.jobId) {
            toast.success('Reverse lookup started!');
            router.push(
              `/dashboard/reverse/results?mediaId=${selectedMedia.id}&jobId=${data.data.jobId}`,
            );
          }
        },
        onError: (error: any) => {
          console.error('Failed to start reverse lookup:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to start reverse lookup';
          toast.error(errorMessage);
          setState('selecting');
        },
      },
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back
          </Button>
        </div>

        {/* Main Content - Centered */}
        <div className="max-w-3xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-purple-50 mb-4">
              <ScanSearch className="size-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Reverse Image Lookup
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Trace the origin and history of images across the internet to find
              original sources
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfoDialog(true)}
              className="cursor-pointer mt-4"
            >
              <Info className="size-4 mr-2" />
              How it works
            </Button>
          </div>

          <FeatureInfoDialog
            open={showInfoDialog}
            onOpenChange={setShowInfoDialog}
            featureInfo={FEATURE_INFO.reverseLookup}
          />

          {/* State: Idle - Show info cards and selector */}
          {state === 'idle' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Info Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Images Only Card */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <ImageIcon className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Images Only
                        </h3>
                        <p className="text-sm text-blue-800 mb-3">
                          This tool analyzes images. Supported formats:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                            JPG
                          </span>
                          <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                            PNG
                          </span>
                          <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                            WebP
                          </span>
                          <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                            GIF
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Got Videos Card */}
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 size-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Film className="size-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-purple-900 mb-2">
                          Got Videos?
                        </h3>
                        <p className="text-sm text-purple-800 mb-3">
                          Extract keyframes first, then upload them here!
                        </p>
                        <Button
                          asChild
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Link href="/dashboard/keyframe">
                            <Video className="size-3 mr-1" />
                            Extract Keyframes
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Media Selector Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Select Image to Analyze
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Media selector dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose from your library
                    </label>
                    <MediaSelector onSelect={handleMediaSelection} />
                  </div>

                  {/* Upload Media Button */}
                  <div className="pt-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/library">
                        <Upload className="size-4 mr-2" />
                        Upload Media to Library
                      </Link>
                    </Button>
                  </div>

                  {/* Tip */}
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <span className="font-medium">Tip:</span> Only images can
                      be analyzed. If you have videos, use the{' '}
                      <Link
                        href="/dashboard/keyframe"
                        className="underline font-medium hover:text-amber-900"
                      >
                        Keyframe Extraction
                      </Link>{' '}
                      feature first.
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileImage className="size-4" />
                      How reverse lookup works
                    </h3>
                    <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                      <li>Select an image from your library</li>
                      <li>We search across multiple image databases</li>
                      <li>Matches are analyzed for similarity and context</li>
                      <li>View detailed results with sources and dates</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* State: Video Warning */}
          {state === 'video-warning' && selectedMedia && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 border-amber-200 bg-amber-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                    <AlertCircle className="size-5 text-amber-600" />
                    Video Files Not Supported
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-gray-500"
                  >
                    <X className="size-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected file info */}
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Video className="size-8 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {selectedMedia.filename}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(Number(selectedMedia.fileSize))} •{' '}
                        {selectedMedia.mimeType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-3">
                  <p className="text-sm text-amber-800 font-medium">
                    Reverse lookup only works with images.
                  </p>
                  <p className="text-sm text-amber-700">
                    To analyze frames from your video:
                  </p>
                  <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside pl-2">
                    <li>Use the Keyframe Extraction tool to extract frames</li>
                    <li>Upload the extracted keyframes to your library</li>
                    <li>Return here and select the keyframe images</li>
                  </ol>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    asChild
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Link href="/dashboard/keyframe">
                      <Film className="size-4 mr-2" />
                      Go to Keyframe Extraction
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Select Different File
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* State: Selecting - Image selected, ready to proceed */}
          {state === 'selecting' && selectedMedia && (
            <Card className="animate-in fade-in slide-in-from-bottom-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Confirm Reverse Lookup
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-gray-500"
                  >
                    <X className="size-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected media preview */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                      <img
                        src={selectedMedia.thumbnailUrl}
                        alt={selectedMedia.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate mb-1">
                        {selectedMedia.filename}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(Number(selectedMedia.fileSize))} • Image
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="size-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          Ready to analyze
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirmation text */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    This will search for matches of this image across the
                    internet. The process typically takes 30-60 seconds.
                  </p>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">What we'll search:</span>{' '}
                      Multiple image databases, news sources, and web archives
                      to find where this image has been published.
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleStartReverseLookup}
                    className="w-full"
                    disabled={reverseLookupMutation.isPending}
                  >
                    <ScanSearch className="size-4 mr-2" />
                    Start Reverse Lookup
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                    disabled={reverseLookupMutation.isPending}
                  >
                    Select Different Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* State: Processing */}
          {state === 'processing' && selectedMedia && (
            <Card className="animate-in fade-in slide-in-from-bottom-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Loader2 className="size-5 animate-spin text-purple-600" />
                    Searching the Internet...
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Media info */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={selectedMedia.thumbnailUrl}
                        alt={selectedMedia.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {selectedMedia.filename}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(Number(selectedMedia.fileSize))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="py-8 text-center">
                  <Loader2 className="size-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Analyzing image across multiple databases
                  </p>
                  <p className="text-xs text-gray-500">
                    This may take up to 60 seconds...
                  </p>
                </div>

                {/* Live indicator */}
                <div className="flex items-center justify-center gap-2 text-xs text-purple-600">
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2 bg-purple-500" />
                  </span>
                  Processing your request
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReverseLookupPage;
