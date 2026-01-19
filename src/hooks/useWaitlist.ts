import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  joinWaitlist,
  type WaitlistData,
  type WaitlistResponse,
} from '@/lib/api/waitlist';

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
