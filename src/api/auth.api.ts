import { api, setAccessToken } from "@/lib/api";
import type {
  AuthResponse,
  CurrentUserResponse,
  LoginPayload,
  ManualRegisterPayload,
} from "@/types/auth.types";

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type BasicApiResponse = {
  success?: boolean;
  message: string;
};

export const loginUser = async (payload: LoginPayload) => {
  const response = await api.post<AuthResponse>("/user/login", payload, {
    withCredentials: true,
    _skipAuthRefresh: true,
  } as any);

  return response.data;
};

export const registerUser = async (payload: ManualRegisterPayload) => {
  const response = await api.post<AuthResponse>("/user/register", payload, {
    _skipAuthRefresh: true,
  } as any);

  return response.data;
};

export const refreshUser = async () => {
  const response = await api.post<AuthResponse>(
    "/user/refresh",
    {},
    {
      withCredentials: true,
      _skipAuthRefresh: true,
    } as any
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<CurrentUserResponse>("/user/me");

  return response.data;
};

export const verifyEmail = async ({ token }: { token: string }) => {
  const response = await api.get<AuthResponse>(`/user/verify-email/${token}`, {
    withCredentials: true,
    _skipAuthRefresh: true,
  } as any);

  if (response.data.accessToken) {
    setAccessToken(response.data.accessToken);
  }

  return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await api.post<BasicApiResponse>(
    "/user/forgot-password",
    payload,
    {
      _skipAuthRefresh: true,
    } as any
  );

  return response.data;
};

export const resetPassword = async ({
  token,
  password,
  confirmPassword,
}: ResetPasswordPayload) => {
  const response = await api.post<BasicApiResponse>(
    `/user/reset-password/${token}`,
    {
      password,
      confirmPassword,
    },
    {
      _skipAuthRefresh: true,
    } as any
  );

  return response.data;
};