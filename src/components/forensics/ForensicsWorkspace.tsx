/** biome-ignore-all lint/performance/noImgElement: <> */
"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileAudio,
  FileImage,
  FileVideo,
  Filter,
  Loader2,
  Search,
  Shield,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
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
  type ImageForensicsDetail,
  useForensicsDetail,
  useForensicsStatus,
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

type MediaFilter = "all" | ForensicsMediaType;
type FlowState =
  | "idle"
  | "media_selected"
  | "creating_forensic_analysis"
  | "analysis_pending"
  | "analysis_processing"
  | "completed"
  | "failed";

const READY_MEDIA_STATUSES = new Set(["uploaded", "processed"]);

const MEDIA_FILTERS: Array<{ label: string; value: MediaFilter }> = [
  { label: "All", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Audio", value: "audio" },
  { label: "Frames", value: "frames" },
];

function getForensicsFeatureKey(
  mediaType?: ForensicsMediaType | null,
): ProductFeatureKey | null {
  switch (mediaType) {
    case "image":
      return "forensicsImage";
    case "audio":
      return "forensicsAudio";
    case "video":
      return "forensicsVideo";
    case "frames":
      return "forensicsFrames";
    default:
      return null;
  }
}

function getMediaTypeLabel(mediaType: Exclude<ForensicsMediaType, "frames">) {
  switch (mediaType) {
    case "image":
      return "Image";
    case "audio":
      return "Audio";
    case "video":
      return "Video";
  }
}

function getMediaTypeIcon(
  mediaType: Exclude<ForensicsMediaType, "frames">,
  className?: string,
) {
  const iconClassName = cn("size-4", className);
  switch (mediaType) {
    case "image":
      return <FileImage className={iconClassName} />;
    case "audio":
      return <FileAudio className={iconClassName} />;
    case "video":
      return <FileVideo className={iconClassName} />;
  }
}

function getPresetModeLabel(filter: MediaFilter) {
  switch (filter) {
    case "image":
      return "Images";
    case "video":
      return "Videos";
    case "audio":
      return "Audio";
    case "frames":
      return "Frames";
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
      return "Run full-video forensic analysis on video files from your library.";
    case "frames":
      return "Run frame-level forensic analysis on video files from your library.";
    default:
      return "Run forensic analysis on image, audio, video, and frame workflows from your library.";
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
    case "frames":
      return "Frame-source videos";
    default:
      return "Library files";
  }
}

function getScopedSupportedLabel(filter: MediaFilter) {
  switch (filter) {
    case "image":
      return "Supported images";
    case "video":
      return "Supported videos";
    case "audio":
      return "Supported audio";
    case "frames":
      return "Frame-ready videos";
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
    case "frames":
      return "Videos ready";
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

function matchesForensicsMode(
  mode: MediaFilter,
  media: Media,
  availability: ReturnType<typeof getMediaAvailability>,
) {
  if (mode === "all") return true;
  if (mode === "frames") return media.mimeType.startsWith("video/");
  return availability.mediaType === mode;
}

function getWorkflowLabel(mode: ForensicsMediaType) {
  switch (mode) {
    case "image":
      return "image";
    case "audio":
      return "audio";
    case "video":
      return "video";
    case "frames":
      return "frame";
  }
}

function getWorkflowTitle(mode: ForensicsMediaType) {
  switch (mode) {
    case "image":
      return "Image";
    case "audio":
      return "Audio";
    case "video":
      return "Video";
    case "frames":
      return "Frames";
  }
}

function getAnalysisTypeLabel(mediaType: ForensicsMediaType) {
  return mediaType === "frames" ? "Frames" : getMediaTypeLabel(mediaType);
}

function getAnalysisTypeIcon(
  mediaType: ForensicsMediaType,
  className?: string,
) {
  return mediaType === "frames" ? (
    <FileVideo className={cn("size-4", className)} />
  ) : (
    getMediaTypeIcon(mediaType, className)
  );
}

function getAsyncStateMessage(mode: ForensicsMediaType, flowState: FlowState) {
  const label = getWorkflowLabel(mode);
  if (flowState === "analysis_processing") {
    return `We are actively processing the selected ${label} forensic analysis. This can take a little longer than image and audio workflows.`;
  }

  return `Your ${label} forensic analysis has been queued. We will keep checking until the result is ready.`;
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

function getRiskBandClasses(riskBand?: string) {
  switch (riskBand) {
    case "low":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "elevated":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "high":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getRiskBandLabel(riskBand?: string) {
  switch (riskBand) {
    case "low":
      return "Low";
    case "elevated":
      return "Elevated";
    case "high":
      return "High";
    default:
      return "Unknown";
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

function getTriggerTypeLabel(triggerType?: string) {
  switch (triggerType) {
    case "rerun":
      return "Rerun";
    case "retry":
      return "Retry";
    case "initial":
      return "Initial run";
    default:
      return "Saved result";
  }
}

function getImageAssessmentClasses(status?: string) {
  const normalized = (status || "").toLowerCase();

  if (
    normalized.includes("tamper") ||
    normalized.includes("suspect") ||
    normalized.includes("manip")
  ) {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (
    normalized.includes("clear") ||
    normalized.includes("clean") ||
    normalized.includes("authentic")
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  return "border-slate-200 bg-slate-50 text-slate-800";
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
      ) : null}
      {forensicMediaType === "audio" ? (
        <FileAudio className="size-8 text-slate-500" />
      ) : null}
      {forensicMediaType === "video" ? (
        <FileVideo className="size-8 text-slate-500" />
      ) : null}
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

function EvidenceListCard({
  title,
  items,
  emptyLabel,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  emptyLabel: string;
  tone?: "neutral" | "warning" | "positive";
}) {
  const toneClasses =
    tone === "warning"
      ? "border-amber-200 bg-amber-50"
      : tone === "positive"
        ? "border-emerald-200 bg-emerald-50"
        : "border-slate-200 bg-slate-50/80";

  return (
    <Card className={cn("shadow-none", toneClasses)}>
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm leading-7 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-500">
            {emptyLabel}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DetailListCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{
    label: string;
    value: string;
    scrollable?: boolean;
  }>;
}) {
  const populatedRows = rows.filter(
    (row) => row.value && row.value !== "Not available",
  );

  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {populatedRows.length > 0 ? (
          populatedRows.map((row) => (
            <div
              key={row.label}
              className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {row.label}
              </div>
              <div
                className={cn(
                  "mt-1 min-w-0 text-sm font-medium text-slate-900",
                  row.scrollable
                    ? "overflow-x-auto whitespace-nowrap font-mono text-xs"
                    : "break-words leading-6",
                )}
              >
                {row.value}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-500">
            No detailed evidence available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ImageSignalCard({
  title,
  score,
  interpretation,
  extra,
}: {
  title: string;
  score?: string | number;
  interpretation?: string;
  extra?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {score !== undefined && score !== null ? (
        <div className="mt-2 text-xl font-semibold text-slate-900">{score}</div>
      ) : null}
      {interpretation ? (
        <p className="mt-2 text-sm leading-7 text-slate-600">
          {interpretation}
        </p>
      ) : null}
      {extra ? (
        <div className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          {extra}
        </div>
      ) : null}
    </div>
  );
}

function ImageForensicsResult({
  analysis,
  selectedAvailabilityReady,
  startPending,
  onRunNewAnalysis,
}: {
  analysis: ForensicsAnalysisDetail;
  selectedAvailabilityReady: boolean;
  startPending: boolean;
  onRunNewAnalysis: () => void;
}) {
  const imageDetail: ImageForensicsDetail | undefined =
    analysis.forensics.imageDetail;
  const assessment = imageDetail?.assessment;
  const issues = imageDetail?.issues;
  const checks = imageDetail?.checks;
  const metadata = imageDetail?.metadata;
  const manipulation = imageDetail?.manipulationDetection;
  const histogram = imageDetail?.enhancementAnalysis?.histogramAnalysis;
  const verification = imageDetail?.verification;
  const userSummary = imageDetail?.userFriendlySummary;
  const userExplanation = userSummary?.explanation;
  const cleanedUserSummaryNote = userSummary?.note
    ?.replace(/\s*\(AI detection disabled\)\s*/i, "")
    .replace(/\bAI detection disabled\b/i, "")
    .trim();
  const primaryIssues =
    userSummary?.issuesFound && userSummary.issuesFound.length > 0
      ? userSummary.issuesFound
      : issues?.issuesFound || [];
  const primaryPositives =
    userSummary?.positiveFindings && userSummary.positiveFindings.length > 0
      ? userSummary.positiveFindings
      : issues?.positiveFindings || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
          <div className="aspect-[4/3] overflow-hidden">
            {analysis.previewUrl ? (
              <img
                src={analysis.previewUrl}
                alt={analysis.fileName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100">
                <FileImage className="size-10 text-slate-500" />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {analysis.isFreshRun || analysis.freshness ? (
                  <Badge
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-700"
                  >
                    Fresh analysis result
                  </Badge>
                ) : null}
                {assessment?.status ? (
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-slate-50 text-slate-700"
                  >
                    Status {userSummary?.status || assessment.status}
                  </Badge>
                ) : null}
                {userSummary?.tamperingProbability ||
                assessment?.tamperingProbability ? (
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-50 text-amber-700"
                  >
                    Tampering possibility{" "}
                    {userSummary?.tamperingProbability ||
                      assessment?.tamperingProbability}
                  </Badge>
                ) : null}
                <Badge
                  variant="outline"
                  className="border-slate-200 bg-slate-50 text-slate-700"
                >
                  Generated{" "}
                  {formatDateTime(
                    analysis.freshness?.resultGeneratedAt ||
                      analysis.analysisCompletedAt ||
                      analysis.updatedAt,
                  )}
                </Badge>
              </div>

              <Badge
                variant="outline"
                className={cn(
                  "border px-3 py-1 text-sm font-semibold",
                  getRiskBandClasses(analysis.forensics.riskBand),
                )}
              >
                Risk Level: {getRiskBandLabel(analysis.forensics.riskBand)}
              </Badge>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                {analysis.forensics.interpretation?.what_this_means ||
                  userSummary?.recommendation ||
                  assessment?.recommendation ||
                  "No forensic summary was returned for this image."}
              </p>
            </div>

            <Badge
              variant="outline"
              className="border-slate-200 bg-slate-50 text-slate-700"
            >
              <FileImage className="size-4" />
              Image
            </Badge>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Signal strength",
                value: String(analysis.forensics.riskScore),
              },
              {
                label: "Risk band",
                value: getRiskBandLabel(analysis.forensics.riskBand),
              },
              {
                label: "Findings",
                value: String(analysis.forensics.findings.length),
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {metric.label}
                </div>
                <div className="mt-2 text-base font-semibold text-slate-900">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {selectedAvailabilityReady ? (
              <Button
                type="button"
                onClick={onRunNewAnalysis}
                disabled={startPending}
              >
                Start Fresh Analysis
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <Card className="border-slate-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            Technical signals
          </CardTitle>
          <CardDescription>
            Technical evidence from the image forensic analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ImageSignalCard
            title="ELA"
            score={manipulation?.ela?.score}
            interpretation={manipulation?.ela?.interpretation}
            extra={
              manipulation?.ela?.artifactAvailable
                ? "Artifact available internally"
                : undefined
            }
          />
          <ImageSignalCard
            title="Noise"
            score={manipulation?.noise?.score}
            interpretation={manipulation?.noise?.interpretation}
            extra={
              manipulation?.noise?.artifactAvailable
                ? "Artifact available internally"
                : undefined
            }
          />
          <ImageSignalCard
            title="Copy-move"
            score={manipulation?.copyMove?.cloneScore}
            interpretation={manipulation?.copyMove?.interpretation}
            extra={
              manipulation?.copyMove?.matchesFound !== undefined
                ? `${manipulation.copyMove.matchesFound} matches found`
                : undefined
            }
          />
          <ImageSignalCard
            title="JPEG compression"
            score={manipulation?.jpegCompression?.format}
            interpretation={manipulation?.jpegCompression?.message}
          />
          <ImageSignalCard
            title="Histogram analysis"
            score={
              histogram?.peaks !== undefined
                ? `${histogram.peaks} peaks`
                : undefined
            }
            interpretation={histogram?.interpretation}
            extra={
              histogram?.meanBrightness !== undefined &&
              histogram?.stdBrightness !== undefined
                ? `Brightness ${histogram.meanBrightness} / ${histogram.stdBrightness}`
                : undefined
            }
          />
        </CardContent>
      </Card>

      {analysis.forensics.elevatedDetectors.length > 0 && (
        <Card className="border-slate-200 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">
              Elevated detectors
            </CardTitle>
            <CardDescription>
              Detectors that crossed their elevated threshold for this file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.forensics.elevatedDetectors.map((detector) => (
                <Badge
                  key={detector}
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700"
                >
                  {detector}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analysis.forensics.checksUnavailable.length > 0 && (
        <Card className="border-slate-200 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">
              Checks that could not run
            </CardTitle>
            <CardDescription>
              Some engine-internal checks could not complete for this file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.forensics.checksUnavailable.map((check) => (
              <div
                key={check.name}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700"
              >
                <span className="font-semibold">{check.name}:</span>{" "}
                {check.reason}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {analysis.forensics.interpretation?.next_steps &&
        analysis.forensics.interpretation.next_steps.length > 0 && (
          <Card className="border-slate-200 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">
                Recommended next steps
              </CardTitle>
              <CardDescription>
                Actions to consider based on the forensic signals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.forensics.interpretation.next_steps.map((step) => (
                <div
                  key={step.action}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-sm",
                    step.type === "platform_feature"
                      ? "border-blue-200 bg-blue-50/80 text-blue-800"
                      : "border-slate-200 bg-slate-50/80 text-slate-700",
                  )}
                >
                  {step.label}
                  {step.type === "platform_feature" && step.feature ? (
                    <Badge
                      variant="outline"
                      className="ml-2 border-blue-200 bg-white text-blue-600"
                    >
                      Platform feature
                    </Badge>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      <div className="grid gap-6 lg:grid-cols-2">
        <EvidenceListCard
          title="Suspicious indicators"
          items={primaryIssues}
          emptyLabel="No suspicious indicators were highlighted in the image detail report."
          tone="warning"
        />
        <EvidenceListCard
          title="Positive indicators"
          items={primaryPositives}
          emptyLabel="No positive trust indicators were highlighted in the image detail report."
          tone="positive"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailListCard
          title="Image information"
          rows={[
            {
              label: "Format",
              value:
                userSummary?.imageInfo?.format ||
                metadata?.format ||
                analysis.mimeType,
            },
            {
              label: "Dimensions",
              value:
                userSummary?.imageInfo?.dimensions ||
                metadata?.dimensions ||
                "Not available",
            },
            {
              label: "File size",
              value:
                userSummary?.imageInfo?.fileSize !== undefined
                  ? `${userSummary.imageInfo.fileSize} MB`
                  : metadata?.fileSizeMb !== undefined
                    ? `${metadata.fileSizeMb} MB`
                    : formatFileSize(analysis.fileSize),
            },
            {
              label: "GPS metadata",
              value:
                userSummary?.imageInfo?.hasGps === undefined
                  ? metadata?.hasGps === undefined
                    ? "Not available"
                    : metadata.hasGps
                      ? "Present"
                      : "Not present"
                  : userSummary.imageInfo.hasGps
                    ? "Present"
                    : "Not present",
            },
          ]}
        />
        <DetailListCard
          title="File and metadata evidence"
          rows={[
            {
              label: "Filename",
              value: metadata?.filename || analysis.fileName,
            },
            {
              label: "File size",
              value:
                metadata?.fileSizeMb !== undefined
                  ? `${metadata.fileSizeMb} MB`
                  : formatFileSize(analysis.fileSize),
            },
            { label: "Format", value: metadata?.format || analysis.mimeType },
            {
              label: "Dimensions",
              value: metadata?.dimensions || "Not available",
            },
            { label: "Color mode", value: metadata?.mode || "Not available" },
            {
              label: "EXIF metadata",
              value:
                metadata?.hasExif === undefined
                  ? "Not available"
                  : metadata.hasExif
                    ? "Present"
                    : "Not present",
            },
            {
              label: "GPS metadata",
              value:
                metadata?.hasGps === undefined
                  ? "Not available"
                  : metadata.hasGps
                    ? "Present"
                    : "Not present",
            },
          ]}
        />
      </div>

      {analysis.forensics.findings.length > 0 && (
        <Card className="border-slate-200 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">
              Synthesized findings
            </CardTitle>
            <CardDescription>
              Findings summarized from the detailed image evidence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.forensics.findings.map((finding) => (
              <FindingCard
                key={`${finding.module}-${finding.title}`}
                finding={finding}
              />
            ))}
          </CardContent>
        </Card>
      )}
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
  const [frameSamplingMode, setFrameSamplingMode] = useState<
    "default" | "uniform"
  >("default");
  const [openDetailSections, setOpenDetailSections] = useState<string[]>([
    "file",
  ]);
  const currentAnalysisRef = useRef<HTMLDivElement | null>(null);

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
  const statusQuery = useForensicsStatus(analysisId, {
    enabled:
      flowState === "analysis_pending" || flowState === "analysis_processing",
  });
  const presetModeLabel = getPresetModeLabel(mediaFilter);

  useEffect(() => {
    const mediaParam = searchParams.get("media");

    if (
      mediaParam === "image" ||
      mediaParam === "video" ||
      mediaParam === "audio" ||
      mediaParam === "frames"
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
  const selectedWorkflowMode =
    mediaFilter === "all"
      ? selectedAvailability?.mediaType || null
      : mediaFilter === "frames"
        ? "frames"
        : mediaFilter;
  const forensicsAccessState = getCombinedFeatureState(
    subscriptionUsageQuery.data,
    ["forensicsImage", "forensicsAudio", "forensicsVideo", "forensicsFrames"],
  );
  const selectedFeatureState = selectedWorkflowMode
    ? getFeatureState(
        subscriptionUsageQuery.data,
        getForensicsFeatureKey(selectedWorkflowMode) as ProductFeatureKey,
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
      const matchesFilter = matchesForensicsMode(
        mediaFilter,
        media,
        availability,
      );

      return matchesSearch && matchesFilter;
    });
  }, [allMedia, deferredSearchValue, mediaFilter]);

  const scopedLibraryCount = allMedia.filter((media) => {
    const availability = getMediaAvailability(media);
    return matchesForensicsMode(mediaFilter, media, availability);
  }).length;
  const supportedMediaCount = allMedia.filter((media) => {
    const availability = getMediaAvailability(media);
    const matchesFilter = matchesForensicsMode(
      mediaFilter,
      media,
      availability,
    );

    return matchesFilter && availability.isSupported;
  }).length;
  const readyMediaCount = allMedia.filter((media) => {
    const availability = getMediaAvailability(media);
    const matchesFilter = matchesForensicsMode(
      mediaFilter,
      media,
      availability,
    );

    return matchesFilter && availability.isReady;
  }).length;
  const activeAnalysis = detailQuery.data ?? latestAnalysis;
  const isLockedMode = mediaFilter !== "all";
  const visibleFilters = isLockedMode
    ? MEDIA_FILTERS.filter((filter) => filter.value === mediaFilter)
    : MEDIA_FILTERS;
  const asyncStatusDetails = statusQuery.data?.analysis;

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

  const scrollToCurrentAnalysis = () => {
    window.requestAnimationFrame(() => {
      currentAnalysisRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  useEffect(() => {
    if (!selectedMedia || !selectedAvailability) {
      return;
    }

    const isCompatible = matchesForensicsMode(
      mediaFilter,
      selectedMedia,
      selectedAvailability,
    );

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
    if (
      flowState !== "creating_forensic_analysis" &&
      flowState !== "analysis_pending" &&
      flowState !== "analysis_processing"
    ) {
      setFlowState("media_selected");
    }
  };

  const handleRunForensics = async () => {
    if (
      !selectedMedia ||
      !selectedAvailability?.mediaType ||
      !selectedWorkflowMode ||
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
    scrollToCurrentAnalysis();

    try {
      const analysis = await startForensics.mutateAsync({
        mediaId: selectedMedia.id,
        mediaType: selectedWorkflowMode,
        options:
          selectedWorkflowMode === "frames" && frameSamplingMode === "uniform"
            ? { sampling_mode: "uniform" }
            : undefined,
      });

      setLatestAnalysis(analysis);
      setAnalysisId(analysis.id);

      if (
        analysis.processing.processingMode === "async" &&
        analysis.status !== "completed"
      ) {
        setFlowState(
          analysis.status === "processing"
            ? "analysis_processing"
            : "analysis_pending",
        );
        return;
      }

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

  useEffect(() => {
    if (!statusQuery.data) {
      return;
    }

    const effectiveStatus = statusQuery.data.analysis.effectiveStatus;

    if (effectiveStatus === "completed") {
      setFlowState("completed");
      detailQuery.refetch();
      return;
    }

    if (effectiveStatus === "failed") {
      setFlowState("failed");
      setErrorMessage(
        statusQuery.data.analysis.errorInfo?.message ||
          "The forensic analysis could not be completed for this file.",
      );
      return;
    }

    if (effectiveStatus === "processing") {
      setFlowState("analysis_processing");
      return;
    }

    setFlowState("analysis_pending");
  }, [detailQuery, statusQuery.data]);

  useEffect(() => {
    if (!detailQuery.data) {
      return;
    }

    setLatestAnalysis(detailQuery.data);
  }, [detailQuery.data]);

  useEffect(() => {
    if (flowState !== "completed" || !activeAnalysis) {
      return;
    }

    setOpenDetailSections(["file"]);
  }, [activeAnalysis, flowState]);

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
                    : "Run forensic analysis on existing image, audio, and video files from your library, including frame-level workflows."}
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
                {visibleFilters.map((filter) => (
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

            {mediaFilter === "frames" ? (
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">
                      Frame analysis options
                    </div>
                    <p className="text-sm leading-7 text-slate-600">
                      Keep the default backend sampling, or request uniform
                      frame sampling when the forensic service supports it.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: "Default",
                        value: "default" as const,
                        description: "Let the backend choose the sampling mode",
                      },
                      {
                        label: "Uniform",
                        value: "uniform" as const,
                        description: "Request uniform frame sampling",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFrameSamplingMode(option.value)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                          frameSamplingMode === option.value
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                        )}
                        title={option.description}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

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
                                {getAnalysisTypeIcon(availability.mediaType)}
                                {getAnalysisTypeLabel(availability.mediaType)}
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
                    {mediaFilter === "frames"
                      ? "Upload a video file to your library first, then return here to run frame-level forensic analysis."
                      : mediaFilter === "all"
                        ? "Upload an image, audio, or video file to your library first, then return here to run forensic analysis."
                        : `Upload a ${getWorkflowLabel(mediaFilter)} file to your library first, then return here to run forensic analysis.`}
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
                        {selectedWorkflowMode ? (
                          <span className="inline-flex items-center gap-1.5">
                            {getAnalysisTypeIcon(selectedWorkflowMode)}
                            {getAnalysisTypeLabel(selectedWorkflowMode)}
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
                          Start{" "}
                          {selectedWorkflowMode
                            ? `${getWorkflowTitle(selectedWorkflowMode)} Analysis`
                            : "Forensic Analysis"}
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
                      {mediaFilter === "frames"
                        ? "Select a video file from your library to begin frame-level forensic analysis."
                        : mediaFilter === "all"
                          ? "Select an image, audio, or video file from your library to begin."
                          : `Select a ${getWorkflowLabel(mediaFilter)} file from your library to begin.`}
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
                focuses on risk signals, interpretation, and
                evidence-oriented outputs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
              {[
                "Select an image, audio, or video file from your library.",
                "We submit the selected media record to the forensic service.",
                "Image and audio analyses usually complete in one response, while video and frame analyses continue through a queued async workflow.",
                "You receive risk signals, interpretation, and forensic findings.",
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
                  Video forensics
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
                  Frame forensics
                </span>
                <Badge
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  variant="outline"
                >
                  Available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card
        ref={currentAnalysisRef}
        className="scroll-mt-24 border-slate-200 shadow-sm"
      >
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
                Choose a file from your library to run forensic analysis.
              </p>
            </div>
          )}

          {flowState === "media_selected" && selectedMedia ? (
            <div className="space-y-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 px-6 py-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    Ready to analyze
                  </div>
                  {selectedWorkflowMode === "frames" &&
                  frameSamplingMode === "uniform" ? (
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                      Uniform frame sampling will be requested for this run.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {selectedAvailability?.mediaType ? (
                      renderMediaPreview(selectedMedia, "rounded-none")
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <AlertCircle className="size-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50 text-slate-700"
                        >
                          {selectedWorkflowMode
                            ? getAnalysisTypeIcon(selectedWorkflowMode)
                            : null}
                          {selectedWorkflowMode
                            ? getAnalysisTypeLabel(selectedWorkflowMode)
                            : "Selected media"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50 text-slate-700"
                        >
                          {selectedMedia.status}
                        </Badge>
                      </div>
                      <h3 className="mt-4 truncate text-2xl font-semibold tracking-tight text-slate-900">
                        {selectedMedia.filename}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                        This file is selected and ready for a fresh forensic
                        run. Once started, the result area below will update
                        with risk signals, interpretation, and evidence details.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        label: "Workflow",
                        value: selectedWorkflowMode
                          ? getAnalysisTypeLabel(selectedWorkflowMode)
                          : "Not available",
                      },
                      {
                        label: "File size",
                        value: formatFileSize(Number(selectedMedia.fileSize)),
                      },
                      {
                        label: "Library status",
                        value: selectedMedia.status,
                      },
                      {
                        label: "MIME type",
                        value: selectedMedia.mimeType,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {item.label}
                        </div>
                        <div className="mt-2 break-words text-base font-semibold text-slate-900">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={handleRunForensics}
                      disabled={
                        !selectedAvailability?.isReady ||
                        !selectedFeatureState.available ||
                        !analysisUsageGate.allowed ||
                        startForensics.isPending
                      }
                    >
                      {startForensics.isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Running Forensics
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-4" />
                          Start Fresh Analysis
                        </>
                      )}
                    </Button>
                    {!selectedAvailability?.isReady ? (
                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-white text-slate-600"
                      >
                        {selectedAvailability?.reason}
                      </Badge>
                    ) : null}
                    {!selectedFeatureState.available ? (
                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-white text-slate-600"
                      >
                        {selectedFeatureState.message}
                      </Badge>
                    ) : null}
                    {!analysisUsageGate.allowed ? (
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700"
                      >
                        Monthly analysis limit reached
                      </Badge>
                    ) : null}
                  </div>
                </div>
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
                We are submitting the selected media for forensic review and
                preparing the analysis workflow.
              </p>
            </div>
          )}

          {(flowState === "analysis_pending" ||
            flowState === "analysis_processing") &&
          selectedWorkflowMode ? (
            <div className="rounded-[1.5rem] border border-blue-200 bg-blue-50/70 px-6 py-12 text-center">
              <Loader2 className="mx-auto size-10 animate-spin text-blue-600" />
              <div className="mt-4 text-lg font-semibold text-slate-900">
                {flowState === "analysis_processing"
                  ? "Processing forensic analysis"
                  : "Forensic analysis queued"}
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {getAsyncStateMessage(selectedWorkflowMode, flowState)}
              </p>
              {asyncStatusDetails ? (
                <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
                  <div className="rounded-2xl border border-blue-100 bg-white/80 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Effective status
                    </div>
                    <div className="mt-1 text-sm font-medium capitalize text-slate-900">
                      {asyncStatusDetails.effectiveStatus}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-blue-100 bg-white/80 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Started
                    </div>
                    <div className="mt-1 text-sm font-medium text-slate-900">
                      {formatDateTime(asyncStatusDetails.analysisStartedAt)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-blue-100 bg-white/80 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Last updated
                    </div>
                    <div className="mt-1 text-sm font-medium text-slate-900">
                      {formatDateTime(asyncStatusDetails.updatedAt)}
                    </div>
                  </div>
                </div>
              ) : null}
              {statusQuery.isError ? (
                <div className="mt-4 flex flex-col items-center gap-3">
                  <p className="text-sm font-medium text-amber-700">
                    Unable to refresh status right now. We will keep the last
                    known state until a new update arrives.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void statusQuery.refetch()}
                  >
                    Refresh status
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

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
                  {activeAnalysis?.freshness?.triggerType ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-white/80 text-red-700"
                      >
                        {getTriggerTypeLabel(
                          activeAnalysis.freshness.triggerType,
                        )}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-white/80 text-red-700"
                      >
                        Generated{" "}
                        {formatDateTime(
                          activeAnalysis.freshness.resultGeneratedAt ||
                            activeAnalysis.updatedAt,
                        )}
                      </Badge>
                    </div>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {selectedAvailability?.isReady ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRunForensics}
                        disabled={startForensics.isPending}
                      >
                        Start Fresh Analysis
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {flowState === "completed" && activeAnalysis ? (
            activeAnalysis.mediaType === "image" &&
            activeAnalysis.forensics.imageDetail ? (
              <ImageForensicsResult
                analysis={activeAnalysis}
                selectedAvailabilityReady={Boolean(
                  selectedAvailability?.isReady,
                )}
                startPending={startForensics.isPending}
                onRunNewAnalysis={handleRunForensics}
              />
            ) : (
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
                          ) : activeAnalysis.mediaType === "audio" ? (
                            <FileAudio className="size-10 text-slate-500" />
                          ) : (
                            <FileVideo className="size-10 text-slate-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        {(activeAnalysis.isFreshRun ||
                          activeAnalysis.freshness) && (
                          <div className="mb-4 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-blue-200 bg-blue-50 text-blue-700"
                            >
                              Fresh analysis result
                            </Badge>
                            {activeAnalysis.freshness?.triggerType ? (
                              <Badge
                                variant="outline"
                                className="border-slate-200 bg-slate-50 text-slate-700"
                              >
                                {getTriggerTypeLabel(
                                  activeAnalysis.freshness.triggerType,
                                )}
                              </Badge>
                            ) : null}
                            <Badge
                              variant="outline"
                              className="border-slate-200 bg-slate-50 text-slate-700"
                            >
                              Generated{" "}
                              {formatDateTime(
                                activeAnalysis.freshness?.resultGeneratedAt ||
                                  activeAnalysis.analysisCompletedAt ||
                                  activeAnalysis.updatedAt,
                              )}
                            </Badge>
                          </div>
                        )}
                        <Badge
                          variant="outline"
                          className={cn(
                            "border px-3 py-1 text-sm font-semibold",
                            getRiskBandClasses(
                              activeAnalysis.forensics.riskBand,
                            ),
                          )}
                        >
                          Risk Level:{" "}
                          {getRiskBandLabel(activeAnalysis.forensics.riskBand)}
                        </Badge>
                        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                          {activeAnalysis.forensics.interpretation?.summary ||
                            activeAnalysis.forensics.summary ||
                            "Forensic result unavailable"}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                          {activeAnalysis.forensics.interpretation
                            ?.what_this_means ||
                            activeAnalysis.forensics.summary ||
                            "No forensic summary was returned for this analysis."}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-slate-50 text-slate-700"
                      >
                        {getAnalysisTypeIcon(activeAnalysis.mediaType)}
                        {getAnalysisTypeLabel(activeAnalysis.mediaType)}
                      </Badge>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        {
                          label: "Signal strength",
                          value: String(activeAnalysis.forensics.riskScore),
                        },
                        {
                          label: "Risk band",
                          value: getRiskBandLabel(
                            activeAnalysis.forensics.riskBand,
                          ),
                        },
                        {
                          label: "Findings",
                          value: String(
                            activeAnalysis.forensics.findings.length,
                          ),
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

                    <div className="mt-6 flex flex-wrap gap-3">
                      {selectedAvailability?.isReady ? (
                        <Button
                          type="button"
                          onClick={handleRunForensics}
                          disabled={startForensics.isPending}
                        >
                          Start Fresh Analysis
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {activeAnalysis.forensics.elevatedDetectors.length > 0 && (
                  <Card className="border-slate-200 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-900">
                        Elevated detectors
                      </CardTitle>
                      <CardDescription>
                        Detectors that crossed their elevated threshold for this
                        file.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {activeAnalysis.forensics.elevatedDetectors.map(
                          (detector) => (
                            <Badge
                              key={detector}
                              variant="outline"
                              className="border-amber-200 bg-amber-50 text-amber-700"
                            >
                              {detector}
                            </Badge>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeAnalysis.forensics.checksUnavailable.length > 0 && (
                  <Card className="border-slate-200 shadow-none">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-900">
                        Checks that could not run
                      </CardTitle>
                      <CardDescription>
                        Some engine-internal checks could not complete for this
                        file.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {activeAnalysis.forensics.checksUnavailable.map(
                        (check) => (
                          <div
                            key={check.name}
                            className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700"
                          >
                            <span className="font-semibold">{check.name}:</span>{" "}
                            {check.reason}
                          </div>
                        ),
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeAnalysis.forensics.interpretation?.next_steps &&
                  activeAnalysis.forensics.interpretation.next_steps.length >
                    0 && (
                    <Card className="border-slate-200 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-lg text-slate-900">
                          Recommended next steps
                        </CardTitle>
                        <CardDescription>
                          Actions to consider based on the forensic signals.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {activeAnalysis.forensics.interpretation.next_steps.map(
                          (step) => (
                            <div
                              key={step.action}
                              className={cn(
                                "rounded-2xl border px-4 py-3 text-sm",
                                step.type === "platform_feature"
                                  ? "border-blue-200 bg-blue-50/80 text-blue-800"
                                  : "border-slate-200 bg-slate-50/80 text-slate-700",
                              )}
                            >
                              {step.label}
                              {step.type === "platform_feature" &&
                              step.feature ? (
                                <Badge
                                  variant="outline"
                                  className="ml-2 border-blue-200 bg-white text-blue-600"
                                >
                                  Platform feature
                                </Badge>
                              ) : null}
                            </div>
                          ),
                        )}
                      </CardContent>
                    </Card>
                  )}

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
                                This analysis completed without detailed
                                forensic findings in the response payload.
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

                      <Accordion
                        type="multiple"
                        value={openDetailSections}
                        onValueChange={setOpenDetailSections}
                        className="w-full"
                      >
                        <AccordionItem value="file">
                          <AccordionTrigger>
                            File and processing
                          </AccordionTrigger>
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
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
