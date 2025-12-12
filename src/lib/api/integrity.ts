import api from "@/lib/api";
import type { IntegrityReportResponse } from "@/types/integrity";

export const getIntegrityReport = async (
	mediaId: string,
	detail: "simple" | "full" = "simple",
): Promise<IntegrityReportResponse["data"]> => {
	const { data } = await api.get<IntegrityReportResponse>(
		`/api/media/${mediaId}/integrity-report`,
		{ params: { detail } },
	);
	return data.data; // Return nested data object
};
