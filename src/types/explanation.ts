/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

export type AnalysisFeatureType =
  | 'deepfake_detection'
  | 'c2pa_verification'
  | 'tamper_detection'
  | 'metadata_extraction'
  | 'timeline_verification'
  | 'reverse_lookup'
  | 'geolocation_verification'
  | 'claim_research'
  | 'fact_check';

export interface AnalysisVerdict {
  conclusion: string;
  category: string;
  subcategories?: string[];
}

export interface ConfidenceScore {
  value: number; // 0-100
  level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  basis?: string;
}

export interface Evidence {
  id: string;
  type:
  | 'metadata'
  | 'visual'
  | 'temporal'
  | 'external_source'
  | 'cryptographic'
  | 'geospatial';
  description: string;
  weight: number; // 0-1
  supportingData: Record<string, any>;
}

export interface Signal {
  name: string;
  value: any;
  interpretation: 'positive' | 'negative' | 'neutral' | 'inconclusive';
  severity?: number; // 0-10
}

export interface MediaContext {
  mediaId: string;
  mediaType: 'image' | 'video' | 'audio';
  filename: string;
  uploadDate: Date;
  fileSize: number;
  dimensions?: {width: number; height: number};
  duration?: number;
}

export interface ProcessingMetadata {
  processingTime: number;
  modelVersion?: string;
  toolVersion?: string;
  resourceUsage?: Record<string, any>;
}

export interface AnalysisResult {
  analysisId: string;
  featureType: AnalysisFeatureType;
  version: string;
  timestamp: Date;
  verdict: AnalysisVerdict;
  confidence: ConfidenceScore;
  evidence: Evidence[];
  signals: Signal[];
  mediaContext: MediaContext;
  processingMetadata: ProcessingMetadata;
  explanationPriority?: 'high' | 'normal' | 'low';
  riskLevel?: 'critical' | 'high' | 'medium' | 'low';
}

export interface ExplanationOptions {
  tone?: 'professional' | 'casual' | 'technical';
  audience?: 'general' | 'expert' | 'legal';
  length?: 'brief' | 'standard' | 'detailed';
  language?: string; // ISO 639-1 code
  forceRegenerate?: boolean;
  promptVersion?: string;
}

export interface ExplanationSection {
  title: string;
  content: string;
  order: number;
  type:
  | 'evidence'
  | 'interpretation'
  | 'methodology'
  | 'limitation'
  | 'recommendation';
}

export interface DetailedExplanation {
  sections: ExplanationSection[];
  markdown?: string | null;
}

export interface KeyFinding {
  finding: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  category: string;
}

export interface ExplanationMetadata {
  generationTimeMs: number;
  tokensUsed: number;
  cost?: number;
  confidenceInExplanation?: number;
  analysisVersion: string;
  explanationSchemaVersion: string;
  flags?: {
    requiresHumanReview?: boolean;
    containsUncertainty?: boolean;
    highRiskContent?: boolean;
  };
}

export interface ExplanationContent {
  summary: string;
  detailedExplanation: DetailedExplanation;
  keyFindings?: KeyFinding[];
  recommendations?: string[];
  limitations?: string[];
  nextSteps?: string[];
}

export interface ExplanationOutput {
  explanationId: string;
  analysisId: string;
  version: string;
  generatedAt: string; // ISO 8601 date string
  promptId: string;
  promptVersion: string;
  modelUsed: string;
  provider: 'gemini' | 'openai';
  content: ExplanationContent;
  metadata: ExplanationMetadata;
}

// API Response Types

export interface GetExplanationResponse {
  success: true;
  cached: boolean;
  data: ExplanationOutput;
}

export interface GenerateExplanationRequest {
  analysisId: string;
  featureType: AnalysisFeatureType;
  options?: ExplanationOptions;
  priority?: 'low' | 'normal' | 'high';
}

export interface GenerateExplanationResponse {
  success: true;
  message: string;
  jobId: string;
  statusUrl: string;
}

export type JobStatus = 'waiting' | 'processing' | 'completed' | 'failed';

export interface JobStatusResponse {
  success: true;
  jobId: string;
  status: JobStatus;
  progress?: number;
  message?: string;
  result?: ExplanationOutput;
  error?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
