import React from 'react';
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
import {
  createReport,
  getReport,
  downloadReportFromUrl,
  type CreateReportPayload,
  type CreateReportResponse,
  type GetReportResponse,
} from '@/lib/api/report';

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

// New hooks for report generation with polling
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateReportResponse, Error, CreateReportPayload>({
    mutationFn: (payload) => createReport(payload),
    onSuccess: (data) => {
      toast.success('Report generation started');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error) => {
      console.error('Error creating report:', error);
      toast.error('Failed to start report generation. Please try again.');
    },
  });
};

export const useReportStatus = (
  reportId: string | null,
  options?: {
    pollingInterval?: number;
    enabled?: boolean;
    onCompleted?: (report: GetReportResponse['data']['report']) => void;
    onFailed?: (error?: string) => void;
  }
) => {
  const pollingInterval = options?.pollingInterval ?? 5000; // 5 seconds default

  return useQuery({
    queryKey: ['reportStatus', reportId],
    queryFn: () => getReport(reportId!),
    enabled: (options?.enabled ?? true) && !!reportId,
    refetchInterval: (query) => {
      const data = query.state.data;

      if (!data?.data?.report?.status) {
        return pollingInterval;
      }

      const status = data.data.report.status;

      // Call callbacks based on status
      if (status === 'completed' && options?.onCompleted) {
        options.onCompleted(data.data.report);
      } else if (status === 'failed' && options?.onFailed) {
        options.onFailed(data.data.jobStatus?.error);
      }

      // Only poll when status is pending or processing
      if (['pending', 'processing'].includes(status)) {
        return pollingInterval;
      }

      // Stop polling when completed or failed
      return false;
    },
    retry: (failureCount, error) => {
      // Don't retry on 404 - report not found
      if ((error as any)?.response?.status === 404) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    staleTime: 0, // Always fetch fresh data when queried
  });
};

// Hook that combines creation and polling
export const useReportGeneration = (options?: {
  onCompleted?: (report: GetReportResponse['data']['report']) => void;
  onFailed?: (error?: string) => void;
}) => {
  const createMutation = useCreateReport();
  const [reportId, setReportId] = React.useState<string | null>(null);

  const statusQuery = useReportStatus(reportId, {
    enabled: !!reportId,
    onCompleted: options?.onCompleted,
    onFailed: options?.onFailed,
  });

  const generate = async (payload: CreateReportPayload) => {
    try {
      const response = await createMutation.mutateAsync(payload);
      setReportId(response.data.reportId);
      return response;
    } catch (error) {
      console.error('Failed to create report:', error);
      throw error;
    }
  };

  const downloadReport = async (title?: string) => {
    const downloadUrl = statusQuery.data?.data?.report?.downloadUrl;
    if (downloadUrl) {
      downloadReportFromUrl(downloadUrl, title);
    }
  };

  const reset = () => {
    setReportId(null);
  };

  return {
    generate,
    downloadReport,
    reset,
    reportId,
    status: statusQuery.data?.data?.report?.status,
    progress: statusQuery.data?.data?.report?.progress,
    downloadUrl: statusQuery.data?.data?.report?.downloadUrl,
    report: statusQuery.data?.data?.report,
    isGenerating: createMutation.isPending,
    isPolling: statusQuery.isFetching,
    error: createMutation.error || statusQuery.error,
  };
};
