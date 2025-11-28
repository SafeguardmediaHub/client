// C2PA Verification Types

export type VerificationStatus =
  | 'verified'
  | 'tampered'
  | 'invalid_signature'
  | 'invalid_certificate'
  | 'no_c2pa_found'
  | 'processing'
  | 'error';

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface MediaInfo {
  _id: string;
  mimeType: string;
  originalFilename: string;
  thumbnailUrl?: string;
}

export interface C2PAVerification {
  id: string;
  verificationId: string; // UUID-based verification identifier
  mediaId: string | MediaInfo;
  userId?: string;
  status: VerificationStatus;
  mediaType?: MediaType;
  fileName?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  manifestPresent?: boolean;
  issuer?: string | null;
  signatureValid?: boolean;
  integrity?: string;
  signedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  summary?: VerificationSummary;
}

export interface VerificationSummary {
  status: VerificationStatus;
  statusReason?: string;
  manifestFound: boolean;
  signatureValid: boolean;
  certificateChainValid: boolean;
  integrityPassed: boolean;
  aiMarkersDetected: boolean;
  creator?: CreatorInfo;
  device?: DeviceInfo;
  warnings?: string[];
}

export interface CreatorInfo {
  name: string;
  software?: string;
  version?: string;
  signedAt?: string;
}

export interface DeviceInfo {
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
}

export interface VerificationDetails {
  id: string;
  mediaId: string | MediaInfo;
  status: VerificationStatus;
  fileName?: string;
  fileSize?: number;
  mediaType?: MediaType;
  thumbnailUrl?: string;
  manifestPresent?: boolean;
  manifestVersion?: string | null;
  issuer?: string | null;
  signatureValid?: boolean;
  signatureAlgorithm?: string | null;
  integrity?: string;
  signedAt?: string | null;
  createdAt: string;
  completedAt?: string;
  jobStatus?: string;
  processingTimeMs?: number;
  verifiedAt?: string;
  editedAfterSigning?: boolean | null;
  aiGenerated?: boolean | null;
  aiModel?: string | null;
  creator?: {
    name: string | null;
    device: string | null;
    software: string | null;
  };
  certificate?: {
    valid: boolean;
    expired: boolean;
    issuer: string | null;
    expiresAt: string | null;
  };
  editHistory?: Array<{
    action?: string;
    timestamp?: string;
    [key: string]: any;
  }>;
  errors?: string[];
  insights?: string[];
  summary?: VerificationSummary;
  manifest?: ManifestNode;
  certificateChain?: Certificate[];
  rawMetadata?: Record<string, unknown>;
  events?: VerificationEvent[];
}

export interface ManifestNode {
  id: string;
  label: string;
  type: 'claim' | 'assertion' | 'ingredient' | 'action';
  value?: string;
  isTampered?: boolean;
  children?: ManifestNode[];
}

export interface Certificate {
  id: string;
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  isValid: boolean;
  serialNumber: string;
  fingerprint: string;
}

export interface VerificationEvent {
  id: string;
  type:
    | 'started'
    | 'manifest_detected'
    | 'signature_verified'
    | 'certificate_validated'
    | 'integrity_checked'
    | 'ai_markers_scanned'
    | 'completed'
    | 'error';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'pending';
}

export interface VerificationStreamUpdate {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  message?: string;
  progress?: number;
}

export interface C2PAStats {
  counts: {
    total: number;
    verified: number;
    noManifest: number;
    tampered: number;
    invalidSignature: number;
    invalidCertificate: number;
    errors: number;
    avgProcessingTime: number;
  };
  percentages: {
    verifiedRate: number;
    manifestPresenceRate: number;
    tamperRate: number;
  };
  breakdown: Array<{
    _id: string;
    count: number;
    avgProcessingTime: number;
  }>;
}

export interface C2PABadge {
  id?: string;
  status: VerificationStatus | string;
  label: string;
  name?: string;
  description: string;
  color: string;
  backgroundColor?: string;
  icon: string;
  tooltip?: string;
  displayRules?: BadgeDisplayRule[];
}

export interface BadgeDisplayRule {
  condition: string;
  priority: number;
  showWhen: string;
}

export interface AdminDashboard {
  system: {
    enabled: boolean;
    tool: {
      available: boolean;
      version?: string;
      error?: string;
    };
  };
  queue: {
    healthy: boolean;
    connected: boolean;
    paused: boolean;
    jobs: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    };
  };
  cache: {
    mediaKeys: number;
    hashKeys: number;
    rateLimitKeys: number;
  };
  stats: {
    today: DailyStats;
    database: DatabaseStats;
    weekly: WeeklyStats[];
  };
}

export interface DailyStats {
  total: number;
  byStatus: Record<string, number>;
  avgProcessingTime: number;
}

export interface DatabaseStats {
  total: number;
  verified: number;
  noManifest: number;
  tampered: number;
  errors: number;
}

export interface WeeklyStats {
  date: string;
  total: number;
  byStatus: Record<string, number>;
  avgProcessingTime: number;
}

// API Request/Response Types
export interface VerificationsListParams {
  page?: number;
  limit?: number;
  status?: VerificationStatus;
  mediaType?: MediaType;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface VerificationsListResponse {
  success: boolean;
  data: {
    verifications: C2PAVerification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface VerificationDetailsResponse {
  success: boolean;
  data: VerificationDetails;
}

export interface VerificationSummaryResponse {
  success: boolean;
  data: VerificationSummary;
}

export interface StatsResponse {
  success: boolean;
  data: C2PAStats;
}

export interface BadgesResponse {
  success: boolean;
  data: {
    badges: C2PABadge[];
  };
}

export interface MediaBadgeResponse {
  success: boolean;
  data: C2PABadge;
}

export interface VerifyMediaRequest {
  mediaId: string;
  forceRefresh?: boolean;
}

export interface BatchVerifyRequest {
  mediaIds: string[];
}

export interface VerifyResponse {
  success: boolean;
  data: {
    verificationId: string;
    status: VerificationStatus | 'queued';
    jobId?: string;
    estimatedProcessingTime?: number;
    alreadyVerified?: boolean;
    manifestPresent?: boolean;
    createdAt?: string;
  };
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboard;
}

export interface AdminVerificationsParams extends VerificationsListParams {
  userId?: string;
}

export interface ClearCacheResponse {
  success: boolean;
  message: string;
  entriesCleared: number;
}

export interface DeleteVerificationResponse {
  success: boolean;
  message: string;
  data: {
    verificationId: string;
  };
}
