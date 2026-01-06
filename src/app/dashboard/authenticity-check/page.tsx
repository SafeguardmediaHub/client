/** biome-ignore-all lint/performance/noImgElement: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
'use client';

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Info,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { IntegrityReportFull } from '@/components/integrity/IntegrityReportFull';
import { IntegrityReportSimple } from '@/components/integrity/IntegrityReportSimple';
import MediaSelector from '@/components/media/MediaSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntegrityReport } from '@/hooks/useIntegrityReport';
import { type Media, useGetMedia } from '@/hooks/useMedia';
import { formatFileSize } from '@/lib/utils';

type PageState = 'idle' | 'selecting' | 'processing' | 'results' | 'error';

const AuthenticityCheckContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<PageState>('idle');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [reportType, setReportType] = useState<'simple' | 'full'>('simple');

  const { data } = useGetMedia();
  const media = data?.media || [];

  const {
    data: reportData,
    isLoading,
    error,
  } = useIntegrityReport(selectedMedia?.id, reportType, {
    enabled: state === 'processing',
  });

  // Handle auto-run from query params
  useEffect(() => {
    const mediaId = searchParams.get('mediaId');
    const autoRun = searchParams.get('autoRun') === 'true';

    if (mediaId && autoRun && media.length > 0) {
      const mediaItem = media.find((m) => m.id === mediaId);
      if (mediaItem) {
        setSelectedMedia(mediaItem);
        setState('processing');
      }
    }
  }, [searchParams, media]);

  // Handle loading completion
  useEffect(() => {
    if (state === 'processing') {
      if (!isLoading && reportData) {
        setState('results');
      } else if (!isLoading && error) {
        const status = (error as any)?.response?.status;
        if (status === 202) {
          toast.info(
            'Report is still being generated. Please try again in a moment.'
          );
          setState('selecting');
        } else {
          setState('error');
        }
      }
    }
  }, [isLoading, reportData, error, state]);

  const handleMediaSelection = (mediaFile: Media) => {
    const selectedFile = media.find((file) => file.id === mediaFile.id);
    if (selectedFile) {
      setSelectedMedia(selectedFile);
      setState('selecting');
    }
  };

  const handleReset = () => {
    setState('idle');
    setSelectedMedia(null);
    setReportType('simple');
  };

  const handleRunCheck = () => {
    if (!selectedMedia) return;
    setState('processing');
  };

  const handleViewFull = () => {
    setReportType('full');
    setState('processing');
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
        <div className="max-w-4xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-blue-50 mb-4">
              <ShieldCheck className="size-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Authenticity Check
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Comprehensive media integrity verification with detailed analysis
            </p>
          </div>

          {/* State: Idle */}
          {state === 'idle' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      What We Check
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Metadata integrity</li>
                      <li>• Content authenticity (C2PA)</li>
                      <li>• File integrity</li>
                      <li>• Geolocation verification</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-900 mb-2">
                      How It Works
                    </h3>
                    <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                      <li>Select media from library</li>
                      <li>Choose report type</li>
                      <li>Run comprehensive analysis</li>
                      <li>Review detailed findings</li>
                    </ol>
                  </CardContent>
                </Card>
              </div>

              {/* Media Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Select Media to Verify
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="block text-sm font-medium text-gray-700 mb-2">
                      Choose from your library
                    </h3>
                    <MediaSelector onSelect={handleMediaSelection} />
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Tip:</span> Only processed
                      media files can be analyzed.
                    </div>
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
                </CardContent>
              </Card>
            </div>
          )}

          {/* State: Selecting */}
          {state === 'selecting' && selectedMedia && (
            <Card className="animate-in fade-in slide-in-from-bottom-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Configure Authenticity Check
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
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
                        {formatFileSize(Number(selectedMedia.fileSize))}
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

                {/* Report type selection */}
                <div>
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-3">
                      Report Detail Level
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setReportType('simple')}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          reportType === 'simple'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">
                          Simple
                        </div>
                        <div className="text-sm text-gray-600">
                          Quick overview with verdict and key issues
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportType('full')}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          reportType === 'full'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">
                          Full
                        </div>
                        <div className="text-sm text-gray-600">
                          Comprehensive analysis with all findings and raw data
                        </div>
                      </button>
                    </div>
                  </fieldset>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button onClick={handleRunCheck} className="w-full">
                    <ShieldCheck className="size-4 mr-2" />
                    Run Authenticity Check
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                  >
                    Select Different File
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
                    <Loader2 className="size-5 animate-spin text-blue-600" />
                    Analyzing Media Integrity...
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
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

                <div className="py-8 text-center">
                  <Loader2 className="size-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Running comprehensive integrity analysis
                  </p>
                  <p className="text-xs text-gray-500">
                    This may take up to 30 seconds...
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2 bg-blue-500" />
                  </span>
                  Processing your request
                </div>
              </CardContent>
            </Card>
          )}

          {/* State: Results */}
          {state === 'results' && reportData && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Integrity Report</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Run Another Check
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {reportType === 'simple' ? (
                    <IntegrityReportSimple
                      report={reportData.report}
                      onViewFull={handleViewFull}
                    />
                  ) : (
                    <IntegrityReportFull report={reportData.report} />
                  )}
                </CardContent>
              </Card>

              {/* Findings Summary */}
              {reportData.report.categories?.some(
                (cat) => cat.findings && cat.findings.length > 0
              ) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Key Findings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Severity Summary */}
                    {(() => {
                      const allFindings =
                        reportData.report.categories?.flatMap(
                          (cat) => cat.findings || []
                        ) || [];
                      const severityCounts = allFindings.reduce(
                        (acc, finding) => {
                          acc[finding.severity] =
                            (acc[finding.severity] || 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>
                      );

                      if (Object.keys(severityCounts).length === 0) return null;

                      return (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {(
                            [
                              'critical',
                              'high',
                              'medium',
                              'low',
                              'info',
                            ] as const
                          ).map((severity) => {
                            const count = severityCounts[severity] || 0;
                            if (count === 0) return null;

                            const severityConfig = {
                              critical: {
                                color: 'bg-red-100 text-red-800 border-red-200',
                                icon: AlertCircle,
                              },
                              high: {
                                color:
                                  'bg-orange-100 text-orange-800 border-orange-200',
                                icon: AlertTriangle,
                              },
                              medium: {
                                color:
                                  'bg-yellow-100 text-yellow-800 border-yellow-200',
                                icon: AlertTriangle,
                              },
                              low: {
                                color:
                                  'bg-blue-100 text-blue-800 border-blue-200',
                                icon: Info,
                              },
                              info: {
                                color:
                                  'bg-gray-100 text-gray-800 border-gray-200',
                                icon: Info,
                              },
                            };

                            const config = severityConfig[severity];
                            const Icon = config.icon;

                            return (
                              <div
                                key={severity}
                                className={`p-3 rounded-lg border ${config.color}`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Icon className="size-4" />
                                  <span className="text-xs font-medium capitalize">
                                    {severity}
                                  </span>
                                </div>
                                <div className="text-2xl font-bold">
                                  {count}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* Findings by Category */}
                    <div className="space-y-4">
                      {reportData.report.categories
                        ?.filter((cat) => cat.findings?.length > 0)
                        .map((category) => (
                          <div
                            key={category.name}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                          >
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <ShieldCheck className="size-4 text-blue-600" />
                              {category.name}
                            </h4>
                            <div className="space-y-3">
                              {category.findings.map((finding) => {
                                const severityColors = {
                                  critical:
                                    'bg-red-600 text-white border-red-700',
                                  high: 'bg-orange-500 text-white border-orange-600',
                                  medium:
                                    'bg-yellow-500 text-white border-yellow-600',
                                  low: 'bg-blue-500 text-white border-blue-600',
                                  info: 'bg-gray-500 text-white border-gray-600',
                                };

                                return (
                                  <div
                                    key={`${category.name}-${finding.type}-${finding.severity}`}
                                    className="bg-white rounded-lg p-3 border-l-4 border-gray-300 shadow-sm"
                                    style={{
                                      borderLeftColor:
                                        finding.severity === 'critical'
                                          ? '#dc2626'
                                          : finding.severity === 'high'
                                          ? '#f97316'
                                          : finding.severity === 'medium'
                                          ? '#eab308'
                                          : finding.severity === 'low'
                                          ? '#3b82f6'
                                          : '#6b7280',
                                    }}
                                  >
                                    <div className="flex items-start gap-2 mb-2">
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-medium border ${
                                          severityColors[finding.severity]
                                        }`}
                                      >
                                        {finding.severity.toUpperCase()}
                                      </span>
                                      <span className="text-sm font-medium text-gray-900">
                                        {finding.type}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {finding.explanation}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Media Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Media Information</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Filename:</span>
                    <span className="font-medium">
                      {reportData.mediaInfo.originalFilename}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {reportData.mediaInfo.mimeType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">
                      {formatFileSize(reportData.mediaInfo.fileSize)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uploaded:</span>
                    <span className="font-medium">
                      {new Date(
                        reportData.mediaInfo.uploadedAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* State: Error */}
          {state === 'error' && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-2">
                      Failed to generate integrity report
                    </h3>
                    <p className="text-sm text-red-800 mb-4">
                      {(error as any)?.response?.data?.message ||
                        'An unexpected error occurred.'}
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setState('processing')}
                        variant="outline"
                        size="sm"
                      >
                        Try Again
                      </Button>
                      <Button onClick={handleReset} variant="outline" size="sm">
                        Select Different File
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const AuthenticityCheckPage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full flex items-center justify-center p-8">
          <div>Loading...</div>
        </div>
      }
    >
      <AuthenticityCheckContent />
    </Suspense>
  );
};

export default AuthenticityCheckPage;
