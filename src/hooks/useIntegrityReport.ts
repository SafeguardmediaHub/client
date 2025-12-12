/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import { useMutation, useQuery } from "@tanstack/react-query";
import { getIntegrityReport } from "@/lib/api/integrity";

export const useIntegrityReport = (
	mediaId: string | undefined,
	detail: "simple" | "full" = "simple",
	options?: { enabled?: boolean },
) => {
	return useQuery({
		queryKey: ["integrityReport", mediaId, detail],
		queryFn: () => getIntegrityReport(mediaId!, detail),
		enabled: !!mediaId && (options?.enabled ?? true),
		staleTime: 60000, // 1 minute cache
		retry: (failureCount, error: any) => {
			const status = error?.response?.status;
			// Don't retry on client errors
			if (status === 404 || status === 400 || status === 202) {
				return false;
			}
			return failureCount < 3;
		},
	});
};

export const useRequestIntegrityReport = () => {
	return useMutation({
		mutationFn: ({
			mediaId,
			detail,
		}: {
			mediaId: string;
			detail: "simple" | "full";
		}) => getIntegrityReport(mediaId, detail),
	});
};
