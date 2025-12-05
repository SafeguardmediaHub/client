import { Progress } from '@/components/ui/progress';
import type { Batch } from '@/types/batch';
import { estimateCompletionTime } from '@/lib/batch-utils';

interface BatchProgressProps {
  batch: Batch;
  showDetails?: boolean;
}

export function BatchProgress({ batch, showDetails = true }: BatchProgressProps) {
  const { progress, completedItems, failedItems, processingItems, totalItems } =
    batch;

  const remainingItems = totalItems - completedItems - failedItems;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Overall Progress</span>
          <span className="font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        {showDetails && (
          <p className="text-xs text-gray-600">
            Processing {completedItems} of {totalItems} files...
          </p>
        )}
      </div>

      {/* Stats Grid */}
      {showDetails && (
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total</p>
            <p className="text-lg font-bold text-gray-900">{totalItems}</p>
          </div>
          <div className="bg-green-50 rounded-md p-3 border border-green-200">
            <p className="text-xs text-green-700 mb-1">Completed</p>
            <p className="text-lg font-bold text-green-700">{completedItems}</p>
          </div>
          <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
            <p className="text-xs text-blue-700 mb-1">Processing</p>
            <p className="text-lg font-bold text-blue-700">{processingItems}</p>
          </div>
          <div className="bg-red-50 rounded-md p-3 border border-red-200">
            <p className="text-xs text-red-700 mb-1">Failed</p>
            <p className="text-lg font-bold text-red-700">{failedItems}</p>
          </div>
        </div>
      )}

      {/* Estimated Completion */}
      {showDetails && remainingItems > 0 && (
        <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
          <strong>Est. completion:</strong>{' '}
          {estimateCompletionTime(remainingItems)}
        </div>
      )}
    </div>
  );
}
