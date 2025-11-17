import type {
  DistributionGraphResponse,
  InitiateTraceRequest,
  InitiateTraceResponse,
  ListTracesResponse,
  TimelineResponse,
  TraceResultResponse,
  TraceStatusResponse,
} from '@/types/trace';
import api from '../api';

export const initiateTrace = async (
  mediaId: string,
  payload: InitiateTraceRequest
): Promise<InitiateTraceResponse> => {
  const { data } = await api.post(
    `/api/sm-tracing/media/${mediaId}/trace`,
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return data;
};

export const getTraceStatus = async (
  traceId: string
): Promise<TraceStatusResponse> => {
  const { data } = await api.get(`/api/sm-tracing/trace/${traceId}/status`);

  return data;
};

export const getTraceResult = async (
  mediaId: string,
  traceId: string
): Promise<TraceResultResponse> => {
  const { data } = await api.get(
    `/api/sm-tracing/media/${mediaId}/trace/${traceId}`
  );

  return data;
};

export const getDistributionGraph = async (
  traceId: string
): Promise<DistributionGraphResponse> => {
  const { data } = await api.get(
    `/api/sm-tracing/trace/${traceId}/distribution`
  );

  return data;
};

export const getTimeline = async (
  traceId: string
): Promise<TimelineResponse> => {
  const { data } = await api.get(`/api/sm-tracing/trace/${traceId}/timeline`);

  return data;
};

export const listMediaTraces = async (
  mediaId: string
): Promise<ListTracesResponse> => {
  const { data } = await api.get(`/api/sm-tracing/media/${mediaId}/traces`);

  return data;
};

export const listUserTraces = async (): Promise<ListTracesResponse> => {
  const { data } = await api.get('/api/user/traces');

  return data;
};
