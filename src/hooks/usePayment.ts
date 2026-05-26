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
  onSuccess?: () => void | Promise<void>;
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

      /**
       * Your backend response:
       * {
       *   success: true,
       *   message: "...",
       *   data: {
       *     paymentId: "...",
       *     razorpayOrderId: "order_xxx",
       *     amount: 49900,
       *     currency: "INR",
       *     plan: "PRO",
       *     key: "rzp_live_xxx"
       *   }
       * }
       */
      const paymentData = orderResponse.data;

      if (!paymentData?.key) {
        throw new Error("Razorpay key is missing from backend response.");
      }

      if (!paymentData?.razorpayOrderId) {
        throw new Error(
          "Razorpay order id is missing from backend response."
        );
      }

      if (!paymentData?.amount) {
        throw new Error("Payment amount is missing from backend response.");
      }

      await openRazorpayCheckout({
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "FetchCart AI",
        description: `${paymentData.plan} Monthly Subscription`,
        orderId: paymentData.razorpayOrderId,

        notes: {
          paymentId: paymentData.paymentId,
          plan: paymentData.plan,
          billingCycle: "monthly",
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

          await onSuccess?.();
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