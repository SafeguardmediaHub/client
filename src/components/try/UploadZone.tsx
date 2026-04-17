"use client";

import { FileIcon, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  accept: string;
  acceptLabel: string;
  maxSizeMB: number;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function UploadZone({
  accept,
  acceptLabel,
  maxSizeMB,
  file,
  onChange,
  disabled,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      onChange(f);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [disabled, handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const clear = useCallback(() => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onChange]);

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <FileIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900">
            {file.name}
          </p>
          <p className="text-xs text-slate-400">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-600 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer select-none flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        isDragging
          ? "border-blue-400 bg-blue-50"
          : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
        <Upload className="h-5 w-5 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-700">
        Drop your file here, or{" "}
        <span className="text-blue-600">browse</span>
      </p>
      <p className="mt-1.5 text-xs text-slate-400">
        {acceptLabel} &middot; Max {maxSizeMB}MB
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
