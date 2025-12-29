/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { use } from "react";
import { toast } from "sonner";
import {
  login,
  logout,
  register,
  requestVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "@/lib/api/auth";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: "user" | "admin";
  accountStatus:
    | "active"
    | "inactive"
    | "suspended"
    | "banned"
    | "pending_verfication";
  emailVerfied: boolean;
  profilePicture: string | null;
  lastLoginAt: Date;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: Tokens;
  };
}

export type RegisterResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountStatus:
    | "active"
    | "inactive"
    | "suspended"
    | "banned"
    | "pending_verfication";
  emailverfied: boolean;
};

export type verifyEmailSuccessResponse = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
      accountStatus:
        | "active"
        | "inactive"
        | "suspended"
        | "banned"
        | "pending_verfication";
    };
  };
};

export type ResendEmailVerificationResponse = {
  success: boolean;
  message: string;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (response) => {
      queryClient.setQueryData(["user"], response.data.user);
      try {
        if (typeof window !== "undefined")
          window.localStorage?.setItem("hasSession", "true");
      } catch {}
      toast.success("Login successful");
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      try {
        if (typeof window !== "undefined")
          window.localStorage?.removeItem("hasSession");
      } catch {}
      toast.success("Logout successful");
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => register(email, password, firstName, lastName),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["user"], data);
      toast.success("Registration successful! Please check your email to verify your account.");
      // Navigate to verify-email page with registered flag and email
      window.location.href = `/auth/verify-email?registered=true&email=${encodeURIComponent(variables.email)}`;
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Email verified successfully. You can now log in.");
      return data;
    },
    onError: (error: any) => {
      console.error("Email verification error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Email verification failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    },
  });
};

export const useResendVerificationEmail = () => {
  const qeryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => requestVerificationEmail(email),
    onSuccess: (data) => {
      qeryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(data.message || "Verification email sent successfully.");
      return data;
    },
    onError: (error: any) => {
      console.error("Resend verification email error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend verification email. Please try again.";
      toast.error(errorMessage);
      throw error;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: (data) => {
      toast.success(data.message || "If an account with that email exists, a password reset link has been sent");
      return data;
    },
    onError: (error: any) => {
      console.error("Forgot password error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send password reset email. Please try again.";
      toast.error(errorMessage);
      throw error;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPassword(token, password),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successful. Please login with your new password");
      return data;
    },
    onError: (error: any) => {
      console.error("Reset password error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
      throw error;
    },
  });
};
