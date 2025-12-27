'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime } from '@/lib/dashboard-utils';
import type { MonthlyUsage } from '@/types/dashboard';
import { Calendar } from 'lucide-react';

interface MonthlyUsageCardProps {
  data: MonthlyUsage;
  isLoading?: boolean;
}

export function MonthlyUsageCard({ data, isLoading }: MonthlyUsageCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-medium">Monthly Usage</h3>
            <p className="text-sm text-muted-foreground">
              Current billing cycle
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>Resets {formatRelativeTime(data.resetDate)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Files Uploaded</span>
            <span className="text-muted-foreground">
              {data.currentMonthFiles} / {data.monthlyFileLimit}
            </span>
          </div>
          <Progress value={data.filesPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Batches Created</span>
            <span className="text-muted-foreground">
              {data.currentMonthBatches} / {data.monthlyBatchLimit}
            </span>
          </div>
          <Progress value={data.batchesPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
