export type BillingCycle = "monthly" | "yearly";

export type PlanType = "FREE" | "PRO";

export type CreateRazorpayOrderPayload = {
  plan: Exclude<PlanType, "FREE">;
  billingCycle: BillingCycle;
};

export type CreateRazorpayOrderResponse = {
  success: boolean;
  message: string;

  order: {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
  };

  razorpay: {
    keyId: string;
    name: string;
    description: string;
    image?: string;
  };

  plan: {
    name: PlanType;
    billingCycle: BillingCycle;
    amount: number;
  };

  user?: {
    name?: string;
    email?: string;
    contact?: string;
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

  subscription?: {
    id: string;
    userId: string;
    plan: PlanType;
    billingCycle: BillingCycle;
    status: "ACTIVE" | "EXPIRED" | "CANCELLED";
    startedAt: string;
    expiresAt: string;
  };
};

export type GetCurrentPlanResponse = {
  success: boolean;
  plan: {
    name: PlanType;
    billingCycle?: BillingCycle;
    status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "FREE";
    startedAt?: string;
    expiresAt?: string;
  };
};

export type RazorpayCheckoutSuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RazorpayCheckoutFailureResponse = {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
};