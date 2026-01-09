"use client";

import {
  AlertCircle,
  Globe,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DistributionGraph, Platform, PlatformAppearance } from "@/types/trace";

interface TimelineTabProps {
  distributionGraph: DistributionGraph;
  platformAppearances: PlatformAppearance[];
  timelineData?: any[];
}


type TimelineEventType =
  | "original_post"
  | "early_spread"
  | "viral_moment"
  | "platform_spread";

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: TimelineEventType;
  platform: Platform;
  description: string;
  metadata?: any;
}

const getEventIcon = (
  type: TimelineEventType,
): React.ComponentType<{ className?: string }> => {
  switch (type) {
    case "original_post":
      return Sparkles;
    case "viral_moment":
      return Zap;
    case "early_spread":
      return TrendingUp;
    case "platform_spread":
      return Share2;
    default:
      return AlertCircle;
  }
};

const getEventColor = (type: TimelineEventType) => {
  switch (type) {
    case "original_post":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "viral_moment":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "early_spread":
      return "text-green-600 bg-green-50 border-green-200";
    case "platform_spread":
      return "text-purple-600 bg-purple-50 border-purple-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getPlatformColor = (platform: Platform) => {
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

const formatEventType = (type: TimelineEventType) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const groupEventsByDay = (events: TimelineEvent[]) => {
  const groups: { [key: string]: TimelineEvent[] } = {};

  events.forEach((event) => {
    const date = new Date(event.timestamp);
    const dayKey = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(event);
  });

  return groups;
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const TimelineTab = ({
  distributionGraph,
  platformAppearances,
  timelineData,
}: TimelineTabProps) => {
  // Generate timeline events from distribution data
  const events = useMemo(() => {
    if (timelineData && Array.isArray(timelineData) && timelineData.length > 0) {
      return timelineData.map((event, idx) => ({
        id: (event as any).id || `event-${idx}`,
        timestamp: event.timestamp,
        type: (event.eventType || (event as any).type) as TimelineEventType,
        platform: event.platform as Platform,
        description: event.description,
        metadata: {
          ...(event as any).metadata,
          url: event.postUrl,
          username: event.username,
          ...(event.engagement || {}),
        },
      }));
    }

    const timelineEvents: TimelineEvent[] = [];

    // Add original post event
    if (distributionGraph?.originalPoster) {
      const op = distributionGraph.originalPoster;
      timelineEvents.push({
        id: `original-${op.userId}`,
        timestamp: op.timestamp,
        type: "original_post",
        platform: op.platform,
        description: `Original post by ${op.displayName} (@${op.username})`,
        metadata: {
          likes: op.engagement.likes,
          shares: op.engagement.shares,
          views: op.engagement.views,
          verified: op.verified,
        },
      });
    }

    // Add early spreader events (limit to first 5)
    if (distributionGraph?.earlySpreaders) {
      distributionGraph.earlySpreaders.slice(0, 5).forEach((spreader, index) => {
        const hoursFromOriginal = spreader.timeFromOriginal / (1000 * 60 * 60);
        timelineEvents.push({
          id: `early-${spreader.postId}`,
          timestamp: spreader.timestamp,
          type: "early_spread",
          platform: spreader.platform,
          description: `Early spread by ${spreader.displayName} (@${spreader.username}) - ${hoursFromOriginal.toFixed(1)}h after original${spreader.isInfluencer ? " (Influencer)" : ""}`,
          metadata: {
            likes: spreader.engagement.likes,
            shares: spreader.engagement.shares,
            isInfluencer: spreader.isInfluencer,
            influenceScore: spreader.influenceScore,
          },
        });
      });
    }

    // Add viral moment events
    if (distributionGraph?.viralMoments) {
      distributionGraph.viralMoments.forEach((moment, index) => {
        timelineEvents.push({
          id: `viral-${moment.platform}-${index}`,
          timestamp: moment.timestamp,
          type: "viral_moment",
          platform: moment.platform,
          description: moment.description,
          metadata: {
            engagementSpike: moment.engagementSpike,
            shareVelocity: moment.shareVelocity,
            totalShares: moment.totalShares,
          },
        });
      });
    }

    // Add platform spread events (first appearance on each platform)
    if (platformAppearances) {
      platformAppearances.forEach((pa) => {
        if (pa.posts && pa.posts.length > 0) {
          // Find the oldest post on this platform
          const oldestPost = pa.posts.reduce((oldest, post) =>
            new Date(post.timestamp) < new Date(oldest.timestamp) ? post : oldest,
            pa.posts[0]
          );

          // Only add if it's not the original poster's platform
          if (
            !distributionGraph?.originalPoster ||
            oldestPost.platform !== distributionGraph.originalPoster.platform ||
            oldestPost.userId !== distributionGraph.originalPoster.userId
          ) {
            timelineEvents.push({
              id: `platform-${pa.platform}`,
              timestamp: oldestPost.timestamp,
              type: "platform_spread",
              platform: pa.platform,
              description: `First appeared on ${pa.platform} via ${oldestPost.displayName}`,
              metadata: {
                totalPosts: pa.totalFound,
                oldestPost: pa.oldestPost,
                newestPost: pa.newestPost,
              },
            });
          }
        }
      });
    }

    return timelineEvents;
  }, [distributionGraph, platformAppearances, timelineData]);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const groupedEvents = groupEventsByDay(sortedEvents);
  const days = Object.keys(groupedEvents).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (events.length === 0) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Timeline Events
        </h3>
        <p className="text-sm text-gray-600">
          No significant events were detected in this trace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Timeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Events</div>
          <div className="text-2xl font-bold text-gray-900">{events.length}</div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Original Posts</div>
          <div className="text-2xl font-bold text-gray-900">
            {events.filter((e) => e.type === "original_post").length}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Viral Moments</div>
          <div className="text-2xl font-bold text-gray-900">
            {events.filter((e) => e.type === "viral_moment").length}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Platform Spreads</div>
          <div className="text-2xl font-bold text-gray-900">
            {events.filter((e) => e.type === "platform_spread").length}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Event Timeline
        </h3>
        <div className="space-y-8">
          {days.map((day) => (
            <div key={day} className="relative">
              {/* Day Header */}
              <div className="sticky top-0 z-10 bg-white pb-3 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  {day}
                  <Badge variant="outline" className="ml-2">
                    {groupedEvents[day].length} events
                  </Badge>
                </h4>
              </div>

              {/* Events for this day */}
              <div className="space-y-4 relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                {groupedEvents[day].map((event) => {
                  const Icon = getEventIcon(event.type);
                  const colorClass = getEventColor(event.type);

                  return (
                    <div key={event.id} className="relative pl-16">
                      {/* Icon */}
                      <div
                        className={cn(
                          "absolute left-0 w-12 h-12 rounded-full border-2 flex items-center justify-center",
                          colorClass,
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn("border text-xs", colorClass)}
                            >
                              {formatEventType(event.type)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs border capitalize",
                                getPlatformColor(event.platform),
                              )}
                            >
                              {event.platform}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTime(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {event.description}
                        </p>

                        {/* Event-specific metadata display */}
                        {event.metadata && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                              {event.type === "viral_moment" && (
                                <>
                                  <span>
                                    <strong>{event.metadata.engagementSpike?.toFixed(1)}x</strong> spike
                                  </span>
                                  <span>
                                    <strong>{formatNumber(event.metadata.shareVelocity)}</strong> shares/hr
                                  </span>
                                  <span>
                                    <strong>{formatNumber(event.metadata.totalShares)}</strong> total shares
                                  </span>
                                </>
                              )}
                              {(event.type === "original_post" || event.type === "early_spread") && (
                                <>
                                  {event.metadata.likes !== undefined && (
                                    <span>
                                      <strong>{formatNumber(event.metadata.likes)}</strong> likes
                                    </span>
                                  )}
                                  {event.metadata.shares !== undefined && (
                                    <span>
                                      <strong>{formatNumber(event.metadata.shares)}</strong> shares
                                    </span>
                                  )}
                                  {event.metadata.views !== undefined && (
                                    <span>
                                      <strong>{formatNumber(event.metadata.views)}</strong> views
                                    </span>
                                  )}
                                  {event.metadata.verified && (
                                    <Badge variant="outline" className="text-xs">Verified</Badge>
                                  )}
                                  {event.metadata.isInfluencer && (
                                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                      Influencer ({event.metadata.influenceScore})
                                    </Badge>
                                  )}
                                </>
                              )}
                              {event.type === "platform_spread" && (
                                <span>
                                  <strong>{event.metadata.totalPosts}</strong> total posts found
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
