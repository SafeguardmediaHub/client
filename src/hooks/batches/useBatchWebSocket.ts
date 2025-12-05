import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/context/WebSocketContext';
import type { Batch, BatchItem } from '@/types/batch';

interface BatchProgressData {
  batchId: string;
  progress: number;
  status: string;
  completedItems: number;
  failedItems: number;
  totalItems: number;
  message?: string;
}

interface BatchItemUpdate {
  batchId: string;
  itemId: string;
  filename: string;
  status: string;
  error?: {
    message: string;
    code: string;
  };
}

interface BatchCompletionData {
  batchId: string;
  status: string;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  processingTime: number;
}

export function useBatchWebSocket(batchId: string | undefined, enabled = true) {
  const { socket, isConnected } = useWebSocket();
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!socket || !isConnected || !batchId || !enabled) {
      setIsSubscribed(false);
      return;
    }

    console.log('[Batch WebSocket] Subscribing to batch:', batchId);

    // Subscribe to batch updates
    socket.emit('batch:subscribe', { batchId });

    // Handle subscription confirmation
    const handleSubscribed = (data: { batchId: string }) => {
      if (data.batchId === batchId) {
        console.log('[Batch WebSocket] Successfully subscribed to batch:', batchId);
        setIsSubscribed(true);
      }
    };

    // Handle batch progress updates
    const handleProgress = (data: BatchProgressData) => {
      if (data.batchId !== batchId) return;

      console.log('[Batch WebSocket] Progress update:', data);

      // Update the batch in React Query cache
      queryClient.setQueryData(['batch', batchId], (oldData: Batch | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          progress: data.progress,
          status: data.status as Batch['status'],
          completedItems: data.completedItems,
          failedItems: data.failedItems,
          processingItems: data.totalItems - data.completedItems - data.failedItems,
        };
      });

      // Also invalidate to ensure consistency
      if (data.progress === 100 || data.status === 'COMPLETED') {
        queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
      }
    };

    // Handle individual item completion
    const handleItemCompleted = (data: BatchItemUpdate) => {
      if (data.batchId !== batchId) return;

      console.log('[Batch WebSocket] Item completed:', data.filename);

      // Update specific item in cache
      queryClient.setQueryData(['batch', batchId], (oldData: Batch | undefined) => {
        if (!oldData) return oldData;

        const updatedItems = oldData.items.map((item) =>
          item.itemId === data.itemId
            ? { ...item, status: 'COMPLETED' as BatchItem['status'], progress: 100 }
            : item,
        );

        return {
          ...oldData,
          items: updatedItems,
        };
      });
    };

    // Handle individual item failure
    const handleItemFailed = (data: BatchItemUpdate) => {
      if (data.batchId !== batchId) return;

      console.error('[Batch WebSocket] Item failed:', data.filename, data.error);

      // Update specific item in cache
      queryClient.setQueryData(['batch', batchId], (oldData: Batch | undefined) => {
        if (!oldData) return oldData;

        const updatedItems = oldData.items.map((item) =>
          item.itemId === data.itemId
            ? {
                ...item,
                status: 'FAILED' as BatchItem['status'],
                error: data.error
                  ? {
                      code: data.error.code,
                      message: data.error.message,
                      details: undefined,
                    }
                  : undefined,
              }
            : item,
        );

        return {
          ...oldData,
          items: updatedItems,
        };
      });

      // Show toast for failed item
      toast.error(`Failed to process ${data.filename}`, {
        description: data.error?.message,
      });
    };

    // Handle batch completion
    const handleCompleted = (data: BatchCompletionData) => {
      if (data.batchId !== batchId) return;

      console.log('[Batch WebSocket] Batch completed:', data);

      // Update batch status
      queryClient.setQueryData(['batch', batchId], (oldData: Batch | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          status: 'COMPLETED' as Batch['status'],
          progress: 100,
          completedItems: data.completedItems,
          failedItems: data.failedItems,
          processingCompletedAt: new Date().toISOString(),
        };
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch-stats'] });

      // Show success notification
      toast.success('Batch processing complete!', {
        description: `${data.completedItems} of ${data.totalItems} files processed successfully in ${data.processingTime}s`,
        duration: 5000,
      });
    };

    // Handle batch failure
    const handleFailed = (data: BatchCompletionData) => {
      if (data.batchId !== batchId) return;

      console.error('[Batch WebSocket] Batch failed:', data);

      // Update batch status
      queryClient.setQueryData(['batch', batchId], (oldData: Batch | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          status: 'FAILED' as Batch['status'],
          failedItems: data.failedItems,
        };
      });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });

      // Show error notification
      toast.error('Batch processing failed', {
        description: `${data.failedItems} of ${data.totalItems} files failed`,
      });
    };

    // Attach event listeners
    socket.on('batch:subscribed', handleSubscribed);
    socket.on('batch:progress', handleProgress);
    socket.on('batch:item:completed', handleItemCompleted);
    socket.on('batch:item:failed', handleItemFailed);
    socket.on('batch:completed', handleCompleted);
    socket.on('batch:failed', handleFailed);

    // Cleanup
    return () => {
      console.log('[Batch WebSocket] Unsubscribing from batch:', batchId);
      socket.emit('batch:unsubscribe', { batchId });
      socket.off('batch:subscribed', handleSubscribed);
      socket.off('batch:progress', handleProgress);
      socket.off('batch:item:completed', handleItemCompleted);
      socket.off('batch:item:failed', handleItemFailed);
      socket.off('batch:completed', handleCompleted);
      socket.off('batch:failed', handleFailed);
      setIsSubscribed(false);
    };
  }, [socket, isConnected, batchId, enabled, queryClient]);

  return {
    isSubscribed,
    isConnected,
  };
}
