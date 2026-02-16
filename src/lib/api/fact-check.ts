import type {
  AnalyzeContentRequest,
  AnalyzeContentResponse,
  ClaimDetailResponse,
  JobStatusResponse,
  VerifyClaimRequest,
  VerifyClaimResponse,
} from '@/types/fact-check';

import api from '../api';

export const analyzeContent = async (
  payload: AnalyzeContentRequest,
): Promise<AnalyzeContentResponse> => {
  const { data } = await api.post('/api/fact-check/analyze', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return data;
};

export const getJobStatus = async (
  jobId: string,
): Promise<JobStatusResponse> => {
  const { data } = await api.get(`/api/fact-check/job/${jobId}`);

  return data;
};

export const getClaimDetail = async (
  claimId: string,
): Promise<ClaimDetailResponse> => {
  const { data } = await api.get(`/api/fact-check/claim/${claimId}`);

  return data;
};

export const verifyClaim = async (
  payload: VerifyClaimRequest,
): Promise<VerifyClaimResponse> => {
  const { data } = await api.post('/api/fact-check/verify-claim', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return data;
};

export const getMediaClaims = async (mediaId: string) => {
  const { data } = await api.get(`/api/fact-check/claims/${mediaId}`);

  return data;
};
