import { keepPreviousData, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Analysis {
  id: string;
  fileName: string;
  mediaType: string;
  uploadDate: string;
  predictedClass: string;
  isDeepfake: boolean;
  confidenceScore: number;
  riskScore: number;
  thumbnailUrl: string;
  status: string;
  createdAt: string;
}

interface UseAnalysisHistoryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  mediaType?: string;
  predictedClass?: string;
  isDeepfake?: boolean;
  confidenceMin?: number;
  confidenceMax?: number;
  dateRange?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AnalysisHistoryResponse {
  pagination: Pagination;
  analyses: Analysis[];
}

const fetchAnalysisHistory = async (params?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  mediaType?: string;
  predictedClass?: string;
  isDeepfake?: boolean;
  confidenceMin?: number;
  confidenceMax?: number;
  dateRange?: string;
}): Promise<AnalysisHistoryResponse> => {
  const { data } = await api.get('/api/analysis', {
    params,
    headers: { 'Content-Type': 'application/json' },
  });

  return data.data;
};

export const useAnalysisHistory = (params?: UseAnalysisHistoryParams) => {
  return useQuery({
    queryKey: ['analysisHistory', params],
    queryFn: () => fetchAnalysisHistory(params),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
