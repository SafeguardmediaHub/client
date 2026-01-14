export interface AssistantState {
  isOpen: boolean;
  isThinking: boolean;
  sessionId: string | null;
  messages: Message[];
  currentWorkflow: WorkflowRecommendation | null;
  mediaContext: {
    mediaId?: string;
    mediaType?: 'image' | 'video' | 'audio';
  };
}

export type MessageRole = 'user' | 'assistant';
export type MessageType = 'text' | 'workflow' | 'question' | 'acknowledgment';

export type Message =
  | {
      role: 'user';
      content: string;
      timestamp: Date;
    }
  | {
      role: 'assistant';
      type: 'text';
      content: string;
      timestamp: Date;
    }
  | {
      role: 'assistant';
      type: 'workflow';
      content: WorkflowRecommendation;
      timestamp: Date;
    }
  | {
      role: 'assistant';
      type: 'question';
      content: ClarifyingQuestion;
      timestamp: Date;
    }
  | {
      role: 'assistant';
      type: 'acknowledgment';
      content: AcknowledgmentContent;
      timestamp: Date;
    };

export interface WorkflowRecommendation {
  id: string;
  name: string;
  explanation: string;
  totalCost: number;
  totalTime: number; // in seconds
  steps: StepCard[];
}

export interface StepCard {
  id: string;
  name: string;
  toolName: string;
  why: string;
  limitation?: string;
  estimatedTime: number; // in seconds
  cost: number;
  order: number;
}

export interface ClarifyingQuestion {
  question: string;
  options: string[];
  context?: string;
}

export interface AcknowledgmentContent {
  message: string;
  helpful_features?: string[];
}

export interface AssistantSession {
  sessionId: string;
  messages: Message[];
  recommendedWorkflow: WorkflowRecommendation | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntentAnalysisRequest {
  message: string;
  media_id?: string;
  session_id?: string;
}

export interface IntentAnalysisResponse {
  session_id: string;
  response: {
    type: 'text' | 'workflow' | 'question' | 'acknowledgment';
    content: string | WorkflowRecommendation | ClarifyingQuestion | AcknowledgmentContent;
  };
}

export interface ExecuteWorkflowRequest {
  session_id: string;
  workflow_id: string;
  media_id: string;
}

export interface ExecuteWorkflowResponse {
  job_id: string;
  estimated_time: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

export interface JobStatusResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: unknown;
  error?: string;
}

export interface SessionResponse {
  session_id: string;
  messages: Message[];
  recommended_workflow: WorkflowRecommendation | null;
  created_at: string;
  updated_at: string;
}

// New types for media attachment feature
export interface AttachedMedia {
  id: string;
  type: 'image' | 'video' | 'audio';
  thumbnailUrl: string;
  filename: string;
  mimeType: string;
}
