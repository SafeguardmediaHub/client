"use client";

import {
  AlertCircle,
  Globe,
  Share2,
  Sparkles,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Platform, TimelineEvent } from "@/types/trace";

interface TimelineTabProps {
  events: TimelineEvent[];
}

const getEventIcon = (
  type: TimelineEvent["type"],
): React.ComponentType<{ className?: string }> => {
  switch (type) {
    case "first_appearance":
      return Sparkles;
    case "viral_spike":
      return TrendingUp;
    case "platform_spread":
      return Share2;
    case "deletion":
      return Trash2;
    default:
      return AlertCircle;
  }
};

const getEventColor = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "first_appearance":
      return "text-green-600 bg-green-50 border-green-200";
    case "viral_spike":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "platform_spread":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "deletion":
      return "text-red-600 bg-red-50 border-red-200";
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

const formatEventType = (type: TimelineEvent["type"]) => {
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

export const TimelineTab = ({ events }: TimelineTabProps) => {
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
          <div className="text-sm text-gray-600 mb-1">First Appearances</div>
          <div className="text-2xl font-bold text-gray-900">
            {events.filter((e) => e.type === "first_appearance").length}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Viral Spikes</div>
          <div className="text-2xl font-bold text-gray-900">
            {events.filter((e) => e.type === "viral_spike").length}
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Deletions</div>
          <div className="text-2xl font-bold text-gray-900">
            {events.filter((e) => e.type === "deletion").length}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Event Timeline
        </h3>
        <div className="space-y-8">
          {days.map((day, dayIndex) => (
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

                {groupedEvents[day].map((event, eventIndex) => {
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
                        <p className="text-sm text-gray-700">
                          {event.description}
                        </p>
                        {event.metadata &&
                          Object.keys(event.metadata).length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <details className="text-xs">
                                <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                                  View metadata
                                </summary>
                                <pre className="mt-2 p-2 bg-white rounded border border-gray-200 overflow-x-auto">
                                  {JSON.stringify(event.metadata, null, 2)}
                                </pre>
                              </details>
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
