import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface GenerateReportPayload {
  type: string;
  analysisId?: string;
  filters?: Record<string, any>;
  format: string;
  priority?: string;
  title?: string;
  description?: string;
}

interface GenerateReportResponse {
  reportId: string;
  status: string;
  estimatedCompletion: string;
  jobId: string;
}

const generateReport = async (
  payload: GenerateReportPayload
): Promise<GenerateReportResponse> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/reports`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEST_TOKEN}`,
      },
    }
  );

  return data.data;
};

export function useGenerateReport() {
  return useMutation<GenerateReportResponse, Error, GenerateReportPayload>({
    mutationFn: (payload) => generateReport(payload),
  });
}
