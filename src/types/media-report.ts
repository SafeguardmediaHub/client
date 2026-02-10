export interface MediaReportResponse {
  reportId: string;
  downloadUrl: string;
}

export interface ReportGenerationError {
  message: string;
  error?: string;
}
