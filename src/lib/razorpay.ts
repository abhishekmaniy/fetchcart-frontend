import type {
  RazorpayCheckoutFailureResponse,
  RazorpayCheckoutSuccessResponse,
} from "@/types/payment.types";

const RAZORPAY_CHECKOUT_SCRIPT =
  "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise: Promise<boolean> | null = null;

export type OpenRazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  orderId: string;

  image?: string;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  notes?: Record<string, string>;

  theme?: {
    color?: string;
  };

  onSuccess: (response: RazorpayCheckoutSuccessResponse) => void;
  onFailure?: (response: RazorpayCheckoutFailureResponse) => void;
  onDismiss?: () => void;
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayCheckoutFailureResponse) => void
  ) => void;
};

type RazorpayConstructor = new (
  options: Record<string, unknown>
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_CHECKOUT_SCRIPT}"]`
    );

    if (existingScript) {
      existingScript.onload = () => resolve(true);
      existingScript.onerror = () => resolve(false);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_SCRIPT;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

export const openRazorpayCheckout = async ({
  key,
  amount,
  currency,
  name,
  description,
  orderId,
  image,
  prefill,
  notes,
  theme,
  onSuccess,
  onFailure,
  onDismiss,
}: OpenRazorpayCheckoutOptions) => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || !window.Razorpay) {
    throw new Error("Razorpay checkout failed to load.");
  }

  const razorpay = new window.Razorpay({
    key,
    amount,
    currency,
    name,
    description,
    image,
    order_id: orderId,

    prefill: {
      name: prefill?.name || "",
      email: prefill?.email || "",
      contact: prefill?.contact || "",
    },

    notes,

    theme: {
      color: theme?.color || "#111827",
    },

    modal: {
      ondismiss: () => {
        onDismiss?.();
      },
    },

    handler: (response: RazorpayCheckoutSuccessResponse) => {
      onSuccess(response);
    },
  });

  razorpay.on("payment.failed", (response) => {
    onFailure?.(response);
  });

  razorpay.open();
};