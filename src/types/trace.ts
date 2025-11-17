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

// Platform appearance
export interface PlatformAppearance {
  platform: Platform;
  postId: string;
  url: string;
  username: string;
  displayName?: string;
  timestamp: string;
  content?: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
  metadata?: {
    isVerified?: boolean;
    followerCount?: number;
    accountCreated?: string;
  };
}

// Distribution graph node
export interface DistributionNode {
  id: string;
  type: "source" | "share" | "repost" | "quote";
  platform: Platform;
  username: string;
  timestamp: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

// Distribution graph edge
export interface DistributionEdge {
  source: string;
  target: string;
  type: "shared" | "reposted" | "quoted" | "replied";
  timestamp: string;
}

// Distribution graph
export interface DistributionGraph {
  nodes: DistributionNode[];
  edges: DistributionEdge[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    platforms: Platform[];
  };
}

// Timeline event
export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "first_appearance" | "viral_spike" | "platform_spread" | "deletion";
  platform: Platform;
  description: string;
  metadata?: Record<string, unknown>;
}

// Suspicious pattern
export interface SuspiciousPattern {
  id: string;
  type:
    | "coordinated_posting"
    | "bot_activity"
    | "rapid_spread"
    | "suspicious_accounts"
    | "unusual_timing";
  severity: "low" | "medium" | "high";
  confidence: number;
  description: string;
  affectedPosts: string[];
  evidence?: Record<string, unknown>;
}

// Forensic analysis
export interface ForensicAnalysis {
  overallConfidence: number;
  authenticity: {
    score: number;
    verdict: "authentic" | "suspicious" | "manipulated" | "inconclusive";
    indicators: Array<{
      type: string;
      description: string;
      confidence: number;
    }>;
  };
  manipulation: {
    detected: boolean;
    types?: string[];
    confidence?: number;
  };
  metadata: {
    originalSource?: {
      platform: Platform;
      url: string;
      timestamp: string;
    };
    earliestAppearance?: {
      platform: Platform;
      timestamp: string;
    };
  };
}

// Full trace result
export interface TraceResult {
  traceId: string;
  mediaId: string;
  status: TraceStatus;
  config: InitiateTraceRequest;
  createdAt: string;
  completedAt?: string;
  platformAppearances: PlatformAppearance[];
  distributionGraph: DistributionGraph;
  timeline: TimelineEvent[];
  suspiciousPatterns: SuspiciousPattern[];
  forensicAnalysis: ForensicAnalysis;
  summary: {
    totalPosts: number;
    platforms: Platform[];
    dateRange: {
      earliest: string;
      latest: string;
    };
    topEngagement: {
      platform: Platform;
      postId: string;
      totalEngagement: number;
    };
  };
}

// Trace result response
export interface TraceResultResponse {
  success: boolean;
  message: string;
  data: TraceResult;
  timestamp: string;
}

// List traces response
export interface TraceListItem {
  traceId: string;
  mediaId: string;
  status: TraceStatus;
  createdAt: string;
  completedAt?: string;
  config: InitiateTraceRequest;
  summary?: {
    totalPosts: number;
    platforms: Platform[];
  };
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

// Distribution graph response
export interface DistributionGraphResponse {
  success: boolean;
  message: string;
  data: {
    visualizationData: DistributionGraph;
  };
  timestamp: string;
}

// Timeline response
export interface TimelineResponse {
  success: boolean;
  message: string;
  data: {
    events: TimelineEvent[];
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
