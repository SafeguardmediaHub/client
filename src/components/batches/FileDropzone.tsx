'use client';

import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  calculateTotalSize,
  findDuplicateFiles,
  formatFileSize,
  getFileIcon,
  validateBatchSize,
  validateFile,
} from '@/lib/batch-utils';

interface FileDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

export function FileDropzone({
  files,
  onFilesChange,
  maxFiles = 100,
  accept,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || newFiles.length === 0) return;

      const fileArray = Array.from(newFiles);
      const validFiles: File[] = [];
      const newErrors: string[] = [];

      // Validate each file
      for (const file of fileArray) {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          newErrors.push(`${file.name}: ${validation.error}`);
        }
      }

      // Check for duplicates
      const combined = [...files, ...validFiles];
      const duplicates = findDuplicateFiles(combined);
      if (duplicates.length > 0) {
        newErrors.push(`Duplicate files: ${duplicates.join(', ')}`);
        // Remove duplicates
        const seen = new Set<string>();
        const filtered = combined.filter((file) => {
          const key = `${file.name}-${file.size}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        onFilesChange(filtered);
      } else {
        onFilesChange(combined);
      }

      // Check batch size
      const sizeValidation = validateBatchSize([...files, ...validFiles]);
      if (!sizeValidation.valid) {
        newErrors.push(sizeValidation.error || '');
      }

      setErrors(newErrors);
    },
    [files, onFilesChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles],
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      onFilesChange(newFiles);
      setErrors([]);
    },
    [files, onFilesChange],
  );

  const clearAll = useCallback(() => {
    onFilesChange([]);
    setErrors([]);
  }, [onFilesChange]);

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${
            isDragging
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-base font-medium text-gray-700 mb-1">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supported: Images (JPG, PNG, HEIC, HEIF, WebP, GIF, BMP), Videos, Audio, Documents
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Max file size: 100MB • Max files: {maxFiles}
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm font-semibold text-red-800 mb-1">
            Upload Errors:
          </p>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              Selected Files ({files.length}/{maxFiles})
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">
                    {getFileIcon(file.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <strong>Total:</strong> {files.length} file
            {files.length !== 1 ? 's' : ''} •{' '}
            {formatFileSize(calculateTotalSize(files))}
          </div>
        </div>
      )}
    </div>
  );
}
