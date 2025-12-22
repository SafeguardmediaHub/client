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
  enableGeolocation: boolean;
  enableIntegrityAnalysis: boolean;
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
    enableGeolocation?: boolean;
    enableIntegrityAnalysis?: boolean;
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
    geolocationVerification?: boolean;
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

// New types for batch results API

export type VerificationStatus =
  | 'verified'
  | 'tampered'
  | 'no_data_found'
  | 'failed'
  | 'pending'
  | 'processing'
  | 'skipped';

export interface VerificationStatuses {
  c2pa?: VerificationStatus;
  timeline?: VerificationStatus;
  geolocation?: VerificationStatus;
  factCheck?: VerificationStatus;
  deepfake?: VerificationStatus;
  ocr?: VerificationStatus;
}

export interface VerificationScores {
  overall?: number;
  c2pa?: number;
  timeline?: number;
  geolocation?: number;
  deepfake?: number;
}

export interface C2PASummary {
  status: VerificationStatus;
  manifestPresent: boolean;
  issuer?: string;
  signedAt?: string;
  signatureValid?: boolean;
  certificateValid?: boolean;
  integrity?: string;
  editedAfterSigning?: boolean;
}

export interface C2PAProcessingInfo {
  processingTimeMs: number;
  toolVersion: string;
  fileSizeBytes: number;
  mediaType: string;
  verifiedAt: string;
}

export interface C2PAResult {
  status: string;
  manifestPresent: boolean;
  issuer: string | null;
  device: string | null;
  software: string | null;
  signedAt: string | null;
  signatureValid: boolean;
  certificateChainValid: boolean;
  certificateExpired: boolean;
  integrity: string | null;
  editedAfterSigning: boolean | null;
  rawManifest: unknown | null;
  errors: string[];
  processingInfo: C2PAProcessingInfo;
}

export interface C2PAFileInfo {
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  hash: string;
}

export interface C2PAMetrics {
  processingTimeMs: number;
  queueWaitTimeMs: number;
  retryCount: number;
}

