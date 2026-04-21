'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { redirectAfterLogin } from '@/lib/auth-redirect';

export default function GoogleOAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // The backend has set the session cookie.
    // We need to signal to the AuthProvider that a session exists.
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('hasSession', 'true');
      redirectAfterLogin(router);
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
        <p className="text-lg">Authenticating with Google...</p>
      </div>
    </div>
  );
}
