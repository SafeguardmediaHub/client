"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTraceStatus } from "@/hooks/useTrace";
import { cn } from "@/lib/utils";
import type { Platform, TraceListItem, TraceStatus } from "@/types/trace";

interface TraceCardLiveProps {
  trace: TraceListItem;
  onRetry?: (traceId: string) => void;
  enablePolling?: boolean;
}

// Helper to convert numeric search depth to display string
const getSearchDepthLabel = (depth?: 1 | 2 | 3): string => {
  switch (depth) {
    case 1:
      return "Shallow";
    case 2:
      return "Moderate";
    case 3:
      return "Deep";
    default:
      return "Moderate";
  }
};

const getStatusConfig = (status: TraceStatus) => {
  switch (status) {
    case "pending":
      return {
        icon: Clock,
        label: "Pending",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        iconColor: "text-yellow-600",
      };
    case "processing":
      return {
        icon: Loader2,
        label: "Processing",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        iconColor: "text-blue-600",
        animate: true,
      };
    case "completed":
      return {
        icon: CheckCircle,
        label: "Completed",
        color: "bg-green-100 text-green-700 border-green-200",
        iconColor: "text-green-600",
      };
    case "failed":
      return {
        icon: XCircle,
        label: "Failed",
        color: "bg-red-100 text-red-700 border-red-200",
        iconColor: "text-red-600",
      };
    case "no_results":
      return {
        icon: AlertCircle,
        label: "No Results",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        iconColor: "text-gray-600",
      };
    default:
      return {
        icon: Clock,
        label: "Unknown",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        iconColor: "text-gray-600",
      };
  }
};

const getPlatformBadgeColor = (platform: Platform) => {
  const colors: Record<Platform, string> = {
    twitter: "bg-sky-100 text-sky-700 border-sky-200",
    facebook: "bg-blue-100 text-blue-700 border-blue-200",
    instagram: "bg-pink-100 text-pink-700 border-pink-200",
    tiktok: "bg-purple-100 text-purple-700 border-purple-200",
    youtube: "bg-red-100 text-red-700 border-red-200",
    reddit: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return colors[platform] || "bg-gray-100 text-gray-700 border-gray-200";
};

export const TraceCardLive = ({
  trace,
  onRetry,
  enablePolling = false,
}: TraceCardLiveProps) => {
  // Poll status for active traces
  const shouldPoll =
    enablePolling &&
    (trace.status === "pending" || trace.status === "processing");

  const statusQuery = useTraceStatus(trace.traceId, {
    enabled: shouldPoll,
  });

  // Use live status if available, otherwise use trace status
  const currentStatus = statusQuery.data?.data?.status || trace.status;
  const currentProgress = statusQuery.data?.data?.progress;

  const statusConfig = getStatusConfig(currentStatus);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTraceId = (traceId: string) => {
    if (traceId.length <= 12) return traceId;
    return `${traceId.slice(0, 8)}...${traceId.slice(-4)}`;
  };

  const isTerminalState =
    currentStatus === "completed" ||
    currentStatus === "failed" ||
    currentStatus === "no_results";

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-sm font-mono text-gray-600">
              {formatTraceId(trace.traceId)}
            </h3>
            <Badge
              className={cn(
                "border flex items-center gap-1.5 px-2 py-1",
                statusConfig.color,
              )}
            >
              <StatusIcon
                className={cn(
                  "w-3.5 h-3.5",
                  statusConfig.iconColor,
                  statusConfig.animate && "animate-spin",
                )}
              />
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-xs text-gray-500">
            Started: {formatDate(trace.createdAt)}
          </p>
          {trace.completedAt && (
            <p className="text-xs text-gray-500">
              Completed: {formatDate(trace.completedAt)}
            </p>
          )}
        </div>
      </div>

      {/* Live Progress Bar (for processing traces) */}
      {currentStatus === "processing" && currentProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-600 capitalize">
              Stage: {currentProgress.stage}
            </span>
            <span className="font-medium text-gray-900">
              {currentProgress.percentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${currentProgress.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs mt-2 text-gray-500">
            <span>
              {currentProgress.platformsSearched} / {currentProgress.totalPlatforms}{" "}
              platforms
            </span>
            <span>{currentProgress.postsFound} posts found</span>
          </div>
        </div>
      )}

      {/* Platforms */}
      {trace.searchConfig?.platforms && trace.searchConfig.platforms.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Platforms:</p>
          <div className="flex flex-wrap gap-2">
            {trace.searchConfig.platforms.map((platform) => (
              <Badge
                key={platform}
                variant="outline"
                className={cn(
                  "text-xs border capitalize",
                  getPlatformBadgeColor(platform),
                )}
              >
                {platform}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Summary (if available) */}
      {trace.summary && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Posts Found:</span>
            <span className="font-semibold text-gray-900">
              {trace.summary.totalPosts}
            </span>
          </div>
          {trace.summary.platforms && (
            <div className="mt-2 text-xs text-gray-500">
              Across {trace.summary.platforms.length} platform
              {trace.summary.platforms.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}

      {/* Config Details */}
      {trace.searchConfig && (
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-gray-500">Search Depth:</span>
            <span className="font-medium text-gray-900">
              {getSearchDepthLabel(trace.searchConfig.searchDepth)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Max Results:</span>
            <span className="font-medium text-gray-900">
              {trace.searchConfig.maxResults || 100}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        {isTerminalState && (
          <Link
            href={`/dashboard/trace/${trace.traceId}?mediaId=${trace.mediaId}`}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full cursor-pointer hover:bg-blue-50 hover:border-blue-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
        )}
        {currentStatus === "failed" && onRetry && (
          <Button
            variant="outline"
            onClick={() => onRetry(trace.traceId)}
            className="flex-1 cursor-pointer hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
        {(currentStatus === "pending" || currentStatus === "processing") && (
          <Link
            href={`/dashboard/trace/${trace.traceId}?mediaId=${trace.mediaId}`}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full cursor-pointer hover:bg-blue-50 hover:border-blue-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              Monitor Progress
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
