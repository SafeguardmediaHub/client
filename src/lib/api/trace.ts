import type {
  InitiateTraceRequest,
  InitiateTraceResponse,
  ListTracesResponse,
  TraceResultResponse,
  TraceStatusResponse,
} from '@/types/trace';
import api from '../api';
import { getMockTraceResult, getMockTraceStatus } from '../mock/traceData';

// Check if mock mode is enabled
const isMockMode = () =>
  process.env.NEXT_PUBLIC_ENABLE_MOCK_TRACE === 'true';

// Store for tracking mock trace state
const mockTraceState = new Map<
  string,
  { stage: 'pending' | 'processing' | 'completed'; startTime: number }
>();

export const initiateTrace = async (
  mediaId: string,
  payload: InitiateTraceRequest
): Promise<InitiateTraceResponse> => {
  if (isMockMode()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const traceId = `mock-trace-${Date.now()}`;
    mockTraceState.set(traceId, { stage: 'pending', startTime: Date.now() });

    // Simulate progression: pending → processing after 1s → completed after 3s
    setTimeout(() => {
      const state = mockTraceState.get(traceId);
      if (state) {
        state.stage = 'processing';
      }
    }, 1000);

    setTimeout(() => {
      const state = mockTraceState.get(traceId);
      if (state) {
        state.stage = 'completed';
      }
    }, 3000);

    return {
      success: true,
      data: {
        traceId,
        mediaId,
        status: 'pending',
        message: 'Trace initiated successfully',
      },
      message: 'Trace initiated successfully',
    };
  }

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
  if (isMockMode()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const state = mockTraceState.get(traceId);
    const stage = state?.stage || 'completed';

    return getMockTraceStatus(traceId, stage);
  }

  const { data } = await api.get(`/api/sm-tracing/trace/${traceId}/status`);

  return data;
};

export const getTraceResult = async (
  mediaId: string,
  traceId: string
): Promise<TraceResultResponse> => {
  if (isMockMode()) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const state = mockTraceState.get(traceId);
    const status = state?.stage === 'completed' ? 'completed' : 'processing';

    return {
      success: true,
      data: {
        ...getMockTraceResult(mediaId, traceId),
        status,
      },
      message: 'Trace result retrieved successfully',
    };
  }

  const { data } = await api.get(
    `/api/sm-tracing/media/${mediaId}/trace/${traceId}`
  );

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
