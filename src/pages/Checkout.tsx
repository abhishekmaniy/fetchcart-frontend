import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";
import {
  useCurrentPlanQuery,
  useRazorpayCheckoutMutation,
} from "@/hooks/usePayment";

const SEARCH_PAGE_ROUTE = "/search";

const MONTHLY_PLAN = {
  label: "Monthly",
  price: 499,
  originalPrice: 799,
  description: "Best for unlocking Pro features every month",
};

const proFeatures = [
  "Unlimited AI product searches",
  "Advanced product comparison",
  "Save liked products",
  "Smart recommendations",
  "Faster product extraction",
  "Priority access to new features",
];

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: currentPlanData,
    isLoading: isCurrentPlanLoading,
    isError: isCurrentPlanError,
    refetch: refetchCurrentPlan,
  } = useCurrentPlanQuery();

  const razorpayCheckoutMutation = useRazorpayCheckoutMutation({
    onSuccess: async () => {
      await refetchCurrentPlan();

      toast({
        title: "Plan upgraded successfully",
        description: "Your Pro monthly plan is now active.",
      });
    },

    onError: () => {
      toast({
        title: "Unable to start payment",
        description: "Please try again after some time.",
        variant: "destructive",
      });
    },

    onPaymentFailed: (response) => {
      toast({
        title: "Payment failed",
        description:
          response.error.description ||
          "Your payment could not be completed.",
        variant: "destructive",
      });
    },

    onDismiss: () => {
      toast({
        title: "Payment cancelled",
        description: "You closed the payment window.",
      });
    },
  });

  const discount = Math.round(
    ((MONTHLY_PLAN.originalPrice - MONTHLY_PLAN.price) /
      MONTHLY_PLAN.originalPrice) *
      100
  );

  const currentPlan = currentPlanData?.plan;

  const hasActivePaidPlan =
    currentPlan?.name === "PRO" &&
    currentPlan?.status === "ACTIVE";

  const handleUpgrade = () => {
    razorpayCheckoutMutation.mutate({
      plan: "PRO",
      billingCycle: "monthly",
    });
  };

  const handleGoToSearch = () => {
    navigate(SEARCH_PAGE_ROUTE);
  };

  if (isCurrentPlanLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/70 shadow-sm">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Checking your current plan
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we verify your subscription.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCurrentPlanError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/70 shadow-sm">
          <CardContent className="p-8 text-center space-y-5">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6 text-destructive" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Could not load your plan
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please retry or go back to search.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>

              <Button
                className="w-full"
                onClick={() => refetchCurrentPlan()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasActivePaidPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-6">
        <Card className="w-full max-w-xl border-border/70 shadow-sm overflow-hidden">
          <CardContent className="p-8 text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <Badge className="mb-3" variant="secondary">
                Pro Plan Active
              </Badge>

              <h1 className="text-2xl font-bold">
                You already have an active plan
              </h1>

              <p className="text-muted-foreground mt-2">
                Your monthly Pro plan is active. You can continue using
                premium search features.
              </p>
            </div>

            {currentPlan?.expiresAt && (
              <div className="rounded-xl border bg-muted/40 p-4 text-sm">
                <span className="text-muted-foreground">
                  Plan expires on:{" "}
                </span>
                <span className="font-medium">
                  {new Date(currentPlan.expiresAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleGoToSearch}
            >
              Go to Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div>
            <h1 className="text-2xl font-bold">
              Upgrade to FetchCart Pro
            </h1>
            <p className="text-sm text-muted-foreground">
              Unlock premium product discovery and comparison features.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Pro Monthly Plan
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Continue with secure Razorpay checkout and unlock
                      premium features.
                    </p>
                  </div>

                  <Badge variant="secondary">
                    Save {discount}%
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-2xl border bg-muted/30 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Monthly Plan
                      </p>

                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-4xl font-bold">
                          ₹{MONTHLY_PLAN.price.toLocaleString("en-IN")}
                        </span>

                        <span className="text-sm text-muted-foreground line-through mb-1">
                          ₹
                          {MONTHLY_PLAN.originalPrice.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <span className="text-sm text-muted-foreground mb-1">
                          / month
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">
                        {MONTHLY_PLAN.description}
                      </p>
                    </div>

                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">
                    What you will get
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {proFeatures.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 rounded-xl border bg-background p-3"
                      >
                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>

                        <span className="text-sm font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/60 dark:bg-green-950/10 dark:border-green-900/40">
              <CardContent className="p-5 flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />

                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-400">
                    Secure payment
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                    Payment is processed securely by Razorpay. Your
                    payment will be verified by our backend before your
                    plan is activated.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/70 shadow-sm sticky top-6">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Plan
                    </span>
                    <span className="font-medium">Pro</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Billing
                    </span>
                    <span className="font-medium">Monthly</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Original Price
                    </span>
                    <span className="line-through">
                      ₹
                      {MONTHLY_PLAN.originalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>
                      -₹
                      {(
                        MONTHLY_PLAN.originalPrice - MONTHLY_PLAN.price
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      ₹{MONTHLY_PLAN.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleUpgrade}
                  disabled={razorpayCheckoutMutation.isPending}
                >
                  {razorpayCheckoutMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Opening Checkout...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay with Razorpay
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoToSearch}
                >
                  Continue with Free Plan
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your monthly plan will activate only after successful
                  payment verification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;