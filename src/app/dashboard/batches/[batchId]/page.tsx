'use client';

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  MoreVertical,
  RefreshCcw,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { BatchProgress } from '@/components/batches/BatchProgress';
import { BatchStatusBadge } from '@/components/batches/BatchStatusBadge';
import { WebSocketStatus } from '@/components/batches/WebSocketStatus';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBatch } from '@/hooks/batches/useBatch';
import { useDeleteBatch } from '@/hooks/batches/useDeleteBatch';
import { useRetryBatch } from '@/hooks/batches/useRetryBatch';
import { formatDate, formatFileSize, getFileIcon } from '@/lib/batch-utils';
import type { BatchItem } from '@/types/batch';

export default function BatchDetailPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { batchId } = resolvedParams;
  const [activeTab, setActiveTab] = useState('all');

  const { data: batch, isLoading } = useBatch(batchId);
  const deleteBatchMutation = useDeleteBatch();
  const retryBatchMutation = useRetryBatch();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this batch?')) {
      deleteBatchMutation.mutate(
        { batchId },
        {
          onSuccess: () => {
            router.push('/dashboard/batches');
          },
        }
      );
    }
  };

  const handleRetry = () => {
    const failedItems =
      batch?.items.filter((item) => item.status === 'FAILED') || [];
    if (failedItems.length === 0) return;

    retryBatchMutation.mutate({
      batchId,
      data: {
        itemIds: failedItems.map((item) => item.itemId),
      },
    });
  };

  const filterItems = (items: BatchItem[]) => {
    switch (activeTab) {
      case 'completed':
        return items.filter((item) => item.status === 'COMPLETED');
      case 'processing':
        return items.filter((item) => item.status === 'PROCESSING');
      case 'failed':
        return items.filter((item) => item.status === 'FAILED');
      default:
        return items;
    }
  };

  const getItemStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'PROCESSING':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Batch not found
          </h2>
          <p className="text-gray-600 mb-4">
            The batch you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push('/dashboard/batches')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batches
          </Button>
        </Card>
      </div>
    );
  }

  const filteredItems = filterItems(batch.items);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/batches')}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batches
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {batch.name || `Batch ${batch.batchId.slice(0, 8)}`}
            </h1>
            <BatchStatusBadge status={batch.status} />
            <WebSocketStatus />
          </div>

          <p className="text-gray-600 mb-2">
            Created {formatDate(batch.createdAt)}
            {batch.createdBy?.email && ` by ${batch.createdBy.email}`}
          </p>

          {batch.description && (
            <p className="text-gray-700 mb-2">{batch.description}</p>
          )}

          {batch.tags && batch.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {batch.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {batch.failedItems > 0 && (
            <Button
              variant="outline"
              onClick={handleRetry}
              disabled={retryBatchMutation.isPending}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry Failed
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Batch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <BatchProgress batch={batch} showDetails={true} />
      </Card>

      {/* Processing Options */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Processing Options
        </h3>
        <div className="flex flex-wrap gap-2">
          {batch.options?.enableC2PA && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              ✓ C2PA Verification
            </span>
          )}
          {batch.options?.enableOCR && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              ✓ OCR Extraction
            </span>
          )}
          {batch.options?.enableDeepfake && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              ✓ Deepfake Detection
            </span>
          )}
          {batch.options?.enableReverseSearch && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              ✓ Reverse Search
            </span>
          )}
          {!batch.options?.enableReverseSearch && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              ✗ Reverse Search
            </span>
          )}
        </div>
        {batch.webhookUrl && (
          <p className="text-sm text-gray-600 mt-3">
            <strong>Webhook:</strong> {batch.webhookUrl}
          </p>
        )}
      </Card>

      {/* File Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          File Details
        </h3>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({batch.totalItems})</TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({batch.completedItems})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({batch.processingItems})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({batch.failedItems})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No files in this category
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <span className="text-2xl flex-shrink-0">
                      {getFileIcon(item.mimeType)}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.filename}
                        </h4>
                        {getItemStatusIcon(item.status)}
                      </div>

                      <p className="text-sm text-gray-600">
                        {formatFileSize(item.fileSize)} • {item.mimeType}
                      </p>

                      {item.status === 'COMPLETED' &&
                        item.processingStartedAt &&
                        item.processingCompletedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Processed in{' '}
                            {(
                              (new Date(item.processingCompletedAt).getTime() -
                                new Date(item.processingStartedAt).getTime()) /
                              1000
                            ).toFixed(1)}
                            s
                          </p>
                        )}

                      {item.status === 'PROCESSING' && item.progress > 0 && (
                        <div className="mt-2">
                          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {item.progress}% complete
                          </p>
                        </div>
                      )}

                      {item.status === 'FAILED' && item.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700">
                            <strong>Error:</strong> {item.error.message}
                          </p>
                          {item.retryCount < item.maxRetries && (
                            <p className="text-xs text-red-600 mt-1">
                              Retry {item.retryCount + 1} of {item.maxRetries}{' '}
                              available
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
