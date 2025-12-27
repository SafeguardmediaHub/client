'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProcessingSummary } from '@/types/dashboard';
import { CheckCircle2, Clock, FileX, Loader2 } from 'lucide-react';

interface ProcessingSummaryCardProps {
  data: ProcessingSummary;
  isLoading?: boolean;
}

export function ProcessingSummaryCard({
  data,
  isLoading,
}: ProcessingSummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgTimeSeconds = (data.averageProcessingTime * 60).toFixed(1);

  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-4">
        <div>
          <h3 className="text-xl font-medium">Processing Summary</h3>
          <p className="text-sm text-muted-foreground">
            Analysis statistics for all media files
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
            <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-2xl font-semibold text-green-900">
                {data.completed}
              </p>
              <p className="text-xs text-green-700">Completed</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
            <Loader2 className="size-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-2xl font-semibold text-blue-900">
                {data.processing}
              </p>
              <p className="text-xs text-blue-700">Processing</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50">
            <Clock className="size-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-2xl font-semibold text-yellow-900">
                {data.pending}
              </p>
              <p className="text-xs text-yellow-700">Pending</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
            <FileX className="size-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-2xl font-semibold text-red-900">
                {data.failed}
              </p>
              <p className="text-xs text-red-700">Failed</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-muted-foreground">Success Rate</span>
          <span className="text-lg font-semibold text-green-600">
            {data.successRate.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Avg Processing Time
          </span>
          <span className="text-sm font-medium">{avgTimeSeconds}s</span>
        </div>
      </CardContent>
    </Card>
  );
}
