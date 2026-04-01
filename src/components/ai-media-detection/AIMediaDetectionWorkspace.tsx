/** biome-ignore-all lint/performance/noImgElement: <> */
"use client";

import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clock3,
  FileAudio,
  FileImage,
  FileVideo,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AccessNotice } from "@/components/subscription/AccessNotice";
import { UsageSummaryBanner } from "@/components/subscription/UsageSummaryBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type AIMediaType,
  type AnalysisDetail,
  getAIMediaType,
  useAnalysisDetail,
  useAnalysisStatus,
  useStartAIMediaDetection,
} from "@/hooks/useAIMediaDetection";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { type Media, useGetMedia } from "@/hooks/useMedia";
import { useSubscriptionUsage } from "@/hooks/useSubscriptionUsage";
import {
  formatResetDate,
  getCombinedFeatureState,
  getDeniedStateFromError,
  getFeatureState,
  getLimitReachedMessage,
  getUsageGate,
  type ProductFeatureKey,
} from "@/lib/subscription-access";
import { cn, formatFileSize, timeAgo } from "@/lib/utils";

type MediaFilter = "all" | AIMediaType;
type AnalysisStatusFilter =
  | "all"
  | "pending"
  | "processing"
  | "completed"
  | "failed";
type FlowState =
  | "idle"
  | "media_selected"
  | "starting_analysis"
  | "analysis_pending"
  | "analysis_processing"
  | "analysis_completed"
  | "analysis_failed";

const READY_MEDIA_STATUSES = new Set(["uploaded", "processed"]);

