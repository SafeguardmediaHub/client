import axios from 'axios';
import type { LoginResponse } from '@/hooks/useAuth';

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

  console.log(data);

  return data as LoginResponse;
};
