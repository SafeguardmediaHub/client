"use client";

import {
  AlertCircle,
  ArrowLeft,
  CloudUpload,
  Clock,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { FeatureInfoDialog, FEATURE_INFO } from "@/components/FeatureInfoDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type GetKeyframeExtractionResponse,
  type KeyframeExtractionStatus,
  type KeyframeFrame,
  isTerminalKeyframeStatus,
  useKeyframeExtraction,
  useKeyframeStatus,
} from "@/hooks/useKeyframes";
import { useUploadKeyframe } from "@/hooks/useMedia";

const formatTimestamp = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const formatDuration = (seconds: number | undefined): string => {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return "—";
  return formatTimestamp(seconds);
};

const statusLabel: Record<KeyframeExtractionStatus, string> = {
  pending: "Queued",
  processing: "Processing",
  completed: "Completed",
  partial: "Partially completed",
  failed: "Failed",
  expired: "Expired",
};

const KeyframeExtractionDetail = () => {
  const params = useParams();
  const router = useRouter();
  const extractionId = (params?.extractionId as string) || "";

  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [uploadingFrames, setUploadingFrames] = useState<Set<string>>(
    new Set(),
  );
  const [uploadedFrames, setUploadedFrames] = useState<Set<string>>(new Set());
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState({
    current: 0,
    total: 0,
  });

  const uploadKeyframeMutation = useUploadKeyframe();
  const statusQuery = useKeyframeStatus(extractionId);
  const recordQuery = useKeyframeExtraction(extractionId);

  const liveStatus =
    statusQuery.data?.extraction?.effectiveStatus ??
    statusQuery.data?.extraction?.status;
  const isTerminal = isTerminalKeyframeStatus(liveStatus);

  const data: GetKeyframeExtractionResponse | undefined = isTerminal
    ? (recordQuery.data ?? statusQuery.data)
    : statusQuery.data;

  const isLoading =
    (statusQuery.isLoading && !statusQuery.data) ||
    (isTerminal && recordQuery.isLoading && !recordQuery.data);

  const extraction = data?.extraction;
  const frames: KeyframeFrame[] = useMemo(() => {
    const list = data?.frames ?? [];
    return [...list].sort((a, b) => a.index - b.index);
  }, [data?.frames]);

  const effectiveStatus =
    extraction?.effectiveStatus ?? extraction?.status ?? "pending";
  const progress =
    typeof data?.queue?.progress === "number" ? data.queue.progress : 0;
  const requested = extraction?.requestedFrameCount ?? 0;
  const achievable = extraction?.achievableFrameCount ?? 0;
  const actual = extraction?.actualFrameCount ?? frames.length;
  const showShortVideoBanner =
    achievable > 0 && requested > 0 && achievable < requested;

  const handleDownload = useCallback((frame: KeyframeFrame) => {
    if (!frame.signedUrl) {
      toast.error("Frame is not ready for download yet.");
      return;
    }
    const link = document.createElement("a");
    link.href = frame.signedUrl;
    link.download = frame.fileName ?? `keyframe_${frame.index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  const uploadFrameToLibrary = useCallback(
    async (frame: KeyframeFrame) => {
      if (!frame.signedUrl) {
        throw new Error("Frame signed URL is not available.");
      }
      const fileName =
        frame.fileName ?? `keyframe_${frame.index + 1}.jpg`;
      const response = await fetch(frame.signedUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch frame image (HTTP ${response.status}).`,
        );
      }
      const blob = await response.blob();
      const file = new File([blob], fileName, {
        type: blob.type || "image/jpeg",
      });
      await uploadKeyframeMutation.mutateAsync({
        file,
        metadata: {
          isKeyframe: true,
          sourceVideo: extraction?.sourceMediaId ?? "",
          frameIndex: frame.index,
          timestamp: formatTimestamp(frame.timestampSeconds),
        },
      });
    },
    [extraction?.sourceMediaId, uploadKeyframeMutation],
  );

  const handleUploadToLibrary = useCallback(
    async (frame: KeyframeFrame) => {
      const key = frame.frameMediaId;
      if (uploadingFrames.has(key) || uploadedFrames.has(key)) return;

      try {
        setUploadingFrames((prev) => new Set(prev).add(key));
        toast.info(`Uploading keyframe ${frame.index + 1}…`);
        await uploadFrameToLibrary(frame);
        setUploadedFrames((prev) => new Set(prev).add(key));
        toast.success(`Keyframe ${frame.index + 1} uploaded to library.`);
      } catch (error) {
        console.error("Error uploading keyframe to library:", error);
        toast.error(`Failed to upload keyframe ${frame.index + 1}.`);
      } finally {
        setUploadingFrames((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [uploadFrameToLibrary, uploadingFrames, uploadedFrames],
  );

  const handleBulkUploadAll = useCallback(async () => {
    if (isBulkUploading) return;
    const pending = frames.filter(
      (f) => !uploadedFrames.has(f.frameMediaId) && Boolean(f.signedUrl),
    );
    if (pending.length === 0) {
      toast.info("All keyframes are already uploaded to your library.");
      return;
    }

    setIsBulkUploading(true);
    setBulkUploadProgress({ current: 0, total: pending.length });
    toast.info(`Uploading ${pending.length} keyframes to library…`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < pending.length; i++) {
      const frame = pending[i];
      const key = frame.frameMediaId;
      try {
        setUploadingFrames((prev) => new Set(prev).add(key));
        await uploadFrameToLibrary(frame);
        setUploadedFrames((prev) => new Set(prev).add(key));
        success++;
      } catch (error) {
        console.error(`Error uploading keyframe ${frame.index}:`, error);
        failed++;
      } finally {
        setUploadingFrames((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        setBulkUploadProgress({ current: i + 1, total: pending.length });
      }
    }

    setIsBulkUploading(false);

    if (failed === 0) {
      toast.success(`Uploaded all ${success} keyframes to your library.`);
    } else if (success > 0) {
      toast.warning(`Uploaded ${success} keyframes, ${failed} failed.`);
    } else {
      toast.error("Failed to upload keyframes. Please try again.");
    }
  }, [
    frames,
    isBulkUploading,
    uploadFrameToLibrary,
    uploadedFrames,
  ]);

  const pendingUploadCount = useMemo(
    () =>
      frames.filter(
        (f) => !uploadedFrames.has(f.frameMediaId) && Boolean(f.signedUrl),
      ).length,
    [frames, uploadedFrames],
  );

  if (statusQuery.isError && !statusQuery.data) {
    return (
      <section className="flex flex-1 flex-col gap-4 py-4 px-8">
        <Header onInfoClick={() => setShowInfoDialog(true)} />
        <Card className="p-6 w-full">
          <CardContent className="p-0 flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div>
              <h2 className="text-lg font-semibold">
                Couldn&apos;t load this extraction
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {(statusQuery.error as Error)?.message ||
                  "The extraction may not exist or you may not have access."}
              </p>
            </div>
            <Button onClick={() => router.push("/dashboard/keyframe")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Keyframe Extraction
            </Button>
          </CardContent>
        </Card>
        <FeatureInfoDialog
          open={showInfoDialog}
          onOpenChange={setShowInfoDialog}
          featureInfo={FEATURE_INFO.keyframe}
        />
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col gap-4 py-4 px-8">
      <Header onInfoClick={() => setShowInfoDialog(true)} />

      <FeatureInfoDialog
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
        featureInfo={FEATURE_INFO.keyframe}
      />

      {isLoading || !extraction ? (
        <Card className="p-6 w-full">
          <CardContent className="p-0 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-2 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="p-6 w-full">
            <CardContent className="p-0 space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold">
                      {statusLabel[effectiveStatus]}
                    </h2>
                    <StatusBadge status={effectiveStatus} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {actual} of {requested} frames extracted
                    {extraction.videoMetadata?.durationSeconds
                      ? ` • Video length ${formatDuration(extraction.videoMetadata.durationSeconds)}`
                      : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/dashboard/keyframe")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
              </div>

              {!isTerminal && (
                <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting keyframes…
                    </span>
                    <span className="text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                    />
                  </div>
                </div>
              )}

              {showShortVideoBanner && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-900">
                    You requested {requested} frames, but this video only
                    supports up to {achievable} distinct frames. Showing all{" "}
                    {achievable}.
                  </p>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Keyframes are kept for 30 days. Download or re-use them
                  before then.
                </p>
              </div>

              {effectiveStatus === "failed" && (
                <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      Extraction failed
                    </p>
                    <p className="text-sm text-destructive/90 mt-1">
                      {extraction.errorInfo?.message ||
                        "An unexpected error occurred while extracting frames."}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push("/dashboard/keyframe")}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {effectiveStatus === "expired" && (
                <div className="flex items-start gap-3 p-4 bg-muted border border-border rounded-lg">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      This extraction has expired
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Frames are retained for 30 days. Re-run the extraction to
                      generate fresh frames.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push("/dashboard/keyframe")}
                  >
                    Re-extract
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {frames.length > 0 && (
            <Card className="p-4 md:p-6 w-full">
              <CardContent className="p-0 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Extracted Keyframes
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Frames selected based on motion, lighting, and composition
                      changes
                    </p>
                    {isBulkUploading && (
                      <p className="text-xs text-primary mt-1">
                        Uploading {bulkUploadProgress.current} of{" "}
                        {bulkUploadProgress.total} keyframes…
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleBulkUploadAll}
                      disabled={isBulkUploading || pendingUploadCount === 0}
                      className="w-full sm:w-auto"
                    >
                      <CloudUpload className="w-4 h-4 mr-2" />
                      {isBulkUploading
                        ? "Uploading…"
                        : pendingUploadCount === 0
                          ? "All Uploaded"
                          : `Upload All (${pendingUploadCount})`}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {frames.map((frame) => {
                    const key = frame.frameMediaId;
                    const isUploading = uploadingFrames.has(key);
                    const isUploaded = uploadedFrames.has(key);
                    return (
                      <div key={key} className="space-y-2">
                        <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video">
                          {frame.signedUrl ? (
                            // biome-ignore lint/performance/noImgElement: signed URLs are short-lived; next/image not configured for this host
                            <img
                              src={frame.signedUrl}
                              alt={
                                frame.fileName ?? `Keyframe ${frame.index + 1}`
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {formatTimestamp(frame.timestampSeconds)}
                          </div>
                          <div className="absolute bottom-2 left-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded font-medium">
                            JPG
                          </div>
                          {isUploaded && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <span>✓</span>
                              <span>Uploaded</span>
                            </div>
                          )}
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="px-1">
                          <p
                            className="text-xs text-muted-foreground truncate"
                            title={frame.fileName ?? `frame_${frame.index}`}
                          >
                            {frame.fileName ?? `frame_${frame.index + 1}.jpg`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={isUploaded ? "secondary" : "default"}
                            size="sm"
                            className="flex-1"
                            onClick={() => handleUploadToLibrary(frame)}
                            disabled={
                              isUploading ||
                              isUploaded ||
                              isBulkUploading ||
                              !frame.signedUrl
                            }
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Uploading…
                              </>
                            ) : isUploaded ? (
                              <>
                                <span className="mr-1">✓</span>
                                Uploaded
                              </>
                            ) : (
                              <>
                                <CloudUpload className="w-3 h-3 mr-1" />
                                Upload
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDownload(frame)}
                            disabled={!frame.signedUrl}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </section>
  );
};

const Header = ({ onInfoClick }: { onInfoClick: () => void }) => (
  <header className="flex-col items-start gap-1 flex">
    <div className="flex items-center justify-between w-full">
      <div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/keyframe"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Keyframe Extraction
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Extraction</span>
        </div>
        <h1 className="text-2xl font-medium text-black leading-9">
          Extraction Details
        </h1>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onInfoClick}
        className="cursor-pointer"
      >
        <Info className="size-4 mr-2" />
        How it works
      </Button>
    </div>
  </header>
);

const StatusBadge = ({ status }: { status: KeyframeExtractionStatus }) => {
  const color =
    status === "completed"
      ? "bg-green-100 text-green-700 border-green-200"
      : status === "partial"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : status === "failed"
          ? "bg-red-100 text-red-700 border-red-200"
          : status === "expired"
            ? "bg-muted text-muted-foreground border-border"
            : "bg-blue-100 text-blue-700 border-blue-200";
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${color}`}
    >
      {statusLabel[status]}
    </span>
  );
};

export default KeyframeExtractionDetail;
