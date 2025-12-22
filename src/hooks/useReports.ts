import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Report } from '@/types/report';
import type { Analysis } from './useAnalysisHistory';

type ReportsResponse = {
  reports: Report[];
  pagination: {
    pages: number;
    total: number;
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
    offset: number;
    limit: number;
  };
};

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

export interface ReportGenerationResponse {
  reportId: string;
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  generatedAt: string;
}

export interface ReportGenerationRequest {
  analysisId: string;
  title: string;
  type: 'media_analytics' | 'user_activity' | 'custom';
  format: 'pdf' | 'docx';
  priority: 'normal' | 'urgent';
  description: string;
}

const fetchReports = async ({ page }: { page: number }) => {
  const { data } = await api.get('/api/reports', {
    params: { page },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data.data;
};

const generateReport = async (
  payload: GenerateReportPayload
): Promise<GenerateReportResponse> => {
  const { data } = await api.post('/api/reports', payload, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data.data;
};

export const useReports = (page: number) => {
  return useQuery<ReportsResponse>({
    queryKey: ['reports', page],
    queryFn: () => fetchReports({ page }),
    placeholderData: keepPreviousData,
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation<GenerateReportResponse, Error, GenerateReportPayload>({
    mutationFn: (payload) => generateReport(payload),
    onSuccess: () => {
      toast.success('Report generation started. It may take a few minutes.');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      window.location.reload();
    },
    onError: (error) => {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    },
  });
};
