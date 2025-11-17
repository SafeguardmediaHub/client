export type ContentType = "text" | "ocr" | "transcript" | "user_submission";

export type JobStatus = "prioritized" | "processing" | "completed" | "failed";

export type PublisherCredibility =
  | "ifcn_certified"
  | "reputable"
  | "unknown"
  | "questionable";

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

export interface Entity {
  text: string;
  type?: string;
}

export interface Claim {
  claim_id: string;
  text: string;
  context?: string;
  credibility_score: number;
  reliability_index: number;
  verdict: string;
  confidence: string;
  verdicts: Array<{
    source: string;
    rating: string;
    review_url: string;
    reviewed_at: string;
  }>;
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

export interface VerdictApiResponse {
  title?: string;
  url?: string;
  text?: string;
  languageCode?: string;
  claimReview?: Array<{
    publisher?: {
      name?: string;
      site?: string;
    };
    url?: string;
    title?: string;
    reviewDate?: string;
    textualRating?: string;
  }>;
}

export interface Verdict {
  source: string;
  rating: string;
  textual_rating: string;
  review_url: string;
  publisher_credibility: PublisherCredibility;
  weighted_score: number;
  api_response: VerdictApiResponse;
}

export interface ClaimDetailResponse {
  success: boolean;
  message: string;
  data: {
    claim: Claim;
    verdicts: Verdict[];
    overall_status:
      | "verified_true"
      | "verified_false"
      | "mixed"
      | "inconclusive"
      | "no_verdict";
    confidence_score?: number;
  };
}

export interface VerifyClaimRequest {
  claim_text: string;
}

export interface VerifyClaimResponse {
  success: boolean;
  message: string;
  data: {
    claim_id: string;
    verdicts: Verdict[];
  };
}
