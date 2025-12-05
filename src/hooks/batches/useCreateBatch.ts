import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { confirmBatch, createBatch, uploadFileToS3 } from '@/lib/api/batch';
import { retryWithBackoff } from '@/lib/batch-utils';
import type { CreateBatchRequest, UploadProgress } from '@/types/batch';

interface UseCreateBatchOptions {
  onUploadProgress?: (progress: UploadProgress[]) => void;
  onSuccess?: (batchId: string) => void;
}

export const useCreateBatch = (options?: UseCreateBatchOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      batchData,
      files,
    }: {
      batchData: CreateBatchRequest;
      files: File[];
    }) => {
      // Step 1: Create batch and get presigned URLs
      const createResponse = await createBatch(batchData);
      const { batchId, items } = createResponse.data;

      // Initialize progress tracking
      const progressMap: Map<string, UploadProgress> = new Map();
      files.forEach((file) => {
        progressMap.set(file.name, {
          filename: file.name,
          progress: 0,
          status: 'pending',
        });
      });

      const updateProgress = () => {
        options?.onUploadProgress?.(Array.from(progressMap.values()));
      };

      // Step 2: Upload all files to S3 concurrently
      const uploadPromises = files.map(async (file, index) => {
        const item = items[index];
        if (!item) throw new Error(`No upload URL for ${file.name}`);

        try {
          // Update status to uploading
          progressMap.set(file.name, {
            filename: file.name,
            progress: 0,
            status: 'uploading',
          });
          updateProgress();

          // Upload with retry logic
          await retryWithBackoff(
            () =>
              uploadFileToS3(file, item.uploadUrl, (progress) => {
                progressMap.set(file.name, {
                  filename: file.name,
                  progress,
                  status: 'uploading',
                });
                updateProgress();
              }),
            3,
            1000
          );

          // Mark as completed
          progressMap.set(file.name, {
            filename: file.name,
            progress: 100,
            status: 'completed',
          });
          updateProgress();

          return { itemId: item.itemId, s3Key: item.s3Key, uploaded: true };
        } catch (error) {
          // Mark as failed
          progressMap.set(file.name, {
            filename: file.name,
            progress: 0,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Upload failed',
          });
          updateProgress();

          throw error;
        }
      });

      const uploadResults = await Promise.allSettled(uploadPromises);

      console.log('this is upload results', uploadResults);

      // Collect successful uploads
      const successfulUploads = uploadResults
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<{
            itemId: string;
            s3Key: string;
            uploaded: boolean;
          }> => result.status === 'fulfilled'
        )
        .map((result) => result.value);

      console.log('successfulUploads', successfulUploads);

      // Step 3: Confirm batch to trigger processing
      if (successfulUploads.length > 0) {
        await confirmBatch(batchId, { items: successfulUploads });
      }

      // Check if any uploads failed
      const failedCount = uploadResults.filter(
        (r) => r.status === 'rejected'
      ).length;

      return {
        batchId,
        totalFiles: files.length,
        successfulUploads: successfulUploads.length,
        failedUploads: failedCount,
      };
    },
    onSuccess: (data) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch-stats'] });

      if (data.failedUploads > 0) {
        toast.warning(
          `Batch created with ${data.successfulUploads}/${data.totalFiles} files uploaded`
        );
      } else {
        toast.success(
          `Batch created successfully! ${data.totalFiles} files uploaded`
        );
      }

      options?.onSuccess?.(data.batchId);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create batch'
      );
    },
  });
};
