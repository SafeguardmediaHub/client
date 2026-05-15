"use client";

import { Info, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FeatureInfoDialog, FEATURE_INFO } from "@/components/FeatureInfoDialog";
import MediaSelector from "@/components/media/MediaSelector";
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
import { type Media, useGetMedia } from "@/hooks/useMedia";

const INFO_DIALOG_SEEN_KEY = "keyframe-info-seen";
const PAGE_LIMIT = 10;

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

  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const [frameCount, setFrameCount] = useState<number>(20);
  const [limitTimeRange, setLimitTimeRange] = useState(false);
  const [startSeconds, setStartSeconds] = useState<string>("0");
  const [endSeconds, setEndSeconds] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] =
    useState<KeyframeExtractionListItem | null>(null);

  const { data: mediaData } = useGetMedia();
  const media = mediaData?.media || [];

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
      // ignore localStorage errors
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

  const handleMediaSelection = useCallback(
    (mediaFile: Media) => {
      const file = media.find((m) => m.id === mediaFile.id) ?? mediaFile;
      if (!file.mimeType?.startsWith("video/")) {
        toast.error(
          "Please select a video file. Images are not supported for keyframe extraction.",
        );
        return;
      }
      setSelectedMedia(file);
    },
    [media],
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

  const canSubmit =
    Boolean(selectedMedia) &&
    !extractMutation.isPending &&
    !frameCountError &&
    !timeRangeError;

  const handleExtract = useCallback(async () => {
    if (!selectedMedia) {
      toast.error("Please select a video first.");
      return;
    }
    if (frameCountError || timeRangeError) {
      toast.error(frameCountError ?? timeRangeError ?? "Invalid options.");
      return;
    }

    const body: Parameters<typeof extractMutation.mutateAsync>[0] = {
      mediaId: selectedMedia.id,
      frameCount,
    };
    if (limitTimeRange) {
      body.timeRange = {
        startSeconds: Number(startSeconds),
        endSeconds: Number(endSeconds),
      };
    }

    try {
      const result = await extractMutation.mutateAsync(body);
      const extractionId = result?.extraction?.id;
      if (!extractionId) {
        toast.error("Extraction started but no ID was returned.");
        return;
      }
      router.push(`/dashboard/keyframe/${extractionId}`);
    } catch {
      // Toasted by the hook's onError.
    }
  }, [
    extractMutation,
    frameCount,
    frameCountError,
    limitTimeRange,
    router,
    selectedMedia,
    startSeconds,
    endSeconds,
    timeRangeError,
  ]);

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
      // Toasted by the hook's onError.
    }
  }, [deleteMutation, deleteTarget]);

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

      <Card className="flex flex-col items-start gap-6 p-6 relative self-stretch w-full">
        <CardContent className="p-0 w-full">
          {!selectedMedia ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a video from your library
                </label>
                <MediaSelector
                  onSelect={handleMediaSelection}
                  filterType="video"
                />
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Supported formats:</span> MP4,
                  AVI, MOV, MKV, WebM, FLV, OGV, WMV, 3GP, MPG, MPEG, F4V
                </p>
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
                      {selectedMedia.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedMedia.mimeType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Frame count + time range config */}
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
                    <p className="text-xs text-destructive">{frameCountError}</p>
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
                        <Label htmlFor="start-seconds">Start (seconds)</Label>
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
                  onClick={() => setSelectedMedia(null)}
                  disabled={extractMutation.isPending}
                >
                  Select Different Video
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
                      No extractions yet. Pick a video above to get started.
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
