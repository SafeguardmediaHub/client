'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
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
      .get('/api/users/me')
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
          setUser(response.data.user);
          router.push('/dashboard');
        },
        onError: () => {
          // Error toast is handled by useLogin hook
        },
      }
    );
  };

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/auth/login');
        setUser(null);
      },
      onError: () => {
        // Error toast is handled by useLogout hook
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
