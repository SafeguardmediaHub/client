"use client";

import {
  CheckCircle,
  Clock,
  Loader2,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TraceProgress as TraceProgressType, TraceStage } from "@/types/trace";

interface TraceProgressProps {
  progress?: TraceProgressType;
  estimatedCompletionSeconds?: number;
  startedAt?: string;
}

const STAGES: {
  value: TraceStage;
  label: string;
  icon: typeof Search;
  description: string;
}[] = [
  {
    value: "discovery",
    label: "Discovery",
    icon: Search,
    description: "Searching platforms for media appearances",
  },
  {
    value: "analysis",
    label: "Analysis",
    icon: TrendingUp,
    description: "Analyzing distribution patterns and engagement",
  },
  {
    value: "forensics",
    label: "Forensics",
    icon: ShieldCheck,
    description: "Performing forensic analysis and authenticity checks",
  },
];

const getStageIndex = (stage: TraceStage): number => {
  return STAGES.findIndex((s) => s.value === stage);
};

export const TraceProgress = ({
  progress,
  estimatedCompletionSeconds,
  startedAt,
}: TraceProgressProps) => {
  if (!progress) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <div>
            <h3 className="font-medium text-gray-900">Initializing Trace...</h3>
            <p className="text-sm text-gray-600">
              Setting up search parameters and preparing to scan platforms
            </p>
          </div>
        </div>
        {estimatedCompletionSeconds && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Clock className="w-4 h-4" />
              <span>
                Estimated completion: ~{estimatedCompletionSeconds} seconds
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentStageIndex = getStageIndex(progress.stage);
  const percentage = progress.percentage || 0;

  // Calculate elapsed time and ETA
  const getTimeInfo = () => {
    if (!startedAt) return null;

    const elapsed = Date.now() - new Date(startedAt).getTime();
    const elapsedSeconds = Math.floor(elapsed / 1000);

    // Estimate remaining time based on percentage
    if (percentage > 0 && percentage < 100) {
      const totalEstimated = (elapsedSeconds / percentage) * 100;
      const remainingSeconds = Math.floor(totalEstimated - elapsedSeconds);
      return {
        elapsed: elapsedSeconds,
        remaining: remainingSeconds > 0 ? remainingSeconds : 0,
      };
    }

    return { elapsed: elapsedSeconds, remaining: null };
  };

  const timeInfo = getTimeInfo();

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-6">
      {/* Current Stage Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <div>
            <h3 className="font-semibold text-gray-900">
              {STAGES[currentStageIndex].label} Stage
            </h3>
            <p className="text-sm text-gray-600">
              {STAGES[currentStageIndex].description}
            </p>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          {percentage}% Complete
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium text-gray-900">{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="space-y-3">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <div key={stage.value} className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                  isCompleted &&
                    "bg-green-100 border-green-500 text-green-700",
                  isCurrent && "bg-blue-100 border-blue-500 text-blue-700",
                  isPending && "bg-gray-100 border-gray-300 text-gray-400",
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isCurrent ? (
                  <Icon className="w-4 h-4 animate-pulse" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-medium",
                      isCompleted && "text-green-700",
                      isCurrent && "text-blue-700",
                      isPending && "text-gray-500",
                    )}
                  >
                    {stage.label}
                  </span>
                  {isCompleted && (
                    <Badge
                      variant="outline"
                      className="text-xs border-green-300 text-green-700"
                    >
                      Complete
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge
                      variant="outline"
                      className="text-xs border-blue-300 text-blue-700"
                    >
                      In Progress
                    </Badge>
                  )}
                </div>
                <p
                  className={cn(
                    "text-sm mt-1",
                    isCompleted && "text-green-600",
                    isCurrent && "text-gray-600",
                    isPending && "text-gray-400",
                  )}
                >
                  {stage.description}
                </p>
              </div>

              {/* Connector Line */}
              {index < STAGES.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[15px] w-0.5 h-6 mt-8 transition-all",
                    isCompleted && "bg-green-500",
                    isCurrent && "bg-blue-500",
                    isPending && "bg-gray-300",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Platform Progress */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Platforms Searched</div>
          <div className="text-2xl font-semibold text-gray-900">
            {progress.platformsSearched} / {progress.totalPlatforms}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Posts Found</div>
          <div className="text-2xl font-semibold text-gray-900">
            {progress.postsFound.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Time Information */}
      {timeInfo && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-blue-800">
              <Clock className="w-4 h-4" />
              <span>Elapsed: {formatTime(timeInfo.elapsed)}</span>
            </div>
            {timeInfo.remaining !== null && (
              <span className="text-blue-600 font-medium">
                ~{formatTime(timeInfo.remaining)} remaining
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
