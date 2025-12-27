export type SubscriptionTier = 'free' | 'standard' | 'premium' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export type IntegrityVerdict =
  | 'authentic'
  | 'likely_authentic'
  | 'suspicious'
  | 'likely_manipulated'
  | 'manipulated';

export type ProcessingStatus = 'pending' | 'uploaded' | 'processing' | 'processed' | 'failed';

// Upload Quota
export interface UploadQuota {
  used: number; // bytes
  limit: number; // bytes
  usedGB: number;
  limitGB: number;
  percentage: number; // 0-100
  fileCount: number;
  maxFiles: number;
  fileCountPercentage: number; // 0-100
}

// Monthly Usage
export interface MonthlyUsage {
  currentMonthFiles: number;
  monthlyFileLimit: number;
  filesPercentage: number; // 0-100
  currentMonthBatches: number;
  monthlyBatchLimit: number;
  batchesPercentage: number; // 0-100
  daysUntilReset: number;
  resetDate: string; // ISO date
}

// Processing Summary
export interface ProcessingSummary {
  totalFiles: number;
  processing: number;
  completed: number;
  failed: number;
  pending: number;
  successRate: number; // percentage
  averageProcessingTime: number; // minutes
}

// Integrity Breakdown
export interface IntegrityBreakdown {
  totalAnalyzed: number;
  authentic: number;
  likelyAuthentic: number;
  suspicious: number;
  likelyManipulated: number;
  manipulated: number;
  averageIntegrityScore: number; // 0-100
  tamperingDetected: number;
  metadataMissing: number;
  c2paVerified: number;
}

// Recent Activity Item
export interface RecentActivityItem {
  mediaId: string;
  filename: string;
  uploadedAt: string; // ISO date
  status: ProcessingStatus;
  integrityScore?: number; // 0-100, optional
  verdict?: IntegrityVerdict;
  mimeType: string;
  fileSize: number; // bytes
}

// Trend Data Point
export interface TrendDataPoint {
  date: string;
  count: number;
}

// Trends
export interface Trends {
  uploadsOverTime: TrendDataPoint[];
  filesProcessedOverTime: TrendDataPoint[];
  integrityScoreTrend: Array<{ date: string; averageScore: number }>;
  tamperingDetectionTrend: TrendDataPoint[];
  totalUploadsLast30Days: number;
  percentageChangeFromPrevious30Days: number; // can be negative
  mostCommonFileType: string;
  mostCommonVerdict: string;
}

// Subscription Info
export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  expiresAt?: string; // ISO date, optional
  autoRenew: boolean;
}

// Main Dashboard Response
export interface DashboardOverviewData {
  uploadQuota: UploadQuota;
  monthlyUsage: MonthlyUsage;
  processingSummary: ProcessingSummary;
  integrityBreakdown: IntegrityBreakdown;
  recentActivity: RecentActivityItem[];
  trends: Trends;
  subscription: SubscriptionInfo;
}

export interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data: DashboardOverviewData;
  timestamp: string;
}
