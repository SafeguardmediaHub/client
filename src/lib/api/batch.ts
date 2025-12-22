import axios from 'axios';
import api from '@/lib/api';
import type {
  Batch,
  BatchItemDetailsResponse,
  BatchListParams,
  BatchListResponse,
  BatchResultsParams,
  BatchResultsResponse,
  BatchStatsResponse,
  ConfirmBatchRequest,
  CreateBatchRequest,
  CreateBatchResponse,
  DeleteBatchRequest,
  ExportBatchRequest,
  ExportBatchResponse,
  ItemVerificationResponse,
  RestoreBatchRequest,
  RetryBatchItemsRequest,
} from '@/types/batch';

// Create a new batch and get presigned URLs
export const createBatch = async (
  data: CreateBatchRequest
): Promise<CreateBatchResponse> => {
  const response = await api.post<CreateBatchResponse>(
    '/api/media/batch/upload',
    data
  );
  return response.data;
};

// Upload a single file to S3 using presigned URL
export const uploadFileToS3 = async (
  file: File,
  uploadUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
    timeout: 300000, // 5 minutes timeout for large files
  });
};

// Confirm batch upload to trigger processing
export const confirmBatch = async (
  batchId: string,
  data: ConfirmBatchRequest
): Promise<{ success: boolean }> => {
  const response = await api.post(`/api/media/batch/${batchId}/confirm`, data);
  return response.data;
};

// Get list of batches with filters
export const getBatches = async (
  params?: BatchListParams
): Promise<BatchListResponse> => {
  const response = await api.get<BatchListResponse>('/api/media/batch', {
    params,
  });

  return response.data;
};

// Get a single batch by ID
export const getBatch = async (batchId: string): Promise<Batch> => {
  const response = await api.get<{ success: boolean; data: Batch }>(
    `/api/media/batch/${batchId}`
  );
  return response.data.data;
};

// Get batch statistics
export const getBatchStats = async (): Promise<BatchStatsResponse['data']> => {
  const response = await api.get<BatchStatsResponse>('/api/media/batch/stats');
  return response.data.data;
};

// Delete batch (soft or permanent)
export const deleteBatch = async (
  batchId: string,
  data?: DeleteBatchRequest
): Promise<{ success: boolean }> => {
  const response = await api.delete(`/api/media/batch/${batchId}`, { data });
  return response.data;
};

// Restore deleted batch
export const restoreBatch = async (
  data: RestoreBatchRequest
): Promise<{ success: boolean; restoredCount: number }> => {
  const response = await api.post('/api/media/batch/restore', data);
  return response.data;
};

// Export batch
export const exportBatch = async (
  data: ExportBatchRequest
): Promise<ExportBatchResponse['data']> => {
  const response = await api.post<ExportBatchResponse>(
    '/api/media/batch/export',
    data
  );
  return response.data.data;
};

// Retry failed batch items
export const retryBatchItems = async (
  batchId: string,
  data: RetryBatchItemsRequest
): Promise<{ success: boolean; batchId: string }> => {
  const response = await api.post(`/api/media/batch/${batchId}/retry`, data);
  return response.data;
};

// Re-analyze batch with new operations
export const reanalyzeBatch = async (
  batchId: string,
  data: {
    operations: {
      deepfakeDetection?: boolean;
      c2paVerification?: boolean;
      reverseSearch?: boolean;
      ocrExtraction?: boolean;
      metadataExtraction?: boolean;
    };
    name?: string;
  }
): Promise<{ success: boolean; batchId: string }> => {
  const response = await api.post(
    `/api/media/batch/${batchId}/reanalyze`,
    data
  );
  return response.data;
};

// Cancel batch processing
export const cancelBatch = async (
  batchId: string
): Promise<{ success: boolean }> => {
  const response = await api.post(`/api/media/batch/${batchId}/cancel`);
  return response.data;
};

// Get paginated batch results with optional detailed summaries
export const getBatchResults = async (
  batchId: string,
  params?: BatchResultsParams
): Promise<BatchResultsResponse> => {
  const response = await api.get<BatchResultsResponse>(
    `/api/media/batch/${batchId}/results`,
    { params }
  );
  return response.data;
};

// Get full details for a single batch item
export const getBatchItemDetails = async (
  batchId: string,
  itemId: string
): Promise<BatchItemDetailsResponse['data']> => {
  const response = await api.get<BatchItemDetailsResponse>(
    `/api/media/batch/${batchId}/item/${itemId}`
  );
  return response.data.data;
};

// Get specific verification data for an item
export const getItemVerification = async (
  batchId: string,
  itemId: string,
  verificationType:
    | 'c2pa'
    | 'timeline'
    | 'geolocation'
    | 'factCheck'
    | 'deepfake'
): Promise<ItemVerificationResponse['data']> => {
  const response = await api.get<ItemVerificationResponse>(
    `/api/media/batch/${batchId}/item/${itemId}/${verificationType}`
  );
  return response.data.data;
};
