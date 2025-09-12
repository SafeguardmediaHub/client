'use client';

import { LinkIcon, UploadIcon } from 'lucide-react';
import type { FC } from 'react';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';

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
    const fileType = encodeURIComponent(
      file.type || 'application/octet-stream'
    );
    const res = await fetch(`/api/media?fileType=${fileType}`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Failed to get upload URL');
    return (await res.json()) as { uploadUrl: string; key: string };
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
            <div className="flex items-center gap-3 flex-1 px-3 py-2.5">
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

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </section>
  );
};

export default Dashboard;
