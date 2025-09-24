import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { Analysis } from '../types/analysis';

export interface ReportGenerationRequest {
  selectedAnalyses: Analysis[];
}

export interface ReportGenerationResponse {
  reportId: string;
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  generatedAt: string;
}

const generateReport = async (
  request: ReportGenerationRequest
): Promise<ReportGenerationResponse> => {
  const response = await axios.post('/api/reports/generate', request, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
  });
  const { data } = response.data;
  console.log(response.data);

  return {
    reportId: `report_${Date.now()}`,
    downloadUrl: `/api/reports/download/${Date.now()}`,
    fileName: data.fileName,
    fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
    generatedAt: new Date().toISOString(),
  };
};

export const useReportGeneration = () => {
  return useMutation({
    mutationFn: generateReport,
    onSuccess: (data) => {
      console.log('Report generated successfully:', data);
    },
    onError: (error) => {
      console.error('Report generation failed:', error);
    },
  });
};
