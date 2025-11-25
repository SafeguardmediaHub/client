// Trace status types
export type TraceStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "no_results";

// Trace stage types
export type TraceStage = "discovery" | "analysis" | "forensics";

// Platform types
export type Platform =
  | "twitter"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "reddit";

// Search depth types
export type SearchDepth = "shallow" | "moderate" | "deep";

// Initiate trace request
export interface InitiateTraceRequest {
  platforms?: Platform[];
  searchDepth?: 1 | 2 | 3; // Backend expects numeric values: 1=shallow, 2=moderate, 3=deep
  maxResults?: number;
  includeDeleted?: boolean;
  timeRange?: {
    start?: string;
    end?: string;
  };
}

// Initiate trace response
export interface InitiateTraceResponse {
  success: boolean;
  message: string;
  data: {
    traceId: string;
    jobId: string;
    status: TraceStatus;
    estimatedCompletionSeconds: number;
  };
  timestamp: string;
}

// Trace progress
export interface TraceProgress {
  stage: TraceStage;
  percentage: number;
  platformsSearched: number;
  totalPlatforms: number;
  postsFound: number;
  estimatedTimeRemaining?: number;
}

// Trace status response
export interface TraceStatusResponse {
  success: boolean;
  message: string;
  data: {
    jobId: string;
    status: TraceStatus;
    progress?: TraceProgress;
    error?: string;
  };
  timestamp?: string;
}

// Engagement metrics type
export interface EngagementMetrics {
  likes: number;
  shares: number;
  comments: number;
  views: number;
  retweets?: number;
  replies?: number;
  reactions?: number;
}

// Individual post data
export interface PlatformPost {
  postId: string;
  userId: string;
  username: string;
  displayName: string;
  platform: Platform;
  timestamp: string;
  url: string;
  engagement: EngagementMetrics;
  hashtags: string[];
  mentions: string[];
  caption?: string;
  isVerified: boolean;
  spreadType: string;
}

// Platform appearance grouping
export interface PlatformAppearance {
  platform: Platform;
  posts: PlatformPost[];
  totalFound: number;
  oldestPost: string;
  newestPost: string;
}

// Original poster info
export interface OriginalPoster {
  platform: Platform;
  userId: string;
  username: string;
  displayName: string;
  postId: string;
  timestamp: string;
  url: string;
  verified: boolean;
  engagement: EngagementMetrics;
}

// Early spreader info
export interface EarlySpreader {
  platform: Platform;
  userId: string;
  username: string;
  displayName: string;
  postId: string;
  timestamp: string;
  url: string;
  engagement: EngagementMetrics;
  isInfluencer: boolean;
  influenceScore: number;
  verified: boolean;
  timeFromOriginal: number;
  spreadType?: string;
}

// Viral moment
export interface ViralMoment {
  timestamp: string;
  platform: Platform;
  engagementSpike: number;
  shareVelocity: number;
  totalShares: number;
  description: string;
}

// Platform breakdown
export interface PlatformBreakdown {
  platform: Platform;
  postCount: number;
  engagementTotal: number;
  percentage?: number;
}

// Distribution graph
export interface DistributionGraph {
  originalPoster: OriginalPoster;
  earlySpreaders: EarlySpreader[];
  viralMoments: ViralMoment[];
  totalPosts: number;
  totalEngagement: number;
  spreadDurationHours: number;
  peakVelocity: number;
  platformBreakdown: PlatformBreakdown[];
}

// Coordinated behavior pattern
export interface CoordinatedBehavior {
  detected: boolean;
  evidence?: any[];
  score: number;
  accountsInvolved?: any[];
  timingClusters?: any[];
  similarityScore?: number;
}

// Bot amplification pattern
export interface BotAmplification {
  detected: boolean;
  suspiciousAccounts?: any[];
  score: number;
  indicators?: any[];
  botProbability?: number;
}

// Rapid spread pattern
export interface RapidSpread {
  detected: boolean;
  spreadRate?: number;
  score: number;
  timeline?: Array<{
    hour: number;
    postCount: number;
    cumulativeTotal?: number;
  }>;
  accelerationPoints?: any[];
  organicLikelihood?: number;
}

// Suspicious patterns container
export interface SuspiciousPatterns {
  coordinatedBehavior: CoordinatedBehavior;
  botAmplification: BotAmplification;
  rapidSpread: RapidSpread;
  overallSuspicionScore: number;
  riskLevel: "low" | "medium" | "high";
  flags: string[];
}

// Forensic analysis
export interface ForensicAnalysis {
  status: TraceStatus;
  startedAt: string;
  completedAt: string;
  processingTimeSeconds: number;
  tracingScore: number;
  confidence: number;
  flags: string[];
  summary: string;
  recommendations: string[];
}

// Full trace result
export interface TraceResult {
  traceId: string;
  mediaId: string;
  status: TraceStatus;
  searchConfig: InitiateTraceRequest;
  createdAt: string;
  completedAt?: string;
  platformAppearances: PlatformAppearance[];
  distributionGraph: DistributionGraph;
  suspiciousPatterns: SuspiciousPatterns;
  forensicAnalysis: ForensicAnalysis;
  // These fields may be present during processing states
  progress?: TraceProgress;
  error?: string;
}

// Trace result response
export interface TraceResultResponse {
  success: boolean;
  message: string;
  data: TraceResult;
  timestamp: string;
}

// Trace summary for list items
export interface TraceListSummary {
  totalPosts: number;
  platforms: Platform[];
}

// List traces response
export interface TraceListItem {
  traceId: string;
  mediaId: string;
  status: TraceStatus;
  createdAt: string;
  completedAt?: string;
  searchConfig: InitiateTraceRequest;
  summary?: TraceListSummary;
}

export interface ListTracesResponse {
  success: boolean;
  message: string;
  data: {
    traces: TraceListItem[];
    total: number;
  };
  timestamp: string;
}


// Client-side state types
export type TraceUIState =
  | "idle"
  | "initiating"
  | "pending"
  | "processing"
  | "completed"
  | "no_results"
  | "failed"
  | "stale_timeout";

export interface TraceSession {
  traceId: string;
  mediaId: string;
  state: TraceUIState;
  progress?: TraceProgress;
  startedAt: string;
  lastPolledAt?: string;
  estimatedCompletionSeconds?: number;
  result?: TraceResult;
  error?: string;
}
