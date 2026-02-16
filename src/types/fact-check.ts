export type ContentType = 'text' | 'ocr' | 'transcript' | 'user_submission';

export type JobStatus = 'prioritized' | 'processing' | 'completed' | 'failed';

export type ClaimStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'no_verdict'
  | 'failed';

export enum VerdictRating {
  TRUE = 'True',
  MOSTLY_TRUE = 'Mostly True',
  MIXED = 'Mixed',
  MOSTLY_FALSE = 'Mostly False',
  FALSE = 'False',
}

export interface AnalyzeContentRequest {
  content: string;
  content_type: ContentType;
  media_id?: string;
}

export interface AnalyzeContentResponse {
  success: boolean;
  message: string;
  data: {
    job_id: string;
    status: JobStatus;
    estimated_completion_seconds: number;
  };
}

export interface Verdict {
  source: string;
  rating: string;
  textual_rating: string;
  review_url: string;
  reviewed_at?: string;
}

export interface Claim {
  claim_id: string;
  text: string;
  context?: string;
  status: ClaimStatus;
  verdicts?: Verdict[];
}

export interface JobStatusResponse {
  success: boolean;
  message: string;
  data: {
    job_id: string;
    status: JobStatus;
    progress?: number;
    estimated_remaining_seconds?: number;
    claims?: Claim[];
    summary?: {
      total_claims: number;
      verified_false: number;
      verified_true: number;
      mixed: number;
    };
    error?: string;
  };
  timestamp: string;
}

export interface ClaimDetailResponse {
  success: boolean;
  message: string;
  data: {
    claim: Claim & {
      normalized_text?: string;
      confidence?: number;
      pattern_matched?: string;
      entities?: string[];
      created_at?: string;
      updated_at?: string;
    };
    verdicts: Verdict[];
  };
}

export interface VerifyClaimRequest {
  claim_id?: string;
  claim_text?: string;
}

export interface VerifyClaimResponse {
  success: boolean;
  message: string;
  data: {
    claim_text: string;
    verdicts_found: number;
    verdicts?: Verdict[];
    message?: string;
  };
}
