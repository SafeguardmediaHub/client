import type {
  ClaimResearchHistoryResponse,
  ClaimResearchStatusResponse,
  RateLimitInfo,
  SubmitClaimRequest,
  SubmitClaimResponse,
} from "@/types/claim-research";
import api from "../api";

export async function submitClaimResearch(
  data: SubmitClaimRequest
): Promise<SubmitClaimResponse> {
  const response = await api.post<SubmitClaimResponse>(
    "/api/claim-research",
    data
  );
  return response.data;
}

export async function getResearchStatus(
  jobId: string
): Promise<ClaimResearchStatusResponse> {
  const response = await api.get<ClaimResearchStatusResponse>(
    `/api/claim-research/${jobId}`
  );
  return response.data;
}

export async function getResearchHistory(
  page = 1,
  limit = 10
): Promise<ClaimResearchHistoryResponse> {
  const response = await api.get<ClaimResearchHistoryResponse>(
    "/api/claim-research/history",
    { params: { page, limit } }
  );
  return response.data;
}

export async function deleteResearch(jobId: string): Promise<void> {
  await api.delete(`/api/claim-research/${jobId}`);
}
export function extractRateLimitInfo(headers: any): RateLimitInfo | null {
  const limit = headers["x-ratelimit-limit"];
  const remaining = headers["x-ratelimit-remaining"];
  const reset = headers["x-ratelimit-reset"];

  if (!limit || !remaining || !reset) return null;

  return {
    limit: parseInt(limit, 10),
    remaining: parseInt(remaining, 10),
    reset,
  };
}

export async function pollResearchStatus(
  jobId: string,
  interval = 2000,
  maxAttempts = 30
): Promise<ClaimResearchStatusResponse> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await getResearchStatus(jobId);

    if (status.status === "completed" || status.status === "failed") {
      return status;
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error("Polling timeout: Research did not complete in time");
}
