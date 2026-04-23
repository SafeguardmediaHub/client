"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { redirectAfterLogin } from "@/lib/auth-redirect";

export default function GoogleOAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // The backend has set the session cookie.
    // We need to signal to the AuthProvider that a session exists.
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hasSession", "true");
      redirectAfterLogin(router);
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/SGM.svg"
          alt=""
          width={231}
          height={315}
          priority
          unoptimized
          className="h-16 w-auto object-contain"
        />
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
        <p className="text-lg">Authenticating with Google...</p>
      </div>
    </div>
  );
}
