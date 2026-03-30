/** biome-ignore-all lint/performance/noImgElement: <> */
"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileAudio,
  FileImage,
  Filter,
  Loader2,
  Search,
  Shield,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AccessNotice } from "@/components/subscription/AccessNotice";
import { UsageSummaryBanner } from "@/components/subscription/UsageSummaryBanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  type ForensicsAnalysisDetail,
  type ForensicsFinding,
  type ForensicsMediaType,
  getForensicsMediaType,
  useForensicsDetail,
  useStartForensics,
} from "@/hooks/useForensics";
import { type Media, useGetMedia } from "@/hooks/useMedia";
import { useSubscriptionUsage } from "@/hooks/useSubscriptionUsage";
import {
  formatResetDate,
  getCombinedFeatureState,
  getDeniedStateFromError,
  getFeatureState,
  getUsageGate,
  type ProductFeatureKey,
} from "@/lib/subscription-access";
import { cn, formatFileSize, timeAgo } from "@/lib/utils";

type MediaFilter = "all" | ForensicsMediaType | "video";
type FlowState =
  | "idle"
  | "media_selected"
  | "creating_forensic_analysis"
  | "completed"
  | "failed";

const READY_MEDIA_STATUSES = new Set(["uploaded", "processed"]);

const MEDIA_FILTERS: Array<{ label: string; value: MediaFilter }> = [
  { label: "All", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Audio", value: "audio" },
];

function getForensicsFeatureKey(
  mediaType?: ForensicsMediaType | null,
): ProductFeatureKey | null {
  switch (mediaType) {
    case "image":
      return "forensicsImage";
    case "audio":
      return "forensicsAudio";
    default:
      return null;
  }
}

function getMediaTypeLabel(mediaType: ForensicsMediaType) {
  return mediaType === "image" ? "Image" : "Audio";
}

function getMediaTypeIcon(mediaType: ForensicsMediaType, className?: string) {
  const iconClassName = cn("size-4", className);
  return mediaType === "image" ? (
    <FileImage className={iconClassName} />
  ) : (
    <FileAudio className={iconClassName} />
  );
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
      return "Run forensic analysis on image files from your library.";
    case "audio":
      return "Run forensic analysis on audio files from your library.";
    case "video":
      return "Browse video files in your library. Video forensics is not available yet.";
    default:
      return "Run forensic analysis on existing image and audio files from your library. Video forensics is planned later.";
  }
}

function getScopedLibraryLabel(filter: MediaFilter) {
  switch (filter) {
    case "image":
      return "Image files";
    case "video":
      return "Video files";
    case "audio":
      return "Audio files";
    default:
      return "Library files";
  }
}

function getScopedSupportedLabel(filter: MediaFilter) {
  switch (filter) {
    case "image":
      return "Supported images";
    case "video":
      return "Supported now";
    case "audio":
      return "Supported audio";
    default:
      return "Supported";
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
      return "Ready now";
  }
}

