import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyEmail,
  type ForgotPasswordPayload,
  type ResetPasswordPayload,
} from "@/api/auth.api";
import type {
  LoginPayload,
  ManualRegisterPayload,
} from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload: ManualRegisterPayload) => registerUser(payload),
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  });
};