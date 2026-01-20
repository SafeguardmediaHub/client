import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  joinWaitlist,
  type WaitlistData,
  type WaitlistResponse,
  waitlistAdminApi,
} from '@/lib/api/waitlist';
import type {
  ApproveRejectInput,
  UpdateWaitlistInput,
  WaitlistQueryParams,
} from '@/types/waitlist-admin';

export const useJoinWaitlist = () => {
  return useMutation<WaitlistResponse, Error, WaitlistData>({
    mutationFn: joinWaitlist,
    onSuccess: (data) => {
      toast.success('Welcome to the waitlist!', {
        description: data.message || "We'll notify you when V2 launches.",
      });
    },
    onError: (error) => {
      toast.error('Failed to join waitlist', {
        description: error.message || 'Please try again later.',
      });
    },
  });
};

// Admin hooks
export const useWaitlistEntries = (params?: WaitlistQueryParams) => {
  return useQuery({
    queryKey: ['waitlist', 'entries', params],
    queryFn: () => waitlistAdminApi.getAllEntries(params),
  });
};

export const useWaitlistStats = () => {
  return useQuery({
    queryKey: ['waitlist', 'stats'],
    queryFn: () => waitlistAdminApi.getStats(),
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useWaitlistEntry = (id: string) => {
  return useQuery({
    queryKey: ['waitlist', 'entry', id],
    queryFn: () => waitlistAdminApi.getEntry(id),
    enabled: !!id,
  });
};

export const useUpdateWaitlistEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWaitlistInput }) =>
      waitlistAdminApi.updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast.success('Entry updated successfully');
    },
    onError: () => {
      toast.error('Failed to update entry');
    },
  });
};

export const useApproveWaitlistEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input?: ApproveRejectInput }) =>
      waitlistAdminApi.approveEntry(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast.success('Entry approved!', {
        description: 'User will receive an email notification.',
      });
    },
    onError: () => {
      toast.error('Failed to approve entry');
    },
  });
};

export const useRejectWaitlistEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input?: ApproveRejectInput }) =>
      waitlistAdminApi.rejectEntry(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast.success('Entry rejected');
    },
    onError: () => {
      toast.error('Failed to reject entry');
    },
  });
};

export const useDeleteWaitlistEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => waitlistAdminApi.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      toast.success('Entry deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete entry');
    },
  });
};
