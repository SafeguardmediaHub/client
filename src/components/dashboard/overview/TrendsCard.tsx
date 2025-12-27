'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendsLineChart } from '@/components/dashboard/charts/TrendsLineChart';
import type { Trends } from '@/types/dashboard';
import { useState } from 'react';

interface TrendsCardProps {
  data: Trends;
  isLoading?: boolean;
}

type TimeRange = '7d' | '30d' | '90d';

export function TrendsCard({ data, isLoading }: TrendsCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Filter data based on time range
  const now = new Date();
  const daysMap = { '7d': 7, '30d': 30, '90d': 90 };

  const filterByTimeRange = <T extends { date: string }>(
    items: T[]
  ): T[] => {
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      const diffTime = now.getTime() - itemDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= daysMap[timeRange];
    });
  };

  const filteredTrends: Trends = {
    uploadsOverTime: filterByTimeRange(data.uploadsOverTime),
    filesProcessedOverTime: filterByTimeRange(data.filesProcessedOverTime),
    integrityScoreTrend: filterByTimeRange(data.integrityScoreTrend),
    tamperingDetectionTrend: filterByTimeRange(data.tamperingDetectionTrend),
    totalUploadsLast30Days: data.totalUploadsLast30Days,
    percentageChangeFromPrevious30Days:
      data.percentageChangeFromPrevious30Days,
    mostCommonFileType: data.mostCommonFileType,
    mostCommonVerdict: data.mostCommonVerdict,
  };

  const totalUploads = filteredTrends.uploadsOverTime.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const totalProcessed = filteredTrends.filesProcessedOverTime.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const avgIntegrity =
    filteredTrends.integrityScoreTrend.length > 0
      ? (
          filteredTrends.integrityScoreTrend.reduce(
            (sum, item) => sum + item.averageScore,
            0
          ) / filteredTrends.integrityScoreTrend.length
        ).toFixed(1)
      : '0.0';

  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-medium">Trends & Insights</h3>
            <p className="text-sm text-muted-foreground">
              Upload and processing trends over time
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        <TrendsLineChart data={filteredTrends} />

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">
              {totalUploads}
            </p>
            <p className="text-xs text-muted-foreground">Total Uploads</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">
              {totalProcessed}
            </p>
            <p className="text-xs text-muted-foreground">Total Processed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-purple-600">
              {avgIntegrity}%
            </p>
            <p className="text-xs text-muted-foreground">Avg Integrity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
