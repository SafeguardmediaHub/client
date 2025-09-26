import axios from 'axios';
import type { LoginResponse, RegisterResponse } from '@/hooks/useAuth';

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/login`,
    { email, password },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return data as LoginResponse;
};

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<RegisterResponse> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/register`,
    { email, password, firstName, lastName, agreedToTerms: true },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return data as RegisterResponse;
};
