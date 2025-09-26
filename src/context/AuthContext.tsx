'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { type User, useLogin } from '@/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const loginMutation = useLogin();

  const login = (email: string, password: string) => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
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
    setUser(null);
    router.push('/login');

    // call backend here
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
