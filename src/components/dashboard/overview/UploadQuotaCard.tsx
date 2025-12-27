'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBytes } from '@/lib/dashboard-utils';
import type { UploadQuota } from '@/types/dashboard';

interface UploadQuotaCardProps {
  data: UploadQuota;
  isLoading?: boolean;
}

export function UploadQuotaCard({ data, isLoading }: UploadQuotaCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-4">
        <div>
          <h3 className="text-xl font-medium">Upload Quota</h3>
          <p className="text-sm text-muted-foreground">
            Storage and file limits for your account
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Storage Used</span>
            <span className="text-muted-foreground">
              {formatBytes(data.used)} / {formatBytes(data.limit)}
            </span>
          </div>
          <Progress value={data.percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {data.percentage.toFixed(1)}% used
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Files Uploaded</span>
            <span className="text-muted-foreground">
              {data.fileCount} / {data.maxFiles}
            </span>
          </div>
          <Progress value={data.fileCountPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {data.maxFiles - data.fileCount} files remaining
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
