export type PlanName = "FREE" | "PRO";

export type CreateRazorpayOrderPayload = {
  plan: "PRO" | "MAX" ;
};

export type CreateRazorpayOrderResponse = {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    plan: "PRO";
    key: string;
  };
};

export type RazorpayCheckoutSuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayCheckoutFailureResponse = {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id?: string;
      payment_id?: string;
    };
  };
};

export type VerifyRazorpayPaymentPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type VerifyRazorpayPaymentResponse = {
  success: boolean;
  message: string;
  data: {
    plan: "PRO";
    startsAt: string;
    expiresAt: string;
  };
};

export type CurrentPlanResponse = {
  success: boolean;
  data: {
    plan: PlanName;
    effectivePlan: PlanName;
    isActive: boolean;
    isExpired: boolean;
    startsAt: string | null;
    expiresAt: string | null;
  };
};