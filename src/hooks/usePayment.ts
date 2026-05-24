import {
  createRazorpayOrder,
  getCurrentPlan,
  verifyRazorpayPayment,
} from "@/api/payment.api";

import { openRazorpayCheckout } from "@/lib/razorpay";

import type {
  CreateRazorpayOrderPayload,
  RazorpayCheckoutFailureResponse,
  RazorpayCheckoutSuccessResponse,
  VerifyRazorpayPaymentPayload,
} from "@/types/payment.types";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const paymentQueryKeys = {
  currentPlan: ["current-plan"] as const,
};

export const useCreateRazorpayOrderMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateRazorpayOrderPayload) =>
      createRazorpayOrder(payload),
  });
};

export const useVerifyRazorpayPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyRazorpayPaymentPayload) =>
      verifyRazorpayPayment(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paymentQueryKeys.currentPlan,
      });
    },
  });
};

export const useCurrentPlanQuery = () => {
  return useQuery({
    queryKey: paymentQueryKeys.currentPlan,
    queryFn: getCurrentPlan,
  });
};

type UseRazorpayCheckoutOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onPaymentFailed?: (
    response: RazorpayCheckoutFailureResponse
  ) => void;
  onDismiss?: () => void;
};

export const useRazorpayCheckoutMutation = ({
  onSuccess,
  onError,
  onPaymentFailed,
  onDismiss,
}: UseRazorpayCheckoutOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRazorpayOrderPayload) => {
      const orderResponse = await createRazorpayOrder(payload);

      await openRazorpayCheckout({
        key: orderResponse.razorpay.keyId,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: orderResponse.razorpay.name,
        description: orderResponse.razorpay.description,
        image: orderResponse.razorpay.image,
        orderId: orderResponse.order.id,

        prefill: {
          name: orderResponse.user?.name,
          email: orderResponse.user?.email,
          contact: orderResponse.user?.contact,
        },

        notes: {
          plan: orderResponse.plan.name,
          billingCycle: orderResponse.plan.billingCycle,
        },

        theme: {
          color: "#111827",
        },

        onSuccess: async (
          razorpayResponse: RazorpayCheckoutSuccessResponse
        ) => {
          await verifyRazorpayPayment({
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_payment_id:
              razorpayResponse.razorpay_payment_id,
            razorpay_signature:
              razorpayResponse.razorpay_signature,
          });

          await queryClient.invalidateQueries({
            queryKey: paymentQueryKeys.currentPlan,
          });

          onSuccess?.();
        },

        onFailure: (failureResponse) => {
          onPaymentFailed?.(failureResponse);
        },

        onDismiss,
      });

      return orderResponse;
    },

    onError: (error) => {
      onError?.(error);
    },
  });
};