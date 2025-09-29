/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { login, logout, register } from '@/lib/api/auth';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: 'user' | 'admin';
  accountStatus:
    | 'active'
    | 'inactive'
    | 'suspended'
    | 'banned'
    | 'pending_verfication';
  emailVerfied: boolean;
  profilePicture: string | null;
  lastLoginAt: Date;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: Tokens;
  };
}

export type RegisterResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountStatus:
    | 'active'
    | 'inactive'
    | 'suspended'
    | 'banned'
    | 'pending_verfication';
  emailverfied: boolean;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (response) => {
      queryClient.setQueryData(['user'], response.data.user);
      try {
        if (typeof window !== 'undefined')
          window.localStorage?.setItem('hasSession', 'true');
      } catch {}
      toast.success('Login successful');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.message || 'Login failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
      try {
        if (typeof window !== 'undefined')
          window.localStorage?.removeItem('hasSession');
      } catch {}
      toast.success('Logout successful');
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => register(email, password, firstName, lastName),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      toast.success('Registration successful. Please verify your email.');
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      toast.error(error?.response?.data?.message || 'Registration failed');
    },
  });
};
