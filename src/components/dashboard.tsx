'use client';

import { LinkIcon, UploadIcon } from 'lucide-react';
import type { FC } from 'react';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
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

// Note: using native select to avoid adding new UI deps

type UploadPhase =
  | 'idle'
  | 'validating'
  | 'requesting_url'
  | 'uploading'
  | 'success'
  | 'error';

type DashboardProps = {
  userName?: string;
  onAnalyzeLink?: (url: string) => void;
  onUploadSuccess?: (key: string) => void;
};

const MAX_BYTES = 1_000_000_000; // 1GB
const ALLOWED_MIME_PREFIXES = ['image/', 'video/'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'mp4', 'mov'];

const Dashboard: FC<DashboardProps> = ({
  userName = 'there',
  onAnalyzeLink,
  onUploadSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isBusy = useMemo(
    () =>
      uploadPhase === 'validating' ||
      uploadPhase === 'requesting_url' ||
      uploadPhase === 'uploading',
    [uploadPhase]
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
      return 'Unsupported file type. Use JPEG, PNG, MP4, or MOV.';
    }
    return null;
  }, []);

  const requestPresignedUrl = useCallback(async (file: File) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/media/presigned-url`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJmZjc2YTA5NDJkYjg0YWNiNTIwZjciLCJlbWFpbCI6ImZpbnp5cGhpbnp5QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU3NzMzNDE0LCJleHAiOjE3NTc3MzQzMTQsImF1ZCI6InNhZmVndWFyZC1tZWRpYS11c2VycyIsImlzcyI6InNhZmVndWFyZC1tZWRpYSJ9.3iM_1RQ4hjx7pbT8gDsqDTrylABxSu2j8AQhOXpvmxs',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
          uploadType: 'general_image',
        }),
      }
    );

    if (!response.ok) throw new Error('Failed to get upload URL');

    const result = await response.json();
    const { data } = result;

    console.log('this is the data', data);
    const { uploadUrl } = data.upload;

    return { uploadUrl, key: data.upload.key || file.name };
  }, []);

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
        const { uploadUrl, key } = await requestPresignedUrl(file);
        setUploadPhase('uploading');
        await uploadWithProgress(file, uploadUrl);
        setUploadPhase('success');
        setUploadedKey(key);
        onUploadSuccess?.(key);
      } catch (err: unknown) {
        setUploadPhase('error');
        const message = err instanceof Error ? err.message : 'Upload failed';
        setUploadError(message);
      }
    },
    [onUploadSuccess, requestPresignedUrl, uploadWithProgress, validateFile]
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
    <section className="flex flex-1 flex-col gap-4 py-4 px-8">
      <header className="flex-col items-start gap-1 flex">
        <h1 className="text-2xl font-medium text-black leading-9">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Hello, {userName}! Ready to verify some media?
        </p>
      </header>

      <Card className="flex flex-col items-start gap-6 p-6 relative self-stretch w-full">
        <CardContent className="p-0 w-full">
          <div className="inline-flex flex-col items-start gap-1 relative mb-6">
            <h2 className="text-xl font-medium text-black leading-[30px]">
              Start a New Analysis
            </h2>
            <p className="text-sm text-muted-foreground">
              Paste links directly or upload images or videos to detect
              deepfakes &amp; authenticity
            </p>
          </div>

          <form
            onSubmit={analyzeSubmit}
            className="flex items-center gap-0 bg-muted rounded-xl mb-6"
          >
            <div className="flex items-center gap-3 flex-1 px-3">
              <LinkIcon className="w-5 h-5 text-muted-foreground" />
              <Input
                aria-label="Media URL"
                className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0"
                placeholder="Paste a link to a video or image to start forensic analysis"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isBusy}
              />
            </div>
            <Button
              type="submit"
              className="rounded-l-none cursor-pointer"
              disabled={isBusy}
            >
              Analyze Link
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
              className="flex flex-col items-center gap-4 w-full py-6 cursor-pointer"
            >
              <UploadIcon className="w-10 h-10 text-muted-foreground" />
              <div className="flex flex-col items-center gap-1 w-full">
                <p className="text-base text-center">
                  Drag and drop to upload or click to browse files
                </p>
                <p className="text-sm text-primary text-center">
                  Supports JPEG, PNG, MP4, MOV (Max file size 1GB)
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

              {uploadPhase === 'success' && uploadedKey && (
                <p className="text-sm text-green-600">
                  Uploaded successfully. Key: {uploadedKey}
                </p>
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
                  '.mp4',
                  '.mov',
                  'image/*',
                  'video/*',
                ].join(',')}
                disabled={isBusy}
              />

              <Button type="button" onClick={onBrowseClick} disabled={isBusy}>
                {isBusy ? 'Please wait…' : 'Select Files to Upload'}
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
