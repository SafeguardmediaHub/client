"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  FileUp,
  FlaskConical,
  Layers,
  LinkIcon,
  Loader2,
  type LucideIcon,
  UploadIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAssistant } from "@/context/AssistantContext";
import { useDashboardOverview } from "@/hooks/useDashboard";
import { useUrlUpload } from "@/hooks/useMedia";
import { useSubscriptionUsage } from "@/hooks/useSubscriptionUsage";
import api from "@/lib/api";
import {
  formatSubscriptionTier,
  getSubscriptionBadgeColor,
} from "@/lib/dashboard-utils";
import {
  type UsageBucket,
  type UsageThresholdState,
  formatResetDate,
  formatUsageValue,
  getUsageGate,
  getUsageThreshold,
  getUsageToneClasses,
  invalidateSubscriptionUsage,
} from "@/lib/subscription-access";
import { AssistantErrorBoundary, AssistantPanel } from "./assistant";
import { DashboardOverview } from "./dashboard/overview/DashboardOverview";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";

type UploadPhase =
  | "idle"
  | "validating"
  | "requesting_url"
  | "uploading"
  | "confirming"
  | "success"
  | "error";

type UploadType = "general_image" | "video" | "audio";

type DashboardProps = {
  userName?: string;
  onAnalyzeLink?: (url: string) => void;
  onUploadSuccess?: (key: string) => void;
};

const MAX_BYTES = 1_000_000_000; // 1GB
const ALLOWED_MIME_PREFIXES = ["image/", "video/", "audio/"];
const ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "mp4",
  "mov",
  "mp3",
  "wav",
  "m4a",
  "aac",
  "ogg",
];

function getProgressColor(threshold: UsageThresholdState) {
  switch (threshold) {
    case "warning":
      return "[&>div]:bg-amber-500";
    case "critical":
    case "reached":
      return "[&>div]:bg-red-500";
    default:
      return "[&>div]:bg-blue-500";
  }
}

function getIconBg(threshold: UsageThresholdState) {
  switch (threshold) {
    case "warning":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    case "critical":
    case "reached":
      return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    default:
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
  }
}

