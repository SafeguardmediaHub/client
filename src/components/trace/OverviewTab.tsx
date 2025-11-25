"use client";

import {
  Activity,
  AlertTriangle,
  Calendar,
  Globe,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
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

  // Calculate summary metrics from platformAppearances
  const summary = useMemo(() => {
    const allPosts = result.platformAppearances?.flatMap((pa) => pa.posts) || [];
    const platforms = result.platformAppearances?.map((pa) => pa.platform) || [];

    const totalEngagement = allPosts.reduce(
      (sum, post) =>
        sum +
        (post.engagement?.likes || 0) +
        (post.engagement?.shares || 0) +
        (post.engagement?.comments || 0) +
        (post.engagement?.views || 0),
      0
    );

    // Filter out invalid timestamps
    const timestamps = allPosts
      .map((p) => new Date(p.timestamp).getTime())
      .filter((t) => !isNaN(t));

    const earliest = timestamps.length > 0
      ? new Date(Math.min(...timestamps)).toISOString()
      : new Date().toISOString();
    const latest = timestamps.length > 0
      ? new Date(Math.max(...timestamps)).toISOString()
      : new Date().toISOString();

    const topPost = allPosts.length > 0
      ? allPosts.reduce((max, post) => {
          const postEngagement =
            (post.engagement?.likes || 0) +
            (post.engagement?.shares || 0) +
            (post.engagement?.comments || 0) +
            (post.engagement?.views || 0);
          const maxEngagement =
            (max.engagement?.likes || 0) +
            (max.engagement?.shares || 0) +
            (max.engagement?.comments || 0) +
            (max.engagement?.views || 0);
          return postEngagement > maxEngagement ? post : max;
        }, allPosts[0])
      : null;

    return {
      totalPosts: allPosts.length,
      platforms,
      dateRange: { earliest, latest },
      topPost,
      totalEngagement,
    };
  }, [result.platformAppearances]);

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
            {summary.totalPosts.toLocaleString()}
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
            {summary.platforms.length}
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
            {summary.totalEngagement.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-sm text-gray-600">Risk Level</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 capitalize">
            {result.suspiciousPatterns?.riskLevel || "Low"}
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
            <span className="text-sm text-gray-600">Confidence Score</span>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    (result.forensicAnalysis?.confidence || 0) * 100 >= 70
                      ? "bg-green-600"
                      : (result.forensicAnalysis?.confidence || 0) * 100 >= 40
                        ? "bg-yellow-600"
                        : "bg-red-600",
                  )}
                  style={{
                    width: `${(result.forensicAnalysis?.confidence || 0) * 100}%`,
                  }}
                />
              </div>
              <span className="font-semibold text-gray-900 min-w-[3rem] text-right">
                {((result.forensicAnalysis?.confidence || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tracing Score</span>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all bg-blue-600"
                  )}
                  style={{
                    width: `${(result.forensicAnalysis?.tracingScore || 0) * 100}%`,
                  }}
                />
              </div>
              <span className="font-semibold text-gray-900 min-w-[3rem] text-right">
                {((result.forensicAnalysis?.tracingScore || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {result.forensicAnalysis?.summary && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{result.forensicAnalysis.summary}</p>
            </div>
          )}

          {result.forensicAnalysis?.flags && result.forensicAnalysis.flags.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Flags:</span>
              <div className="flex flex-wrap gap-2">
                {result.forensicAnalysis.flags.map((flag, index) => (
                  <Badge key={index} variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-800">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Platform Distribution
        </h3>
        <div className="space-y-3">
          {result.platformAppearances?.map((pa) => {
            const platformEngagement = pa.posts.reduce(
              (sum, post) =>
                sum +
                (post.engagement?.likes || 0) +
                (post.engagement?.shares || 0) +
                (post.engagement?.comments || 0) +
                (post.engagement?.views || 0),
              0,
            );
            const percentage = ((pa.posts.length / summary.totalPosts) * 100).toFixed(1);

            return (
              <div key={pa.platform} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("capitalize border", getPlatformColor(pa.platform))}
                    >
                      {pa.platform}
                    </Badge>
                    <span className="text-gray-600">
                      {pa.posts.length} posts
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{percentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        getPlatformColor(pa.platform).split(" ")[0].replace("text", "bg"),
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
              {formatDate(summary.dateRange.earliest)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Latest Appearance</div>
            <div className="font-medium text-gray-900">
              {formatDate(summary.dateRange.latest)}
            </div>
          </div>
        </div>
        {result.distributionGraph?.originalPoster && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">
              Original Poster
            </div>
            <div className="text-sm text-blue-800">
              Platform: {result.distributionGraph.originalPoster.platform}
              <br />
              User: {result.distributionGraph.originalPoster.username}
              <br />
              Posted: {formatDate(result.distributionGraph.originalPoster.timestamp)}
            </div>
          </div>
        )}
      </div>

      {/* Top Engagement */}
      {summary.topPost && (
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
                  getPlatformColor(summary.topPost.platform),
                )}
              >
                {summary.topPost.platform}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mb-1">By {summary.topPost.username}</div>
            <div className="text-sm text-gray-600 mb-2">Total Engagement</div>
            <div className="text-2xl font-bold text-gray-900">
              {(
                (summary.topPost.engagement?.likes || 0) +
                (summary.topPost.engagement?.shares || 0) +
                (summary.topPost.engagement?.comments || 0) +
                (summary.topPost.engagement?.views || 0)
              ).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
