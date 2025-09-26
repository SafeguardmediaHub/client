'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { type User, useLogin, useLogout } from '@/hooks/useAuth';
import api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api
      .get('/api/users/me', { withCredentials: true })
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null));
  }, []);

  const router = useRouter();

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = (email: string, password: string) => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          console.log('this is user', response.data);
          setUser(response.data.user);
          toast.success('Login successful');

          router.push('/dashboard');
        },
        onError: () => {
          toast.error('Login failed');
        },
      }
    );
  };

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logout successful');
        router.push('/auth/login');
        setUser(null);
      },
      onError: () => {
        toast.error('Logout failed');
      },
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
