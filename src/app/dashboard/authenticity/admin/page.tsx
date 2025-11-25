'use client';

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Database,
  HardDrive,
  Loader2,
  RefreshCw,
  Server,
  Settings,
  Trash2,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  StatsCard,
  StatsCardSkeleton,
  VerificationFilters,
  VerificationTable,
} from '@/components/c2pa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import {
  useAdminDashboard,
  useAdminVerifications,
  useClearAdminCache,
} from '@/hooks/useC2PA';
import { cn } from '@/lib/utils';
import type { AdminVerificationsParams } from '@/types/c2pa';

function HealthIndicator({
  status,
  label,
  latency,
}: {
  status: 'up' | 'down' | 'degraded';
  label: string;
  latency?: number;
}) {
  const statusConfig = {
    up: { color: 'bg-emerald-500', text: 'Healthy', textColor: 'text-emerald-700' },
    down: { color: 'bg-red-500', text: 'Down', textColor: 'text-red-700' },
    degraded: { color: 'bg-amber-500', text: 'Degraded', textColor: 'text-amber-700' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className={cn('size-2.5 rounded-full', config.color)} />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {latency !== undefined && (
          <span className="text-xs text-gray-400">{latency}ms</span>
        )}
        <span className={cn('text-xs font-medium', config.textColor)}>
          {config.text}
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const clearCacheMutation = useClearAdminCache();

  const [filters, setFilters] = useState<AdminVerificationsParams>({
    page: 1,
    limit: 10,
  });
  const [userIdFilter, setUserIdFilter] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const dashboardQuery = useAdminDashboard();
  const verificationsQuery = useAdminVerifications({
    ...filters,
    userId: userIdFilter || undefined,
  });

  const dashboard = dashboardQuery.data?.data;
  const verifications = verificationsQuery.data?.data.verifications || [];
  const pagination = verificationsQuery.data?.data.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  // Check admin access
  if (user?.role !== 'admin') {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 p-8 min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="size-12 mx-auto text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-sm text-gray-500 mt-1">
            You don't have permission to access this page.
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/authenticity')}
          variant="outline"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Overview
        </Button>
      </div>
    );
  }

  const handleClearCache = async () => {
    try {
      const result = await clearCacheMutation.mutateAsync();
      toast.success(`Cache cleared! ${result.entriesCleared} entries removed.`);
      setShowClearConfirm(false);
    } catch (err) {
      toast.error('Failed to clear cache');
    }
  };

  const handleFiltersChange = (newFilters: AdminVerificationsParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleViewDetails = (verificationId: string) => {
    router.push(`/dashboard/authenticity/${verificationId}`);
  };

  const handleRefresh = () => {
    dashboardQuery.refetch();
    verificationsQuery.refetch();
  };

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/authenticity')}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-gray-500" />
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="size-4 mr-1" />
          Refresh
        </Button>
      </div>

      {/* System health section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="size-4 text-blue-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardQuery.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : dashboard?.systemHealth ? (
              <>
                <div className="mb-4 p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Overall Status
                    </span>
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-1 rounded-full',
                        dashboard.systemHealth.status === 'healthy' &&
                          'bg-emerald-100 text-emerald-700',
                        dashboard.systemHealth.status === 'degraded' &&
                          'bg-amber-100 text-amber-700',
                        dashboard.systemHealth.status === 'down' &&
                          'bg-red-100 text-red-700'
                      )}
                    >
                      {dashboard.systemHealth.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Uptime: {Math.floor(dashboard.systemHealth.uptime / 3600)}h{' '}
                    {Math.floor((dashboard.systemHealth.uptime % 3600) / 60)}m
                  </p>
                </div>
                <div>
                  {dashboard.systemHealth.services.map((service) => (
                    <HealthIndicator
                      key={service.name}
                      status={service.status}
                      label={service.name}
                      latency={service.latency}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Unable to load health data</p>
            )}
          </CardContent>
        </Card>

        {/* Queue status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="size-4 text-purple-600" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardQuery.isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : dashboard?.queueStatus ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-semibold text-amber-700">
                    {dashboard.queueStatus.pending}
                  </p>
                  <p className="text-xs text-amber-600">Pending</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-semibold text-blue-700">
                    {dashboard.queueStatus.processing}
                  </p>
                  <p className="text-xs text-blue-600">Processing</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-semibold text-emerald-700">
                    {dashboard.queueStatus.completed}
                  </p>
                  <p className="text-xs text-emerald-600">Completed</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-semibold text-red-700">
                    {dashboard.queueStatus.failed}
                  </p>
                  <p className="text-xs text-red-600">Failed</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Unable to load queue data</p>
            )}
            {dashboard?.queueStatus && (
              <p className="text-xs text-gray-500 mt-4">
                Avg. processing time:{' '}
                {(dashboard.queueStatus.avgProcessingTime / 1000).toFixed(1)}s
              </p>
            )}
          </CardContent>
        </Card>

        {/* Cache status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="size-4 text-teal-600" />
              Cache Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardQuery.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : dashboard?.cacheStatus ? (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size</span>
                    <span className="font-medium">
                      {(dashboard.cacheStatus.size / 1024 / 1024).toFixed(1)} MB /{' '}
                      {(dashboard.cacheStatus.maxSize / 1024 / 1024).toFixed(0)} MB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(dashboard.cacheStatus.size / dashboard.cacheStatus.maxSize) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hit Rate</span>
                    <span className="font-medium text-emerald-600">
                      {(dashboard.cacheStatus.hitRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Entries</span>
                    <span className="font-medium">
                      {dashboard.cacheStatus.entries.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Clear cache button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  {showClearConfirm ? (
                    <div className="space-y-2">
                      <p className="text-xs text-red-600">
                        Are you sure? This will clear all cached data.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleClearCache}
                          disabled={clearCacheMutation.isPending}
                          className="flex-1"
                        >
                          {clearCacheMutation.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            'Confirm'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowClearConfirm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowClearConfirm(true)}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-4 mr-1" />
                      Clear Cache
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Unable to load cache data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin verifications section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          All Verifications
        </h2>

        {/* User ID filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-gray-400" />
            <Input
              placeholder="Filter by User ID..."
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              className="w-64"
            />
          </div>
          {userIdFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserIdFilter('')}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Filters */}
        <VerificationFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Table */}
        <VerificationTable
          verifications={verifications}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
          isLoading={verificationsQuery.isLoading}
        />
      </div>

      {/* Recent activity */}
      {dashboard?.recentActivity && dashboard.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboard.recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="size-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        User: {activity.userId.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