export interface C2PAFull {
  _id: string;
  verificationId: string;
  mediaId: string;
  userId: string;
  result: C2PAResult;
  fileInfo: C2PAFileInfo;
  metrics: C2PAMetrics;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TimelineEvent {
  date: string;
  source: string;
  url: string;
  title?: string;
  description?: string;
}

export interface TimelineSource {
  name: string;
  count: number;
  urls: string[];
}

export interface TimelineFull {
  status: string;
  flags: string[];
  timeline: TimelineEvent[];
  sources: TimelineSource[];
}

export interface OCRData {
  confidence: number;
  language: string;
}

export interface TimelineSummary {
  status: VerificationStatus;
  score?: number;
  classification?: string;
  earliestDate?: string;
  latestDate?: string;
  daysDiscrepancy?: number;
  topSources?: string[];
}

export interface GeolocationSummary {
  id: string;
  status: string;
  match?: boolean;
  confidence?: number;
  claimedLocation?: string;
}

export interface GeolocationCoordinates {
  lat: number;
  lng: number;
}

export interface GeolocationMarker {
  type: string;
  coordinates: GeolocationCoordinates;
  label: string;
}

export interface GeolocationMapData {
  centerCoordinates: GeolocationCoordinates;
  zoom: number;
  markers: GeolocationMarker[];
}

export interface GeolocationAddressComponents {
  city?: string;
  state?: string;
  country?: string;
  country_code?: string;
}

export interface GeolocationReverseGeocode {
  address: string;
  components: GeolocationAddressComponents;
  provider: string;
}

export interface GeolocationGeocoding {
  reverseGeocode?: GeolocationReverseGeocode;
}

export interface GeolocationExtractedCoordinates {
  lat: number;
  lng: number;
  source: string;
}

export interface GeolocationVerification {
  status: string;
  match?: boolean;
  confidence?: number;
  confidenceExplanation?: {
    summary: string;
    reasons: string[];
    missingData?: {
      gpsCoordinates: boolean;
      geocodedLocation: boolean;
    };
  };
  discrepancies?: {
    addressMismatch: boolean;
    countryMismatch: boolean;
  };
}

export interface GeolocationApiCosts {
  geocoding: number;
  staticMap: number;
  total: number;
}

export interface GeolocationFull {
  _id: string;
  mediaId: string;
  userId: string;
  claimedLocation?: {
    raw?: string;
  };
  verification: GeolocationVerification;
  mapData: GeolocationMapData;
  extractedCoordinates?: GeolocationExtractedCoordinates;
  geocoding?: GeolocationGeocoding;
  processingTime: number;
  apiCosts: GeolocationApiCosts;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Integrity Analysis Types
export type IntegrityVerdict =
  | 'authentic'
  | 'likely_authentic'
  | 'suspicious'
  | 'likely_manipulated'
  | 'manipulated';

export type IntegrityAnalysisStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'skipped';

export interface IntegrityFinding {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: number;
  explanation: string;
  details?: unknown;
}

export interface IntegrityCategory {
  name: string;
  status: string;
  score: number | null;
  findings: IntegrityFinding[];
}

export interface IntegrityAnalysisSummary {
  status: IntegrityAnalysisStatus;
  integrityScore?: number;
  verdict?: IntegrityVerdict;
  summary?: string;
  flags?: string[];
}

export interface IntegrityAnalysisFull {
  _id?: string;
  mediaId: string;
  userId?: string;
  status: IntegrityAnalysisStatus;
  integrityScore?: number;
  verdict?: IntegrityVerdict;
  summary?: string;
  flags?: string[];
  recommendations?: string;
  fullReport?: {
    verdict: {
      category: IntegrityVerdict;
      score: number;
      confidence: number;
    };
    categories: IntegrityCategory[];
    rawData?: unknown;
  };
  processingTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IntegritySummaryStats {
  integrityAnalyzed: number;
  authenticMedia: number;
  likelyAuthenticMedia: number;
  suspiciousMedia: number;
  likelyManipulatedMedia: number;
  manipulatedMedia: number;
  averageIntegrityScore: number;
}

export interface BatchResultItem {
  itemId: string;
  filename: string;
  originalFilename?: string;
  mimeType: string;
  fileSize: number;
  status: BatchItemStatus;
  mediaId?: string;
  verifications?: VerificationStatuses;
  scores?: VerificationScores;
  uploadedAt: string;
  processingStartedAt?: string;
  processingCompletedAt?: string;
  // Detailed fields (only with detailed=true)
  c2paSummary?: C2PASummary;
  timelineSummary?: TimelineSummary;
  geolocation?: GeolocationSummary;
  c2paVerification?: C2PASummary;
  ocr?: OCRData;
  ocrText?: string;
  ocrConfidence?: number;
  integrityAnalysis?: IntegrityAnalysisSummary;
  metadata?: {
    cameraMake?: string;
    cameraModel?: string;
    datetimeOriginal?: string;
    gps?: {
      lat: number;
      lon: number;
      altitude?: number;
    };
    [key: string]: unknown;
  };
}

export interface BatchResultsSummary {
  totalItems: number;
  successfulItems: number;
  failedItems: number;
  totalProcessingTime?: number;
  averageProcessingTime?: number;
  successRate?: number;
  detectedDeepfakes?: number;
  c2paVerified?: number;
  metadataIssues?: number;
  // Integrity Analysis Summary
  integrityAnalyzed?: number;
  authenticMedia?: number;
  likelyAuthenticMedia?: number;
  suspiciousMedia?: number;
  likelyManipulatedMedia?: number;
  manipulatedMedia?: number;
  averageIntegrityScore?: number;
}

export interface BatchResultsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BatchResultsParams {
  page?: number;
  limit?: number;
  detailed?: boolean;
  sortBy?: 'filename' | 'status' | 'createdAt' | 'score';
  sortOrder?: 'asc' | 'desc';
}

export interface BatchResultsResponse {
  success: boolean;
  message: string;
  data: {
    batchId: string;
    status: BatchStatus;
    summary: BatchResultsSummary;
    items: BatchResultItem[];
    pagination: BatchResultsPagination;
    downloadUrls?: {
      csv: string;
      json: string;
    };
  };
}

// Extended type for detailed item view
export interface BatchItemDetails extends BatchResultItem {
  c2paFull?: C2PAFull;
  timelineFull?: TimelineFull;
  geolocationFull?: GeolocationFull;
  deepfakeFull?: unknown;
  factCheckFull?: unknown;
  integrityAnalysisFull?: IntegrityAnalysisFull;
}

export interface BatchItemDetailsResponse {
  success: boolean;
  message: string;
  data: BatchItemDetails;
  timestamp: string;
}

export interface ItemVerificationResponse {
  success: boolean;
  data: unknown;
}
