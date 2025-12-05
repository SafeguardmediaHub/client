import type {
  LoginResponse,
  RegisterResponse,
  ResendEmailVerificationResponse,
  verifyEmailSuccessResponse,
} from "@/hooks/useAuth";
import api from "../api";

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data } = await api.post("/api/auth/login", {
    email,
    password,
    rememberMe: true,
  });

  return data as LoginResponse;
};

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<RegisterResponse> => {
  const { data } = await api.post("/api/auth/register", {
    email,
    password,
    firstName,
    lastName,
    agreedToTerms: true,
  });

  return data as RegisterResponse;
};

export const logout = async () => {
  await api.post("/api/auth/logout", {});
  return true;
};

export const refreshToken = async () => {
  const { data } = await api.post(
    "/api/auth/refresh",
    {},
    { withCredentials: true },
  );
  return data;
};

export const verifyEmail = async (
  token: string,
): Promise<verifyEmailSuccessResponse> => {
  const response = await api.post(
    "/api/auth/verify-email",
    {
      token,
    },
    { headers: { "Content-Type": "application/json" } },
  );

  return response.data as verifyEmailSuccessResponse;
};

export const requestVerificationEmail = async (
  email: string,
): Promise<ResendEmailVerificationResponse> => {
  const response = await api.post(
    "/api/auth/resend-verification",
    { email },
    { headers: { "Content-Type": "application/json" } },
  );

  return response.data as ResendEmailVerificationResponse;
};

export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(
    "/api/auth/forgot-password",
    { email },
    { headers: { "Content-Type": "application/json" } },
  );

  return response.data;
};

export const resetPassword = async (token: string, password: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(
    "/api/auth/reset-password",
    { token, password },
    { headers: { "Content-Type": "application/json" } },
  );

  return response.data;
};
