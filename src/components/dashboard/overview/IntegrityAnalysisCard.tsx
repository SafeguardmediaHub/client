'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IntegrityDonutChart } from '@/components/dashboard/charts/IntegrityDonutChart';
import { TamperingBarChart } from '@/components/dashboard/charts/TamperingBarChart';
import type { IntegrityBreakdown, Trends } from '@/types/dashboard';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { getTamperingSeverity } from '@/lib/dashboard-utils';

interface IntegrityAnalysisCardProps {
  data: IntegrityBreakdown;
  trends: Trends;
  isLoading?: boolean;
}

export function IntegrityAnalysisCard({
  data,
  trends,
  isLoading,
}: IntegrityAnalysisCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalFiles = data.totalAnalyzed;
  const tamperingSeverity = getTamperingSeverity(
    data.tamperingDetected,
    totalFiles
  );

  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-6">
        <div>
          <h3 className="text-xl font-medium">Integrity Analysis Breakdown</h3>
          <p className="text-sm text-muted-foreground">
            Media authenticity classification and tampering detection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div>
            <IntegrityDonutChart data={data} />
          </div>

          {/* Stats Legend */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
              <Shield className="size-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Average Integrity Score</p>
                <p className="text-2xl font-semibold">
                  {data.averageIntegrityScore.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
              <AlertTriangle className={`size-5 ${tamperingSeverity.color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">Tampering Detected</p>
                <p className="text-2xl font-semibold">
                  {data.tamperingDetected}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {tamperingSeverity.severity} severity
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
              <CheckCircle className="size-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">C2PA Verified</p>
                <p className="text-2xl font-semibold">{data.c2paVerified}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">Metadata Missing</p>
                <p className="font-semibold">{data.metadataMissing}</p>
              </div>
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">Total Analyzed</p>
                <p className="font-semibold">{totalFiles}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tampering Trend */}
        <div>
          <h4 className="text-sm font-medium mb-2">
            Tampering Detection Trend
          </h4>
          <TamperingBarChart data={trends.tamperingDetectionTrend} />
        </div>
      </CardContent>
    </Card>
  );
}
