import type { LoginResponse, RegisterResponse } from '@/hooks/useAuth';
import api from '../api';

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await api.post('/api/auth/login', {
    email,
    password,
    rememberMe: true,
  });

  return data as LoginResponse;
};

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<RegisterResponse> => {
  const { data } = await api.post('/api/auth/register', {
    email,
    password,
    firstName,
    lastName,
    agreedToTerms: true,
  });

  return data as RegisterResponse;
};

export const logout = async () => {
  await api.post('/api/auth/logout', {});
  return true;
};

export const refreshToken = async () => {
  const { data } = await api.post(
    '/api/auth/refresh',
    {},
    { withCredentials: true }
  );
  return data;
};