function getMediaAvailability(media: Media) {
  const mediaType = getForensicsMediaType(media.mimeType);
  const normalizedStatus = media.status.toLowerCase();
  const isSupported = Boolean(mediaType);
  const isReady = isSupported && READY_MEDIA_STATUSES.has(normalizedStatus);

  let reason = "";
  if (!isSupported) {
    reason = media.mimeType.startsWith("video/")
      ? "Video forensics is not available yet"
      : "Unsupported media type";
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

function formatPercentage(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "Not available";
  }

  return `${Math.round(value * 100)}%`;
}

function getVerdictClasses(verdict?: string) {
  switch ((verdict || "").toLowerCase()) {
    case "likely_authentic":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "likely_tampered":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "tampered":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getSeverityClasses(severity?: string) {
  switch ((severity || "").toLowerCase()) {
    case "high":
      return "border-red-200 bg-red-50 text-red-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "low":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getForensicsErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "The forensic analysis could not be completed for this file.";
}

function renderMediaPreview(media: Media, className?: string) {
  const forensicMediaType = getForensicsMediaType(media.mimeType);
  const thumbnailUrl = media.thumbnailUrl || media.publicUrl;

  if (forensicMediaType === "image" && thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt={media.filename}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-2xl bg-slate-100",
        className,
      )}
    >
      {forensicMediaType === "image" ? (
        <FileImage className="size-8 text-slate-500" />
      ) : (
        <FileAudio className="size-8 text-slate-500" />
      )}
    </div>
  );
}

function FindingCard({ finding }: { finding: ForensicsFinding }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-slate-900">
            {finding.title}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Module: {finding.module}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            className={cn("border", getSeverityClasses(finding.severity))}
            variant="outline"
          >
            {finding.severity || "Unknown"}
          </Badge>
          <Badge
            variant="outline"
            className="border-slate-200 bg-slate-50 text-slate-600"
          >
            Confidence {formatPercentage(finding.confidence)}
          </Badge>
        </div>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {finding.description}
      </p>
      {finding.timestamp_s !== undefined ? (
        <div className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          Timestamp {finding.timestamp_s}s
        </div>
      ) : null}
    </div>
  );
}

export function ForensicsWorkspace() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [searchValue, setSearchValue] = useState("");
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [latestAnalysis, setLatestAnalysis] =
    useState<ForensicsAnalysisDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const deferredSearchValue = useDeferredValue(searchValue);
  const subscriptionUsageQuery = useSubscriptionUsage();
  const mediaQuery = useGetMedia({
    page: 1,
    limit: 60,
    sort: "uploadedAt",
  });
  const startForensics = useStartForensics();
  const detailQuery = useForensicsDetail(analysisId, {
    enabled: flowState === "completed",
  });
  const presetModeLabel = getPresetModeLabel(mediaFilter);

  useEffect(() => {
    const mediaParam = searchParams.get("media");

    if (
      mediaParam === "image" ||
      mediaParam === "video" ||
      mediaParam === "audio"
    ) {
      setMediaFilter(mediaParam);
      return;
    }

    setMediaFilter("all");
  }, [searchParams]);

  const allMedia = mediaQuery.data?.media ?? [];
  const selectedMedia =
    allMedia.find((item) => item.id === selectedMediaId) ?? null;
  const selectedAvailability = selectedMedia
    ? getMediaAvailability(selectedMedia)
    : null;
  const forensicsAccessState = getCombinedFeatureState(
    subscriptionUsageQuery.data,
    ["forensicsImage", "forensicsAudio"],
  );
  const selectedFeatureState = selectedAvailability?.mediaType
    ? getFeatureState(
        subscriptionUsageQuery.data,
        getForensicsFeatureKey(
          selectedAvailability.mediaType,
        ) as ProductFeatureKey,
      )
    : forensicsAccessState;
  const analysisUsage = subscriptionUsageQuery.data?.usage.analyses;
  const analysisUsageGate = getUsageGate(analysisUsage);

  const filteredMedia = useMemo(() => {
    const normalizedSearch = deferredSearchValue.trim().toLowerCase();

    return allMedia.filter((media) => {
      const availability = getMediaAvailability(media);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        media.filename.toLowerCase().includes(normalizedSearch);
      const matchesFilter =
        mediaFilter === "all" ||
        availability.mediaType === mediaFilter ||
        (mediaFilter === "video" && media.mimeType.startsWith("video/"));

      return matchesSearch && matchesFilter;
    });
  }, [allMedia, deferredSearchValue, mediaFilter]);

  const scopedLibraryCount = allMedia.filter((media) => {
    const availability = getMediaAvailability(media);
    return (
      mediaFilter === "all" ||
      availability.mediaType === mediaFilter ||
      (mediaFilter === "video" && media.mimeType.startsWith("video/"))
    );
  }).length;
  const supportedMediaCount = allMedia.filter((media) => {
    const availability = getMediaAvailability(media);
    const matchesFilter =
      mediaFilter === "all" ||
      availability.mediaType === mediaFilter ||
      (mediaFilter === "video" && media.mimeType.startsWith("video/"));

    return matchesFilter && availability.isSupported;
  }).length;
  const readyMediaCount = allMedia.filter((media) => {
    const availability = getMediaAvailability(media);
    const matchesFilter =
      mediaFilter === "all" ||
      availability.mediaType === mediaFilter ||
      (mediaFilter === "video" && media.mimeType.startsWith("video/"));

    return matchesFilter && availability.isReady;
  }).length;
  const activeAnalysis = detailQuery.data ?? latestAnalysis;

  const updateMediaFilter = (nextFilter: MediaFilter) => {
    setMediaFilter(nextFilter);

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

  useEffect(() => {
    if (!selectedMedia || !selectedAvailability) {
      return;
    }

    const isVideoSelection = selectedMedia.mimeType.startsWith("video/");
    const isCompatible =
      mediaFilter === "all" ||
      selectedAvailability.mediaType === mediaFilter ||
      (mediaFilter === "video" && isVideoSelection);

    if (isCompatible) {
      return;
    }

    setSelectedMediaId(null);
    setFlowState("idle");
    setAnalysisId(null);
    setLatestAnalysis(null);
    setErrorMessage(null);
  }, [mediaFilter, selectedAvailability, selectedMedia]);

  const handleSelectMedia = (media: Media) => {
    const isDifferentSelection = media.id !== selectedMediaId;

    setSelectedMediaId(media.id);
    setErrorMessage(null);
    if (isDifferentSelection) {
      setLatestAnalysis(null);
      setAnalysisId(null);
    }
    if (flowState !== "creating_forensic_analysis") {
      setFlowState("media_selected");
    }
  };

  const handleRunForensics = async () => {
    if (
      !selectedMedia ||
      !selectedAvailability?.mediaType ||
      !selectedAvailability.isReady
    ) {
      return;
    }
    if (!selectedFeatureState.available) {
      setErrorMessage(
        selectedFeatureState.message ||
          "This forensic workflow is unavailable.",
      );
      setFlowState("failed");
      return;
    }
    if (!analysisUsageGate.allowed) {
      setErrorMessage(
        `You have reached your monthly analysis limit. Your limit resets on ${formatResetDate(
          subscriptionUsageQuery.data?.currentPeriod.endDate,
        )}.`,
      );
      setFlowState("failed");
      return;
    }

    setFlowState("creating_forensic_analysis");
    setErrorMessage(null);
    setLatestAnalysis(null);
    setAnalysisId(null);

    try {
      const analysis = await startForensics.mutateAsync({
        mediaId: selectedMedia.id,
        mediaType: selectedAvailability.mediaType,
      });

      setLatestAnalysis(analysis);
      setAnalysisId(analysis.id);
      setFlowState("completed");
    } catch (error) {
      const denialState = getDeniedStateFromError(error);
      setErrorMessage(
        denialState.kind === "limit"
          ? `You have reached your monthly analysis limit. Used ${denialState.used ?? analysisUsage?.used ?? 0} of ${denialState.limit ?? analysisUsage?.limit ?? 0}. Your limit resets on ${formatResetDate(
              denialState.resetsAt ||
                subscriptionUsageQuery.data?.currentPeriod.endDate,
            )}.`
          : denialState.kind === "plan" || denialState.kind === "unavailable"
            ? denialState.message
            : getForensicsErrorMessage(error),
      );
      setFlowState("failed");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
            <Shield className="size-4" />
            Forensics
          </div>
          {presetModeLabel ? (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
              <Sparkles className="size-4" />
              {presetModeLabel} Mode
            </div>
          ) : null}
        </div>
        <h1 className="text-responsive-2xl font-medium text-slate-950">
          Forensic Analysis
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50/80">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl text-slate-900">
                  Select media from your library
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-7 text-slate-600">
                  {presetModeLabel
                    ? `${getPresetModeDescription(mediaFilter)} Select a file to continue.`
                    : "Run forensic analysis on existing image and audio files from your library. Video forensics is planned later."}
                </CardDescription>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <Link href="/dashboard">
                  <Upload className="size-4" />
                  Upload Media
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {getScopedLibraryLabel(mediaFilter)}
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {scopedLibraryCount}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {getScopedSupportedLabel(mediaFilter)}
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {supportedMediaCount}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {getScopedReadyLabel(mediaFilter)}
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {readyMediaCount}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search your library"
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <Filter className="size-3.5" />
                  Filter
                </div>
                {MEDIA_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => updateMediaFilter(filter.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      mediaFilter === filter.value
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-3">
              {mediaQuery.isLoading ? (
                <div className="flex h-72 items-center justify-center rounded-[1.25rem] bg-white">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <Loader2 className="size-4 animate-spin" />
                    Loading library media
                  </div>
                </div>
              ) : filteredMedia.length > 0 ? (
                <div className="grid max-h-[28rem] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                  {filteredMedia.map((media) => {
                    const availability = getMediaAvailability(media);
                    const isSelected = selectedMediaId === media.id;

                    return (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() => handleSelectMedia(media)}
                        className={cn(
                          "overflow-hidden rounded-[1.25rem] border text-left transition-all duration-200",
                          isSelected
                            ? "border-blue-300 bg-blue-50 shadow-md shadow-blue-100"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
                          !availability.isSupported && "opacity-70",
                        )}
                      >
                        <div className="relative h-32 overflow-hidden border-b border-slate-100 bg-slate-100">
                          {availability.mediaType ? (
                            renderMediaPreview(media, "rounded-none")
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <AlertCircle className="size-8 text-slate-400" />
                            </div>
                          )}
                          <div className="absolute left-3 top-3 flex items-center gap-2">
                            {availability.mediaType ? (
                              <Badge
                                variant="outline"
                                className="border-white/80 bg-white/90 text-slate-700"
                              >
                                {getMediaTypeIcon(availability.mediaType)}
                                {getMediaTypeLabel(availability.mediaType)}
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-white/80 bg-white/90 text-slate-700"
                              >
                                Unsupported
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3 p-4">
                          <div className="min-w-0">
                            <div className="truncate text-base font-semibold text-slate-900">
                              {media.filename}
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                              {formatFileSize(Number(media.fileSize))} •{" "}
                              {timeAgo(media.uploadedAt)}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "border",
                                availability.isReady
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-slate-50 text-slate-600",
                              )}
                            >
                              {availability.isReady
                                ? "Ready"
                                : availability.reason}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-72 flex-col items-center justify-center rounded-[1.25rem] bg-white px-6 text-center">
                  <div className="rounded-full bg-slate-100 p-4">
                    <Shield className="size-6 text-slate-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    No supported media found
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
                    Upload an image or audio file to your library first, then
                    return here to run forensic analysis.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard">
                      <Upload className="size-4" />
                      Upload Media
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              {selectedMedia && selectedAvailability ? (
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      {selectedAvailability.mediaType ? (
                        renderMediaPreview(selectedMedia)
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <AlertCircle className="size-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold text-slate-900">
                        {selectedMedia.filename}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        {selectedAvailability.mediaType ? (
                          <span className="inline-flex items-center gap-1.5">
                            {getMediaTypeIcon(selectedAvailability.mediaType)}
                            {getMediaTypeLabel(selectedAvailability.mediaType)}
                          </span>
                        ) : null}
                        <span>•</span>
                        <span>
                          {formatFileSize(Number(selectedMedia.fileSize))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch gap-2 lg:items-end">
                    {!selectedAvailability.isReady ? (
                      <div className="text-sm font-medium text-slate-500">
                        {selectedAvailability.reason}
                      </div>
                    ) : !selectedFeatureState.available ? (
                      <div className="text-sm font-medium text-slate-500">
                        {selectedFeatureState.message}
                      </div>
                    ) : !analysisUsageGate.allowed ? (
                      <div className="text-sm font-medium text-red-700">
                        Monthly analysis limit reached
                      </div>
                    ) : null}
                    <Button
                      onClick={handleRunForensics}
                      disabled={
                        !selectedAvailability.isReady ||
                        !selectedFeatureState.available ||
                        !analysisUsageGate.allowed ||
                        startForensics.isPending
                      }
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {startForensics.isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Running Forensics
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-4" />
                          Run Forensic Analysis
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-base font-semibold text-slate-900">
                      Choose a file to continue
                    </div>
                    <p className="mt-1 text-sm leading-7 text-slate-500">
                      Select an image or audio file from your library to begin.
                    </p>
                  </div>
                  <Button disabled className="bg-blue-600 text-white">
                    Run Forensic Analysis
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">
                How it works
              </CardTitle>
              <CardDescription className="leading-7 text-slate-600">
                Forensics is a separate workflow from AI Media Detection. It
                focuses on forensic findings, probability, confidence, and
                evidence-oriented outputs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
              {[
                "Select an image or audio file from your library.",
                "We submit the selected media record to the forensic service.",
                "You receive a verdict, summary, confidence, probability, and findings.",
                "Video and frame forensics are planned later and are not part of Phase 1.",
              ].map((step, index) => (
                <div key={step} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                    {index + 1}
                  </div>
                  <p>{step}</p>
                </div>
              ))}
              {!forensicsAccessState.available ? (
                <AccessNotice
                  state={forensicsAccessState}
                  message={
                    forensicsAccessState.message ||
                    "Forensics is currently unavailable."
                  }
                />
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">
                Current scope
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Image forensics
                </span>
                <Badge
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  variant="outline"
                >
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Audio forensics
                </span>
                <Badge
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  variant="outline"
                >
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Video and frame forensics
                </span>
                <Badge
                  className="border-amber-200 bg-amber-50 text-amber-700"
                  variant="outline"
                >
                  Planned later
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900">
            Forensic Analysis
          </CardTitle>
          <CardDescription className="leading-7 text-slate-600">
            Review the current forensic result, summary, and findings for the
            selected media.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {flowState === "idle" && (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
              <Shield className="mx-auto size-10 text-slate-400" />
              <div className="mt-4 text-lg font-semibold text-slate-900">
                Select media to begin
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Choose an image or audio file from your library to run forensic
                analysis.
              </p>
            </div>
          )}

          {flowState === "media_selected" && selectedMedia ? (
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 px-6 py-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    Ready to analyze
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                    {selectedMedia.filename} is selected. Run forensic analysis
                    to review verdict, summary, confidence, probability, and
                    findings.
                  </p>
                </div>
                {selectedAvailability?.mediaType ? (
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-700"
                  >
                    {getMediaTypeIcon(selectedAvailability.mediaType)}
                    {getMediaTypeLabel(selectedAvailability.mediaType)}
                  </Badge>
                ) : null}
              </div>
            </div>
          ) : null}

          {flowState === "creating_forensic_analysis" && (
            <div className="rounded-[1.5rem] border border-blue-200 bg-blue-50/70 px-6 py-12 text-center">
              <Loader2 className="mx-auto size-10 animate-spin text-blue-600" />
              <div className="mt-4 text-lg font-semibold text-slate-900">
                Running forensic analysis
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                We are submitting the selected media for forensic review. This
                Phase 1 flow is synchronous, so the result should return here
                directly.
              </p>
            </div>
          )}

          {flowState === "failed" && (
            <div className="rounded-[1.5rem] border border-red-200 bg-red-50/70 px-6 py-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
                <div>
                  <div className="text-lg font-semibold text-red-700">
                    Forensic analysis failed
                  </div>
                  <p className="mt-2 text-sm leading-7 text-red-700/90">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {flowState === "completed" && activeAnalysis ? (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
                  <div className="aspect-[4/3] overflow-hidden">
                    {activeAnalysis.mediaType === "image" &&
                    activeAnalysis.previewUrl ? (
                      <img
                        src={activeAnalysis.previewUrl}
                        alt={activeAnalysis.fileName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100">
                        {activeAnalysis.mediaType === "image" ? (
                          <FileImage className="size-10 text-slate-500" />
                        ) : (
                          <FileAudio className="size-10 text-slate-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border px-3 py-1 text-sm font-semibold",
                          getVerdictClasses(activeAnalysis.forensics.verdict),
                        )}
                      >
                        {activeAnalysis.forensics.verdictLabel || "No verdict"}
                      </Badge>
                      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                        {activeAnalysis.forensics.verdictLabel ||
                          "Forensic result unavailable"}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                        {activeAnalysis.forensics.summary ||
                          "No forensic summary was returned for this analysis."}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-slate-50 text-slate-700"
                    >
                      {activeAnalysis.mediaType === "image" ? (
                        <FileImage className="size-4" />
                      ) : (
                        <FileAudio className="size-4" />
                      )}
                      {activeAnalysis.mediaType === "image" ? "Image" : "Audio"}
                    </Badge>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        label: "Confidence",
                        value: formatPercentage(
                          activeAnalysis.forensics.confidence,
                        ),
                      },
                      {
                        label: "Probability",
                        value: formatPercentage(
                          activeAnalysis.forensics.probability,
                        ),
                      },
                      {
                        label: "Findings",
                        value: String(activeAnalysis.forensics.findings.length),
                      },
                      {
                        label: "Mode",
                        value:
                          activeAnalysis.processing.processingMode ||
                          "Not available",
                      },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {metric.label}
                        </div>
                        <div className="mt-2 text-xl font-semibold text-slate-900">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
                <Card className="border-slate-200 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900">
                      Findings
                    </CardTitle>
                    <CardDescription>
                      Review the forensic findings returned for this media.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeAnalysis.forensics.findings.length > 0 ? (
                      activeAnalysis.forensics.findings.map((finding) => (
                        <FindingCard
                          key={`${finding.module}-${finding.title}`}
                          finding={finding}
                        />
                      ))
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-6">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                          <div>
                            <div className="text-base font-semibold text-slate-900">
                              No major findings returned
                            </div>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              This analysis completed without detailed forensic
                              findings in the response payload.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900">
                      Analysis details
                    </CardTitle>
                    <CardDescription>
                      Processing metadata and file-level forensic details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-3">
                      {[
                        {
                          label: "Status",
                          value: activeAnalysis.status,
                        },
                        {
                          label: "Started",
                          value: formatDateTime(
                            activeAnalysis.analysisStartedAt,
                          ),
                        },
                        {
                          label: "Completed",
                          value: formatDateTime(
                            activeAnalysis.analysisCompletedAt,
                          ),
                        },
                        {
                          label: "Processing time",
                          value: activeAnalysis.processing.processingMetadata
                            ?.processingTimeMs
                            ? `${activeAnalysis.processing.processingMetadata.processingTimeMs} ms`
                            : "Not available",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
                        >
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {item.label}
                          </div>
                          <div className="mt-1 text-sm font-medium text-slate-900">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="file">
                        <AccordionTrigger>File and processing</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-600">
                            <div>
                              <span className="font-semibold text-slate-900">
                                Filename:
                              </span>{" "}
                              {activeAnalysis.fileName}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900">
                                File size:
                              </span>{" "}
                              {formatFileSize(activeAnalysis.fileSize)}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900">
                                MIME type:
                              </span>{" "}
                              {activeAnalysis.mimeType}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900">
                                Processing mode:
                              </span>{" "}
                              {activeAnalysis.processing.processingMode ||
                                "Not available"}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900">
                                SHA-256:
                              </span>{" "}
                              {activeAnalysis.forensics.file?.sha256 ||
                                "Not available"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
