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
  TrendingUp,
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
      toast.success(`Cache cleared! ${result.entriesCleared} keys removed.`);
      setShowClearConfirm(false);
      dashboardQuery.refetch();
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

      {/* System Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="size-4 text-blue-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardQuery.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : dashboard ? (
              <div className="space-y-3">
                {/* C2PA System Enabled */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'size-2 rounded-full',
                        dashboard.system.enabled
                          ? 'bg-emerald-500'
                          : 'bg-gray-400'
                      )}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      C2PA System
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-1 rounded-full',
                      dashboard.system.enabled
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {dashboard.system.enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                {/* C2PA Tool Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'size-2 rounded-full',
                        dashboard.system.tool.available
                          ? 'bg-emerald-500'
                          : 'bg-red-500'
                      )}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      C2PA Tool
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {dashboard.system.tool.version && (
                      <span className="text-xs text-gray-500">
                        v{dashboard.system.tool.version}
                      </span>
                    )}
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-1 rounded-full',
                        dashboard.system.tool.available
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      )}
                    >
                      {dashboard.system.tool.available
                        ? 'AVAILABLE'
                        : 'UNAVAILABLE'}
                    </span>
                  </div>
                </div>

                {dashboard.system.tool.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-700">
                      {dashboard.system.tool.error}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Unable to load system data
              </p>
            )}
          </CardContent>
        </Card>

        {/* Queue Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="size-4 text-purple-600" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-14" />
                  ))}
                </div>
              </div>
            ) : dashboard ? (
              <div className="space-y-3">
                {/* Queue Health */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'size-2 rounded-full',
                        dashboard.queue.healthy && dashboard.queue.connected
                          ? 'bg-emerald-500'
                          : 'bg-red-500'
                      )}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Queue Health
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-1 rounded-full',
                      dashboard.queue.healthy && dashboard.queue.connected
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    )}
                  >
                    {dashboard.queue.healthy && dashboard.queue.connected
                      ? 'HEALTHY'
                      : 'UNHEALTHY'}
                  </span>
                </div>

                {/* Job Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-amber-50 rounded-lg text-center">
                    <p className="text-xl font-semibold text-amber-700">
                      {dashboard.queue.jobs.waiting}
                    </p>
                    <p className="text-xs text-amber-600">Waiting</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-center">
                    <p className="text-xl font-semibold text-blue-700">
                      {dashboard.queue.jobs.active}
                    </p>
                    <p className="text-xs text-blue-600">Active</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg text-center">
                    <p className="text-xl font-semibold text-red-700">
                      {dashboard.queue.jobs.delayed}
                    </p>
                    <p className="text-xs text-red-600">Delayed</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-emerald-50 rounded-lg text-center">
                    <p className="text-xl font-semibold text-emerald-700">
                      {dashboard.queue.jobs.completed}
                    </p>
                    <p className="text-xs text-emerald-600">Completed</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg text-center">
                    <p className="text-xl font-semibold text-gray-700">
                      {dashboard.queue.jobs.failed}
                    </p>
                    <p className="text-xs text-gray-600">Failed</p>
                  </div>
                </div>

                {dashboard.queue.paused && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700 font-medium">
                      ⚠️ Queue is paused
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Unable to load queue data</p>
            )}
          </CardContent>
        </Card>

        {/* Cache Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="size-4 text-teal-600" />
              Cache Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardQuery.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
                <Skeleton className="h-10 w-full" />
              </div>
            ) : dashboard ? (
              <>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Media Keys</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {dashboard.cache.mediaKeys.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Hash Keys</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {dashboard.cache.hashKeys.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Rate Limit Keys
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {dashboard.cache.rateLimitKeys.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Total Cached Items
                    </p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      {(
                        dashboard.cache.mediaKeys +
                        dashboard.cache.hashKeys +
                        dashboard.cache.rateLimitKeys
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Clear cache button */}
                <div className="pt-3 border-t border-gray-100">
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
                      Clear All Caches
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

      {/* Statistics Section */}
      {dashboard && (
        <>
          {/* Today's Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="size-4 text-blue-600" />
                  Today's Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total Verifications
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {dashboard.stats.today.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Avg Processing Time
                    </span>
                    <span className="text-lg font-semibold text-gray-700">
                      {dashboard.stats.today.avgProcessingTime > 0
                        ? `${(
                            dashboard.stats.today.avgProcessingTime / 1000
                          ).toFixed(2)}s`
                        : 'N/A'}
                    </span>
                  </div>
                  {Object.keys(dashboard.stats.today.byStatus).length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">By Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(dashboard.stats.today.byStatus).map(
                          ([status, count]) => (
                            <div
                              key={status}
                              className="p-2 bg-gray-50 rounded text-center"
                            >
                              <p className="text-lg font-semibold text-gray-900">
                                {count}
                              </p>
                              <p className="text-xs text-gray-600 capitalize">
                                {status.replace(/_/g, ' ')}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Database Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HardDrive className="size-4 text-purple-600" />
                  Database Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">
                      {dashboard.stats.database.total}
                    </p>
                    <p className="text-xs text-blue-600">Total Records</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-700">
                      {dashboard.stats.database.verified}
                    </p>
                    <p className="text-xs text-emerald-600">Verified</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-700">
                      {dashboard.stats.database.noManifest}
                    </p>
                    <p className="text-xs text-gray-600">No Manifest</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-700">
                      {dashboard.stats.database.tampered}
                    </p>
                    <p className="text-xs text-red-600">Tampered</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg col-span-2">
                    <p className="text-2xl font-bold text-amber-700">
                      {dashboard.stats.database.errors}
                    </p>
                    <p className="text-xs text-amber-600">Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Trends */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-4 text-green-600" />
                Last 7 Days Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboard.stats.weekly.map((day, index) => {
                  const maxTotal = Math.max(
                    ...dashboard.stats.weekly.map((d) => d.total)
                  );
                  const widthPercent = maxTotal > 0 ? (day.total / maxTotal) * 100 : 0;

                  return (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-20 text-right">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all flex items-center px-3"
                          style={{ width: `${Math.max(widthPercent, 2)}%` }}
                        >
                          {day.total > 0 && (
                            <span className="text-xs font-semibold text-white">
                              {day.total}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 w-16">
                        {day.avgProcessingTime > 0
                          ? `${(day.avgProcessingTime / 1000).toFixed(1)}s`
                          : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card> */}
        </>
      )}

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
    </div>
  );
}
