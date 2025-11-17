"use client";

import {
  Activity,
  AlertTriangle,
  Calendar,
  Globe,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Platform, TraceResult } from "@/types/trace";

interface OverviewTabProps {
  result: TraceResult;
}

const getPlatformIcon = (platform: Platform) => {
  // You can replace these with actual platform icons
  return Globe;
};

const getPlatformColor = (platform: Platform) => {
  const colors: Record<Platform, string> = {
    twitter: "text-sky-600 bg-sky-50 border-sky-200",
    facebook: "text-blue-600 bg-blue-50 border-blue-200",
    instagram: "text-pink-600 bg-pink-50 border-pink-200",
    tiktok: "text-purple-600 bg-purple-50 border-purple-200",
    youtube: "text-red-600 bg-red-50 border-red-200",
    reddit: "text-orange-600 bg-orange-50 border-orange-200",
  };
  return colors[platform] || "text-gray-600 bg-gray-50 border-gray-200";
};

export const OverviewTab = ({ result }: OverviewTabProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAuthenticityColor = (
    verdict: "authentic" | "suspicious" | "manipulated" | "inconclusive",
  ) => {
    switch (verdict) {
      case "authentic":
        return "text-green-700 bg-green-50 border-green-200";
      case "suspicious":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "manipulated":
        return "text-red-700 bg-red-50 border-red-200";
      case "inconclusive":
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const totalEngagement =
    result.platformAppearances.reduce(
      (sum, post) =>
        sum +
        post.engagement.likes +
        post.engagement.shares +
        post.engagement.comments,
      0,
    ) || 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {result.summary.totalPosts.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm text-gray-600">Platforms</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {result.summary.platforms.length}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-600">Total Engagement</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {totalEngagement.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-sm text-gray-600">Suspicious Patterns</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {result.suspiciousPatterns.length}
          </div>
        </div>
      </div>

      {/* Forensic Overview */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Forensic Analysis
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Overall Confidence</span>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    result.forensicAnalysis.overallConfidence >= 70
                      ? "bg-green-600"
                      : result.forensicAnalysis.overallConfidence >= 40
                        ? "bg-yellow-600"
                        : "bg-red-600",
                  )}
                  style={{
                    width: `${result.forensicAnalysis.overallConfidence}%`,
                  }}
                />
              </div>
              <span className="font-semibold text-gray-900 min-w-[3rem] text-right">
                {result.forensicAnalysis.overallConfidence}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Authenticity Verdict</span>
            <Badge
              className={cn(
                "border capitalize",
                getAuthenticityColor(
                  result.forensicAnalysis.authenticity.verdict,
                ),
              )}
            >
              {result.forensicAnalysis.authenticity.verdict}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Manipulation Detected</span>
            <Badge
              variant="outline"
              className={cn(
                "border",
                result.forensicAnalysis.manipulation.detected
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200",
              )}
            >
              {result.forensicAnalysis.manipulation.detected ? "Yes" : "No"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Platform Distribution
        </h3>
        <div className="space-y-3">
          {result.summary.platforms.map((platform) => {
            const platformPosts = result.platformAppearances.filter(
              (p) => p.platform === platform,
            );
            const platformEngagement = platformPosts.reduce(
              (sum, post) =>
                sum +
                post.engagement.likes +
                post.engagement.shares +
                post.engagement.comments,
              0,
            );
            const percentage = (
              (platformPosts.length / result.summary.totalPosts) *
              100
            ).toFixed(1);

            return (
              <div key={platform} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("capitalize border", getPlatformColor(platform))}
                    >
                      {platform}
                    </Badge>
                    <span className="text-gray-600">
                      {platformPosts.length} posts
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{percentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        getPlatformColor(platform).split(" ")[0].replace("text", "bg"),
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 min-w-[4rem] text-right">
                    {platformEngagement.toLocaleString()} eng.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Summary */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Timeline Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Earliest Appearance</div>
            <div className="font-medium text-gray-900">
              {formatDate(result.summary.dateRange.earliest)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Latest Appearance</div>
            <div className="font-medium text-gray-900">
              {formatDate(result.summary.dateRange.latest)}
            </div>
          </div>
        </div>
        {result.forensicAnalysis.metadata.earliestAppearance && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">
              Potential Original Source
            </div>
            <div className="text-sm text-blue-800">
              Platform: {result.forensicAnalysis.metadata.earliestAppearance.platform}
              <br />
              Timestamp:{" "}
              {formatDate(
                result.forensicAnalysis.metadata.earliestAppearance.timestamp,
              )}
            </div>
          </div>
        )}
      </div>

      {/* Top Engagement */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Top Performing Post
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={cn(
                "capitalize border",
                getPlatformColor(result.summary.topEngagement.platform),
              )}
            >
              {result.summary.topEngagement.platform}
            </Badge>
          </div>
          <div className="text-sm text-gray-600 mb-1">Total Engagement</div>
          <div className="text-2xl font-bold text-gray-900">
            {result.summary.topEngagement.totalEngagement.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
