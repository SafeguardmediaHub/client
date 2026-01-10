import type {
  ExecuteWorkflowRequest,
  ExecuteWorkflowResponse,
  IntentAnalysisRequest,
  IntentAnalysisResponse,
  JobStatusResponse,
  SessionResponse,
} from '@/types/assistant';
import api from '../api';

/**
 * Analyze user intent and get workflow recommendations
 */
export const analyzeIntent = async (
  request: IntentAnalysisRequest
): Promise<IntentAnalysisResponse> => {
  const { data } = await api.post('/api/assistant/intent', request);
  return data as IntentAnalysisResponse;
};

/**
 * Execute a recommended workflow
 */
export const executeWorkflow = async (
  request: ExecuteWorkflowRequest
): Promise<ExecuteWorkflowResponse> => {
  const { data } = await api.post('/api/assistant/execute', request);
  return data as ExecuteWorkflowResponse;
};

/**
 * Load a previous assistant session
 */
export const loadSession = async (
  sessionId: string
): Promise<SessionResponse> => {
  const { data } = await api.get(`/api/assistant/session/${sessionId}`);
  return data as SessionResponse;
};

/**
 * Poll for job status
 */
export const pollJobStatus = async (
  jobId: string
): Promise<JobStatusResponse> => {
  const { data } = await api.get(`/api/assistant/job/${jobId}`);
  return data as JobStatusResponse;
};
