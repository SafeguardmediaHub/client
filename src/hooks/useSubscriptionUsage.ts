import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  type SubscriptionUsageData,
  subscriptionUsageQueryKey,
} from "@/lib/subscription-access";

async function fetchSubscriptionUsage(): Promise<SubscriptionUsageData> {
  const { data } = await api.get("/api/subscription/usage");
  return data.data;
}

export function useSubscriptionUsage(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: subscriptionUsageQueryKey,
    queryFn: fetchSubscriptionUsage,
    staleTime: 30000,
    refetchOnWindowFocus: true,
    enabled: options?.enabled ?? true,
  });
}
