import { Calendar, Flag, ExternalLink, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TimelineFull } from '@/types/batch';
import type { VerificationData } from '../VerificationRegistry';

interface TimelineRendererProps {
  data: VerificationData;
}

export function TimelineRenderer({ data }: TimelineRendererProps) {
  const timelineFull = data.details as TimelineFull | undefined;

  if (!timelineFull) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        No detailed timeline data available
      </div>
    );
  }

  const { flags, timeline, sources } = timelineFull;

  const summaryData = data.summary as any;

  return (
    <div className="space-y-4">
      {summaryData ? (
        <Card className="p-3 bg-white">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {summaryData.classification && (
              <div>
                <span className="text-gray-600">Classification:</span>
                <p className="font-medium text-gray-900">{summaryData.classification as string}</p>
              </div>
            )}
            {summaryData.earliestDate && (
              <div>
                <span className="text-gray-600">Earliest Date:</span>
                <p className="font-medium text-gray-900">{summaryData.earliestDate as string}</p>
              </div>
            )}
            {summaryData.latestDate && (
              <div>
                <span className="text-gray-600">Latest Date:</span>
                <p className="font-medium text-gray-900">{summaryData.latestDate as string}</p>
              </div>
            )}
          </div>
        </Card>
      ) : null}

      {flags && flags.length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Flag className="h-3.5 w-3.5 text-red-600" />
            Detected Flags ({flags.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {flags.map((flag, index) => (
              <Badge key={index} variant="destructive" className="text-xs">
                {flag}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {timeline && timeline.length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            Timeline Events ({timeline.length})
          </h4>
          <div className="space-y-2">
            {timeline.map((event, index) => (
              <Card key={index} className="p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {event.title && (
                      <p className="font-medium text-gray-900 text-xs">{event.title}</p>
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
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {sources && sources.length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-green-600" />
            Sources ({sources.length})
          </h4>
          <div className="space-y-2">
            {sources.map((source, index) => (
              <Card key={index} className="p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 text-xs">{source.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {source.count}
                  </Badge>
                </div>
                {source.urls && source.urls.length > 0 && (
                  <div className="space-y-1">
                    {source.urls.slice(0, 2).map((url, urlIndex) => (
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
                    {source.urls.length > 2 && (
                      <p className="text-xs text-gray-500 ml-4">
                        +{source.urls.length - 2} more
                      </p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {timelineFull.status === 'processing' && (!timeline || timeline.length === 0) ? (
        <div className="text-center py-6 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2" />
          <p className="text-xs">Timeline analysis in progress...</p>
        </div>
      ) : null}
    </div>
  );
}
