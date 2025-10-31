"use client";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({
  progress,
  className = "",
}: ProgressBarProps) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
      <div
        className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
