import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mediaReportApi } from '@/lib/api/media-report';
import type { MediaReportResponse } from '@/types/media-report';

export const useGenerateMediaReport = () => {
  return useMutation<MediaReportResponse, Error, string>({
    mutationFn: (mediaId: string) => mediaReportApi.generateReport(mediaId),
    onSuccess: (data) => {
      // Automatically download the PDF
      window.open(data.downloadUrl, '_blank');
      toast.success('Report generated successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to generate report';
      toast.error(errorMessage);
    },
  });
};
