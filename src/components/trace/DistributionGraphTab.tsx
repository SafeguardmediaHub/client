"use client";

import {
  AlertCircle,
  Globe,
  TrendingUp,
  Users,
  Clock,
  Zap,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DistributionGraph, Platform } from "@/types/trace";

interface DistributionGraphTabProps {
  graph: DistributionGraph;
}

const getPlatformColor = (platform: Platform) => {
  const colors: Record<Platform, string> = {
    twitter: "bg-sky-500 text-white",
    facebook: "bg-blue-500 text-white",
    instagram: "bg-pink-500 text-white",
    tiktok: "bg-purple-500 text-white",
    youtube: "bg-red-500 text-white",
    reddit: "bg-orange-500 text-white",
  };
  return colors[platform] || "bg-gray-500 text-white";
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
};

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (hours: number) => {
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  if (days > 0) {
    return `${days}d ${remainingHours}h`;
  }
  return `${remainingHours}h`;
};

export const DistributionGraphTab = ({ graph }: DistributionGraphTabProps) => {
  if (!graph || !graph.originalPoster) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Distribution Data
        </h3>
        <p className="text-sm text-gray-600">
          Not enough data to generate distribution analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(graph.totalPosts)}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div className="text-sm text-gray-600">Total Engagement</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(graph.totalEngagement)}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <div className="text-sm text-gray-600">Spread Duration</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatDuration(graph.spreadDurationHours)}
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <div className="text-sm text-gray-600">Peak Velocity</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(graph.peakVelocity)}
            <span className="text-sm text-gray-600 ml-1">posts/hr</span>
          </div>
        </div>
      </div>

      {/* Original Poster */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Original Poster
        </h3>
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-blue-400">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {graph.originalPoster.displayName}
                  </span>
                  {graph.originalPoster.verified && (
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>@{graph.originalPoster.username}</span>
                  <span>•</span>
                  <Badge
                    className={cn(
                      "capitalize text-xs",
                      getPlatformColor(graph.originalPoster.platform)
                    )}
                  >
                    {graph.originalPoster.platform}
                  </Badge>
                </div>
              </div>
            </div>
            {/* Link disabled for demo */}
            <div className="text-gray-400 cursor-not-allowed">
              <ExternalLink className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Posted: {formatDate(graph.originalPoster.timestamp)}
          </div>
          <div className="flex gap-4 text-sm text-gray-700">
            <span>{formatNumber(graph.originalPoster.engagement.likes)} likes</span>
            <span>{formatNumber(graph.originalPoster.engagement.shares)} shares</span>
            <span>{formatNumber(graph.originalPoster.engagement.comments)} comments</span>
            <span>{formatNumber(graph.originalPoster.engagement.views)} views</span>
          </div>
        </div>
      </div>

      {/* Early Spreaders */}
      {graph.earlySpreaders && graph.earlySpreaders.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Early Spreaders
          </h3>
          <div className="space-y-3">
            {graph.earlySpreaders.slice(0, 10).map((spreader, index) => {
              const totalEngagement =
                spreader.engagement.likes +
                spreader.engagement.shares +
                spreader.engagement.comments +
                spreader.engagement.views;
              const hoursFromOriginal = spreader.timeFromOriginal / (1000 * 60 * 60);

              return (
                <div
                  key={spreader.postId}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-300 rounded-full text-xs font-bold text-gray-700">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {spreader.displayName}
                          </span>
                          {spreader.verified && (
                            <BadgeCheck className="w-4 h-4 text-blue-600" />
                          )}
                          {spreader.isInfluencer && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              Influencer ({spreader.influenceScore})
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>@{spreader.username}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {spreader.platform}
                          </Badge>
                          <span>•</span>
                          <span>{formatDuration(hoursFromOriginal)} after original</span>
                        </div>
                      </div>
                    </div>
                    {/* Link disabled for demo */}
                    <div className="text-gray-400 cursor-not-allowed">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600 mt-2">
                    <span>{formatNumber(spreader.engagement.likes)} likes</span>
                    <span>{formatNumber(spreader.engagement.shares)} shares</span>
                    <span>{formatNumber(spreader.engagement.comments)} comments</span>
                    <span className="font-medium text-gray-700">
                      {formatNumber(totalEngagement)} total engagement
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Viral Moments */}
      {graph.viralMoments && graph.viralMoments.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Viral Moments
          </h3>
          <div className="space-y-3">
            {graph.viralMoments.map((moment, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={cn(
                          "capitalize text-xs",
                          getPlatformColor(moment.platform)
                        )}
                      >
                        {moment.platform}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">
                        {moment.engagementSpike.toFixed(1)}x engagement spike
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{moment.description}</p>
                    <div className="text-xs text-gray-600">
                      {formatDate(moment.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-gray-600 mt-2">
                  <span>Velocity: {formatNumber(moment.shareVelocity)} shares/hr</span>
                  <span>Total Shares: {formatNumber(moment.totalShares)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Breakdown */}
      {graph.platformBreakdown && graph.platformBreakdown.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Platform Breakdown
          </h3>
          <div className="space-y-3">
            {graph.platformBreakdown.map((platform) => {
              const percentage = ((platform.postCount / graph.totalPosts) * 100).toFixed(1);

              return (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "capitalize",
                          getPlatformColor(platform.platform)
                        )}
                      >
                        {platform.platform}
                      </Badge>
                      <span className="text-gray-600">
                        {platform.postCount} posts
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{percentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getPlatformColor(platform.platform)
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 min-w-[5rem] text-right">
                      {formatNumber(platform.engagementTotal)} eng.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
