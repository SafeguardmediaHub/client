import api from '../api';
import type {
  ExplanationOutput,
  ExplanationOptions,
  GetExplanationResponse,
  GenerateExplanationRequest,
  GenerateExplanationResponse,
  JobStatusResponse,
} from '@/types/explanation';

export const explanationApi = {
  /**
   * Get cached explanation for an analysis
   */
  getExplanation: async (
    analysisId: string,
    options?: ExplanationOptions,
  ): Promise<GetExplanationResponse> => {
    const params = new URLSearchParams();
    if (options?.tone) params.append('tone', options.tone);
    if (options?.audience) params.append('audience', options.audience);
    if (options?.length) params.append('length', options.length);
    if (options?.language) params.append('language', options.language);

    const response = await api.get<GetExplanationResponse>(
      `/api/explanations/${analysisId}`,
      { params },
    );
    return response.data;
  },

  /**
   * Queue explanation generation
   */
  generateExplanation: async (
    request: GenerateExplanationRequest,
  ): Promise<GenerateExplanationResponse> => {
    const response = await api.post<GenerateExplanationResponse>(
      '/api/explanations/generate',
      request,
    );
    return response.data;
  },

  /**
   * Check job status
   */
  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    const response = await api.get<JobStatusResponse>(
      `/api/explanations/status/${jobId}`,
    );
    return response.data;
  },

  /**
   * Poll for job completion
   */
  pollJobStatus: async (
    jobId: string,
    intervalMs = 1000,
    maxAttempts = 30,
  ): Promise<ExplanationOutput> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await explanationApi.getJobStatus(jobId);

      if (status.status === 'completed' && status.result) {
        return status.result;
      }

      if (status.status === 'failed') {
        throw new Error(status.error || 'Explanation generation failed');
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error('Explanation generation timed out');
  },
};
