import api from '@/lib/api';
import type { MediaReportResponse } from '@/types/media-report';

export const mediaReportApi = {
  generateReport: async (mediaId: string): Promise<MediaReportResponse> => {
    const response = await api.post<{
      success: boolean;
      data: MediaReportResponse;
      message: string;
    }>(`/api/media/${mediaId}/reports`);
    return response.data.data;
  },
};