function UsageCard({
  icon: Icon,
  label,
  sublabel,
  bucket,
}: {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  bucket?: UsageBucket;
}) {
  const threshold = getUsageThreshold(bucket);
  const percentage = bucket?.unlimited ? 0 : (bucket?.percentage ?? 0);

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={`rounded-md p-1.5 ${getIconBg(threshold)}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {formatUsageValue(bucket)}
        </p>
        {!bucket?.unlimited && (
          <Progress
            value={percentage}
            className={`h-1.5 bg-slate-100 dark:bg-slate-800 ${getProgressColor(threshold)}`}
          />
        )}
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </CardContent>
    </Card>
  );
}

const Dashboard: FC<DashboardProps> = ({
  userName = "there",
  onAnalyzeLink,
  onUploadSuccess,
}) => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const urlUploadMutation = useUrlUpload();
  const { openAssistant, setMediaContext } = useAssistant();
  const subscriptionUsageQuery = useSubscriptionUsage();
  const fileUsage = subscriptionUsageQuery.data?.usage.files;
  const analysisUsage = subscriptionUsageQuery.data?.usage.analyses;
  const batchUsage = subscriptionUsageQuery.data?.usage.batches;
  const uploadGate = getUsageGate(fileUsage);
  const uploadThreshold = getUsageThreshold(fileUsage);

  const handleUpload = () => {
    if (!uploadGate.allowed) {
      const resetLabel = formatResetDate(
        subscriptionUsageQuery.data?.currentPeriod.endDate,
      );
      toast.error(
        `You have reached your monthly upload limit. Your limit resets on ${resetLabel}.`,
      );
      return;
    }

    if (!url) {
      toast.error("Please enter a URL to upload.");
      return;
    }

    toast.info("Starting upload from URL...");

    setUrl("");
    urlUploadMutation.mutate(
      {
        url,
        // uploadType: "general_image",
      },
      {
        onSuccess: () => {
          router.push("/dashboard/library");
        },
      },
    );
  };

  const isBusy = useMemo(
    () =>
      uploadPhase === "validating" ||
      uploadPhase === "requesting_url" ||
      uploadPhase === "uploading" ||
      uploadPhase === "confirming" ||
      urlUploadMutation.isPending,
    [uploadPhase, urlUploadMutation.isPending],
  );

  const validateFile = useCallback((file: File) => {
    if (file.size > MAX_BYTES) {
      return "File is too large. Max size is 1GB.";
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);
    const isAllowedMime = ALLOWED_MIME_PREFIXES.some((p) =>
      file.type.startsWith(p),
    );
    if (!isAllowedExt && !isAllowedMime) {
      return "Unsupported file type. Use JPEG, PNG, MP4, MOV, or common audio (MP3, WAV, M4A, AAC, OGG).";
    }
    return null;
  }, []);

  const determineUploadType = useCallback((file: File): UploadType => {
    if (file.type.startsWith("image/")) return "general_image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext))
      return "general_image";
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "video";
    if (["mp3", "wav", "m4a", "aac", "ogg"].includes(ext)) return "audio";
    return "general_image";
  }, []);

  const requestPresignedUrl = useCallback(
    async (file: File, uploadType: UploadType) => {
      try {
        const response = await api.post("/api/media/presigned-url", {
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
          uploadType,
        });

        const result = response.data;
        const { data } = result;

        toast.success("Upload URL obtained. Starting upload...");
        const { uploadUrl, s3Key, correlationId } = data.upload;

        return { uploadUrl, key: s3Key, correlationId };
      } catch (error: unknown) {
        console.error("Failed to get presigned URL:", error);
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to get upload URL. Please try again.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [],
  );

  const confirmUpload = useCallback(
    async (s3Key: string, correlationId: string) => {
      try {
        const response = await api.post("/api/media/confirm-upload", {
          s3Key,
          correlationId,
        });

        const result = response.data;
        toast.success("File uploaded and confirmed successfully!");
        return result;
      } catch (error: unknown) {
        console.error("Failed to confirm upload:", error);
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to confirm upload. Please try again.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [],
  );

  const uploadWithProgress = useCallback(
    async (file: File, uploadUrl: string) => {
      // Use XHR to track upload progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            setProgress(pct);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress(100);
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => {
          reject(new Error("Network error during upload"));
        };
        xhr.setRequestHeader(
          "Content-Type",
          file.type || "application/octet-stream",
        );
        xhr.send(file);
      });
    },
    [],
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (!uploadGate.allowed) {
        const resetLabel = formatResetDate(
          subscriptionUsageQuery.data?.currentPeriod.endDate,
        );
        setUploadPhase("error");
        setUploadError(
          `You have reached your monthly upload limit. Your limit resets on ${resetLabel}.`,
        );
        return;
      }
      setUploadError(null);
      setUploadedKey(null);
      setProgress(0);
      const file = files[0];
      setUploadPhase("validating");
      const validationError = validateFile(file);
      if (validationError) {
        setUploadPhase("error");
        setUploadError(validationError);
        return;
      }
      try {
        setUploadPhase("requesting_url");
        const uploadType = determineUploadType(file);
        const { uploadUrl, key, correlationId } = await requestPresignedUrl(
          file,
          uploadType,
        );
        setUploadPhase("uploading");
        await uploadWithProgress(file, uploadUrl);
        setUploadPhase("confirming");
        await confirmUpload(key, correlationId);
        invalidateSubscriptionUsage(queryClient);
        setUploadPhase("success");
        setUploadedKey(key);
        onUploadSuccess?.(key);

        // Auto-open assistant and set media context
        setMediaContext(
          key,
          uploadType === "general_image" ? "image" : uploadType,
        );
        openAssistant();

        router.push("/dashboard/library");
      } catch (err: unknown) {
        const status =
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof err.response === "object" &&
          err.response !== null &&
          "status" in err.response &&
          typeof err.response.status === "number"
            ? err.response.status
            : null;

        if (status === 429) {
          invalidateSubscriptionUsage(queryClient);
        }
        setUploadPhase("error");
        const message = err instanceof Error ? err.message : "Upload failed";
        setUploadError(message);
      }
    },
    [
      onUploadSuccess,
      requestPresignedUrl,
      uploadWithProgress,
      validateFile,
      confirmUpload,
      determineUploadType,
      openAssistant,
      router,
      setMediaContext,
      uploadGate.allowed,
      subscriptionUsageQuery.data?.currentPeriod.endDate,
      queryClient,
    ],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isBusy) return;
      const dt = e.dataTransfer;
      handleFiles(dt.files);
    },
    [handleFiles, isBusy],
  );

  const onBrowseClick = useCallback(() => {
    if (isBusy) return;
    fileInputRef.current?.click();
  }, [isBusy]);

  const analyzeSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onAnalyzeLink?.(url);
    },
    [onAnalyzeLink, url],
  );
  const inputId = useId();

  const { data: dashboardData } = useDashboardOverview();

  return (
    <section className="flex flex-1 flex-col gap-4 py-4 px-4 sm:px-6 md:px-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-col items-start gap-1 flex">
          <h1 className="text-responsive-2xl font-medium text-black leading-9">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Hello, {userName}! Ready to verify some media?
          </p>
        </div>
        {dashboardData?.subscription && (
          <Badge
            className={`${getSubscriptionBadgeColor(dashboardData.subscription.tier)} w-fit`}
          >
            {formatSubscriptionTier(dashboardData.subscription.tier)}
          </Badge>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {subscriptionUsageQuery.data ? (
          <>
            <UsageCard
              icon={FileUp}
              label="Uploads"
              sublabel="This month"
              bucket={fileUsage}
            />
            <UsageCard
              icon={FlaskConical}
              label="Analyses"
              sublabel="This month"
              bucket={analysisUsage}
            />
            <UsageCard
              icon={Layers}
              label="Batches"
              sublabel="This month"
              bucket={batchUsage}
            />
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Usage Resets
                  </p>
                  <div className="rounded-md bg-slate-100 dark:bg-slate-800 p-1.5">
                    <CalendarClock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {formatResetDate(
                    subscriptionUsageQuery.data.currentPeriod.endDate,
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Next billing cycle
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-7 rounded-md" />
                </div>
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-2 w-full rounded-full" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="p-4 sm:p-6">
        <CardContent className="p-0 w-full space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-black">
              Start a New Analysis
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Upload media to verify authenticity
            </p>
          </div>
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${getUsageToneClasses(uploadThreshold)}`}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span>{formatUsageValue(fileUsage)} uploads used this month</span>
              <span>
                Resets{" "}
                {formatResetDate(
                  subscriptionUsageQuery.data?.currentPeriod.endDate,
                )}
              </span>
            </div>
          </div>

          {/* URL Upload Form */}
          <form onSubmit={analyzeSubmit} className="space-y-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-lg border border-muted-foreground/20">
              <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                aria-label="Media URL"
                className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 text-sm placeholder:text-muted-foreground/60"
                placeholder="Paste media URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isBusy || !uploadGate.allowed}
              />
            </div>
            <Button
              type="submit"
              className="cursor-pointer w-full sm:w-auto sm:min-w-[140px]"
              disabled={isBusy || !uploadGate.allowed}
              onClick={handleUpload}
            >
              {isBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                "Upload from URL"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* File Upload Dropzone */}
          <section
            className="relative w-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all"
            aria-label="Upload dropzone"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onBrowseClick();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={onDrop}
          >
            <label
              htmlFor={inputId}
              className="flex flex-col items-center gap-4 w-full py-8 sm:py-10 px-4 cursor-pointer"
            >
              <div className="p-3 rounded-full bg-primary/10">
                <UploadIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>

              <div className="flex flex-col items-center gap-2 w-full">
                <p className="text-sm sm:text-base font-medium text-center text-foreground">
                  <span className="hidden sm:inline">
                    Drop files here or click to browse
                  </span>
                  <span className="sm:hidden">Tap to select files</span>
                </p>
                <p className="text-xs text-muted-foreground text-center max-w-xs">
                  JPEG, PNG, MP4, MOV, MP3, WAV (Max 1GB)
                </p>
              </div>

              {uploadPhase === "uploading" && (
                <div className="w-full max-w-sm space-y-2">
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Uploading... {progress}%
                  </p>
                </div>
              )}

              {uploadPhase === "confirming" && (
                <div className="w-full max-w-sm space-y-2">
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all animate-pulse rounded-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Confirming upload...
                  </p>
                </div>
              )}

              {uploadPhase === "success" && uploadedKey && (
                <div className="flex items-center gap-2 text-green-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm font-medium">Uploaded successfully!</p>
                </div>
              )}

              {uploadPhase === "error" && uploadError && (
                <div className="flex items-center gap-2 text-red-600 max-w-sm">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <p className="text-sm">{uploadError}</p>
                </div>
              )}

              <input
                id={inputId}
                ref={fileInputRef}
                type="file"
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
                accept={[
                  ".jpg",
                  ".jpeg",
                  ".png",
                  ".heic",
                  ".heif",
                  ".mp4",
                  ".mov",
                  ".mp3",
                  ".wav",
                  ".m4a",
                  ".aac",
                  ".ogg",
                  "image/*",
                  "video/*",
                  "audio/*",
                ].join(",")}
                disabled={isBusy || !uploadGate.allowed}
              />
            </label>
          </section>
        </CardContent>
      </Card>

      {/* Dashboard Overview */}
      <DashboardOverview />

      {/* AI Intent Assistant */}
      <AssistantErrorBoundary>
        <AssistantPanel />
      </AssistantErrorBoundary>
    </section>
  );
};

export default Dashboard;
