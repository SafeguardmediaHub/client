export enum ClaimResearchStatus {
  PENDING = 'pending',
  SEARCHING = 'searching',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ResearchStage {
  SEARCH = 'search',
  SYNTHESIS = 'synthesis',
  COMPLETE = 'complete',
}

export enum EvidenceStance {
  SUPPORTING = 'supporting',
  CONTRADICTING = 'contradicting',
  NEUTRAL = 'neutral',
}

export interface SearchResult {
  query: string;
  source: string;
  title: string;
  snippet: string;
  link: string;
  date?: string;
  relevance_score: number;
}

export interface EvidenceAssessment {
  supporting: number;
  contradicting: number;
  neutral: number;
}

export interface EvidenceSynthesis {
  summary: string;
  evidence_assessment: EvidenceAssessment;
  confidence: number; // 0-100
  key_findings: string[];
  contradictions: string[];
  limitations: string[];
  suggested_next_steps: string[];
}

export interface ResearchProgress {
  stage: ResearchStage;
  percentage: number;
}

export interface SubmitClaimRequest {
  claim_text: string;
  context?: string;
}

export interface SubmitClaimResponse {
  job_id: string;
  status: ClaimResearchStatus;
  estimated_completion_seconds: number;
}

export interface ClaimResearchStatusResponse {
  job_id: string;
  status: ClaimResearchStatus;
  progress: ResearchProgress;
  claim_text?: string;
  synthesis?: EvidenceSynthesis;
  search_results?: SearchResult[];
  completed_at?: string; // ISO date string
  processing_time_ms?: number;
}

export interface ClaimResearchHistoryItem {
  job_id: string;
  claim_text: string;
  status: ClaimResearchStatus;
  confidence?: number;
  submitted_at: string; // ISO date string
  completed_at?: string; // ISO date string
}

export interface ClaimResearchHistoryResponse {
  researches: ClaimResearchHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ClaimResearchError {
  error: string;
  message?: string;
  limit?: number;
  remaining?: number;
  resetAt?: string; // ISO date string
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: string; // ISO date string
}
