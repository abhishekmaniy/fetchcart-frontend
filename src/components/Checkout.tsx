import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Crown,
  Loader2,
  Shield,
  Sparkles,
  Star,
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
import { useAppAuth } from "@/hooks/useAppAuth";
import { useAppStore } from "@/store/app.store";
import { useRazorpayCheckoutMutation } from "@/hooks/usePayment";
import type { UserPlan } from "@/types/auth.types";

const SEARCH_PAGE_ROUTE = "/search";

type PaidPlan = Extract<UserPlan, "PRO" | "MAX">;

type PlanCardConfig = {
  plan: PaidPlan;
  label: string;
  badge: string;
  price: number;
  originalPrice: number;
  description: string;
  icon: typeof Zap;
  features: string[];
  highlighted?: boolean;
};

const PLAN_ORDER: Record<UserPlan, number> = {
  FREE: 0,
  PRO: 1,
  MAX: 2,
};

const MONTHLY_PLANS: PlanCardConfig[] = [
  {
    plan: "PRO",
    label: "Pro Monthly",
    badge: "Popular",
    price: 499,
    originalPrice: 799,
    description: "Best for premium AI product discovery every month.",
    icon: Zap,
    highlighted: false,
    features: [
      "Unlimited AI product searches",
      "Advanced product comparison",
      "Save liked products",
      "Smart recommendations",
      "Faster product extraction",
      "Priority access to new features",
    ],
  },
  {
    plan: "MAX",
    label: "Max Monthly",
    badge: "Best Value",
    price: 999,
    originalPrice: 1499,
    description: "For power users who want the highest limits and fastest flow.",
    icon: Crown,
    highlighted: true,
    features: [
      "Everything in Pro",
      "Highest product search limits",
      "Advanced comparison insights",
      "Priority Razorpay verification",
      "Early access to premium tools",
      "Best extraction speed and reliability",
    ],
  },
];

