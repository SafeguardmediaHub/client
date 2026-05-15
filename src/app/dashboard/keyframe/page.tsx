"use client";

import {
  Info,
  Loader2,
  RotateCcw,
  Trash2,
  UploadIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type FC,
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { FeatureInfoDialog, FEATURE_INFO } from "@/components/FeatureInfoDialog";
import { ExtractionView } from "@/components/keyframe/ExtractionView";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  type KeyframeExtractionListItem,
  type KeyframeExtractionStatus,
  useDeleteKeyframeExtraction,
  useExtractKeyframes,
  useListKeyframeExtractions,
} from "@/hooks/useKeyframes";
import api from "@/lib/api";

const INFO_DIALOG_SEEN_KEY = "keyframe-info-seen";
const PAGE_LIMIT = 10;
const MAX_BYTES = 1_000_000_000; // 1GB
const ALLOWED_EXTENSIONS = [
  "mp4",
  "mov",
  "avi",
  "mkv",
  "webm",
  "flv",
  "ogv",
  "wmv",
  "3gp",
  "mpg",
  "mpeg",
  "f4v",
];

type Phase = "idle" | "uploading" | "confirming" | "extracting" | "error";

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const formatTimestamp = (seconds: number | undefined): string => {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return "—";
  const total = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const formatDate = (iso: string | undefined): string => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
};

const statusBadge = (
  status: KeyframeExtractionStatus,
): { label: string; classes: string } => {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        classes: "bg-green-100 text-green-700 border-green-200",
      };
    case "partial":
      return {
        label: "Partial",
        classes: "bg-amber-100 text-amber-700 border-amber-200",
      };
    case "failed":
      return {
        label: "Failed",
        classes: "bg-red-100 text-red-700 border-red-200",
      };
    case "expired":
      return {
        label: "Expired",
        classes: "bg-muted text-muted-foreground border-border",
      };
    case "processing":
      return {
        label: "Processing",
        classes: "bg-blue-100 text-blue-700 border-blue-200",
      };
    case "pending":
    default:
      return {
        label: "Queued",
        classes: "bg-blue-100 text-blue-700 border-blue-200",
      };
  }
};

