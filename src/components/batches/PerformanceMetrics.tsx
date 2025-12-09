import { Clock, Timer, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PerformanceMetricsProps {
  processingStartedAt?: string;
  processingCompletedAt?: string;
  c2paMetrics?: {
    processingTimeMs: number;
    queueWaitTimeMs: number;
    retryCount: number;
  };
}

export function PerformanceMetrics({
  processingStartedAt,
  processingCompletedAt,
  c2paMetrics,
}: PerformanceMetricsProps) {
  const calculateDuration = () => {
    if (!processingStartedAt || !processingCompletedAt) return null;
    const start = new Date(processingStartedAt).getTime();
    const end = new Date(processingCompletedAt).getTime();
    const durationMs = end - start;

    if (durationMs < 1000) return `${durationMs}ms`;
    if (durationMs < 60000) return `${(durationMs / 1000).toFixed(2)}s`;
    return `${(durationMs / 60000).toFixed(2)}m`;
  };

  const formatMs = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  };

  const totalDuration = calculateDuration();

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Timer className="h-4 w-4" />
        Performance Metrics
      </h3>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {totalDuration && (
          <div className="col-span-2 pb-2 border-b">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-gray-600">Total Processing Time:</span>
            </div>
            <p className="font-semibold text-blue-600 text-lg mt-1">{totalDuration}</p>
          </div>
        )}

        {c2paMetrics && (
          <>
            <div>
              <span className="text-gray-600">C2PA Processing:</span>
              <p className="font-medium text-gray-900">
                {formatMs(c2paMetrics.processingTimeMs)}
              </p>
            </div>

            <div>
              <span className="text-gray-600">Queue Wait Time:</span>
              <p className="font-medium text-gray-900">
                {formatMs(c2paMetrics.queueWaitTimeMs)}
              </p>
            </div>

            {c2paMetrics.retryCount > 0 && (
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 text-orange-600" />
                  <span className="text-gray-600">Retry Count:</span>
                </div>
                <p className="font-medium text-orange-600 mt-1">
                  {c2paMetrics.retryCount} {c2paMetrics.retryCount === 1 ? 'retry' : 'retries'}
                </p>
              </div>
            )}
          </>
        )}

        {!totalDuration && !c2paMetrics && (
          <div className="col-span-2 text-center text-gray-500 py-2">
            No performance data available
          </div>
        )}
      </div>
    </Card>
  );
}
