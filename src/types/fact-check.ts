export type ContentType = "text" | "ocr" | "transcript" | "user_submission";

export type JobStatus = "processing" | "success" | "failed";

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
  original_text: string;
  confidence: number;
  pattern_matched: string;
  entities: string[];
}

export interface JobStatusResponse {
  success: boolean;
  message: string;
  data: {
    job_id: string;
    status: JobStatus;
    progress: number;
    estimated_remaining_seconds?: number;
    result?: {
      claims: Claim[];
      total_claims: number;
      processing_time: number;
    };
    error?: string;
  };
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
