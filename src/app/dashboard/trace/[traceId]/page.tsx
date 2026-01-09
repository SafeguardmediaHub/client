"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { DistributionGraphTab } from "@/components/trace/DistributionGraphTab";
import { ForensicAnalysisTab } from "@/components/trace/ForensicAnalysisTab";
import { OverviewTab } from "@/components/trace/OverviewTab";
import { PostsListTab } from "@/components/trace/PostsListTab";
import { RawJSONTab } from "@/components/trace/RawJSONTab";
import { SuspiciousPatternsTab } from "@/components/trace/SuspiciousPatternsTab";
import { TimelineTab } from "@/components/trace/TimelineTab";
import { TraceProgress } from "@/components/trace/TraceProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportGeneration } from "@/hooks/useReports";
import { useTraceDistribution, useTraceResult, useTraceTimeline } from "@/hooks/useTrace";
import type { TraceStatus } from "@/types/trace";

const LoadingState = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

const TraceDetailContent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const traceId = params.traceId as string;
  const mediaId = searchParams.get("mediaId") || "";

  const [pollStartTime] = useState(Date.now());
  const [isStale, setIsStale] = useState(false);

  // Stale timeout: 10 minutes (600000ms)
  const STALE_TIMEOUT = 600000;

  // Poll trace result (handles status + data in one query)
  const resultQuery = useTraceResult(mediaId, traceId);
  const distributionQuery = useTraceDistribution(traceId, {
    enabled: resultQuery.data?.data?.status === 'completed',
  });
  const timelineQuery = useTraceTimeline(traceId, {
    enabled: resultQuery.data?.data?.status === 'completed',
  });

  const status = resultQuery.data?.data?.status;
  const progress = resultQuery.data?.data?.progress;
  const error = resultQuery.data?.data?.error;


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
    if (!mediaId) {
      toast.error('Media ID not found');
      return;
    }

    try {
      await reportGeneration.generate({
        type: 'media_analytics',
        mediaId: mediaId,
        verificationType: 'sm_trace',
        format: 'pdf',
        title: `Social Media Trace Report - ${mediaId}`,
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleDownloadReport = () => {
    reportGeneration.downloadReport(`SM_Trace_Report_${mediaId}`);
  };

  // Check for stale timeout
  useEffect(() => {
    const isPolling = status === "pending" || status === "processing";
    if (!isPolling) return;

    const checkStale = () => {
      const elapsed = Date.now() - pollStartTime;
      if (elapsed > STALE_TIMEOUT && status === "processing") {
        setIsStale(true);
        toast.warning("Trace is taking longer than expected", {
          description: "You can continue monitoring or check back later.",
        });
      }
    };

    const interval = setInterval(checkStale, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [status, pollStartTime, STALE_TIMEOUT]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      toast.success("Connection restored", {
        description: "Resuming trace monitoring...",
      });
      if (status === "pending" || status === "processing") {
        resultQuery.refetch();
      }
    };

    const handleOffline = () => {
      toast.error("Connection lost", {
        description: "Will resume monitoring when connection returns.",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [status, resultQuery]);

  const getStatusConfig = (currentStatus: TraceStatus) => {
    switch (currentStatus) {
      case "pending":
        return {
          icon: Loader2,
          title: "Trace Pending",
          description: "Your trace request is queued and will start shortly.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "processing":
        return {
          icon: Loader2,
          title: "Trace in Progress",
          description: "Scanning social media platforms for your content.",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          animate: true,
        };
      case "completed":
        return {
          icon: CheckCircle,
          title: "Trace Completed",
          description: "Your social media trace has finished successfully.",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "failed":
        return {
          icon: XCircle,
          title: "Trace Failed",
          description: error || "An error occurred during the trace.",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "no_results":
        return {
          icon: AlertCircle,
          title: "No Results Found",
          description:
            "No appearances of your media were found on the searched platforms.",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
      default:
        return {
          icon: Loader2,
          title: "Loading...",
          description: "Fetching trace status...",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  if (resultQuery.isLoading && !resultQuery.data) {
    return (
      <div className="w-full flex flex-col gap-6 p-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (resultQuery.isError) {
    return (
      <div className="w-full flex flex-col gap-6 p-8">
        <Link href="/dashboard/trace">
          <Button variant="outline" className="w-fit cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Traces
          </Button>
        </Link>
        <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Failed to Load Trace
              </h3>
              <p className="text-sm text-red-800 mb-4">
                There was an error loading this trace. Please try again or go
                back to the traces list.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => resultQuery.refetch()}
                  className="cursor-pointer bg-red-600 hover:bg-red-500"
                >
                  Retry
                </Button>
                <Link href="/dashboard/trace">
                  <Button variant="outline" className="cursor-pointer">
                    Back to Traces
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = status ? getStatusConfig(status) : null;
  const StatusIcon = statusConfig?.icon || Loader2;

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/trace">
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Traces
          </Button>
        </Link>
        {!navigator.onLine && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">Offline</span>
          </div>
        )}
      </div>

      {/* Trace Info */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Trace Details
            </h1>
            <p className="text-sm font-mono text-gray-600">ID: {traceId}</p>
          </div>
          {statusConfig && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
            >
              <StatusIcon
                className={`w-5 h-5 ${statusConfig.color} ${statusConfig.animate ? "animate-spin" : ""}`}
              />
              <span className={`font-medium ${statusConfig.color}`}>
                {statusConfig.title}
              </span>
            </div>
          )}
        </div>
        {statusConfig && (
          <p className="text-sm text-gray-600">{statusConfig.description}</p>
        )}
      </div>

      {/* Stale Timeout Warning */}
      {isStale && status === "processing" && (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Taking Longer Than Expected
              </h3>
              <p className="text-sm text-yellow-800 mb-4">
                This trace is taking longer than the estimated time. This can
                happen with deep searches or high platform activity. You can:
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setIsStale(false);
                    resultQuery.refetch();
                  }}
                  variant="outline"
                  className="cursor-pointer border-yellow-300 hover:bg-yellow-100"
                >
                  Continue Monitoring
                </Button>
                <Link href="/dashboard/trace">
                  <Button variant="outline" className="cursor-pointer">
                    Check Back Later
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Display */}
      {(status === "pending" || status === "processing") && (
        <TraceProgress
          progress={progress}
          estimatedCompletionSeconds={undefined}
          startedAt={new Date().toISOString()}
        />
      )}

      {/* Completed Results with Tabs */}
      {status === "completed" && resultQuery.isLoading && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <LoadingState message="Loading trace results..." />
        </div>
      )}

      {status === "completed" && resultQuery.data && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <Tabs defaultValue="overview" className="w-full">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Trace Results
              </h2>
              <TabsList className="w-full justify-start flex-wrap h-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
                <TabsTrigger value="posts">
                  Posts (
                  {resultQuery.data?.data?.platformAppearances?.reduce(
                    (sum, pa) => sum + (pa.posts?.length || 0),
                    0
                  ) || 0}
                  )
                </TabsTrigger>
                {/* <TabsTrigger value="suspicious">Suspicious Patterns</TabsTrigger> */}
                <TabsTrigger value="forensics">Forensics</TabsTrigger>
                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0">
                <OverviewTab result={resultQuery.data.data} />
              </TabsContent>

              <TabsContent value="timeline" className="mt-0">
                {timelineQuery.isLoading ? (
                  <LoadingState message="Fetching chronological timeline..." />
                ) : timelineQuery.isError ? (
                  <div className="p-12 text-center text-red-600">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>Failed to load timeline data.</p>
                  </div>
                ) : (
                  <TimelineTab
                    distributionGraph={resultQuery.data.data.distributionGraph}
                    platformAppearances={resultQuery.data.data.platformAppearances}
                    timelineData={timelineQuery.data?.data?.timeline}
                  />
                )}
              </TabsContent>

              <TabsContent value="distribution" className="mt-0">
                {distributionQuery.isLoading ? (
                  <LoadingState message="Analyzing distribution network..." />
                ) : distributionQuery.isError ? (
                  <div className="p-12 text-center text-red-600">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>Failed to load distribution data.</p>
                  </div>
                ) : (
                  <DistributionGraphTab
                    graph={resultQuery.data.data.distributionGraph}
                    networkData={distributionQuery.data?.data}
                  />
                )}
              </TabsContent>


              <TabsContent value="posts" className="mt-0">
                <PostsListTab
                  platformAppearances={resultQuery.data.data.platformAppearances}
                />
              </TabsContent>

              {/* <TabsContent value="suspicious" className="mt-0">
                <SuspiciousPatternsTab
                  patterns={resultQuery.data.data.suspiciousPatterns}
                />
              </TabsContent> */}

              <TabsContent value="forensics" className="mt-0">
                <ForensicAnalysisTab
                  analysis={resultQuery.data.data.forensicAnalysis}
                  searchConfig={resultQuery.data.data.searchConfig}
                />
              </TabsContent>

              <TabsContent value="raw" className="mt-0">
                <RawJSONTab data={resultQuery.data.data} />
              </TabsContent>
            </div>
          </Tabs>

          {/* Report Generation Section */}
          <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
            <div className="flex justify-center gap-4">
              {!reportGeneration.status && (
                <Button
                  onClick={handleGenerateReport}
                  disabled={reportGeneration.isGenerating}
                  className="cursor-pointer"
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
                  className="cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Results State */}
      {status === "no_results" && (
        <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              No public posts containing your media were found on the selected
              platforms. Try:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 mb-6 text-left">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Widening the time range to include older posts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Increasing search depth for more comprehensive results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Adding more platforms to your search</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Checking if the media is publicly accessible</span>
              </li>
            </ul>
            <Link href="/dashboard/trace">
              <Button className="cursor-pointer bg-blue-600 hover:bg-blue-500">
                Start New Trace
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Failed State */}
      {status === "failed" && (
        <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Trace Failed
              </h3>
              <p className="text-sm text-red-800 mb-4">
                {error ||
                  "An error occurred while processing your trace. This could be due to platform issues or network problems."}
              </p>
              <div className="flex gap-2">
                <Link href="/dashboard/trace">
                  <Button className="cursor-pointer bg-red-600 hover:bg-red-500">
                    Try New Trace
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    toast.info("Retry with same config will be added soon");
                  }}
                >
                  Retry with Same Config
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TraceDetailPage = () => {
  return (
    <Suspense fallback={<LoadingState message="Loading trace details..." />}>
      <TraceDetailContent />
    </Suspense>
  );
};

export default TraceDetailPage;