const getPlanLabel = (plan: UserPlan) => {
  if (plan === "MAX") return "Max Plan";
  if (plan === "PRO") return "Pro Plan";
  return "Free Plan";
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user, plan: currentPlan } = useAppAuth();
  const refreshCurrentUser = useAppStore((state) => state.refreshCurrentUser);

  const [selectedPlan, setSelectedPlan] = useState<PaidPlan>(() => {
    if (currentPlan === "PRO") return "MAX";
    return "PRO";
  });

  const selectedPlanConfig = useMemo(
    () => MONTHLY_PLANS.find((item) => item.plan === selectedPlan)!,
    [selectedPlan]
  );

  const currentPlanRank = PLAN_ORDER[currentPlan];
  const selectedPlanRank = PLAN_ORDER[selectedPlan];

  const isCurrentPlanMax = currentPlan === "MAX";

  const isSelectedPlanAlreadyActive =
    currentPlanRank >= selectedPlanRank && currentPlan !== "FREE";

  const planExpiresAt = formatDate(user?.userPlan?.expiresAt);

  const discount = Math.round(
    ((selectedPlanConfig.originalPrice - selectedPlanConfig.price) /
      selectedPlanConfig.originalPrice) *
      100
  );

  const savings = selectedPlanConfig.originalPrice - selectedPlanConfig.price;

  const razorpayCheckoutMutation = useRazorpayCheckoutMutation({
    onSuccess: async () => {
      await refreshCurrentUser();

      toast({
        title: "Plan upgraded successfully",
        description: `Your ${selectedPlanConfig.label} plan is now active.`,
      });

      navigate(SEARCH_PAGE_ROUTE);
    },

    onError: (error) => {
      console.error("RAZORPAY_CHECKOUT_ERROR", error);

      toast({
        title: "Unable to start payment",
        description:
          error instanceof Error
            ? error.message
            : "Please try again after some time.",
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

  const handleUpgrade = () => {
    if (isSelectedPlanAlreadyActive) {
      navigate(SEARCH_PAGE_ROUTE);
      return;
    }

    razorpayCheckoutMutation.mutate({
      plan: selectedPlan,
    });
  };

  const handleGoToSearch = () => {
    navigate(SEARCH_PAGE_ROUTE);
  };

  if (isCurrentPlanMax) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-6">
        <Card className="w-full max-w-xl overflow-hidden border-border/70 shadow-sm">
          <div className="h-1 bg-primary-gradient" />

          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Crown className="h-10 w-10 text-primary" />
            </div>

            <div>
              <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">
                Max Plan Active
              </Badge>

              <h1 className="text-2xl font-bold">
                You already have the highest plan
              </h1>

              <p className="mt-2 text-muted-foreground">
                Your Max monthly plan is active. You can continue using all
                premium FetchCart AI features.
              </p>
            </div>

            {planExpiresAt && (
              <div className="rounded-xl border bg-muted/40 p-4 text-sm">
                <span className="text-muted-foreground">Plan expires on: </span>
                <span className="font-medium">{planExpiresAt}</span>
              </div>
            )}

            <Button
              size="lg"
              className="w-full bg-primary-gradient text-white shadow-elegant hover:shadow-glow"
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
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div>
            <h1 className="text-2xl font-bold">
              Choose your FetchCart AI plan
            </h1>

            <p className="text-sm text-muted-foreground">
              Current plan:{" "}
              <span className="font-medium text-foreground">
                {getPlanLabel(currentPlan)}
              </span>
            </p>
          </div>
        </div>

        {currentPlan !== "FREE" && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Check className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Your {getPlanLabel(currentPlan)} is active
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {planExpiresAt
                      ? `Your plan expires on ${planExpiresAt}.`
                      : "Your current plan is active."}
                  </p>
                </div>
              </div>

              <Button variant="outline" onClick={handleGoToSearch}>
                Go to Search
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {MONTHLY_PLANS.map((planItem) => {
                const Icon = planItem.icon;
                const isSelected = selectedPlan === planItem.plan;
                const planRank = PLAN_ORDER[planItem.plan];

                const isAlreadyIncluded =
                  currentPlanRank >= planRank && currentPlan !== "FREE";

                const itemDiscount = Math.round(
                  ((planItem.originalPrice - planItem.price) /
                    planItem.originalPrice) *
                    100
                );

                return (
                  <button
                    key={planItem.plan}
                    type="button"
                    onClick={() => setSelectedPlan(planItem.plan)}
                    disabled={isAlreadyIncluded}
                    className={`group relative rounded-3xl border bg-card p-1 text-left transition-all ${
                      isSelected
                        ? "border-primary shadow-glow"
                        : "border-border/70 shadow-sm hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
                    } ${
                      isAlreadyIncluded
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer"
                    }`}
                  >
                    {planItem.highlighted && (
                      <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                        <Badge className="bg-primary-gradient text-white shadow-elegant">
                          Recommended
                        </Badge>
                      </div>
                    )}

                    <div className="rounded-[20px] bg-background p-5">
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                          <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>

                            <Badge variant="secondary">
                              {isAlreadyIncluded
                                ? "Current"
                                : planItem.badge}
                            </Badge>
                          </div>

                          <h2 className="text-xl font-bold">
                            {planItem.label}
                          </h2>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {planItem.description}
                          </p>
                        </div>

                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </div>

                      <div className="mb-5">
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold">
                            ₹{planItem.price.toLocaleString("en-IN")}
                          </span>

                          <span className="mb-1 text-sm text-muted-foreground line-through">
                            ₹{planItem.originalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
                            Save {itemDiscount}%
                          </Badge>

                          <span className="text-sm text-muted-foreground">
                            / month
                          </span>
                        </div>
                      </div>

                      <Separator className="mb-5" />

                      <div className="space-y-3">
                        {planItem.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-3">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            </div>

                            <span className="text-sm font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6 border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Payment Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Selected Plan
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        {selectedPlanConfig.label}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {selectedPlanConfig.description}
                      </p>
                    </div>

                    {selectedPlan === "MAX" ? (
                      <Crown className="h-6 w-6 text-primary" />
                    ) : (
                      <Zap className="h-6 w-6 text-primary" />
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Plan</span>
                    <span className="font-medium">{currentPlan}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Plan</span>
                    <span className="font-medium">{selectedPlan}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing</span>
                    <span className="font-medium">Monthly</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Original Price
                    </span>
                    <span className="line-through">
                      ₹{selectedPlanConfig.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>-₹{savings.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>{discount}%</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      ₹{selectedPlanConfig.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary-gradient text-white shadow-elegant hover:shadow-glow"
                  onClick={handleUpgrade}
                  disabled={
                    razorpayCheckoutMutation.isPending ||
                    isSelectedPlanAlreadyActive
                  }
                >
                  {razorpayCheckoutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opening Checkout...
                    </>
                  ) : isSelectedPlanAlreadyActive ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Already Active
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Razorpay
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoToSearch}
                >
                  Continue with {getPlanLabel(currentPlan)}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Your monthly plan will activate only after successful payment
                  verification.
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