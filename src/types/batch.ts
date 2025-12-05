export type BatchStatus =
  | 'PENDING'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'PARTIAL_FAILURE';

export type BatchItemStatus =
  | 'PENDING'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export type Priority = 'low' | 'normal' | 'high';

export interface BatchOptions {
  enableC2PA: boolean;
  enableOCR: boolean;
  enableReverseSearch: boolean;
  enableDeepfake: boolean;
  priority: Priority;
}

export interface BatchCreator {
  userId: string;
  email: string;
}

export interface BatchError {
  code: string;
  message: string;
  details?: unknown;
}

export interface BatchItemAnalysis {
  c2pa?: unknown;
  ocr?: unknown;
  deepfake?: unknown;
  reverseSearch?: unknown;
  metadata?: unknown;
}

export interface BatchItem {
  itemId: string;
  s3Key: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  status: BatchItemStatus;
  progress: number;
  uploadUrl?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  error?: BatchError;
  analysis?: BatchItemAnalysis;
  retryCount: number;
  maxRetries: number;
  processingStartedAt?: string;
  processingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  batchId: string;
  name?: string;
  description?: string;
  tags?: string[];
  status: BatchStatus;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  processingItems: number;
  pendingItems: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: BatchCreator;
  options?: BatchOptions;
  webhookUrl?: string;
  items: BatchItem[];
  estimatedCompletionTime?: string;
  processingStartedAt?: string;
  processingCompletedAt?: string;
}

export interface CreateBatchRequest {
  name?: string;
  description?: string;
  tags?: string[];
  files: {
    filename: string;
    contentType: string;
    fileSize: number;
  }[];
  options?: {
    priority?: Priority;
    enableC2PA?: boolean;
    enableOCR?: boolean;
    enableReverseSearch?: boolean;
    enableDeepfake?: boolean;
  };
  webhookUrl?: string;
}

export interface CreateBatchResponse {
  success: boolean;
  data: {
    batchId: string;
    status: BatchStatus;
    totalItems: number;
    items: {
      itemId: string;
      s3Key: string;
      uploadUrl: string;
      filename: string;
    }[];
  };
}

export interface ConfirmBatchRequest {
  items: {
    itemId: string;
    s3Key: string;
    uploaded: boolean;
  }[];
}

export interface BatchListParams {
  page?: number;
  limit?: number;
  status?: BatchStatus;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface BatchListResponse {
  success: boolean;
  data: {
    batches: Batch[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface BatchStatsResponse {
  success: boolean;
  data: {
    totalBatches: number;
    processingBatches: number;
    completedBatches: number;
    failedBatches: number;
    totalFiles: number;
    processingFiles: number;
    completedFiles: number;
    failedFiles: number;
    storageUsed: number;
    storageLimit: number;
    successRate: number;
  };
}

export interface DeleteBatchRequest {
  permanent?: boolean;
  deleteFiles?: boolean;
  reason?: string;
}

export interface RestoreBatchRequest {
  batchIds: string[];
}

export interface ExportBatchRequest {
  batchIds: string[];
  includeOriginals?: boolean;
  includeAnalysis?: boolean;
  includeMetadata?: boolean;
  includeThumbnails?: boolean;
  format?: 'zip' | 'tar';
  name?: string;
}

export interface ExportBatchResponse {
  success: boolean;
  data: {
    exportId: string;
    batchId: string;
    totalItems: number;
    estimatedSize: number;
    downloadUrl: string;
    expiresAt: string;
  };
}

export interface RetryBatchItemsRequest {
  itemIds: string[];
  operations?: {
    deepfakeDetection?: boolean;
    c2paVerification?: boolean;
    reverseSearch?: boolean;
    ocrExtraction?: boolean;
    metadataExtraction?: boolean;
  };
}

// File validation types
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}
