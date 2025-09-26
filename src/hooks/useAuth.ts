import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { login } from '@/lib/api/auth';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: 'user' | 'admin';
  accountStatus: 'active' | 'suspended' | 'deactivated';
  emailVerfied: boolean;
  profilePicture: string | null;
  lastLoginAt: Date;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      console.log('Login data:', data);
      queryClient.setQueryData(['user'], data.user);
      toast.success('Login successful');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.message || 'Login failed');
    },
  });
};
