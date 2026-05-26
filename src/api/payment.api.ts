import { api } from "@/lib/api";

import type {
  CreateRazorpayOrderPayload,
  CreateRazorpayOrderResponse,
  CurrentPlanResponse,
  VerifyRazorpayPaymentPayload,
  VerifyRazorpayPaymentResponse,
} from "@/types/payment.types";

export const createRazorpayOrder = async (
  payload: CreateRazorpayOrderPayload
) => {
  const response = await api.post<CreateRazorpayOrderResponse>(
    "/billing/create-order",
    payload
  );

  return response.data;
};

export const verifyRazorpayPayment = async (
  payload: VerifyRazorpayPaymentPayload
) => {
  const response = await api.post<VerifyRazorpayPaymentResponse>(
    "/billing/verify-payment",
    payload
  );

  return response.data;
};

export const getCurrentPlan = async () => {
  const response = await api.get<CurrentPlanResponse>(
    "/billing/current-plan"
  );

  return response.data;
};