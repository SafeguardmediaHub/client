import { Calendar, Flag, ExternalLink, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TimelineFull } from '@/types/batch';

interface TimelineEventsDisplayProps {
  timelineFull?: TimelineFull;
}

export function TimelineEventsDisplay({ timelineFull }: TimelineEventsDisplayProps) {
  if (!timelineFull) {
    return (
      <div className="text-center py-12 text-gray-500">
        No timeline data available
      </div>
    );
  }

  const { status, flags, timeline, sources } = timelineFull;

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Timeline Status</h3>
          <Badge
            variant={
              status === 'completed'
                ? 'default'
                : status === 'processing'
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {status}
          </Badge>
        </div>
      </Card>

      {/* Flags */}
      {flags && flags.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Flag className="h-4 w-4 text-red-600" />
            Detected Flags ({flags.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {flags.map((flag, index) => (
              <Badge key={index} variant="destructive" className="text-xs">
                {flag}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline Events */}
      {timeline && timeline.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            Timeline Events ({timeline.length})
          </h3>
          <div className="space-y-3">
            {timeline.map((event, index) => (
              <div
                key={index}
                className="border-l-2 border-blue-600 pl-3 py-1 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {event.title && (
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                    )}
                    {event.description && (
                      <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {event.date} • {event.source}
                    </p>
                  </div>
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 mt-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sources */}
      {sources && sources.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-green-600" />
            Sources ({sources.length})
          </h3>
          <div className="space-y-3">
            {sources.map((source, index) => (
              <div key={index} className="border rounded p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 text-sm">{source.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {source.count} {source.count === 1 ? 'occurrence' : 'occurrences'}
                  </Badge>
                </div>
                {source.urls && source.urls.length > 0 && (
                  <div className="space-y-1">
                    {source.urls.slice(0, 3).map((url, urlIndex) => (
                      <a
                        key={urlIndex}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{url}</span>
                      </a>
                    ))}
                    {source.urls.length > 3 && (
                      <p className="text-xs text-gray-500 ml-4">
                        +{source.urls.length - 3} more
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {status === 'processing' && (!timeline || timeline.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
          <p>Timeline analysis in progress...</p>
        </div>
      )}
    </div>
  );
}
