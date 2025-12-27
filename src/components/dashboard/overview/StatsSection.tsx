'use client';

import { StatsCard } from '@/components/c2pa/StatsCard';
import { Database, FileCheck, HardDrive } from 'lucide-react';
import { formatBytes } from '@/lib/dashboard-utils';
import type {
  MonthlyUsage,
  ProcessingSummary,
  UploadQuota,
} from '@/types/dashboard';

interface StatsSectionProps {
  uploadQuota: UploadQuota;
  monthlyUsage: MonthlyUsage;
  processingSummary: ProcessingSummary;
  isLoading?: boolean;
}

export function StatsSection({
  uploadQuota,
  monthlyUsage,
  processingSummary,
  isLoading,
}: StatsSectionProps) {
  // Format bytes to display in MB or GB without decimal
  const getStorageDisplay = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    const gb = bytes / (1024 * 1024 * 1024);

    if (gb >= 1) {
      return { value: Math.round(gb * 10) / 10, unit: 'GB' };
    }
    return { value: Math.round(mb), unit: 'MB' };
  };

  const storage = getStorageDisplay(uploadQuota.used);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard
        title={`Storage Used (${storage.unit})`}
        value={storage.value}
        icon={HardDrive}
        description={`${uploadQuota.percentage.toFixed(1)}% of ${uploadQuota.limitGB} GB`}
        variant={
          uploadQuota.percentage > 90
            ? 'danger'
            : uploadQuota.percentage > 75
              ? 'warning'
              : 'default'
        }
        isLoading={isLoading}
      />

      <StatsCard
        title="Files This Month"
        value={monthlyUsage.currentMonthFiles}
        icon={Database}
        description={`${monthlyUsage.monthlyFileLimit - monthlyUsage.currentMonthFiles} remaining`}
        variant="default"
        isLoading={isLoading}
      />

      <StatsCard
        title="Total Processed"
        value={processingSummary.completed}
        icon={FileCheck}
        description={`${processingSummary.successRate.toFixed(1)}% success rate`}
        variant="success"
        isLoading={isLoading}
      />
    </div>
  );
}
