import api from "../api";

// Types
export type ReportType = "media_analytics" | "system" | "user_activity";
export type ReportFormat = "pdf" | "csv" | "json";
export type ReportPriority = "low" | "normal" | "high";
export type ReportStatus = "pending" | "processing" | "completed" | "failed";
export type VerificationType = "timeline" | "c2pa" | "geolocation" | "authenticity";

export interface CreateReportPayload {
  type: ReportType;
  format?: ReportFormat;
  priority?: ReportPriority;
  title?: string;
  description?: string;
  analysisId?: string;
  mediaId?: string;
  verificationType?: VerificationType;
  filters?: {
    analysisId?: string;
    dateRange?: {
      startDate: string;
      endDate: string;
    };
    limit?: number;
    [key: string]: any;
  };
}

export interface CreateReportResponse {
  success: boolean;
  message: string;
  data: {
    reportId: string;
    status: ReportStatus;
    estimatedCompletion: string;
    jobId: string;
  };
  timestamp: string;
}

export interface ReportJobStatus {
  status: "active" | "completed" | "failed";
  progress: number;
  data: any;
  error?: string;
}

export interface Report {
  id: string;
  type: ReportType;
  status: ReportStatus;
  format: ReportFormat;
  title: string;
  progress: number;
  estimatedCompletion: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  fileSize?: number;
  accessCount: number;
  lastAccessedAt?: string;
  expiresAt: string;
  metadata: {
    totalRecords?: number;
    queryExecutionTime?: number;
    generatedAt?: string;
    reportData?: {
      mediaId?: string;
      verificationType?: VerificationType;
      userId?: string;
      reportType?: string;
    };
    reportType?: string;
    processingTime?: number;
    [key: string]: any;
  };
  downloadUrl: string | null;
}

export interface GetReportResponse {
  success: boolean;
  message: string;
  data: {
    report: Report;
    jobStatus: ReportJobStatus | null;
  };
  timestamp: string;
}

// API Functions
export async function createReport(payload: CreateReportPayload) {
  const response = await api.post<CreateReportResponse>("/api/reports", payload);
  return response.data;
}

export async function getReport(reportId: string) {
  const response = await api.get<GetReportResponse>(`/api/reports/${reportId}`);
  return response.data;
}

export async function downloadReport(reportId: string, title?: string) {
  const response = await api.get(`/api/reports/${reportId}/download`, {
    responseType: "blob",
    headers: { "Content-Type": "application/json" },
  });

  const blob = response.data as Blob;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(title || "report").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function deleteReport(reportId: string) {
  const response = await api.delete(`/api/reports/${reportId}`);
  return response.data;
}

// Legacy function for backward compatibility
export async function generateReport(payload: {
  analysisId: string;
  title: string;
}) {
  return createReport({
    type: "media_analytics",
    format: "pdf",
    analysisId: payload.analysisId,
    title: payload.title,
  });
}

// Utility to download from URL directly
export async function downloadReportFromUrl(url: string, title?: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(title || "report").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
