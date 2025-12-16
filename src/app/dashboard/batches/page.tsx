/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
/** biome-ignore-all lint/style/noNonNullAssertion: <> */
/** biome-ignore-all lint/complexity/noUselessFragments: <> */
'use client';

import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BatchStatusBadge } from '@/components/batches/BatchStatusBadge';
import { BatchUploadModal } from '@/components/batches/BatchUploadModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useBatches } from '@/hooks/batches/useBatches';
import { useBatchStats } from '@/hooks/batches/useBatchStats';
import { formatDate, formatFileSize } from '@/lib/batch-utils';
import type { BatchListParams, BatchStatus } from '@/types/batch';

export default function BatchesPage() {
  const router = useRouter();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [filters, setFilters] = useState<BatchListParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: batchesData, isLoading } = useBatches(filters);
  const { data: stats, isLoading: statsLoading } = useBatchStats();

  const batches = batchesData?.data?.batches || [];
  const pagination = batchesData?.data?.pagination;

  console.log('Current filters:', filters);
  console.log('Batches data:', batchesData);
  console.log('Batches returned:', batches.length);
  console.log('Stats:', stats);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({
      ...prev,
      search: value || undefined,
      page: 1
    }));
  };

  const handleStatusFilter = (status?: BatchStatus) => {
    console.log('Filtering by status:', status);
    setFilters((prev) => ({
      ...prev,
      status: status,
      page: 1
    }));
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-responsive-3xl font-bold text-gray-900">Batch Processing</h1>
          <p className="text-gray-600 mt-1">
            Manage and process media files in bulk
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          New Batch
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="p-5 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">Total Batches</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalBatches || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.totalFiles || 0} files
              </p>
            </Card>

            <Card className="p-5 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">Processing</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.processingBatches || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.processingFiles || 0} files
              </p>
            </Card>

            <Card className="p-5 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {stats?.completedBatches || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.completedFiles || 0} files
              </p>
            </Card>

            <Card className="p-5 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">Storage Used</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.storageUsed ? formatFileSize(stats.storageUsed) : '0 B'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                of{' '}
                {stats?.storageLimit
                  ? formatFileSize(stats.storageLimit)
                  : '0 B'}
              </p>
            </Card>
          </>
        )}
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={!filters.status ? 'default' : 'outline'}
              onClick={() => handleStatusFilter(undefined)}
              size="sm"
              className="whitespace-nowrap"
            >
              All
            </Button>
            <Button
              variant={filters.status === 'PROCESSING' ? 'default' : 'outline'}
              onClick={() => handleStatusFilter('PROCESSING')}
              size="sm"
              className="whitespace-nowrap"
            >
              Processing
            </Button>
            <Button
              variant={filters.status === 'COMPLETED' ? 'default' : 'outline'}
              onClick={() => handleStatusFilter('COMPLETED')}
              size="sm"
              className="whitespace-nowrap"
            >
              Completed
            </Button>
            <Button
              variant={filters.status === 'FAILED' ? 'default' : 'outline'}
              onClick={() => handleStatusFilter('FAILED')}
              size="sm"
              className="whitespace-nowrap"
            >
              Failed
            </Button>
          </div>
        </div>
      </Card>

      {/* Batch List */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </Card>
            ))}
          </>
        ) : batches.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl">📦</div>
              {filters.status ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900">
                    No {filters.status.toLowerCase()} batches
                  </h3>
                  <p className="text-gray-600">
                    There are no batches with status "{filters.status}"
                  </p>
                  <Button onClick={() => handleStatusFilter(undefined)} variant="outline">
                    Clear Filter
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-900">
                    No batches yet
                  </h3>
                  <p className="text-gray-600">
                    Start by uploading your first batch of media files
                  </p>
                  <Button onClick={() => setUploadModalOpen(true)} size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Batch
                  </Button>
                </>
              )}
            </div>
          </Card>
        ) : (
          batches.map((batch) => (
            <Card
              key={batch.batchId}
              className="p-5 hover:shadow-md transition-all cursor-pointer"
              onClick={() => router.push(`/dashboard/batches/${batch.batchId}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {batch.name || `Batch ${batch.batchId.slice(0, 8)}`}
                    </h3>
                    <BatchStatusBadge status={batch.status} />
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {batch.description || 'No description'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {batch.totalItems} file{batch.totalItems !== 1 ? 's' : ''}
                    </span>
                    <span>•</span>
                    <span>{batch.completedItems} completed</span>
                    {batch.failedItems > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-red-600">
                          {batch.failedItems} failed
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span>{formatDate(batch.createdAt)}</span>
                  </div>

                  {batch.tags && batch.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {batch.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {batch.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          +{batch.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(batch.progress)}%
                  </div>
                  <div className="text-xs text-gray-500">progress</div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{' '}
            to{' '}
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            )}{' '}
            of {pagination.totalItems} batches
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                setFilters({ ...filters, page: filters.page! - 1 })
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setFilters({ ...filters, page: filters.page! + 1 })
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <BatchUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
      />
      </div>
    </div>
  );
}
