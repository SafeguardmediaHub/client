'use client';

import { CloudUpload, File, Loader2, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFileSelect?: (file: File) => void;
  onMediaIdSubmit?: (mediaId: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
  isLoading?: boolean;
  className?: string;
}

export function UploadDropzone({
  onFileSelect,
  onMediaIdSubmit,
  accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx',
  maxSize = 100 * 1024 * 1024, // 100MB default
  isLoading = false,
  className,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaId, setMediaId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'mediaId'>('upload');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setSelectedFile(file);
    },
    [maxSize]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setSelectedFile(file);
    },
    [maxSize]
  );

  const handleSubmit = () => {
    if (mode === 'upload' && selectedFile) {
      onFileSelect?.(selectedFile);
    } else if (mode === 'mediaId' && mediaId.trim()) {
      onMediaIdSubmit?.(mediaId.trim());
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            mode === 'upload'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode('mediaId')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            mode === 'mediaId'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Enter Media ID
        </button>
      </div>

      {mode === 'upload' ? (
        <>
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative border-2 border-dashed rounded-xl p-8 transition-all duration-200',
              'flex flex-col items-center justify-center text-center',
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50',
              error && 'border-red-300 bg-red-50'
            )}
          >
            {selectedFile ? (
              <div className="flex items-center gap-4 animate-in fade-in">
                <div className="size-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <File className="size-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="size-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <>
                <CloudUpload
                  className={cn(
                    'size-12 mb-4',
                    isDragging ? 'text-blue-500' : 'text-gray-400'
                  )}
                />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Drop your file here, or{' '}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept={accept}
                      onChange={handleFileInput}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500">
                  Supports images, videos, audio, and documents up to{' '}
                  {formatFileSize(maxSize)}
                </p>
              </>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 animate-in fade-in">{error}</p>
          )}
        </>
      ) : (
        /* Media ID input */
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter media ID (e.g., img_a3f2c8e1...)"
            value={mediaId}
            onChange={(e) => setMediaId(e.target.value)}
            className="h-12 font-mono"
          />
          <p className="text-xs text-gray-500">
            Enter the unique media ID from your library to verify its authenticity
          </p>
        </div>
      )}

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={
          isLoading ||
          (mode === 'upload' && !selectedFile) ||
          (mode === 'mediaId' && !mediaId.trim())
        }
        className="w-full h-11"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          'Start Verification'
        )}
      </Button>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
