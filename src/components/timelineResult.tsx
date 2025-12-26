/** biome-ignore-all lint/performance/noImgElement: <> */

import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Media } from '@/hooks/useMedia';
import { useReportGeneration } from '@/hooks/useReports';
import { AspectRatio } from './ui/aspect-ratio';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface TimelineEvent {
  label: string;
  timestamp: string;
  source: string;
}

interface Match {
  title: string;
  link: string;
  source: string;
  sourceIcon?: string;
  thumbnail?: string;
  confidence?: string;
}

interface VerifyTimelineResponse {
  timeline: TimelineEvent[];
  flags: string[];
  analysis: {
    hasMetadata: boolean;
    metadataConsistent: boolean;
    earlierOnlineAppearance: boolean;
    spoofedMetadata: boolean;
  };
  matches: Match[];
  metadata: {
    extractedAt: string;
    analysis: {
      integrityScore: number;
      authenticityScore: number;
      completenessScore: number;
    };
  };
}

interface ResultsPageProps {
  data?: VerifyTimelineResponse;
  media?: Media;
  onBack?: () => void;
  claimedDate?: string;
}

export default function ResultsPage({
  data,
  media,
  onBack,
  claimedDate,
}: ResultsPageProps) {
  const timelineData = media?.timeline || data;
  const hasRealData = media?.timeline?.status === 'completed';
  const [visibleMatches, setVisibleMatches] = useState(8);

  // Report generation hook
  const reportGeneration = useReportGeneration({
    onCompleted: (report) => {
      toast.success('Report generated successfully!');
    },
    onFailed: (error) => {
      toast.error(error || 'Report generation failed');
    },
  });

  const handleGenerateReport = async () => {
    if (!media?.id) {
      toast.error('Media ID not found');
      return;
    }

    try {
      await reportGeneration.generate({
        type: 'media_analytics',
        mediaId: media.id,
        verificationType: 'timeline',
        format: 'pdf',
        title: `Timeline Report - ${media.filename}`,
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleDownloadReport = () => {
    reportGeneration.downloadReport(
      `Timeline_Report_${media?.filename}`
    );
  };

  const searchEngines = [
    { name: 'Google Images', checked: true },
    { name: 'Bing Visual Search', checked: true },
    { name: 'TinEye', checked: true },
    { name: 'Yandex', checked: true },
  ];

  const matches = timelineData?.matches || [];
  const displayedMatches = matches.slice(0, visibleMatches);
  const hasMoreMatches = matches.length > visibleMatches;

  const loadMoreMatches = () => {
    setVisibleMatches((prev) => Math.min(prev + 8, matches.length));
  };

  const isLoading = !hasRealData;

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-semibold truncate">
            Timeline Verification Results
          </h2>
          {media && (
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
              <p className="text-xs md:text-sm text-gray-600 truncate">
                Analyzing: {media.filename}
              </p>
              {hasRealData ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                  ✓ Completed
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                  ⏳ Processing...
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            {isLoading ? (
              <div className="w-full sm:w-48 md:w-64 h-48 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
            ) : (
              <img
                src={media.thumbnailUrl}
                alt={media.filename}
                className="w-full sm:w-48 md:w-64 h-48 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                User Claim Information
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-gray-600">Claimed Date</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {claimedDate
                      ? new Date(claimedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-gray-600">Media File</span>
                  {isLoading ? (
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-sm text-gray-900 font-medium truncate">
                      {media.filename}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-gray-600">Uploaded</span>
                  {isLoading ? (
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-sm text-gray-900 font-medium">
                      {new Date(media.uploadedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={hasRealData ? 'default' : 'secondary'}>
                    {hasRealData ? 'Verified' : 'Processing'}
                  </Badge>
                </div>
              </div>
              {claimedDate && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  {(() => {
                    const originalDateTime =
                      media?.timeline?.metadata?.image?.originalDateTime;
                    // const originalDateTime = '2022-05-15T10:30:00Z'; // Example date for testing
                    const claimedDateObj = new Date(claimedDate);
                    const claimedDateStr = claimedDateObj.toLocaleDateString();

                    if (originalDateTime) {
                      const originalDateObj = new Date(originalDateTime);
                      const originalDateStr =
                        originalDateObj.toLocaleDateString();
                      const isEarlier = originalDateObj < claimedDateObj;
                      const isSame =
                        originalDateObj.toDateString() ===
                        claimedDateObj.toDateString();

                      return (
                        <div className="text-sm text-blue-800">
                          <p className="mb-2">
                            <strong>Metadata Analysis:</strong> The media's
                            original creation date is{' '}
                            <span className="font-medium">
                              {originalDateStr}
                            </span>
                            , while the claimed date is{' '}
                            <span className="font-medium">
                              {claimedDateStr}
                            </span>
                            .
                          </p>
                          {isSame ? (
                            <p className="text-green-700 font-medium">
                              ✓ The metadata date matches the claimed date.
                            </p>
                          ) : isEarlier ? (
                            <p className="text-amber-700 font-medium">
                              ⚠ The media was created{' '}
                              {Math.floor(
                                (claimedDateObj.getTime() -
                                  originalDateObj.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{' '}
                              days before the claimed date.
                            </p>
                          ) : (
                            <p className="text-red-700 font-medium">
                              ✗ The claimed date precedes the media's creation
                              date by{' '}
                              {Math.floor(
                                (originalDateObj.getTime() -
                                  claimedDateObj.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{' '}
                              days.
                            </p>
                          )}
                          <p className="mt-2">
                            Online matches are provided below for additional
                            verification.
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <p className="text-sm text-blue-800">
                          <strong>Timeline Verification:</strong> The media's
                          original creation date is not available in the
                          metadata for comparison against the claimed date of{' '}
                          <span className="font-medium">{claimedDateStr}</span>.
                          However, we have conducted a comprehensive search
                          across multiple platforms to identify any earlier
                          online appearances, with results provided below.
                        </p>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              Search Completed
            </h3>
            <p className="text-gray-600 text-sm">
              Found {matches.length} matches across 4 search engines.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Search Coverage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {searchEngines.map((engine) => (
                <div key={engine.name} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{engine.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <h2 className="text-lg md:text-xl font-medium mb-3">Found Matches</h2>
        {isLoading ? (
          <div className="border border-gray-200 rounded-xl p-8 text-center">
            <div className="animate-pulse space-y-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto"></div>
              <p className="text-gray-500">Searching for matches...</p>{' '}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedMatches.map((m: Match) => (
              <div
                key={m.link}
                className="flex flex-col max-w-sm bg-gray-200 border border-gray-200 rounded-lg shadow-sm mb-4"
              >
                <a href={m.link} target="_blank">
                  <div className="relative">
                    <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                      <img
                        src={m.thumbnail || '/placeholder-image.png'}
                        alt={m.title}
                        className="h-full w-full rounded-t-md object-cover dark:brightness-[0.2] dark:grayscale"
                      />
                    </AspectRatio>
                    {/* <div className="absolute top-3 right-3">
                      <Badge className="px-2 py-0.5 text-xs rounded border">
                        {m.confidence ? `${Math.round(parseFloat(m.confidence) * 100)}%` : 'N/A'} match
                      </Badge>
                    </div> */}
                  </div>
                </a>
                <div className="p-2">
                  <a href={m.link} target="_blank">
                    <h5 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
                      {m.title}{' '}
                    </h5>
                  </a>

                  <div className="flex items-center gap-2 mb-1">
                    {m.sourceIcon && (
                      <img
                        src={m.sourceIcon}
                        alt={m.source}
                        className="w-4 h-4 rounded"
                      />
                    )}
                    <span className="text-sm font-semibold">{m.source}</span>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  <a href={m.link} target="_blank">
                    <Button className="px-4 py-2 text-sm border border-gray-300 hover:text-gray-700  cursor-pointer rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      View Source
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && hasMoreMatches && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={loadMoreMatches}
              variant="outline"
              className="px-6 py-2"
            >
              Load More ({matches.length - visibleMatches} remaining)
            </Button>
          </div>
        )}
      </div>

      {/* Report Generation Section */}
      {hasRealData && media?.id && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Generate Report
          </h3>

          {/* Report Generation Status */}
          {reportGeneration.status && (
            <div className="mb-4 bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {reportGeneration.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : reportGeneration.status === 'failed' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {reportGeneration.status === 'pending'
                          ? 'Report Queued'
                          : reportGeneration.status === 'processing'
                          ? 'Generating Report'
                          : reportGeneration.status === 'completed'
                          ? 'Report Ready'
                          : 'Report Generation Failed'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {reportGeneration.status === 'pending' &&
                          'Your report is in the queue'}
                        {reportGeneration.status === 'processing' &&
                          'Creating your PDF report...'}
                        {reportGeneration.status === 'completed' &&
                          'Your report is ready to download'}
                        {reportGeneration.status === 'failed' &&
                          'An error occurred during generation'}
                      </p>
                    </div>
                  </div>
                  {reportGeneration.status === 'completed' && (
                    <Button
                      onClick={handleDownloadReport}
                      className="cursor-pointer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>

                {/* Progress Bar */}
                {(reportGeneration.status === 'pending' ||
                  reportGeneration.status === 'processing') && (
                  <div className="space-y-2">
                    <Progress value={reportGeneration.progress || 0} />
                    <p className="text-xs text-gray-500 text-center">
                      {reportGeneration.progress || 0}% complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            {!reportGeneration.status && (
              <Button
                onClick={handleGenerateReport}
                disabled={reportGeneration.isGenerating}
                className="cursor-pointer w-full sm:w-auto"
              >
                {reportGeneration.isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate PDF Report
                  </>
                )}
              </Button>
            )}
            {reportGeneration.status === 'failed' && (
              <Button
                onClick={handleGenerateReport}
                disabled={reportGeneration.isGenerating}
                className="cursor-pointer w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
