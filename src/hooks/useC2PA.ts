import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getVerifications,
  getVerificationDetails,
  getVerificationSummary,
  getVerificationStats,
  verifyMedia,
  batchVerifyMedia,
  getBadges,
  getMediaBadge,
  getAdminDashboard,
  getAdminVerifications,
  clearAdminCache,
  createVerificationStream,
} from '@/lib/api/c2pa';
import type {
  VerificationsListParams,
  AdminVerificationsParams,
  VerificationStreamUpdate,
  VerifyMediaRequest,
  BatchVerifyRequest,
} from '@/types/c2pa';

// Query keys
export const c2paKeys = {
  all: ['c2pa'] as const,
  verifications: (params?: VerificationsListParams) =>
    [...c2paKeys.all, 'verifications', params] as const,
  verification: (id: string) => [...c2paKeys.all, 'verification', id] as const,
  verificationDetails: (id: string) =>
    [...c2paKeys.verification(id), 'details'] as const,
  verificationSummary: (id: string) =>
    [...c2paKeys.verification(id), 'summary'] as const,
  stats: () => [...c2paKeys.all, 'stats'] as const,
  badges: () => [...c2paKeys.all, 'badges'] as const,
  mediaBadge: (mediaId: string) =>
    [...c2paKeys.all, 'badge', mediaId] as const,
  admin: () => [...c2paKeys.all, 'admin'] as const,
  adminDashboard: () => [...c2paKeys.admin(), 'dashboard'] as const,
  adminVerifications: (params?: AdminVerificationsParams) =>
    [...c2paKeys.admin(), 'verifications', params] as const,
};

// Verification list hook
export const useVerifications = (
  params: VerificationsListParams = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: c2paKeys.verifications(params),
    queryFn: () => getVerifications(params),
    staleTime: 30000, // 30 seconds
    ...options,
  });
};

// Verification details hook
export const useVerificationDetails = (
  verificationId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: c2paKeys.verificationDetails(verificationId),
    queryFn: () => getVerificationDetails(verificationId),
    enabled: !!verificationId && (options?.enabled ?? true),
    staleTime: 60000, // 1 minute
  });
};

// Verification summary hook
export const useVerificationSummary = (
  verificationId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: c2paKeys.verificationSummary(verificationId),
    queryFn: () => getVerificationSummary(verificationId),
    enabled: !!verificationId && (options?.enabled ?? true),
    staleTime: 60000,
  });
};

// Stats hook
export const useVerificationStats = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: c2paKeys.stats(),
    queryFn: getVerificationStats,
    staleTime: 60000,
    refetchInterval: 60000, // Refresh every minute
    ...options,
  });
};

// Verify media mutation
export const useVerifyMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: VerifyMediaRequest) => verifyMedia(request),
    onSuccess: () => {
      // Invalidate verifications list and stats
      queryClient.invalidateQueries({ queryKey: c2paKeys.verifications() });
      queryClient.invalidateQueries({ queryKey: c2paKeys.stats() });
    },
  });
};

// Batch verify mutation
export const useBatchVerifyMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BatchVerifyRequest) => batchVerifyMedia(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: c2paKeys.verifications() });
      queryClient.invalidateQueries({ queryKey: c2paKeys.stats() });
    },
  });
};

// SSE Stream hook for real-time verification updates
export const useVerificationStream = (
  verificationId: string,
  options?: {
    enabled?: boolean;
    onUpdate?: (update: VerificationStreamUpdate) => void;
    onComplete?: () => void;
    onError?: (error: Event) => void;
  }
) => {
  const [updates, setUpdates] = useState<VerificationStreamUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    if (!verificationId || eventSourceRef.current) return;

    const eventSource = createVerificationStream(
      verificationId,
      (event) => {
        try {
          const update = JSON.parse(event.data) as VerificationStreamUpdate;
          setUpdates((prev) => [...prev, update]);
          options?.onUpdate?.(update);

          if (update.status === 'completed' || update.status === 'error') {
            // Invalidate queries to refetch fresh data
            queryClient.invalidateQueries({
              queryKey: c2paKeys.verificationDetails(verificationId),
            });
            queryClient.invalidateQueries({ queryKey: c2paKeys.stats() });
            options?.onComplete?.();
            eventSource.close();
            eventSourceRef.current = null;
            setIsConnected(false);
          }
        } catch (e) {
          console.error('Failed to parse SSE message:', e);
        }
      },
      (err) => {
        setError(new Error('Stream connection failed'));
        options?.onError?.(err);
        setIsConnected(false);
      }
    );

    eventSourceRef.current = eventSource;
    setIsConnected(true);
  }, [verificationId, queryClient, options]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (options?.enabled !== false && verificationId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [verificationId, options?.enabled, connect, disconnect]);

  return {
    updates,
    isConnected,
    error,
    connect,
    disconnect,
    latestUpdate: updates[updates.length - 1],
  };
};

// Badges hooks
export const useBadges = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: c2paKeys.badges(),
    queryFn: getBadges,
    staleTime: 300000, // 5 minutes
    ...options,
  });
};

export const useMediaBadge = (
  mediaId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: c2paKeys.mediaBadge(mediaId),
    queryFn: () => getMediaBadge(mediaId),
    enabled: !!mediaId && (options?.enabled ?? true),
    staleTime: 60000,
  });
};

// Admin hooks
export const useAdminDashboard = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: c2paKeys.adminDashboard(),
    queryFn: getAdminDashboard,
    staleTime: 30000,
    refetchInterval: 30000,
    ...options,
  });
};

export const useAdminVerifications = (
  params: AdminVerificationsParams = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: c2paKeys.adminVerifications(params),
    queryFn: () => getAdminVerifications(params),
    staleTime: 30000,
    ...options,
  });
};

export const useClearAdminCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAdminCache,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: c2paKeys.adminDashboard() });
    },
  });
};
