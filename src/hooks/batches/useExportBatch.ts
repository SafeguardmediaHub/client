import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { exportBatch } from '@/lib/api/batch';
import type { ExportBatchRequest } from '@/types/batch';

export const useExportBatch = () => {
  return useMutation({
    mutationFn: (data: ExportBatchRequest) => exportBatch(data),
    onSuccess: (data) => {
      toast.success('Export created successfully');

      // Automatically download the file
      window.location.href = data.downloadUrl;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to export batch',
      );
    },
  });
};
