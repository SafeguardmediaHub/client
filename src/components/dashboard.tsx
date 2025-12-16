'use client';

import { LinkIcon, Loader2, UploadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useUrlUpload } from '@/hooks/useMedia';
import api from '@/lib/api';
import {
  batchProcessingData,
  chartCategories,
  chartData,
  recentActivities,
  statisticsData,
} from '@/lib/data';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';

type UploadPhase =
  | 'idle'
  | 'validating'
  | 'requesting_url'
  | 'uploading'
  | 'confirming'
  | 'success'
  | 'error';

type UploadType = 'general_image' | 'video' | 'audio';

type DashboardProps = {
  userName?: string;
  onAnalyzeLink?: (url: string) => void;
  onUploadSuccess?: (key: string) => void;
};

const MAX_BYTES = 1_000_000_000; // 1GB
const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/'];
const ALLOWED_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'mp4',
  'mov',
  'mp3',
  'wav',
  'm4a',
  'aac',
  'ogg',
];

const Dashboard: FC<DashboardProps> = ({
  userName = 'there',
  onAnalyzeLink,
  onUploadSuccess,
}) => {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const urlUploadMutation = useUrlUpload();

  const handleUpload = () => {
    if (!url) {
      toast.error('Please enter a URL to upload.');
      return;
    }

    toast.info('Starting upload from URL...');

    setUrl('');
    urlUploadMutation.mutate(
      {
        url,
        // uploadType: "general_image",
      },
      {
        onSuccess: () => {
          router.push('/dashboard/library');
        },
      }
    );
  };

  const isBusy = useMemo(
    () =>
      uploadPhase === 'validating' ||
      uploadPhase === 'requesting_url' ||
      uploadPhase === 'uploading' ||
      uploadPhase === 'confirming' ||
      urlUploadMutation.isPending,
    [uploadPhase, urlUploadMutation.isPending]
  );

  const validateFile = useCallback((file: File) => {
    if (file.size > MAX_BYTES) {
      return 'File is too large. Max size is 1GB.';
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);
    const isAllowedMime = ALLOWED_MIME_PREFIXES.some((p) =>
      file.type.startsWith(p)
    );
    if (!isAllowedExt && !isAllowedMime) {
      return 'Unsupported file type. Use JPEG, PNG, MP4, MOV, or common audio (MP3, WAV, M4A, AAC, OGG).';
    }
    return null;
  }, []);

  const determineUploadType = useCallback((file: File): UploadType => {
    if (file.type.startsWith('image/')) return 'general_image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext))
      return 'general_image';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'm4a', 'aac', 'ogg'].includes(ext)) return 'audio';
    return 'general_image';
  }, []);

  const requestPresignedUrl = useCallback(
    async (file: File, uploadType: UploadType) => {
      try {
        const response = await api.post('/api/media/presigned-url', {
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
          uploadType,
        });

        const result = response.data;
        const { data } = result;

        toast.success('Upload URL obtained. Starting upload...');
        const { uploadUrl, s3Key, correlationId } = data.upload;

        return { uploadUrl, key: s3Key, correlationId };
      } catch (error: unknown) {
        console.error('Failed to get presigned URL:', error);
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to get upload URL. Please try again.';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const confirmUpload = useCallback(
    async (s3Key: string, correlationId: string) => {
      try {
        const response = await api.post('/api/media/confirm-upload', {
          s3Key,
          correlationId,
        });

        const result = response.data;
        console.log('Upload confirmed:', result);
        toast.success('File uploaded and confirmed successfully!');
        return result;
      } catch (error: unknown) {
        console.error('Failed to confirm upload:', error);
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to confirm upload. Please try again.';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const uploadWithProgress = useCallback(
    async (file: File, uploadUrl: string) => {
      // Use XHR to track upload progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl, true);
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
          reject(new Error('Network error during upload'));
        };
        xhr.setRequestHeader(
          'Content-Type',
          file.type || 'application/octet-stream'
        );
        xhr.send(file);
      });
    },
    []
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploadError(null);
      setUploadedKey(null);
      setProgress(0);
      const file = files[0];
      setUploadPhase('validating');
      const validationError = validateFile(file);
      if (validationError) {
        setUploadPhase('error');
        setUploadError(validationError);
        return;
      }
      try {
        setUploadPhase('requesting_url');
        const uploadType = determineUploadType(file);
        const { uploadUrl, key, correlationId } = await requestPresignedUrl(
          file,
          uploadType
        );
        setUploadPhase('uploading');
        await uploadWithProgress(file, uploadUrl);
        setUploadPhase('confirming');
        await confirmUpload(key, correlationId);
        setUploadPhase('success');
        setUploadedKey(key);
        onUploadSuccess?.(key);
        router.push('/dashboard/library');
      } catch (err: unknown) {
        setUploadPhase('error');
        const message = err instanceof Error ? err.message : 'Upload failed';
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
      router,
    ]
  );

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
  const inputId = useId();

  return (
    <section className="flex flex-1 flex-col gap-4 py-4 px-4 sm:px-6 md:px-8">
      <header className="flex-col items-start gap-1 flex">
        <h1 className="text-responsive-2xl font-medium text-black leading-9">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Hello, {userName}! Ready to verify some media?
        </p>
      </header>

      <Card className="flex flex-col items-start gap-4 sm:gap-6 p-4 sm:p-6 relative self-stretch w-full">
        <CardContent className="p-0 w-full">
          <div className="inline-flex flex-col items-start gap-1 relative mb-4 sm:mb-6">
            <h2 className="text-responsive-xl font-medium text-black leading-[30px]">
              Start a New Analysis
            </h2>
            <p className="text-sm text-muted-foreground">
              Paste links or upload media to detect deepfakes
            </p>
          </div>

          <form
            onSubmit={analyzeSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6"
          >
            <div className="flex items-center gap-3 flex-1 px-3 py-2 sm:py-0 bg-muted rounded-xl sm:rounded-r-none">
              <LinkIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <Input
                aria-label="Media URL"
                className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 text-sm sm:text-base"
                placeholder="Paste media URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isBusy}
              />
            </div>
            <Button
              type="submit"
              className="sm:rounded-l-none cursor-pointer w-full sm:w-auto"
              disabled={isBusy}
              onClick={handleUpload}
            >
              {isBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span className="ml-2">Uploading...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Upload Media</span>
                  <span className="sm:hidden">Upload</span>
                </>
              )}
            </Button>
          </form>

          <section
            className="relative w-full rounded-lg border border-dashed bg-muted"
            aria-label="Upload dropzone"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
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
              className="flex flex-col items-center gap-3 sm:gap-4 w-full py-4 sm:py-6 px-4 cursor-pointer"
            >
              <UploadIcon className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
              <div className="flex flex-col items-center gap-1 w-full">
                <p className="text-sm sm:text-base text-center">
                  <span className="hidden sm:inline">Drag and drop to upload or click to browse files</span>
                  <span className="sm:hidden">Tap to select files or drag & drop</span>
                </p>
                <p className="text-xs sm:text-sm text-primary text-center">
                  <span className="hidden sm:inline">Supports JPEG, PNG, MP4, MOV and common audio (Max 1GB)</span>
                  <span className="sm:hidden">Images, videos, audio (Max 1GB)</span>
                </p>
              </div>

              {uploadPhase === 'uploading' && (
                <div className="w-full max-w-xl">
                  <div className="h-2 w-full rounded bg-background/50 overflow-hidden">
                    <div
                      className="h-2 bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Uploading... {progress}%
                  </p>
                </div>
              )}

              {uploadPhase === 'confirming' && (
                <div className="w-full max-w-xl">
                  <div className="h-2 w-full rounded bg-background/50 overflow-hidden">
                    <div className="h-2 bg-primary transition-all animate-pulse" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Confirming upload...
                  </p>
                </div>
              )}

              {uploadPhase === 'success' && uploadedKey && (
                <p className="text-sm text-green-600">Uploaded successfully.</p>
              )}
              {uploadPhase === 'error' && uploadError && (
                <p className="text-sm text-red-600">{uploadError}</p>
              )}

              <input
                id={inputId}
                ref={fileInputRef}
                type="file"
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
                accept={[
                  '.jpg',
                  '.jpeg',
                  '.png',
                  '.heic',
                  '.heif',
                  '.mp4',
                  '.mov',
                  '.mp3',
                  '.wav',
                  '.m4a',
                  '.aac',
                  '.ogg',
                  'image/*',
                  'video/*',
                  'audio/*',
                ].join(',')}
                disabled={isBusy}
              />

              <Button type="button" onClick={onBrowseClick} disabled={isBusy} className="w-full sm:w-auto">
                {isBusy ? (
                  'Please wait…'
                ) : (
                  <>
                    <span className="hidden sm:inline">Select Files to Upload</span>
                    <span className="sm:hidden">Select Files</span>
                  </>
                )}
              </Button>
            </label>
          </section>
        </CardContent>
      </Card>

      {/* charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Card className="p-6">
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-medium">Detection Ratio</h3>
                <p className="text-sm text-muted-foreground">
                  Total media files uploaded over a month:{' '}
                  <span className="font-semibold text-foreground">842</span>
                </p>
              </div>
              <select className="h-9 rounded-md border bg-background px-3 text-sm">
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
              </select>
            </div>

            <div className="rounded-lg border bg-accent/30 p-4">
              <div className="grid grid-cols-3 gap-4">
                {chartCategories.map((category) => (
                  <div
                    key={category.label}
                    className="text-center text-xs text-muted-foreground"
                  >
                    {category.label}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-rows-6 gap-2">
                {chartData.map((item) => (
                  <div key={item.value} className="flex items-center gap-2">
                    <span className="w-10 text-right text-xs text-muted-foreground">
                      {item.value}
                    </span>
                    <div className="h-px w-full bg-border" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-medium">Statistics</h3>
                <p className="text-sm text-muted-foreground">
                  Total files processed across system features:{' '}
                  <span className="font-semibold text-foreground">2,247</span>
                </p>
              </div>
              <select className="h-9 rounded-md border bg-background px-3 text-sm">
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
              </select>
            </div>
            <div className="space-y-4">
              {statisticsData.map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="text-sm font-medium">{stat.label}</div>
                  <div className="h-3 w-full rounded-lg bg-primary/10">
                    <div
                      className="h-3 rounded-lg bg-primary"
                      style={{ width: `${stat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Card className="p-6">
          <CardContent className="p-0 space-y-4">
            <h3 className="text-xl font-medium">Recent Activities</h3>
            <div className="divide-y rounded-xl border">
              {recentActivities.map((activity) => (
                <div
                  key={activity.title + activity.time}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <img src={activity.icon} alt="" className="size-10 rounded" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold leading-none">
                        {activity.title}
                      </h4>
                      {activity.status && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
                          style={{
                            background: activity.statusColor.match(
                              /bg-\[(.*)\]/
                            )?.[1]
                              ? undefined
                              : undefined,
                          }}
                        >
                          <span className="inline-block size-1.5 rounded-full" />
                          {activity.status}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{activity.description}</span>
                      <span className="h-3 w-px bg-border" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="p-0 space-y-6">
            <div>
              <h3 className="text-xl font-medium">Batch Files Processing</h3>
              <p className="text-sm text-muted-foreground">
                List of files currently being analyzed
              </p>
            </div>
            <div className="space-y-4">
              {batchProcessingData.map((item) => (
                <div key={item.title} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-muted-foreground">{item.time}</span>
                  </div>
                  <div className="h-3 w-full rounded-lg bg-primary/10">
                    <div
                      className="h-3 rounded-lg bg-primary"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </section>
  );
};

export default Dashboard;
