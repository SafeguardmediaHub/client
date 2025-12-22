'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface ProtectedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function Protected({
  children,
  redirectTo = '/auth/login',
}: ProtectedProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname || '/');
      router.replace(`${redirectTo}?next=${next}`);
    }
  }, [isAuthenticated, loading, redirectTo, router, pathname]);

  if (loading) return null;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
