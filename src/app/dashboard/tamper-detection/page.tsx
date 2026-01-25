/** biome-ignore-all lint/performance/noImgElement: <> */
'use client';

import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  FileImage,
  Info,
  Shield,
  Sparkles,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  FEATURE_INFO,
  FeatureInfoDialog,
} from '@/components/FeatureInfoDialog';
import { AnalysisView } from '@/components/media/AnalysisView';
import MediaSelector from '@/components/media/MediaSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Media, useGetMedia } from '@/hooks/useMedia';
import { formatFileSize } from '@/lib/utils';

type PageState = 'idle' | 'viewing';

const TamperDetectionPage = () => {
  const [state, setState] = useState<PageState>('idle');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const router = useRouter();
  const { data } = useGetMedia();
  const media = data?.media || [];

  // Show dialog on first visit
  useEffect(() => {
    setShowInfoDialog(true);
  }, []);

  const handleMediaSelection = (mediaFile: Media) => {
    const selectedFile = media.find((file) => file.id === mediaFile.id);

    if (selectedFile) {
      setSelectedMedia(selectedFile);
      setState('viewing');
    }
  };

  const handleReset = () => {
    setState('idle');
    setSelectedMedia(null);
  };

  const handleCopyJSON = () => {
    if (!selectedMedia) return;

    const exportData = {
      filename: selectedMedia.filename,
      fileSize: selectedMedia.fileSize,
      mimeType: selectedMedia.mimeType,
      metadata: selectedMedia.metadata,
      analysis: selectedMedia.metadata?.analysis,
      c2paVerification: selectedMedia.c2paVerification,
    };

    navigator.clipboard
      .writeText(JSON.stringify(exportData, null, 2))
      .then(() => {
        toast.success('Analysis data copied to clipboard');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy data');
      });
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
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-red-50 mb-4">
              <Shield className="size-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Tamper Detection
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Analyze media files for signs of manipulation, metadata tampering,
              and integrity issues
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
            featureInfo={FEATURE_INFO.tamperDetection}
          />

          {/* State: Idle - Show info cards and selector */}
          {state === 'idle' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Info Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* All Media Types Card */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileImage className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                          All Media Types
                        </h3>
                        <p className="text-sm text-blue-800 mb-3">
                          This tool analyzes images, videos, and audio files.
                          Supported formats:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                            Images
                          </span>
                          <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                            Videos
                          </span>
                          <span className="px-2 py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded">
                            Audio
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lightning Fast Analysis Card */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 size-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Shield className="size-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 mb-2">
                          Lightning Fast Analysis
                        </h3>
                        <p className="text-sm text-green-800">
                          Get instant tamper detection results the moment you
                          select a file. Our advanced forensic analysis delivers
                          comprehensive findings in milliseconds.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Media Selector Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Select Media to Analyze
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Media selector dropdown */}
                  <div>
                    <label
                      htmlFor="media-selector"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Choose from your library
                    </label>
                    <MediaSelector
                      onSelect={handleMediaSelection}
                      filterType="all"
                    />
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
                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Pro Tip:</span> Our
                      intelligent analysis engine processes every file as it's
                      uploaded, so your results are always ready when you need
                      them.
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="size-4" />
                      What we analyze
                    </h3>
                    <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                      <li>Metadata integrity and completeness</li>
                      <li>Signs of metadata stripping or manipulation</li>
                      <li>Missing or suspicious metadata fields</li>
                      <li>File structure and forensic signatures</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* State: Viewing - Display analysis results */}
          {state === 'viewing' && selectedMedia && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Selected Media Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Analysis Results</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyJSON}
                        className="flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="size-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            Copy JSON
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-gray-500"
                      >
                        Select Different File
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
                          {formatFileSize(Number(selectedMedia.fileSize))} •{' '}
                          {selectedMedia.mimeType}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* C2PA Status Card */}
              {selectedMedia.c2paVerification && (
                <Card
                  className={
                    selectedMedia.c2paVerification.result.c2paStatus ===
                    'verified'
                      ? 'border-green-200 bg-green-50/50'
                      : selectedMedia.c2paVerification.result.c2paStatus ===
                          'no_c2pa_found'
                        ? 'border-gray-200 bg-gray-50/50'
                        : 'border-yellow-200 bg-yellow-50/50'
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Shield className="size-5 text-blue-600" />
                        C2PA Content Credentials
                      </CardTitle>
                      <Badge
                        variant={
                          selectedMedia.c2paVerification.result.c2paStatus ===
                          'verified'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {selectedMedia.c2paVerification.result.c2paStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* AI Generated Indicator */}
                      {selectedMedia.c2paVerification.result.c2paStatus ===
                        'verified' &&
                        selectedMedia.c2paVerification.result.issuer && (
                          <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <Sparkles className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-purple-900 mb-1">
                                AI-Generated Content Detected
                              </h4>
                              <p className="text-sm text-purple-800">
                                This media has C2PA credentials indicating it
                                was created or modified by AI tools.
                              </p>
                              {selectedMedia.c2paVerification.result.issuer && (
                                <p className="text-xs text-purple-700 mt-2">
                                  <span className="font-medium">Issuer:</span>{' '}
                                  {selectedMedia.c2paVerification.result.issuer}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Status Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Manifest:
                          </span>
                          <p className="text-gray-900 mt-1">
                            {selectedMedia.c2paVerification.result
                              .manifestPresent
                              ? 'Present'
                              : 'Not Found'}
                          </p>
                        </div>
                        {selectedMedia.c2paVerification.result
                          .signatureValid !== null && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Signature:
                            </span>
                            <p className="text-gray-900 mt-1">
                              {selectedMedia.c2paVerification.result
                                .signatureValid
                                ? 'Valid'
                                : 'Invalid'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analysis Results */}
              <AnalysisView analysis={selectedMedia.metadata?.analysis} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TamperDetectionPage;
