'use client';

import { useDashboardOverview } from '@/hooks/useDashboard';
import { StatsSection } from './StatsSection';
import { UploadQuotaCard } from './UploadQuotaCard';
import { MonthlyUsageCard } from './MonthlyUsageCard';
import { ProcessingSummaryCard } from './ProcessingSummaryCard';
import { Badge } from '@/components/ui/badge';
import {
  formatSubscriptionTier,
  getSubscriptionBadgeColor,
} from '@/lib/dashboard-utils';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type {
  MonthlyUsage,
  ProcessingSummary,
  UploadQuota,
} from '@/types/dashboard';

export function DashboardOverview() {
  const { data, isLoading, error } = useDashboardOverview();

  useEffect(() => {
    if (error) {
      toast.error('Failed to load dashboard data. Please try again.');
    }
  }, [error]);

  // Provide safe default values to prevent errors during loading
  const uploadQuota: UploadQuota = data?.uploadQuota || {
    used: 0,
    limit: 0,
    usedGB: 0,
    limitGB: 0,
    percentage: 0,
    fileCount: 0,
    maxFiles: 0,
    fileCountPercentage: 0,
  };

  const monthlyUsage: MonthlyUsage = data?.monthlyUsage || {
    currentMonthFiles: 0,
    monthlyFileLimit: 0,
    filesPercentage: 0,
    currentMonthBatches: 0,
    monthlyBatchLimit: 0,
    batchesPercentage: 0,
    daysUntilReset: 0,
    resetDate: new Date().toISOString(),
  };

  const processingSummary: ProcessingSummary = data?.processingSummary || {
    totalFiles: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    successRate: 0,
    averageProcessingTime: 0,
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <StatsSection
        uploadQuota={uploadQuota}
        monthlyUsage={monthlyUsage}
        processingSummary={processingSummary}
        isLoading={isLoading}
      />

      {/* Quota & Usage Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProcessingSummaryCard
          data={processingSummary}
          isLoading={isLoading}
        />
        <UploadQuotaCard data={uploadQuota} isLoading={isLoading} />
        <MonthlyUsageCard data={monthlyUsage} isLoading={isLoading} />
      </div>
    </div>
  );
}
