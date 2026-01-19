export type ContentType = 'text' | 'ocr' | 'transcript' | 'user_submission';

export type JobStatus = 'prioritized' | 'processing' | 'completed' | 'failed';

export type PublisherCredibility =
  | 'ifcn_certified'
  | 'reputable'
  | 'unknown'
  | 'questionable';

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
    // job_id might be directly in data in some versions, but keeping consistent with prev code unless API changed structure significantly.
    // Integration guide says: data.data.job_id which implies typical wrapper.
    // Checking file 20: const { data } = await api.post... return data.
    // So the response type matches the AXIOS response.data.
  };
}

export interface Entity {
  text: string;
  type?: string;
}

export interface VerifiableElement {
  element: string;
  type: string;
  canBeVerified: boolean;
  verificationMethod: string;
}

export interface AIAnalysis {
  specificity?: {
    level: string;
    score: number;
    reasoning: string;
  };
  reasoning?: string; // Added shorthand if full specificity obj isn't there
  verifiableElements?: VerifiableElement[];
  redFlags?: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
  logicalConsistency?: {
    isConsistent: boolean;
    issues: string[];
    reasoning: string;
  };
  missingInformation?: string[];
  verificationGuide?: {
    suggestedSources: string[];
    keyQuestionsToAsk: string[];
    searchTerms: string[];
    expertDomains: string[];
  };
  summary: string;
  confidence?: number;
  analyzedAt?: string;
}

export interface Claim {
  claim_id: string;
  text: string;
  context?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed'; // explicit status for claim
  credibility_score?: number;
  reliability_index?: number;
  verdict?: 'True' | 'False' | 'Mixed' | 'Unknown';
  confidence?: 'High' | 'Medium' | 'Low';

  // Explanation / Sources
  ai_analysis?: AIAnalysis;
  verdicts?: Array<{
    source: string;
    review_url?: string;
    rating?: string;
    textual_rating?: string;
    publisher_credibility?: PublisherCredibility;
    weighted_score?: number;
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
  reviewed_at?: string;
  recency_days?: number;
  credibility_multiplier?: number;
  recency_multiplier?: number;
  api_response: VerdictApiResponse;
}

export interface Consensus {
  agreement_rate: number;
  interpretation: string;
}

export interface ScoreBreakdown {
  total_sources: number;
  ifcn_certified: number;
  avg_recency_days?: number;
}

export interface ClaimScore {
  consensus?: Consensus;
  breakdown?: ScoreBreakdown;
  credibility_score: number;
  reliability_index: number;
  verdict: string;
  confidence: string;
}

export interface ClaimDetailResponse {
  success: boolean;
  message: string;
  data: {
    claim: Claim;
    verdicts: Verdict[];
    score?: ClaimScore; // New field from backend
    // specialized fields for backward compatibility if needed, but per json they are in score
    overall_status?: string;
    confidence_score?: number;
  };
}

export interface VerifyClaimRequest {
  claim_id?: string; // Changed to support refetching by claim_id
  claim_text?: string; // Backward compatibility or manual text
}

export interface VerifyClaimResponse {
  success: boolean;
  message: string;
  data: {
    claim_id: string;
    verdicts: Verdict[];
  };
}
