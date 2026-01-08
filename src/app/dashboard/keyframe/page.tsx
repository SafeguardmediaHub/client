"use client";

import { LinkIcon, Loader2, UploadIcon, CloudUpload, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { FeatureInfoDialog, FEATURE_INFO } from "@/components/FeatureInfoDialog";
import { useUploadKeyframe } from "@/hooks/useMedia";
import api from "@/lib/api";
import {
  batchProcessingData,
  chartCategories,
  chartData,
  recentActivities,
  statisticsData,
} from "@/lib/data";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import MediaSelector from '@/components/media/MediaSelector';
import { type Media, useGetMedia } from '@/hooks/useMedia';

type DashboardProps = {
  userName?: string;
  onAnalyzeLink?: (url: string) => void;
  onUploadSuccess?: (key: string) => void;
};

const MAX_BYTES = 1_000_000_000; // 1GB
const ALLOWED_MIME_PREFIXES = ["video/"];
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

const Keyframe: FC<DashboardProps> = ({
  userName = "there",
  onAnalyzeLink,
  onUploadSuccess,
}) => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<
    Array<{
      name: string;
      size: number;
      progress: number;
      status: "uploading" | "completed" | "extracting";
      key?: string;
    }>
  >([]);
  const [actualFile, setActualFile] = useState<File | null>(null);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractedKeyframes, setExtractedKeyframes] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const isBusy = useMemo(() => uploadingFiles.length > 0, [uploadingFiles]);
  const [mockExtractions, setMockExtractions] = useState<
    Array<{
      id: number;
      fileName: string;
      videoLength: string;
      framesExtracted: number;
      uploadDate: string;
    }>
  >([]);
  const [uploadingFrames, setUploadingFrames] = useState<Set<number>>(
    new Set()
  );
  const [uploadedFrames, setUploadedFrames] = useState<Set<number>>(new Set());
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const uploadKeyframeMutation = useUploadKeyframe();
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const { data } = useGetMedia();
  const media = data?.media || [];

  const handleMediaSelection = (mediaFile: Media) => {
    const selectedFile = media.find((file) => file.id === mediaFile.id);

    if (selectedFile) {
      const isVideo = selectedFile.mimeType.startsWith('video/');

      if (!isVideo) {
        toast.error('Please select a video file. Images are not supported for keyframe extraction.');
        return;
      }

      setSelectedMedia(selectedFile);
    }
  };

  // Show dialog on first visit
  useEffect(() => {
    setShowInfoDialog(true);
  }, []);

  const filteredExtractions = mockExtractions.filter((item) =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExtractions.length / itemsPerPage);
  const paginatedExtractions = filteredExtractions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const validateFile = useCallback((file: File) => {
    if (file.size > MAX_BYTES) {
      return "File is too large. Max size is 1GB.";
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);
    const isAllowedMime = ALLOWED_MIME_PREFIXES.some((p) =>
      file.type.startsWith(p)
    );
    if (!isAllowedExt && !isAllowedMime) {
      return "Unsupported file type. Use JPEG, PNG, MP4, MOV, or common audio (MP3, WAV, M4A, AAC, OGG).";
    }
    return null;
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      // Validate
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      setActualFile(file);

      // Simulate upload progress
      setUploadingFiles([
        {
          name: file.name,
          size: file.size,
          progress: 0,
          status: "uploading",
        },
      ]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadingFiles([
          {
            name: file.name,
            size: file.size,
            progress,
            status: "uploading",
          },
        ]);

        if (progress >= 100) {
          clearInterval(interval);
          setUploadingFiles([
            {
              name: file.name,
              size: file.size,
              progress: 100,
              status: "completed",
              key: file.name,
            },
          ]);
          toast.success("File ready for extraction!");
        }
      }, 200);
    },
    [validateFile]
  );

  const handleExtractKeyframes = useCallback(async () => {
    if (!selectedMedia) {
      toast.error("No video selected");
      return;
    }

    setIsExtracting(true);
    setExtractionProgress(0);

    try {
      // Fetch the video file from the media URL
      const videoResponse = await fetch(selectedMedia.publicUrl);
      if (!videoResponse.ok) throw new Error("Failed to fetch video");

      const videoBlob = await videoResponse.blob();
      const videoFile = new File([videoBlob], selectedMedia.filename, { type: selectedMedia.mimeType });

      const formData = new FormData();
      formData.append("video", videoFile);

      const progressInterval = setInterval(() => {
        setExtractionProgress((prev) => Math.min(prev + 5, 90));
      }, 500);

      const response = await fetch(
        "https://safeguardmedia-keyframeextractor.hf.space/extract",
        {
          method: "POST",
          body: formData,
        }
      );

      clearInterval(progressInterval);

      if (!response.ok) throw new Error("Extraction failed");

      const blob = await response.blob();
      setExtractionProgress(95);

      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(blob);

      const imagePromises: Promise<string>[] = [];
      zip.forEach((relativePath, file) => {
        if (!file.dir && /\.(jpg|jpeg|png)$/i.test(relativePath)) {
          imagePromises.push(
            file.async("blob").then((blob) => URL.createObjectURL(blob))
          );
        }
      });

      const images = await Promise.all(imagePromises);
      setExtractedKeyframes(images);
      setExtractionProgress(100);
      setIsExtracting(false);

      // Add to mockExtractions
      const newExtraction = {
        id: mockExtractions.length + 1,
        fileName: selectedMedia.filename,
        videoLength: "00:00",
        framesExtracted: images.length,
        uploadDate: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMockExtractions([newExtraction, ...mockExtractions]);

      toast.success(`Extracted ${images.length} keyframes!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to extract keyframes");
      setIsExtracting(false);
    }
  }, [selectedMedia, mockExtractions]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isBusy) return;
      const dt = e.dataTransfer;
      handleFiles(dt.files);
    },
    [handleFiles, isBusy]
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
    [onAnalyzeLink, url]
  );

  // Convert blob URL to File object
  const blobToFile = useCallback(
    async (blobUrl: string, fileName: string): Promise<File> => {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new File([blob], fileName, { type: "image/jpeg" });
    },
    []
  );

  // Upload individual keyframe
  const handleUploadKeyframe = useCallback(
    async (index: number) => {
      if (uploadingFrames.has(index) || uploadedFrames.has(index)) return;

      const blobUrl = extractedKeyframes[index];
      // const sourceFileName = actualFile?.name || uploadingFiles[0]?.name || "video";
      const sourceFileName = selectedMedia?.filename || "video";
      const fileName = `${sourceFileName.replace(/\.[^/.]+$/, "")}_keyframe_${String(index + 1).padStart(3, "0")}.jpg`;
      const timestamp = `00:${String(Math.floor((index * 17) / 60)).padStart(2, "0")}:${String((index * 17) % 60).padStart(2, "0")}`;

      try {
        setUploadingFrames((prev) => new Set(prev).add(index));
        toast.info(`Uploading keyframe ${index + 1}...`);

        const file = await blobToFile(blobUrl, fileName);
        await uploadKeyframeMutation.mutateAsync({
          file,
          metadata: {
            isKeyframe: true,
            sourceVideo: sourceFileName,
            frameIndex: index,
            timestamp,
          },
        });

        setUploadedFrames((prev) => new Set(prev).add(index));
        toast.success(`Keyframe ${index + 1} uploaded successfully!`);
      } catch (error) {
        console.error("Error uploading keyframe:", error);
        toast.error(`Failed to upload keyframe ${index + 1}`);
      } finally {
        setUploadingFrames((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }
    },
    [
      extractedKeyframes,
      actualFile,
      uploadingFiles,
      uploadingFrames,
      uploadedFrames,
      blobToFile,
      uploadKeyframeMutation,
    ]
  );

  // Bulk upload all keyframes
  const handleBulkUpload = useCallback(async () => {
    if (isBulkUploading || extractedKeyframes.length === 0) return;

    const framesToUpload = extractedKeyframes
      .map((_, index) => index)
      .filter((index) => !uploadedFrames.has(index));

    if (framesToUpload.length === 0) {
      toast.info("All keyframes are already uploaded!");
      return;
    }

    setIsBulkUploading(true);
    setBulkUploadProgress({ current: 0, total: framesToUpload.length });

    toast.info(`Uploading ${framesToUpload.length} keyframes...`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < framesToUpload.length; i++) {
      const index = framesToUpload[i];
      const blobUrl = extractedKeyframes[index];
      const sourceFileName = selectedMedia?.filename || "video";
      // const sourceFileName = actualFile?.name || uploadingFiles[0]?.name || "video";
      const fileName = `${sourceFileName.replace(/\.[^/.]+$/, "")}_keyframe_${String(index + 1).padStart(3, "0")}.jpg`;
      const timestamp = `00:${String(Math.floor((index * 17) / 60)).padStart(2, "0")}:${String((index * 17) % 60).padStart(2, "0")}`;

      try {
        setUploadingFrames((prev) => new Set(prev).add(index));

        const file = await blobToFile(blobUrl, fileName);
        await uploadKeyframeMutation.mutateAsync({
          file,
          metadata: {
            isKeyframe: true,
            sourceVideo: sourceFileName,
            frameIndex: index,
            timestamp,
          },
        });

        setUploadedFrames((prev) => new Set(prev).add(index));
        successCount++;
      } catch (error) {
        console.error(`Error uploading keyframe ${index}:`, error);
        failCount++;
      } finally {
        setUploadingFrames((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
        setBulkUploadProgress({ current: i + 1, total: framesToUpload.length });
      }
    }

    setIsBulkUploading(false);

    if (failCount === 0) {
      toast.success(`Successfully uploaded all ${successCount} keyframes!`);
    } else if (successCount > 0) {
      toast.warning(
        `Uploaded ${successCount} keyframes, ${failCount} failed.`
      );
    } else {
      toast.error("Failed to upload keyframes. Please try again.");
    }
  }, [
    extractedKeyframes,
    actualFile,
    uploadingFiles,
    uploadedFrames,
    isBulkUploading,
    blobToFile,
    uploadKeyframeMutation,
  ]);

  const inputId = useId();

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
        onOpenChange={setShowInfoDialog}
        featureInfo={FEATURE_INFO.keyframe}
      />

      {extractedKeyframes.length === 0 ? (
        <>
          <Card className="flex flex-col items-start gap-6 p-6 relative self-stretch w-full">
            <CardContent className="p-0 w-full">
              {!selectedMedia ? (
                <div className="space-y-6">
                  {/* Media Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select a video from your library
                    </label>
                    <MediaSelector
                      onSelect={handleMediaSelection}
                      // filterType="video"
                    />
                  </div>

                  {/* Info Card */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Supported formats:</span> MP4, AVI, MOV, MKV, WebM, FLV, OGV, WMV, 3GP, MPG, MPEG, F4V (up to 500MB)
                    </p>
                  </div>
                </div>
              ) : isExtracting ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{selectedMedia.filename}</span>
                  </div>
                  <div className="text-center py-12 space-y-4">
                    <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
                    <div>
                      <p className="text-lg font-semibold">Extracting Keyframes...</p>
                      <p className="text-sm text-muted-foreground">Analyzing video for significant visual changes</p>
                    </div>
                  </div>
                  <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Processing Video Frames</span>
                      <span className="text-muted-foreground">{extractionProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-background">
                      <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${extractionProgress}%` }} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        setIsExtracting(false);
                        setSelectedMedia(null);
                        toast.info("Extraction cancelled");
                      }}
                    >
                      Cancel Extraction
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected video preview */}
                  <div className="flex items-center justify-between py-2">
                    <h3 className="text-sm font-medium">Selected Video</h3>
                    <span className="text-xs text-green-600 font-medium">Ready</span>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{selectedMedia.filename}</p>
                        <p className="text-xs text-muted-foreground">{selectedMedia.mimeType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleExtractKeyframes} className="flex-1">
                      Extract Keyframes
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedMedia(null)}>
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
                  placeholder="Search here..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
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
                        Upload date/time
                      </th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paginatedExtractions.length > 0 ? (
                      paginatedExtractions.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
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
                          <td className="py-3 px-4 text-sm">{item.fileName}</td>
                          <td className="py-3 px-4 text-sm">
                            {item.videoLength}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {item.framesExtracted}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {item.uploadDate}
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-muted-foreground hover:text-foreground">
                              ⋮
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-sm text-muted-foreground"
                        >
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredExtractions.length
                    )}{" "}
                    of {filteredExtractions.length} entries
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-9"
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="p-4 md:p-6 w-full">
          <CardContent className="p-0 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg max-md:text-[12px] max-lg:text-[14px] font-semibold">
                  Extracted Keyframes
                </h3>
                <p className="text-sm max-md:text-[10px] max-lg:text-[12px] text-muted-foreground">
                  Frames selected based on motion, lighting, and composition
                  changes
                </p>
                {isBulkUploading && (
                  <p className="text-xs text-primary mt-1">
                    Uploading {bulkUploadProgress.current} of{" "}
                    {bulkUploadProgress.total} keyframes...
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleBulkUpload}
                  disabled={
                    isBulkUploading ||
                    extractedKeyframes.length === 0 ||
                    uploadedFrames.size === extractedKeyframes.length
                  }
                  className="w-full sm:w-auto"
                >
                  <CloudUpload className="w-4 h-4 mr-2" />
                  {isBulkUploading
                    ? "Uploading..."
                    : uploadedFrames.size === extractedKeyframes.length
                      ? "All Uploaded"
                      : `Upload All (${extractedKeyframes.length - uploadedFrames.size})`}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setExtractedKeyframes([]);
                    setSelectedMedia(null);
                    setUploadedFrames(new Set());
                    setUploadingFrames(new Set());
                  }}
                  className="w-full sm:w-auto"
                  disabled={isBulkUploading}
                >
                  Extract New Video
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {extractedKeyframes.map((frame, index) => {
                const sourceFileName =
                  // actualFile?.name || uploadingFiles[0]?.name || "video";
                  selectedMedia?.filename || "video";
                const keyframeFileName = `${sourceFileName.replace(/\.[^/.]+$/, "")}_keyframe_${String(index + 1).padStart(3, "0")}.jpg`;

                return (
                  <div key={index} className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video">
                      <img
                        src={frame}
                        alt={`Keyframe ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {`00:${String(Math.floor((index * 17) / 60)).padStart(
                          2,
                          "0"
                        )}:${String((index * 17) % 60).padStart(2, "0")}`}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded font-medium">
                        JPG
                      </div>
                      {uploadedFrames.has(index) && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <span>✓</span>
                          <span>Uploaded</span>
                        </div>
                      )}
                      {uploadingFrames.has(index) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="px-1">
                      <p
                        className="text-xs text-muted-foreground truncate"
                        title={keyframeFileName}
                      >
                        {keyframeFileName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          uploadedFrames.has(index) ? "secondary" : "default"
                        }
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUploadKeyframe(index)}
                        disabled={
                          uploadingFrames.has(index) ||
                          uploadedFrames.has(index) ||
                          isBulkUploading
                        }
                      >
                        {uploadingFrames.has(index) ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Uploading...
                          </>
                        ) : uploadedFrames.has(index) ? (
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
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = frame;
                          link.download = keyframeFileName;
                          link.click();
                        }}
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
    </section>
  );
};

export default Keyframe;
