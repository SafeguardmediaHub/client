import {
  deleteResearch,
  getResearchHistory,
  getResearchStatus,
  submitClaimResearch,
} from "@/lib/api/claim-research";
import type { SubmitClaimRequest } from "@/types/claim-research";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useSubmitClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitClaimRequest) => submitClaimResearch(data),
    onSuccess: () => {
      // Invalidate history to refresh the list
      queryClient.invalidateQueries({ queryKey: ["claimResearchHistory"] });
    },
  });
}


export function useResearchStatus(jobId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["claimResearch", jobId],
    queryFn: () => getResearchStatus(jobId!),
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling when completed or failed
      if (data?.status === "completed" || data?.status === "failed") {
        return false;
      }
      // Poll every 2 seconds while processing
      return 2000;
    },
    refetchIntervalInBackground: true,
  });
}


export function useResearchHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["claimResearchHistory", page, limit],
    queryFn: () => getResearchHistory(page, limit),
    placeholderData: (previousData) => previousData, // Keep old data while fetching new page
  });
}


export function useDeleteResearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => deleteResearch(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claimResearchHistory"] });
    },
  });
}