const Keyframe: FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [phaseError, setPhaseError] = useState<string | null>(null);
  const [extractionId, setExtractionId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [frameCount, setFrameCount] = useState<number>(20);
  const [limitTimeRange, setLimitTimeRange] = useState(false);
  const [startSeconds, setStartSeconds] = useState<string>("0");
  const [endSeconds, setEndSeconds] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] =
    useState<KeyframeExtractionListItem | null>(null);

  const extractMutation = useExtractKeyframes();
  const deleteMutation = useDeleteKeyframeExtraction();
  const listQuery = useListKeyframeExtractions({
    page: currentPage,
    limit: PAGE_LIMIT,
  });

  // First-visit info dialog (gated by localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = window.localStorage.getItem(INFO_DIALOG_SEEN_KEY);
      if (!seen) setShowInfoDialog(true);
    } catch {
      // ignore
    }
  }, []);

  const handleInfoDialogChange = useCallback((open: boolean) => {
    setShowInfoDialog(open);
    if (!open && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(INFO_DIALOG_SEEN_KEY, "true");
      } catch {
        // ignore
      }
    }
  }, []);

  const validateFile = useCallback((candidate: File): string | null => {
    if (candidate.size > MAX_BYTES) {
      return "File is too large. Max size is 1GB.";
    }
    const ext = candidate.name.split(".").pop()?.toLowerCase() ?? "";
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);
    const isAllowedMime = candidate.type.startsWith("video/");
    if (!isAllowedExt && !isAllowedMime) {
      return "Unsupported file type. Please upload a video file (MP4, MOV, AVI, MKV, WebM, etc.).";
    }
    return null;
  }, []);

  const handleFileChosen = useCallback(
    (candidate: File) => {
      const err = validateFile(candidate);
      if (err) {
        toast.error(err);
        return;
      }
      setFile(candidate);
      setPhaseError(null);
    },
    [validateFile],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFileChosen(f);
      // reset so the same file can be picked again
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFileChosen],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (phase !== "idle") return;
      const f = e.dataTransfer.files?.[0];
      if (f) handleFileChosen(f);
    },
    [handleFileChosen, phase],
  );

  const timeRangeError = useMemo(() => {
    if (!limitTimeRange) return null;
    const s = Number(startSeconds);
    const e = Number(endSeconds);
    if (!Number.isFinite(s) || s < 0) return "Start must be 0 or greater.";
    if (!Number.isFinite(e) || e <= 0) return "End must be greater than 0.";
    if (e <= s) return "End must be greater than start.";
    return null;
  }, [limitTimeRange, startSeconds, endSeconds]);

  const frameCountError = useMemo(() => {
    if (!Number.isFinite(frameCount) || frameCount < 1 || frameCount > 60) {
      return "Frame count must be between 1 and 60.";
    }
    return null;
  }, [frameCount]);

  const isBusy =
    phase === "uploading" ||
    phase === "confirming" ||
    phase === "extracting" ||
    extractMutation.isPending;

  const canSubmit =
    Boolean(file) && !isBusy && !frameCountError && !timeRangeError;

  const uploadFileToS3 = useCallback(
    (target: File, uploadUrl: string): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            resolve();
          } else {
            reject(new Error(`Upload failed (HTTP ${xhr.status}).`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.setRequestHeader(
          "Content-Type",
          target.type || "application/octet-stream",
        );
        xhr.send(target);
      }),
    [],
  );

  const handleExtract = useCallback(async () => {
    if (!file) {
      toast.error("Please choose a video first.");
      return;
    }
    if (frameCountError || timeRangeError) {
      toast.error(frameCountError ?? timeRangeError ?? "Invalid options.");
      return;
    }

    setPhaseError(null);
    setUploadProgress(0);

    try {
      // 1. Presigned URL
      setPhase("uploading");
      const presignedRes = await api.post("/api/media/presigned-url", {
        filename: file.name,
        contentType: file.type || "video/mp4",
        fileSize: file.size,
        uploadType: "video",
      });
      const upload = presignedRes.data?.data?.upload;
      if (!upload?.uploadUrl || !upload?.s3Key || !upload?.correlationId) {
        throw new Error("Presigned URL response was malformed.");
      }

      // 2. Direct S3 upload
      await uploadFileToS3(file, upload.uploadUrl);

      // 3. Confirm upload → mediaId
      setPhase("confirming");
      const confirmRes = await api.post("/api/media/confirm-upload", {
        s3Key: upload.s3Key,
        correlationId: upload.correlationId,
      });
      const confirmed = confirmRes.data;
      const mediaId =
        confirmed?.data?.media?.id ??
        confirmed?.data?.media?._id ??
        confirmed?.data?.id ??
        confirmed?.data?._id ??
        confirmed?.media?.id ??
        confirmed?.id;
      if (!mediaId) {
        throw new Error(
          "Upload was confirmed but no media ID was returned.",
        );
      }

      // 4. Submit extraction
      setPhase("extracting");
      const body: Parameters<typeof extractMutation.mutateAsync>[0] = {
        mediaId,
        frameCount,
      };
      if (limitTimeRange) {
        body.timeRange = {
          startSeconds: Number(startSeconds),
          endSeconds: Number(endSeconds),
        };
      }
      const extractResult = await extractMutation.mutateAsync(body);
      const newExtractionId = extractResult?.extraction?.id;
      if (!newExtractionId) {
        throw new Error("Extraction was queued but no ID was returned.");
      }
      setExtractionId(newExtractionId);
    } catch (err) {
      console.error("Upload/extract chain failed:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to start extraction.";
      setPhaseError(msg);
      setPhase("error");
      toast.error(msg);
    }
  }, [
    extractMutation,
    file,
    frameCount,
    frameCountError,
    limitTimeRange,
    startSeconds,
    endSeconds,
    timeRangeError,
    uploadFileToS3,
  ]);

  const handleStartOver = useCallback(() => {
    setFile(null);
    setPhase("idle");
    setUploadProgress(0);
    setPhaseError(null);
    setExtractionId(null);
  }, []);

  const extractions = listQuery.data?.extractions ?? [];
  const pagination = listQuery.data?.pagination;
  const filteredExtractions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return extractions;
    return extractions.filter((item) => {
      const name = item.sourceMedia?.filename ?? "";
      return name.toLowerCase().includes(q);
    });
  }, [extractions, searchQuery]);

  const totalPages = pagination?.totalPages ?? 1;

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // toasted by hook's onError
    }
  }, [deleteMutation, deleteTarget]);

  const showExtractionView = Boolean(extractionId);

  return (
    <section className="flex flex-1 flex-col gap-4 py-4 px-8">
      <header className="flex-col items-start gap-1 flex">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-medium text-black leading-9">
              Keyframe Extraction
            </h1>
            <p className="text-sm text-muted-foreground">
              Intelligently extract the most important frames from videos for
              focused analysis
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInfoDialog(true)}
            className="cursor-pointer"
          >
            <Info className="size-4 mr-2" />
            How it works
          </Button>
        </div>
      </header>

      <FeatureInfoDialog
        open={showInfoDialog}
        onOpenChange={handleInfoDialogChange}
        featureInfo={FEATURE_INFO.keyframe}
      />

      {showExtractionView ? (
        <>
          <ExtractionView
            extractionId={extractionId as string}
            onRetry={handleStartOver}
          />
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleStartOver}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Extract Another Video
            </Button>
          </div>
        </>
      ) : (
        <Card className="flex flex-col items-start gap-6 p-6 relative self-stretch w-full">
          <CardContent className="p-0 w-full">
            {!file ? (
              <div
                className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/30 hover:bg-muted/30"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (phase === "idle") setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <UploadIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    Drag and drop a video, or
                  </p>
                  <Button
                    variant="link"
                    className="px-1 h-auto"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse from your computer
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  MP4, MOV, AVI, MKV, WebM, FLV, OGV, WMV, 3GP, MPG, MPEG, F4V
                  · up to 1GB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>
            ) : phase === "uploading" || phase === "confirming" ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {phase === "uploading"
                        ? "Uploading…"
                        : "Finalizing upload…"}
                    </span>
                    <span className="text-muted-foreground">
                      {phase === "uploading" ? `${uploadProgress}%` : ""}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{
                        width:
                          phase === "uploading"
                            ? `${uploadProgress}%`
                            : "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <h3 className="text-sm font-medium">Selected Video</h3>
                  <span className="text-xs text-green-600 font-medium">
                    Ready
                  </span>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <title>Video file</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.type || "video"} · {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="frame-count">Number of frames</Label>
                    <Input
                      id="frame-count"
                      type="number"
                      min={1}
                      max={60}
                      value={Number.isFinite(frameCount) ? frameCount : ""}
                      onChange={(e) =>
                        setFrameCount(parseInt(e.target.value, 10))
                      }
                      className="max-w-[160px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      1–60 frames (default 20)
                    </p>
                    {frameCountError && (
                      <p className="text-xs text-destructive">
                        {frameCountError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="limit-range-switch">
                        Limit to time range
                      </Label>
                      <Switch
                        id="limit-range-switch"
                        checked={limitTimeRange}
                        onCheckedChange={setLimitTimeRange}
                      />
                    </div>
                    {limitTimeRange && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="start-seconds">
                            Start (seconds)
                          </Label>
                          <Input
                            id="start-seconds"
                            type="number"
                            min={0}
                            step="0.1"
                            value={startSeconds}
                            onChange={(e) => setStartSeconds(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="end-seconds">End (seconds)</Label>
                          <Input
                            id="end-seconds"
                            type="number"
                            min={0}
                            step="0.1"
                            value={endSeconds}
                            onChange={(e) => setEndSeconds(e.target.value)}
                          />
                        </div>
                        {timeRangeError && (
                          <p className="col-span-2 text-xs text-destructive">
                            {timeRangeError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {phase === "error" && phaseError && (
                  <p className="text-sm text-destructive">{phaseError}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleExtract}
                    disabled={!canSubmit}
                    className="flex-1"
                  >
                    {extractMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Extract Keyframes"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setFile(null);
                      setPhase("idle");
                      setPhaseError(null);
                    }}
                    disabled={isBusy}
                  >
                    Choose Different Video
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="p-6 w-full">
        <CardContent className="p-0 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Recent Keyframe Extractions
            </h3>
          </div>

          <div className="relative">
            <Input
              placeholder="Search by filename…"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-sm text-muted-foreground">
                  <th className="text-left font-medium max-md:text-[12px] py-3 px-4">
                    Media
                  </th>
                  <th className="text-left font-medium py-3 max-md:text-[12px] px-4">
                    File name
                  </th>
                  <th className="text-left font-medium py-3 max-md:text-[12px] px-4">
                    Video Length
                  </th>
                  <th className="text-left font-medium py-3 max-md:text-[12px] px-4">
                    Frames Extracted
                  </th>
                  <th className="text-left font-medium py-3 max-md:text-[12px] px-4">
                    Status
                  </th>
                  <th className="text-left font-medium py-3 max-md:text-[12px] px-4">
                    Date
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listQuery.isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin inline" />
                    </td>
                  </tr>
                ) : filteredExtractions.length > 0 ? (
                  filteredExtractions.map((item) => {
                    const status =
                      item.effectiveStatus ?? item.status ?? "pending";
                    const badge = statusBadge(status);
                    const filename =
                      item.sourceMedia?.filename ?? "Unknown video";
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/keyframe/${item.id}`)
                        }
                      >
                        <td className="py-3 px-4">
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>Video</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm truncate max-w-[240px]">
                          {filename}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {formatTimestamp(
                            item.videoMetadata?.durationSeconds,
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {item.actualFrameCount}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badge.classes}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-destructive p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(item);
                            }}
                            aria-label="Delete extraction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      No extractions yet. Upload a video above to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Page {pagination?.page ?? currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination?.hasPrevPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={!pagination?.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this extraction?</DialogTitle>
            <DialogDescription>
              This will permanently remove the extraction and all of its
              frames. Any frame you&apos;ve already sent to another feature
              (reverse lookup, geolocation, etc.) will become unavailable.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Keyframe;
