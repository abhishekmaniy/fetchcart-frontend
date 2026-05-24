import { api } from "@/lib/api";

import type {
  CreateRazorpayOrderPayload,
  CreateRazorpayOrderResponse,
  GetCurrentPlanResponse,
  VerifyRazorpayPaymentPayload,
  VerifyRazorpayPaymentResponse,
} from "@/types/payment.types";

export const createRazorpayOrder = async (
  payload: CreateRazorpayOrderPayload
) => {
  const response = await api.post<CreateRazorpayOrderResponse>(
    "/payments/create-order",
    payload
  );

  return response.data;
};

export const verifyRazorpayPayment = async (
  payload: VerifyRazorpayPaymentPayload
) => {
  const response = await api.post<VerifyRazorpayPaymentResponse>(
    "/payments/verify",
    payload
  );

  return response.data;
};

export const getCurrentPlan = async () => {
  const response = await api.get<GetCurrentPlanResponse>(
    "/payments/current-plan"
  );

  return response.data;
};