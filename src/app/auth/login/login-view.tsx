"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import AuthBrand from "@/components/auth/AuthBrand";
import { LoginForm } from "@/components/login-form";

export default function LoginView() {
  const searchParams = useSearchParams();
  const isAccountExistsError = useMemo(
    () => searchParams.get("error") === "account_exists",
    [searchParams],
  );

  useEffect(() => {
    if (isAccountExistsError) {
      toast.error(
        "An account with this email already exists. Please sign in with your email and password.",
      );
    }
  }, [isAccountExistsError]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <AuthBrand />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm isAccountExistsError={isAccountExistsError} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://plus.unsplash.com/premium_photo-1680608979589-e9349ed066d5?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="login img"
          fill
          priority
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
