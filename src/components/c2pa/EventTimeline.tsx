'use client';

import {
  AlertCircle,
  Bot,
  CheckCircle,
  Clock,
  FileSearch,
  KeyRound,
  Loader2,
  Play,
  Shield,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VerificationEvent } from '@/types/c2pa';

interface EventTimelineProps {
  events: VerificationEvent[];
  className?: string;
}

const eventTypeConfig: Record<
  VerificationEvent['type'],
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  started: {
    icon: Play,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  manifest_detected: {
    icon: FileSearch,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  signature_verified: {
    icon: KeyRound,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  certificate_validated: {
    icon: Shield,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  integrity_checked: {
    icon: ShieldCheck,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  ai_markers_scanned: {
    icon: Bot,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  completed: {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
};

const eventStatusIcons: Record<
  VerificationEvent['status'],
  { icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  success: { icon: CheckCircle, className: 'text-emerald-500' },
  warning: { icon: AlertCircle, className: 'text-amber-500' },
  error: { icon: XCircle, className: 'text-red-500' },
  pending: { icon: Clock, className: 'text-gray-400' },
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDateHeader(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function EventTimeline({ events, className }: EventTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <Clock className="size-12 mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No events recorded</p>
      </div>
    );
  }

  // Group events by date
  const groupedEvents = events.reduce(
    (acc, event) => {
      const dateKey = new Date(event.timestamp).toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    },
    {} as Record<string, VerificationEvent[]>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
        <div key={dateKey}>
          {/* Date header */}
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            {formatDateHeader(dateEvents[0].timestamp)}
          </div>

          {/* Events for this date */}
          <div className="space-y-3">
            {dateEvents.map((event, index) => {
              const typeConfig = eventTypeConfig[event.type];
              const statusConfig = eventStatusIcons[event.status];
              const TypeIcon = typeConfig.icon;
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={event.id}
                  className={cn(
                    'relative flex items-start gap-3 animate-in fade-in slide-in-from-left-2',
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Connector line */}
                  {index < dateEvents.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-200" />
                  )}

                  {/* Event icon */}
                  <div
                    className={cn(
                      'relative z-10 flex-shrink-0 size-10 rounded-full flex items-center justify-center',
                      typeConfig.bgColor
                    )}
                  >
                    <TypeIcon className={cn('size-5', typeConfig.color)} />
                  </div>

                  {/* Event content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {event.message}
                      </span>
                      <StatusIcon className={cn('size-4', statusConfig.className)} />
                    </div>
                    <span className="text-xs text-gray-400 mt-0.5 block">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function EventTimelineSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3 animate-pulse">
          <div className="size-10 rounded-full bg-gray-200" />
          <div className="flex-1 pt-1 space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
