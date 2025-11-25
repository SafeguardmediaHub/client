import api from '@/lib/api';
import type {
  AdminDashboardResponse,
  AdminVerificationsParams,
  BadgesResponse,
  BatchVerifyRequest,
  ClearCacheResponse,
  MediaBadgeResponse,
  StatsResponse,
  VerificationDetailsResponse,
  VerificationSummaryResponse,
  VerificationsListParams,
  VerificationsListResponse,
  VerifyMediaRequest,
  VerifyResponse,
} from '@/types/c2pa';

// Verification endpoints
export const getVerifications = async (
  params: VerificationsListParams = {}
): Promise<VerificationsListResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.mediaType) queryParams.append('mediaType', params.mediaType);
  if (params.search) queryParams.append('search', params.search);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  const url = `/api/c2pa/verify${queryString ? `?${queryString}` : ''}`;

  const { data } = await api.get<VerificationsListResponse>(url);
  return data;
};

export const getVerificationDetails = async (
  verificationId: string
): Promise<VerificationDetailsResponse> => {
  const { data } = await api.get<VerificationDetailsResponse>(
    `/api/c2pa/verify/${verificationId}/details`
  );
  return data;
};

export const getVerificationSummary = async (
  verificationId: string
): Promise<VerificationSummaryResponse> => {
  const { data } = await api.get<VerificationSummaryResponse>(
    `/api/c2pa/verify/${verificationId}/summary`
  );
  return data;
};

export const getVerificationStats = async (): Promise<StatsResponse> => {
  const { data } = await api.get<StatsResponse>('/api/c2pa/stats');
  return data;
};

// Verification actions
export const verifyMedia = async (
  request: VerifyMediaRequest
): Promise<VerifyResponse> => {
  const { data } = await api.post<VerifyResponse>(
    `/api/c2pa/verify/${request.mediaId}`,
    {},
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
};

export const batchVerifyMedia = async (
  request: BatchVerifyRequest
): Promise<VerifyResponse[]> => {
  const { data } = await api.post<{ success: boolean; data: VerifyResponse[] }>(
    '/api/c2pa/verify/batch',
    request,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data.data;
};

// SSE Stream for real-time updates
export const createVerificationStream = (
  verificationId: string,
  onMessage: (event: MessageEvent) => void,
  onError?: (error: Event) => void
): EventSource => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';
  const eventSource = new EventSource(
    `${baseUrl}/api/c2pa/verify/${verificationId}/stream`,
    { withCredentials: true }
  );

  eventSource.onmessage = onMessage;
  if (onError) {
    eventSource.onerror = onError;
  }

  return eventSource;
};

// Badge endpoints
export const getBadges = async (): Promise<BadgesResponse> => {
  const { data } = await api.get<BadgesResponse>('/api/c2pa/badges');
  return data;
};

export const getMediaBadge = async (
  mediaId: string
): Promise<MediaBadgeResponse> => {
  const { data } = await api.get<MediaBadgeResponse>(
    `/api/c2pa/media/${mediaId}/badge`
  );
  return data;
};

// Admin endpoints
export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const { data } = await api.get<AdminDashboardResponse>(
    '/api/c2pa/admin/dashboard'
  );
  return data;
};

export const getAdminVerifications = async (
  params: AdminVerificationsParams = {}
): Promise<VerificationsListResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.mediaType) queryParams.append('mediaType', params.mediaType);
  if (params.search) queryParams.append('search', params.search);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.userId) queryParams.append('userId', params.userId);

  const queryString = queryParams.toString();
  const url = `/api/c2pa/admin/verifications${queryString ? `?${queryString}` : ''}`;

  const { data } = await api.get<VerificationsListResponse>(url);
  return data;
};

export const clearAdminCache = async (): Promise<ClearCacheResponse> => {
  const { data } = await api.post<ClearCacheResponse>(
    '/api/c2pa/admin/cache/clear',
    {},
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
};