const MEDIA_FILTERS: Array<{ label: string; value: MediaFilter }> = [
  { label: "All", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Audio", value: "audio" },
];

const ANALYSIS_STATUS_FILTERS: Array<{
  label: string;
  value: AnalysisStatusFilter;
}> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

function getDeepfakeFeatureKey(
  mediaType?: AIMediaType | null,
): ProductFeatureKey | null {
  switch (mediaType) {
    case "image":
      return "deepfakeImage";
    case "video":
      return "deepfakeVideo";
    case "audio":
      return "deepfakeAudio";
    default:
      return null;
  }
}

function getMediaTypeLabel(mediaType: AIMediaType) {
  switch (mediaType) {
    case "image":
      return "Image";
    case "video":
      return "Video";
    case "audio":
      return "Audio";
  }
}

function getMediaTypeIcon(mediaType: AIMediaType, className?: string) {
  const iconClassName = cn("size-4", className);

  switch (mediaType) {
    case "image":
      return <FileImage className={iconClassName} />;
    case "video":
      return <FileVideo className={iconClassName} />;
    case "audio":
      return <FileAudio className={iconClassName} />;
  }
}

function getVerdictLabel(predictedClass?: string) {
  switch ((predictedClass || "").toLowerCase()) {
    case "real":
      return "Likely Real";
    case "synthetic":
      return "AI-Generated";
    case "manipulated":
      return "Manipulated";
    case "deepfake":
      return "Deepfake";
    default:
      return predictedClass || "Unable to Evaluate";
  }
}

function getVerdictDescription(predictedClass?: string) {
  switch ((predictedClass || "").toLowerCase()) {
    case "real":
      return "This file appears likely authentic based on the current model output.";
    case "synthetic":
      return "This file appears likely AI-generated.";
    case "manipulated":
      return "This file shows signals associated with manipulation or suspicious edits.";
    case "deepfake":
      return "This file shows signals consistent with deepfake content.";
    default:
      return "This file could not be assigned a clear verdict.";
  }
}

function getVerdictClasses(predictedClass?: string) {
  switch ((predictedClass || "").toLowerCase()) {
    case "real":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "synthetic":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "manipulated":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "deepfake":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getStatusClasses(status?: string) {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "processing":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "pending":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "failed":
      return "border-red-200 bg-red-50 text-red-700";
    case "uploaded":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getStatusLabel(status?: string) {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return "Completed";
    case "processing":
    case "active":
      return "Processing";
    case "pending":
    case "queued":
      return "Pending";
    case "failed":
      return "Failed";
    case "uploaded":
      return "Ready";
    default:
      return status || "Unknown";
  }
}

function formatDateTime(value?: string) {
  if (!value) return "Not available";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMediaAvailability(media: Media) {
  const mediaType = getAIMediaType(media.mimeType);
  const normalizedStatus = media.status.toLowerCase();
  const isSupported = Boolean(mediaType);
  const isReady = isSupported && READY_MEDIA_STATUSES.has(normalizedStatus);

  let reason = "";
  if (!isSupported) {
    reason = "Unsupported media type";
  } else if (!isReady) {
    reason = "Still processing in library";
  }

  return {
    mediaType,
    isSupported,
    isReady,
    reason,
  };
}

function getPresetModeLabel(filter: MediaFilter) {
  switch (filter) {
    case "image":
      return "Images";
    case "video":
      return "Videos";
    case "audio":
      return "Audio";
    default:
      return null;
  }
}

function getPresetModeDescription(filter: MediaFilter) {
  switch (filter) {
    case "image":
      return "Analyze image files from your library for signs of AI generation or manipulation.";
    case "video":
      return "Analyze video files from your library for signs of AI generation or manipulation.";
    case "audio":
      return "Analyze audio files from your library for signs of AI generation or manipulation.";
    default:
      return "Analyze images, videos, and audio from your library for signs of AI generation or manipulation.";
  }
}

function getScopedStatsLabel(filter: MediaFilter) {
  switch (filter) {
    case "image":
      return "Supported images";
    case "video":
      return "Supported videos";
    case "audio":
      return "Supported audio";
    default:
      return "Supported files";
  }
}

function getScopedReadyLabel(filter: MediaFilter) {
  switch (filter) {
    case "image":
      return "Images ready";
    case "video":
      return "Videos ready";
    case "audio":
      return "Audio ready";
    default:
      return "Ready to analyze";
  }
}

function humanizeAnalysisError(error?: string, mediaType?: AIMediaType | null) {
  if (!error) {
    return "The analysis could not be completed for this file. Please try another file or check again later.";
  }

  const normalized = error.toLowerCase();

  if (
    normalized.includes("unsupported") ||
    normalized.includes("not supported") ||
    normalized.includes("unable to evaluate")
  ) {
    return mediaType === "audio"
      ? "This audio file was uploaded successfully, but it could not be evaluated."
      : "This file was uploaded successfully, but it could not be evaluated.";
  }

  if (
    normalized.includes("auth") ||
    normalized.includes("credential") ||
    normalized.includes("configuration")
  ) {
    return "Analysis is temporarily unavailable because the service configuration could not be used.";
  }

  if (normalized.includes("timeout")) {
    return "The analysis took too long to respond for this file. Try refreshing the status or rerunning it later.";
  }

  if (normalized.includes("provider")) {
    return "The analysis could not be completed for this file right now.";
  }

  return error;
}

function getModelLabel(modelInfo?: Record<string, unknown>) {
  if (typeof modelInfo?.name === "string") {
    return modelInfo.name;
  }

  return "Not available";
}

function MediaThumbnail({ media }: { media: Media }) {
  const mediaType = getAIMediaType(media.mimeType);
  const hasPreview = media.thumbnailUrl && mediaType !== "audio";

  if (hasPreview) {
    return (
      <img
        src={media.thumbnailUrl}
        alt={media.filename}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
      {mediaType ? (
        getMediaTypeIcon(mediaType, "size-5")
      ) : (
        <Sparkles className="size-5" />
      )}
    </div>
  );
}

function AnalysisPreview({ analysis }: { analysis: AnalysisDetail }) {
  if (analysis.thumbnailUrl && analysis.mediaType !== "audio") {
    return (
      <img
        src={analysis.thumbnailUrl}
        alt={analysis.fileName}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
      {getMediaTypeIcon(analysis.mediaType, "size-6")}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}

export function AIMediaDetectionWorkspace() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [librarySearch, setLibrarySearch] = useState("");
  const deferredLibrarySearch = useDeferredValue(librarySearch);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [analysisSearch, setAnalysisSearch] = useState("");
  const deferredAnalysisSearch = useDeferredValue(analysisSearch);
  const [analysisStatusFilter, setAnalysisStatusFilter] =
    useState<AnalysisStatusFilter>("all");
  const [analysisPage, setAnalysisPage] = useState(1);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<AnalysisDetail | null>(null);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [pollUntil, setPollUntil] = useState<number | null>(null);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const [detailAnalysisId, setDetailAnalysisId] = useState<string | null>(null);
  const currentAnalysisRef = useRef<HTMLDivElement | null>(null);

  const mediaQuery = useGetMedia({ page: 1, limit: 100, sort: "createdAt" });
  const subscriptionUsageQuery = useSubscriptionUsage();
  const analysisHistoryQuery = useAnalysisHistory({
    page: analysisPage,
    limit: 10,
    sort: "createdAt",
    order: "desc",
    mediaType: mediaFilter === "all" ? undefined : mediaFilter,
  });

  const startDetection = useStartAIMediaDetection();

  const statusQuery = useAnalysisStatus(activeAnalysisId, {
    enabled:
      flowState === "analysis_pending" || flowState === "analysis_processing",
    pollUntil,
  });

  const activeDetailQuery = useAnalysisDetail(activeAnalysisId, {
    enabled: flowState === "analysis_completed" && Boolean(activeAnalysisId),
  });

  const detailQuery = useAnalysisDetail(detailAnalysisId, {
    enabled: Boolean(detailAnalysisId),
  });
  const presetModeLabel = getPresetModeLabel(mediaFilter);
  const lockedMediaMode = useMemo(() => {
    const mediaParam = searchParams.get("media");
    return mediaParam === "image" ||
      mediaParam === "video" ||
      mediaParam === "audio"
      ? mediaParam
      : null;
  }, [searchParams]);

  useEffect(() => {
    if (lockedMediaMode) {
      setMediaFilter(lockedMediaMode);
      return;
    }

    setMediaFilter("all");
  }, [lockedMediaMode]);

  useEffect(() => {
    if (!pollUntil) return undefined;

    const remainingMs = pollUntil - Date.now();
    if (remainingMs <= 0) {
      setPollTimedOut(true);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPollTimedOut(true);
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [pollUntil]);

  useEffect(() => {
    if (!statusQuery.data) return;

    const { analysis, queue } = statusQuery.data;
    const effectiveStatus = analysis.effectiveStatus;

    if (effectiveStatus === "completed") {
      setFlowError(null);
      setFlowState("analysis_completed");
      return;
    }

    if (effectiveStatus === "failed") {
      setFlowState("analysis_failed");
      setFlowError(
        humanizeAnalysisError(
          queue.error ||
            analysis.errorInfo?.message ||
            "The analysis could not be completed for this file.",
          analysis.mediaType,
        ),
      );
      return;
    }

    if (effectiveStatus === "processing") {
      setFlowState("analysis_processing");
      return;
    }

    setFlowState("analysis_pending");
  }, [statusQuery.data]);

  useEffect(() => {
    if (!activeDetailQuery.data) return;
    setActiveResult(activeDetailQuery.data);
  }, [activeDetailQuery.data]);

  const mediaItems = useMemo(
    () => mediaQuery.data?.media || [],
    [mediaQuery.data],
  );

  const libraryStats = useMemo(() => {
    let supported = 0;
    let ready = 0;

    for (const item of mediaItems) {
      const availability = getMediaAvailability(item);
      const matchesFilter =
        mediaFilter === "all" || availability.mediaType === mediaFilter;

      if (!matchesFilter) {
        continue;
      }

      if (availability.isSupported) supported += 1;
      if (availability.isReady) ready += 1;
    }

    return {
      supported,
      ready,
    };
  }, [mediaFilter, mediaItems]);

  const filteredMedia = useMemo(() => {
    const query = deferredLibrarySearch.trim().toLowerCase();

    return mediaItems.filter((item) => {
      const availability = getMediaAvailability(item);

      if (!availability.isSupported) return false;
      if (mediaFilter !== "all" && availability.mediaType !== mediaFilter) {
        return false;
      }

      if (!query) return true;

      return (
        item.filename.toLowerCase().includes(query) ||
        item.mimeType.toLowerCase().includes(query)
      );
    });
  }, [deferredLibrarySearch, mediaFilter, mediaItems]);

  const selectedMedia = useMemo(
    () => mediaItems.find((item) => item.id === selectedMediaId) || null,
    [mediaItems, selectedMediaId],
  );

  const selectedMediaAvailability = selectedMedia
    ? getMediaAvailability(selectedMedia)
    : null;
  const deepfakeAccessState = getCombinedFeatureState(
    subscriptionUsageQuery.data,
    ["deepfakeImage", "deepfakeVideo", "deepfakeAudio"],
  );
  const selectedFeatureState = selectedMediaAvailability?.mediaType
    ? getFeatureState(
        subscriptionUsageQuery.data,
        getDeepfakeFeatureKey(
          selectedMediaAvailability.mediaType,
        ) as ProductFeatureKey,
      )
    : deepfakeAccessState;
  const analysisUsage = subscriptionUsageQuery.data?.usage.analyses;
  const analysisUsageGate = getUsageGate(analysisUsage);

  const recentAnalyses = useMemo(() => {
    const items = analysisHistoryQuery.data?.analyses || [];
    const query = deferredAnalysisSearch.trim().toLowerCase();

    return items.filter((analysis) => {
      if (
        analysisStatusFilter !== "all" &&
        analysis.status.toLowerCase() !== analysisStatusFilter
      ) {
        return false;
      }

      if (!query) return true;

      return (
        analysis.fileName.toLowerCase().includes(query) ||
        (analysis.predictedClass || "").toLowerCase().includes(query) ||
        analysis.mediaType.toLowerCase().includes(query)
      );
    });
  }, [
    analysisHistoryQuery.data?.analyses,
    analysisStatusFilter,
    deferredAnalysisSearch,
  ]);

  const analysisPagination = analysisHistoryQuery.data?.pagination;

  const updateMediaFilter = (nextFilter: MediaFilter) => {
    setMediaFilter(nextFilter);
    setAnalysisPage(1);

    const params = new URLSearchParams(searchParams.toString());

    if (nextFilter === "all") {
      params.delete("media");
    } else {
      params.set("media", nextFilter);
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  };

  const scrollToCurrentAnalysis = () => {
    window.requestAnimationFrame(() => {
      currentAnalysisRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  useEffect(() => {
    if (!selectedMedia || !selectedMediaAvailability) {
      return;
    }

    const isCompatible =
      mediaFilter === "all" ||
      selectedMediaAvailability.mediaType === mediaFilter;

    if (isCompatible) {
      return;
    }

    setSelectedMediaId(null);
    setFlowState("idle");
    setActiveAnalysisId(null);
    setActiveResult(null);
    setFlowError(null);
    setPollUntil(null);
    setPollTimedOut(false);
  }, [mediaFilter, selectedMedia, selectedMediaAvailability]);

  const handleSelectMedia = (mediaId: string) => {
    setSelectedMediaId(mediaId);
    setFlowState("media_selected");
    setActiveAnalysisId(null);
    setActiveResult(null);
    setFlowError(null);
    setPollUntil(null);
    setPollTimedOut(false);
  };

  const handleRunAnalysis = async () => {
    if (!selectedMedia || !selectedMediaAvailability?.mediaType) return;
    if (!selectedMediaAvailability.isReady) return;
    if (!selectedFeatureState.available) {
      toast.error(
        selectedFeatureState.message || "This analysis is unavailable.",
      );
      return;
    }
    if (!analysisUsageGate.allowed) {
      toast.error(
        `You have reached your monthly analysis limit. Your limit resets on ${formatResetDate(
          subscriptionUsageQuery.data?.currentPeriod.endDate,
        )}.`,
      );
      return;
    }

    setFlowState("starting_analysis");
    setFlowError(null);
    setActiveAnalysisId(null);
    setActiveResult(null);
    setPollUntil(null);
    setPollTimedOut(false);
    scrollToCurrentAnalysis();

    try {
      const result = await startDetection.mutateAsync({
        mediaId: selectedMedia.id,
        mediaType: selectedMediaAvailability.mediaType,
      });

      setActiveAnalysisId(result.analysis.id);

      if (result.analysis.status === "completed") {
        setActiveResult(result.analysis);
        setFlowState("analysis_completed");
        toast.success("Analysis completed successfully.");
        return;
      }

      setFlowState(
        result.analysis.status === "processing"
          ? "analysis_processing"
          : "analysis_pending",
      );
      setPollUntil(Date.now() + 5 * 60 * 1000);
      toast.success("Analysis started. We will keep checking for updates.");
    } catch (error) {
      const denialState = getDeniedStateFromError(error);
      const friendlyMessage =
        denialState.kind === "limit"
          ? `You have reached your monthly analysis limit. Used ${denialState.used ?? analysisUsage?.used ?? 0} of ${denialState.limit ?? analysisUsage?.limit ?? 0}. Your limit resets on ${formatResetDate(
              denialState.resetsAt ||
                subscriptionUsageQuery.data?.currentPeriod.endDate,
            )}.`
          : denialState.kind === "plan" || denialState.kind === "unavailable"
            ? denialState.message
            : humanizeAnalysisError(
                (error as { response?: { data?: { message?: string } } })
                  ?.response?.data?.message || "Failed to start the analysis.",
                selectedMediaAvailability.mediaType,
              );
      setFlowState("analysis_failed");
      setFlowError(friendlyMessage);
      toast.error(friendlyMessage);
    }
  };

  const handleRefreshActiveAnalysis = async () => {
    if (!activeAnalysisId) return;

    try {
      const { data } = await statusQuery.refetch();
      if (data?.analysis.effectiveStatus === "completed") {
        await activeDetailQuery.refetch();
      }
    } catch {
      toast.error("Failed to refresh analysis status.");
    }
  };

  const renderResultMetrics = (analysis: AnalysisDetail) => {
    const confidence =
      typeof analysis.confidenceScore === "number"
        ? `${analysis.confidenceScore.toFixed(1)}%`
        : "Not available";
    const aiProbability =
      typeof analysis.aiGeneratedProbability === "number"
        ? `${analysis.aiGeneratedProbability.toFixed(1)}%`
        : "Not available";
    const risk =
      typeof analysis.riskScore === "number"
        ? `${analysis.riskScore.toFixed(1)}`
        : "Not available";

    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Confidence</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {confidence}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">AI probability</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {aiProbability}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Risk score</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{risk}</p>
        </div>
      </div>
    );
  };

  const renderActiveState = () => {
    if (flowState === "idle") {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
          <Bot className="size-10 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Choose media to begin
          </h3>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Select an image, video, or audio file from your library and run AI
            media analysis from one workspace.
          </p>
        </div>
      );
    }

    if (
      flowState === "media_selected" &&
      selectedMedia &&
      selectedMediaAvailability
    ) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                {getMediaTypeIcon(
                  selectedMediaAvailability.mediaType as AIMediaType,
                  "size-5",
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500">Selected media</p>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedMedia.filename}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {getMediaTypeLabel(
                    selectedMediaAvailability.mediaType as AIMediaType,
                  )}{" "}
                  detected • {formatFileSize(Number(selectedMedia.fileSize))}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <Badge
                className={cn("border", getStatusClasses(selectedMedia.status))}
                variant="outline"
              >
                {selectedMediaAvailability.isReady
                  ? "Ready to analyze"
                  : selectedMediaAvailability.reason}
              </Badge>
              <Button
                onClick={handleRunAnalysis}
                disabled={
                  !selectedMediaAvailability.isReady ||
                  !selectedFeatureState.available ||
                  !analysisUsageGate.allowed ||
                  startDetection.isPending
                }
                className="min-w-40"
              >
                {startDetection.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Run Analysis"
                )}
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Media type</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {getMediaTypeLabel(
                  selectedMediaAvailability.mediaType as AIMediaType,
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Library status</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {getStatusLabel(selectedMedia.status)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Uploaded</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {formatDateTime(String(selectedMedia.uploadedAt))}
              </p>
            </div>
          </div>
          {!selectedMediaAvailability.isReady && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              This media item is in your library, but it cannot be analyzed yet.
              Wait until library processing finishes, then run the analysis
              here.
            </div>
          )}
          {selectedMediaAvailability.isReady &&
            !selectedFeatureState.available && (
              <AccessNotice
                state={selectedFeatureState}
                message={
                  selectedFeatureState.message ||
                  "This analysis is currently unavailable for the selected media type."
                }
              />
            )}
          {selectedMediaAvailability.isReady &&
            selectedFeatureState.available &&
            !analysisUsageGate.allowed && (
              <AccessNotice
                tone="limit"
                message={getLimitReachedMessage(
                  "analysis",
                  subscriptionUsageQuery.data?.currentPeriod.endDate,
                )}
              />
            )}
        </div>
      );
    }

    if (
      flowState === "starting_analysis" ||
      flowState === "analysis_pending" ||
      flowState === "analysis_processing"
    ) {
      const queueStatus =
        statusQuery.data?.analysis.effectiveStatus ||
        statusQuery.data?.queue.status ||
        "pending";
      const progress = statusQuery.data?.queue.progress ?? 18;
      const queueMessage =
        flowState === "analysis_processing"
          ? "The analysis is currently working through the selected file."
          : flowState === "starting_analysis"
            ? "We are creating the analysis job and preparing the request."
            : "The analysis request has been accepted and is waiting to begin.";

      return (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Current analysis</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">
                {flowState === "analysis_processing"
                  ? "Analysis in progress"
                  : flowState === "starting_analysis"
                    ? "Preparing analysis"
                    : "Analysis queued"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {selectedMedia
                  ? `${selectedMedia.filename} is being processed.`
                  : queueMessage}
              </p>
            </div>
            <Badge
              className={cn("border", getStatusClasses(queueStatus))}
              variant="outline"
            >
              {getStatusLabel(queueStatus)}
            </Badge>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-slate-500" />
                {queueMessage}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Progress value={Math.min(progress, 100)} />
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4" />
                {statusQuery.data?.processing.processingMode ||
                  "Queued workflow"}
              </span>
              {typeof statusQuery.data?.queue.attemptsMade === "number" && (
                <span>Attempts: {statusQuery.data.queue.attemptsMade}</span>
              )}
            </div>
          </div>

          {pollTimedOut && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              We stopped automatic polling after 5 minutes. You can refresh the
              status manually to keep checking this analysis.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleRefreshActiveAnalysis}
              disabled={statusQuery.isFetching}
            >
              {statusQuery.isFetching ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  Refresh status
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    if (flowState === "analysis_failed") {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                Analysis failed
              </h3>
              <p className="mt-2 text-sm text-red-800">
                {flowError ||
                  "The analysis could not process this file. Please try a different file or check again later."}
              </p>
              <div className="mt-4 rounded-2xl border border-red-200/70 bg-white/60 p-4 text-sm text-red-900">
                If this persists, try another file or rerun the analysis later.
                Audio files are more likely to fail when support or content
                quality is limited.
              </div>
              {activeAnalysisId && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={handleRefreshActiveAnalysis}
                  >
                    <RefreshCw className="mr-2 size-4" />
                    Refresh status
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (flowState === "analysis_completed" && activeResult) {
      return (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="h-44 w-full overflow-hidden rounded-2xl border border-slate-200 lg:w-64">
              <AnalysisPreview analysis={activeResult} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className={cn(
                    "border px-3 py-1 text-sm",
                    getVerdictClasses(activeResult.predictedClass),
                  )}
                  variant="outline"
                >
                  {getVerdictLabel(activeResult.predictedClass)}
                </Badge>
                <Badge
                  className="border-slate-200 bg-slate-50 text-slate-700"
                  variant="outline"
                >
                  {getMediaTypeLabel(activeResult.mediaType)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500">Analysis result</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                  {activeResult.fileName}
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  {getVerdictDescription(activeResult.predictedClass)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                <span>
                  Analyzed{" "}
                  {formatDateTime(
                    activeResult.analysisCompletedAt || activeResult.updatedAt,
                  )}
                </span>
                {activeResult.modelInfo && (
                  <span>Model metadata available</span>
                )}
              </div>
            </div>
          </div>

          {renderResultMetrics(activeResult)}

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setDetailAnalysisId(activeResult.id)}
            >
              View details
            </Button>
            {selectedMediaAvailability?.isReady && (
              <Button onClick={handleRunAnalysis}>Run again</Button>
            )}
            <Button
              variant="outline"
              onClick={() => analysisHistoryQuery.refetch()}
            >
              Refresh analyses
            </Button>
          </div>
        </div>
      );
    }

    if (flowState === "analysis_completed" && activeDetailQuery.isLoading) {
      return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          <Loader2 className="size-5 animate-spin" />
          Loading completed analysis details...
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <section className="flex flex-1 flex-col gap-6 px-4 py-4 sm:px-6 md:px-8">
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
              <Bot className="size-4" />
              AI Media Detection
            </div>
            {presetModeLabel ? (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">
                <Sparkles className="size-4" />
                {presetModeLabel} Mode
              </div>
            ) : null}
          </div>
          <h1 className="text-responsive-2xl font-medium text-slate-950">
            AI-Generated Media Detection
          </h1>
          <p className="max-w-3xl text-sm text-slate-500">
            {getPresetModeDescription(mediaFilter)}
          </p>
        </header>

        <UsageSummaryBanner
          bucket={analysisUsage}
          label="Analyses used this month"
          resetAt={subscriptionUsageQuery.data?.currentPeriod.endDate}
        />

        <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
          <Card className="overflow-hidden py-0">
            <CardHeader className="border-b border-slate-200 bg-slate-50/70 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Select media from your library</CardTitle>
                  <CardDescription>
                    {presetModeLabel
                      ? `Browse your ${presetModeLabel.toLowerCase()} library and choose a file to analyze.`
                      : "Search your uploaded media, filter by type, and choose a file to analyze."}
                  </CardDescription>
                </div>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/dashboard">
                    <Upload className="mr-2 size-4" />
                    Upload Media
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 px-6 py-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    {getScopedStatsLabel(mediaFilter)}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {libraryStats.supported}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    {getScopedReadyLabel(mediaFilter)}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {libraryStats.ready}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Current filter</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {
                      MEDIA_FILTERS.find((item) => item.value === mediaFilter)
                        ?.label
                    }
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={librarySearch}
                    onChange={(event) => setLibrarySearch(event.target.value)}
                    placeholder="Search by filename or type"
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {lockedMediaMode ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                      <Filter className="size-4" />
                      {getPresetModeLabel(lockedMediaMode)}
                    </div>
                  ) : (
                    MEDIA_FILTERS.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={
                          mediaFilter === filter.value ? "default" : "outline"
                        }
                        onClick={() => updateMediaFilter(filter.value)}
                        className="min-w-20"
                      >
                        {filter.label}
                      </Button>
                    ))
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/70">
                <div className="border-b border-slate-200 bg-white/80 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">
                    Browse media
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Pick one file from the tray below. The selection stays
                    pinned after you scroll.
                  </p>
                </div>

                <div className="h-[24rem] overflow-y-auto p-4">
                  {mediaQuery.isLoading ? (
                    <div className="flex h-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-600">
                      <Loader2 className="size-4 animate-spin" />
                      Loading library items...
                    </div>
                  ) : filteredMedia.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          No media available
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Upload media to your library first, then return here
                          to run AI media analysis.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {filteredMedia.map((media) => {
                        const availability = getMediaAvailability(media);
                        const isSelected = selectedMediaId === media.id;

                        return (
                          <button
                            key={media.id}
                            type="button"
                            onClick={() => handleSelectMedia(media.id)}
                            className={cn(
                              "group overflow-hidden rounded-2xl border text-left transition-all duration-200",
                              isSelected
                                ? "border-blue-500 bg-white shadow-md ring-2 ring-blue-100"
                                : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm",
                            )}
                          >
                            <div className="relative h-28 border-b border-slate-200 bg-slate-100">
                              <MediaThumbnail media={media} />
                              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/15 via-slate-950/5 to-transparent" />
                              <div className="absolute left-3 top-3">
                                <Badge
                                  className={cn(
                                    "border shadow-sm backdrop-blur",
                                    availability.isReady
                                      ? "border-emerald-200 bg-white/95 text-emerald-700"
                                      : "border-slate-200 bg-white/95 text-slate-700",
                                  )}
                                  variant="outline"
                                >
                                  {availability.isReady
                                    ? "Ready"
                                    : availability.reason ||
                                      getStatusLabel(media.status)}
                                </Badge>
                              </div>
                              {isSelected && (
                                <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                                  <CheckCircle2 className="size-4" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-2.5 p-3.5">
                              <div>
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {media.filename}
                                </p>
                                <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                  {availability.mediaType && (
                                    <>
                                      {getMediaTypeIcon(
                                        availability.mediaType,
                                        "size-3.5",
                                      )}
                                      <span>
                                        {getMediaTypeLabel(
                                          availability.mediaType,
                                        )}
                                      </span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span>
                                    {formatFileSize(Number(media.fileSize))}
                                  </span>
                                </p>
                              </div>

                              <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                                <span>{timeAgo(media.uploadedAt)}</span>
                                <span
                                  className={cn(
                                    "truncate transition-colors",
                                    isSelected
                                      ? "text-blue-700"
                                      : "text-slate-500 group-hover:text-slate-700",
                                  )}
                                >
                                  {getStatusLabel(media.status)}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 bg-white p-3">
                  {selectedMedia && selectedMediaAvailability ? (
                    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <MediaThumbnail media={selectedMedia} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                            Selected file
                          </p>
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {selectedMedia.filename}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              {getMediaTypeIcon(
                                selectedMediaAvailability.mediaType as AIMediaType,
                                "size-3.5",
                              )}
                              {getMediaTypeLabel(
                                selectedMediaAvailability.mediaType as AIMediaType,
                              )}
                            </span>
                            <span>•</span>
                            <span>
                              {formatFileSize(Number(selectedMedia.fileSize))}
                            </span>
                            <span>•</span>
                            <span>{getStatusLabel(selectedMedia.status)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <Badge
                          className={cn(
                            "border",
                            getStatusClasses(selectedMedia.status),
                          )}
                          variant="outline"
                        >
                          {selectedMediaAvailability.isReady
                            ? "Ready to analyze"
                            : selectedMediaAvailability.reason}
                        </Badge>
                        <Button
                          onClick={handleRunAnalysis}
                          disabled={
                            !selectedMediaAvailability.isReady ||
                            startDetection.isPending
                          }
                          size="sm"
                          className="min-w-36"
                        >
                          {startDetection.isPending ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Starting...
                            </>
                          ) : (
                            "Run Analysis"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Choose a file to continue
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Your selected media will stay pinned here while you
                          browse the tray above.
                        </p>
                      </div>
                      <Button disabled size="sm" className="min-w-36">
                        Run Analysis
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardHeader className="border-b border-slate-200 bg-slate-50/70 py-5">
              <CardTitle>How it works</CardTitle>
              <CardDescription>
                AI Media Detection is separate from provenance and authenticity
                checks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-6 py-6">
              <div className="space-y-4">
                {[
                  "Select media from your library",
                  "We identify whether it is image, video, or audio",
                  "We run the correct detection workflow for that media type",
                  "You receive a verdict, confidence score, and analysis details",
                ].map((step, index) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm text-slate-600">{step}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Product distinction
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Use this page for model-based AI generation and manipulation
                  detection. Use Authenticity for provenance, integrity,
                  metadata, and C2PA-related checks.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Image results are usually faster. Video and audio analyses may
                spend longer in queue or analysis processing.
              </div>
              {!deepfakeAccessState.available && (
                <AccessNotice
                  state={deepfakeAccessState}
                  message={
                    deepfakeAccessState.message ||
                    "AI media detection is currently unavailable."
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>

        <Card ref={currentAnalysisRef} className="scroll-mt-24 py-0">
          <CardHeader className="border-b border-slate-200 bg-slate-50/70 py-5">
            <CardTitle>Current analysis</CardTitle>
            <CardDescription>
              Follow the active AI media analysis workflow from selection to
              result.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6">{renderActiveState()}</CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="border-b border-slate-200 bg-slate-50/70 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>
                  Your latest AI media detection runs across image, video, and
                  audio.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => analysisHistoryQuery.refetch()}
              >
                <RefreshCw className="mr-2 size-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={analysisSearch}
                    onChange={(event) => setAnalysisSearch(event.target.value)}
                    placeholder="Search analyses by filename, verdict, or type"
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <Filter className="size-4" />
                    Status
                  </span>
                  {ANALYSIS_STATUS_FILTERS.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={
                        analysisStatusFilter === filter.value
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setAnalysisStatusFilter(filter.value)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {analysisHistoryQuery.isLoading ? (
              <div className="flex items-center gap-3 px-6 py-6 text-sm text-slate-600">
                <Loader2 className="size-4 animate-spin" />
                Loading recent analyses...
              </div>
            ) : recentAnalyses.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  No matching analyses
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {analysisHistoryQuery.data?.analyses?.length
                    ? "Try changing the search or status filter."
                    : "Select an image, video, or audio file from your library to see results here."}
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Media</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verdict</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Analyzed</TableHead>
                      <TableHead className="pr-6 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAnalyses.map((analysis) => (
                      <TableRow key={analysis.id}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                              {analysis.thumbnailUrl &&
                              analysis.mediaType !== "audio" ? (
                                <img
                                  src={analysis.thumbnailUrl}
                                  alt={analysis.fileName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                getMediaTypeIcon(
                                  analysis.mediaType as AIMediaType,
                                  "size-4 text-slate-500",
                                )
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900">
                                {analysis.fileName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatDateTime(analysis.uploadDate)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="border-slate-200 bg-slate-50 text-slate-700"
                            variant="outline"
                          >
                            {getMediaTypeLabel(
                              analysis.mediaType as AIMediaType,
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "border",
                              getStatusClasses(analysis.status),
                            )}
                            variant="outline"
                          >
                            {getStatusLabel(analysis.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "border",
                              getVerdictClasses(analysis.predictedClass),
                            )}
                            variant="outline"
                          >
                            {getVerdictLabel(analysis.predictedClass)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {typeof analysis.confidenceScore === "number"
                            ? `${analysis.confidenceScore.toFixed(1)}%`
                            : "Not available"}
                        </TableCell>
                        <TableCell>
                          {timeAgo(new Date(analysis.createdAt))}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDetailAnalysisId(analysis.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {analysisPagination && (
                  <div className="border-t border-slate-200 px-6 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-slate-500">
                        Page {analysisPagination.page} of{" "}
                        {analysisPagination.totalPages} •{" "}
                        {analysisPagination.total} analyses
                      </p>

                      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(event) => {
                                event.preventDefault();
                                if (!analysisPagination.hasPrevPage) return;
                                setAnalysisPage((current) => current - 1);
                              }}
                              aria-disabled={!analysisPagination.hasPrevPage}
                              className={
                                !analysisPagination.hasPrevPage
                                  ? "pointer-events-none opacity-50"
                                  : undefined
                              }
                            />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(event) => {
                                event.preventDefault();
                                if (!analysisPagination.hasNextPage) return;
                                setAnalysisPage((current) => current + 1);
                              }}
                              aria-disabled={!analysisPagination.hasNextPage}
                              className={
                                !analysisPagination.hasNextPage
                                  ? "pointer-events-none opacity-50"
                                  : undefined
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <Sheet
        open={Boolean(detailAnalysisId)}
        onOpenChange={(open) => !open && setDetailAnalysisId(null)}
      >
        <SheetContent className="w-full gap-0 overflow-y-auto bg-slate-50/80 p-0 sm:max-w-3xl">
          <SheetHeader className="border-b border-slate-200 bg-white px-6 py-5 pr-14 sm:px-7">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Analysis details
            </p>
            <SheetTitle className="text-xl text-slate-950">
              Result breakdown
            </SheetTitle>
            <SheetDescription className="max-w-2xl text-sm text-slate-500">
              Review the verdict, confidence signals, timing, and technical
              metadata for this analysis run.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-6 py-6 sm:px-7 sm:py-7">
            {detailQuery.isLoading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-600 shadow-sm">
                <Loader2 className="size-4 animate-spin" />
                Loading analysis details...
              </div>
            ) : detailQuery.data ? (
              <>
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="h-64 bg-slate-50">
                    <AnalysisPreview analysis={detailQuery.data} />
                  </div>
                  <div className="border-t border-slate-200 px-6 py-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        className={cn(
                          "border px-3 py-1 text-sm",
                          getVerdictClasses(detailQuery.data.predictedClass),
                        )}
                        variant="outline"
                      >
                        {getVerdictLabel(detailQuery.data.predictedClass)}
                      </Badge>
                      <Badge
                        className="border-slate-200 bg-slate-50 text-slate-700"
                        variant="outline"
                      >
                        {getMediaTypeLabel(detailQuery.data.mediaType)}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                      {detailQuery.data.fileName}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {getVerdictDescription(detailQuery.data.predictedClass)}
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                          Status
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {getStatusLabel(detailQuery.data.status)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                          Model
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {getModelLabel(detailQuery.data.modelInfo)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                          Completed
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {formatDateTime(
                            detailQuery.data.analysisCompletedAt ||
                              detailQuery.data.updatedAt,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Core metrics
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Primary scores surfaced from the completed analysis.
                    </p>
                  </div>
                  {renderResultMetrics(detailQuery.data)}
                </div>

                <Card className="overflow-hidden rounded-3xl border-slate-200 py-0 shadow-sm">
                  <CardHeader className="border-b border-slate-200 bg-slate-50/70 py-4">
                    <CardTitle>Analysis summary</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 py-3">
                    <DetailRow
                      label="Status"
                      value={getStatusLabel(detailQuery.data.status)}
                    />
                    <DetailRow
                      label="Analyzed at"
                      value={formatDateTime(
                        detailQuery.data.analysisCompletedAt ||
                          detailQuery.data.updatedAt,
                      )}
                    />
                    <DetailRow
                      label="Uploaded at"
                      value={formatDateTime(detailQuery.data.uploadDate)}
                    />
                    <DetailRow
                      label="Model"
                      value={getModelLabel(detailQuery.data.modelInfo)}
                    />
                  </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-3xl border-slate-200 py-0 shadow-sm">
                  <CardHeader className="border-b border-slate-200 bg-slate-50/70 py-4">
                    <CardTitle>Technical details</CardTitle>
                    <CardDescription>
                      Generic model output and detection data for deeper review.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 px-6 py-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-900">
                        Model info
                      </p>
                      <pre className="max-h-72 overflow-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-100 shadow-inner">
                        {JSON.stringify(
                          detailQuery.data.modelInfo || {},
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-900">
                        Detection features
                      </p>
                      <pre className="max-h-80 overflow-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-100 shadow-inner">
                        {JSON.stringify(
                          detailQuery.data.detectionFeatures || {},
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-800 shadow-sm">
                We could not load the analysis details for this item.
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
