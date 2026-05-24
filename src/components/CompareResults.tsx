import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompareByIdQuery } from "@/hooks/useCompareMutations";
import type { CompareInsights } from "@/types/compare.types";
import type { Product } from "@/types/search.types";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ExternalLink,
  GitCompareArrows,
  Info,
  Loader2,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type CompareEventType =
  | "COMPARE_STARTED"
  | "COMPARE_PRODUCTS_LOADED"
  | "COMPARE_PRODUCT_EXTRACTION_STARTED"
  | "COMPARE_PRODUCT_EXTRACTED"
  | "COMPARE_PRODUCT_FAILED"
  | "COMPARE_ANALYSIS_STARTED"
  | "COMPARE_COMPLETED"
  | "COMPARE_FAILED";

type CompareSocketEvent = {
  type: CompareEventType;
  compareId: string;
  message?: string;
  total?: number;
  processed?: number;
  failed?: number;
  product?: Product;
  error?: string;
  createdAt?: string;
};

const getWebSocketUrl = () => {
  const envUrl = import.meta.env.VITE_WS_URL;

  if (envUrl) return envUrl;

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";

  return `${protocol}://${window.location.host}`;
};

function getInsightsValue(insights: unknown): CompareInsights {
  if (!insights || typeof insights !== "object" || Array.isArray(insights)) {
    return {};
  }

  return insights as CompareInsights;
}

const safeArray = (value?: string[] | null) => {
  if (!Array.isArray(value)) return [];

  return value.filter(Boolean);
};

const formatSpecValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  if (typeof value === "string") return value;

  return String(value);
};

const CompareResults = () => {
  const { compareId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [liveEvents, setLiveEvents] = useState<CompareSocketEvent[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCompareByIdQuery(compareId);

  const compare = data?.compare;
  const products = compare?.products ?? [];
  const insights = compare?.insights ?? {};

  const normalizedInsights = useMemo(
    () => getInsightsValue(insights),
    [insights],
  );

  const status = compare?.status || normalizedInsights.status || "PROCESSING";

  const shouldConnectSocket =
    Boolean(compareId) && status !== "COMPLETED" && status !== "FAILED";

  const queryKey = ["compare", "detail", compareId];

  useEffect(() => {
    if (!compareId || !shouldConnectSocket) return;

    const socket = new WebSocket(getWebSocketUrl());
    socketRef.current = socket;

    socket.onopen = () => {
      setIsSocketConnected(true);

      socket.send(
        JSON.stringify({
          type: "SUBSCRIBE_COMPARE",
          compareId,
        }),
      );
    };

    socket.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as CompareSocketEvent;

        if (!event?.type || event.compareId !== compareId) return;

        setLiveEvents((prev) => [...prev.slice(-20), event]);
      } catch (error) {
        console.error("Invalid compare socket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Compare socket error:", error);
      setIsSocketConnected(false);
    };

    socket.onclose = () => {
      setIsSocketConnected(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "UNSUBSCRIBE_COMPARE",
            compareId,
          }),
        );
      }

      socket.close();
      socketRef.current = null;
    };
  }, [compareId, shouldConnectSocket]);

  useEffect(() => {
    if (!compareId || liveEvents.length === 0) return;

    const latestEvent = liveEvents[liveEvents.length - 1];

    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.compare) return oldData;

      const currentCompare = oldData.compare;
      const currentInsights = getInsightsValue(currentCompare.insights);
      const currentProducts = currentCompare.products ?? [];

      if (latestEvent.type === "COMPARE_STARTED") {
        return {
          ...oldData,
          compare: {
            ...currentCompare,
            insights: {
              ...currentInsights,
              status: "PROCESSING",
              errorMessage: null,
            },
          },
        };
      }

      if (latestEvent.type === "COMPARE_PRODUCTS_LOADED") {
        return {
          ...oldData,
          compare: {
            ...currentCompare,
            insights: {
              ...currentInsights,
              status: "PROCESSING",
              totalProducts: latestEvent.total,
              processedProducts: latestEvent.processed,
              failedProducts: latestEvent.failed,
            },
          },
        };
      }

      if (latestEvent.type === "COMPARE_PRODUCT_EXTRACTED") {
        const incomingProduct = latestEvent.product;

        const productAlreadyExists = incomingProduct
          ? currentProducts.some(
              (product: Product) => product.id === incomingProduct.id,
            )
          : true;

        const nextProducts =
          incomingProduct && !productAlreadyExists
            ? [...currentProducts, incomingProduct]
            : currentProducts;

        return {
          ...oldData,
          compare: {
            ...currentCompare,
            products: nextProducts,
            insights: {
              ...currentInsights,
              status: "PROCESSING",
              totalProducts: latestEvent.total,
              processedProducts: latestEvent.processed,
              failedProducts: latestEvent.failed,
            },
          },
        };
      }

      if (latestEvent.type === "COMPARE_PRODUCT_FAILED") {
        return {
          ...oldData,
          compare: {
            ...currentCompare,
            insights: {
              ...currentInsights,
              status: "PROCESSING",
              totalProducts: latestEvent.total,
              processedProducts: latestEvent.processed,
              failedProducts: latestEvent.failed,
              errorMessage: latestEvent.error || latestEvent.message,
            },
          },
        };
      }

      if (latestEvent.type === "COMPARE_ANALYSIS_STARTED") {
        return {
          ...oldData,
          compare: {
            ...currentCompare,
            insights: {
              ...currentInsights,
              status: "PROCESSING",
              totalProducts: latestEvent.total,
              processedProducts: latestEvent.processed,
              failedProducts: latestEvent.failed,
            },
          },
        };
      }

      if (latestEvent.type === "COMPARE_FAILED") {
        return {
          ...oldData,
          compare: {
            ...currentCompare,
            insights: {
              ...currentInsights,
              status: "FAILED",
              errorMessage: latestEvent.error || latestEvent.message,
            },
          },
        };
      }

      return oldData;
    });

    if (
      latestEvent.type === "COMPARE_COMPLETED" ||
      latestEvent.type === "COMPARE_FAILED"
    ) {
      queryClient.invalidateQueries({
        queryKey,
      });
    }
  }, [liveEvents, compareId, queryClient]);

  const totalProducts =
    Number(
      compare?.totalProducts ||
        normalizedInsights.totalProducts ||
        products.length,
    ) || products.length;

  const processedProducts =
    Number(
      compare?.processedProducts ||
        normalizedInsights.processedProducts ||
        products.length,
    ) || products.length;

  const failedProducts =
    Number(compare?.failedProducts || normalizedInsights.failedProducts || 0) ||
    0;

  const progressPercentage =
    totalProducts > 0
      ? Math.min(Math.round((processedProducts / totalProducts) * 100), 100)
      : 0;

  const statusText = useMemo(() => {
    if (isLoading) return "Loading comparison...";

    if (isError) {
      return error instanceof Error
        ? error.message
        : "Something went wrong while loading comparison.";
    }

    if (status === "COMPLETED") {
      return "Comparison completed successfully.";
    }

    if (status === "FAILED") {
      return (
        compare?.errorMessage ||
        normalizedInsights.errorMessage ||
        "Comparison failed."
      );
    }

    const latestEvent = liveEvents[liveEvents.length - 1];

    if (latestEvent?.message) return latestEvent.message;

    if (totalProducts > 0) {
      return `${processedProducts}/${totalProducts} products processed.`;
    }

    return "Preparing product comparison...";
  }, [
    isLoading,
    isError,
    error,
    status,
    compare,
    normalizedInsights,
    liveEvents,
    processedProducts,
    totalProducts,
  ]);

  const winner = normalizedInsights.winner;
  const bestFor = Array.isArray(normalizedInsights.bestFor)
    ? normalizedInsights.bestFor
    : [];
  const comparisonTable = Array.isArray(normalizedInsights.comparisonTable)
    ? normalizedInsights.comparisonTable
    : [];

  if (isLoading) {
    return (
      <section className="min-h-full space-y-5 pb-8 sm:space-y-6 sm:pb-12">
        <CompareHeader
          title="Product Comparison"
          subtitle="Loading comparison..."
          isConnected={false}
          status="LOADING"
          onBack={() => navigate(-1)}
          onRefresh={() => refetch()}
          isRefreshing={false}
        />

        <CompareSkeleton />
      </section>
    );
  }

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading comparison.";

    return (
      <section className="min-h-full space-y-5 pb-8 sm:space-y-6 sm:pb-12">
        <CompareHeader
          title="Product Comparison"
          subtitle={message}
          isConnected={false}
          status="FAILED"
          onBack={() => navigate(-1)}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-500 shadow-soft sm:p-8">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-semibold">Failed to load comparison</h3>
              <p className="mt-1 text-sm opacity-80">{message}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 min-h-full pb-8 sm:pb-12">
      <div className="space-y-5 sm:space-y-6">
        <CompareHeader
          title={compare?.title || "Product Comparison"}
          subtitle={statusText}
          isConnected={isSocketConnected}
          status={status}
          onBack={() => navigate(-1)}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />

        {status !== "COMPLETED" && status !== "FAILED" && (
          <ProgressPanel
            total={totalProducts}
            processed={processedProducts}
            failed={failedProducts}
            percentage={progressPercentage}
          />
        )}

        {status === "FAILED" && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-500 shadow-soft sm:p-6">
            {compare?.errorMessage ||
              normalizedInsights.errorMessage ||
              "Comparison failed. Please try again."}
          </div>
        )}

        {compare?.summary && (
          <SummaryPanel
            summary={compare.summary}
            recommendation={String(normalizedInsights.recommendation || "")}
            winner={winner}
          />
        )}

        {products.length > 0 ? (
          <ProductSideBySide products={products} winner={winner} />
        ) : (
          <CompareProductLoadingGrid total={Math.max(totalProducts, 2)} />
        )}

        {products.length > 0 && <ProsConsPanel products={products} />}

        {products.length > 0 && <ProductSpecsPanel products={products} />}

        {products.length > 0 && <FeatureBulletsPanel products={products} />}

        {bestFor.length > 0 && <BestForPanel items={bestFor} />}

        {comparisonTable.length > 0 && (
          <ComparisonTablePanel
            products={products}
            comparisonTable={comparisonTable}
          />
        )}

        <InsightsPanel insights={normalizedInsights} />

        {liveEvents.length > 0 && status !== "COMPLETED" && (
          <LiveEventsPanel events={liveEvents} />
        )}
      </div>
    </section>
  );
};

const CompareHeader = ({
  title,
  subtitle,
  isConnected,
  status,
  onBack,
  onRefresh,
  isRefreshing,
}: {
  title: string;
  subtitle: string;
  isConnected: boolean;
  status?: string;
  onBack: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}) => {
  return (
    <div className="glass relative z-20 overflow-hidden rounded-3xl border border-border/70 p-4 shadow-soft sm:p-5">
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="min-w-0">
            <div className="mb-2 inline-flex max-w-full items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-primary">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">AI comparison</span>
            </div>

            <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              <span className="text-gradient italic">{title}</span>
            </h1>

            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status && (
            <Badge
              variant="secondary"
              className="rounded-full border border-border/70 bg-card/70 px-3 py-1"
            >
              {status}
            </Badge>
          )}

          {isConnected && (
            <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-500">
              Live
            </Badge>
          )}

          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-xl border-border/70 bg-card/70"
          >
            {isRefreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProgressPanel = ({
  total,
  processed,
  failed,
  percentage,
}: {
  total: number;
  processed: number;
  failed: number;
  percentage: number;
}) => {
  return (
    <div className="glass rounded-3xl border border-border/70 p-4 shadow-soft sm:p-5">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground sm:text-sm">
        <span>
          Progress: {processed}/{total || "?"}
        </span>
        <span>{percentage}%</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary-gradient shadow-glow transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {failed > 0 && (
        <p className="mt-3 text-xs text-red-500">
          {failed} product{failed > 1 ? "s" : ""} failed while processing.
        </p>
      )}
    </div>
  );
};

const SummaryPanel = ({
  summary,
  recommendation,
  winner,
}: {
  summary: string;
  recommendation?: string;
  winner?: any;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]"
    >
      <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold sm:text-xl">AI Summary</h2>
            <p className="text-sm text-muted-foreground">
              A practical overview generated from product data.
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          {summary}
        </p>

        {recommendation && (
          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/10 p-4">
            <h3 className="mb-1 text-sm font-semibold text-primary">
              Recommendation
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {recommendation}
            </p>
          </div>
        )}
      </div>

      <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Trophy className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold sm:text-xl">Winner</h2>
            <p className="text-sm text-muted-foreground">Best overall pick.</p>
          </div>
        </div>

        {winner?.productName ? (
          <div>
            <h3 className="font-semibold text-primary">
              {winner.productName}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {winner.reason || "Best overall option based on available data."}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Winner will appear when comparison is completed.
          </p>
        )}
      </div>
    </motion.div>
  );
};

const ProductSideBySide = ({
  products,
  winner,
}: {
  products: Product[];
  winner?: any;
}) => {
  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
      {products.map((product, index) => {
        const isWinner =
          winner?.productName &&
          product.productName &&
          winner.productName
            .toLowerCase()
            .includes(product.productName.toLowerCase().slice(0, 20));

        return (
          <motion.article
            key={product.id || index}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.06,
              duration: 0.45,
              type: "spring",
            }}
            className={`relative overflow-hidden rounded-3xl border p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant sm:p-5 ${
              isWinner
                ? "border-primary/50 bg-primary/10"
                : "glass border-border/70"
            }`}
          >
            <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />

            {isWinner && (
              <div className="absolute right-4 top-4 z-10 rounded-full bg-primary-gradient px-3 py-1 text-xs font-semibold text-white shadow-glow">
                Winner
              </div>
            )}

            <div className="relative grid gap-4 sm:grid-cols-[150px_1fr] lg:grid-cols-[180px_1fr]">
              <div className="aspect-square overflow-hidden rounded-2xl border border-border/70 bg-card/70">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.productName || "Product"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap gap-2">
                  {product.brand && (
                    <Badge variant="secondary" className="rounded-full">
                      {product.brand}
                    </Badge>
                  )}

                  {product.category && (
                    <Badge variant="outline" className="rounded-full">
                      {product.category}
                    </Badge>
                  )}

                  {product.model && (
                    <Badge variant="outline" className="rounded-full">
                      {product.model}
                    </Badge>
                  )}
                </div>

                <h3 className="line-clamp-3 text-base font-semibold leading-tight sm:text-lg">
                  {product.productName || "Unnamed Product"}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {product.rating && (
                    <span className="inline-flex items-center rounded-full bg-accent/70 px-2.5 py-1">
                      <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
                      {product.rating}
                    </span>
                  )}

                  {product.reviews && <span>{product.reviews} reviews</span>}

                  {product.store && <span>Sold by {product.store}</span>}

                  {product.asin && <span>ASIN: {product.asin}</span>}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {product.price ? (
                    <span className="text-xl font-bold text-primary sm:text-2xl">
                      {product.price}
                    </span>
                  ) : (
                    <span className="text-sm italic text-muted-foreground">
                      Price not available
                    </span>
                  )}

                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                  )}

                  {product.savings && (
                    <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                      Save {product.savings}
                    </Badge>
                  )}
                </div>

                {product.description && (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {product.description}
                  </p>
                )}

                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                  <Button
                    className="rounded-xl bg-primary-gradient text-white shadow-soft hover:shadow-glow"
                    disabled={!product.productUrl}
                    onClick={() =>
                      product.productUrl &&
                      window.open(product.productUrl, "_blank")
                    }
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>

                  {product.productUrl && (
                    <Button
                      variant="outline"
                      className="rounded-xl border-border/70 bg-card/70"
                      onClick={() => window.open(product.productUrl, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};

const ProsConsPanel = ({ products }: { products: Product[] }) => {
  const hasProsCons = products.some(
    (product) =>
      safeArray(product.pros).length > 0 || safeArray(product.cons).length > 0,
  );

  if (!hasProsCons) return null;

  return (
    <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft sm:p-6">
      <PanelHeading
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Pros & Cons"
        subtitle="Strengths and limitations extracted from product data."
        gradient
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {products.map((product, index) => {
          const pros = safeArray(product.pros);
          const cons = safeArray(product.cons);

          return (
            <div
              key={product.id || index}
              className="rounded-2xl border border-border/70 bg-card/60 p-4"
            >
              <h3 className="line-clamp-2 font-semibold">
                {product.productName || `Product ${index + 1}`}
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                    Pros
                  </div>

                  {pros.length > 0 ? (
                    <ul className="space-y-2">
                      {pros.slice(0, 6).map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex gap-2 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No pros available.
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-500">
                    <XCircle className="h-4 w-4" />
                    Cons
                  </div>

                  {cons.length > 0 ? (
                    <ul className="space-y-2">
                      {cons.slice(0, 6).map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex gap-2 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No cons available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProductSpecsPanel = ({ products }: { products: Product[] }) => {
  const commonSpecKeys = Array.from(
    new Set(
      products.flatMap((product) =>
        Object.keys(product.productInfo || {}).filter(Boolean),
      ),
    ),
  ).slice(0, 14);

  if (commonSpecKeys.length === 0) return null;

  return (
    <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft sm:p-6">
      <PanelHeading
        icon={<Info className="h-5 w-5" />}
        title="Product Specifications"
        subtitle="Important fields stored in your product database."
      />

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border/70">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-card/70">
            <tr>
              <th className="w-52 px-4 py-3 text-left font-semibold">
                Field
              </th>

              {products.map((product, index) => (
                <th
                  key={product.id || index}
                  className="px-4 py-3 text-left font-semibold"
                >
                  <span className="line-clamp-2">
                    {product.productName || `Product ${index + 1}`}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <SpecRow
              label="Brand"
              products={products}
              getValue={(product) => product.brand}
            />
            <SpecRow
              label="Model"
              products={products}
              getValue={(product) => product.model}
            />
            <SpecRow
              label="Category"
              products={products}
              getValue={(product) => product.category}
            />
            <SpecRow
              label="Store"
              products={products}
              getValue={(product) => product.store}
            />
            <SpecRow
              label="ASIN"
              products={products}
              getValue={(product) => product.asin}
            />
            <SpecRow
              label="Rating"
              products={products}
              getValue={(product) => product.rating}
            />
            <SpecRow
              label="Reviews"
              products={products}
              getValue={(product) => product.reviews}
            />
            <SpecRow
              label="Price"
              products={products}
              getValue={(product) => product.price}
            />
            <SpecRow
              label="Original Price"
              products={products}
              getValue={(product) => product.originalPrice}
            />
            <SpecRow
              label="Savings"
              products={products}
              getValue={(product) => product.savings}
            />

            {commonSpecKeys.map((key) => (
              <SpecRow
                key={key}
                label={key}
                products={products}
                getValue={(product) => product.productInfo?.[key]}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SpecRow = ({
  label,
  products,
  getValue,
}: {
  label: string;
  products: Product[];
  getValue: (product: Product) => unknown;
}) => {
  return (
    <tr className="border-t border-border/70">
      <td className="px-4 py-3 font-medium">{label}</td>

      {products.map((product, index) => (
        <td
          key={`${label}-${product.id || index}`}
          className="px-4 py-3 text-muted-foreground"
        >
          {formatSpecValue(getValue(product))}
        </td>
      ))}
    </tr>
  );
};

const FeatureBulletsPanel = ({ products }: { products: Product[] }) => {
  const hasFeatures = products.some(
    (product) => safeArray(product.featureBullets).length > 0,
  );

  if (!hasFeatures) return null;

  return (
    <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft sm:p-6">
      <PanelHeading
        icon={<PackageCheck className="h-5 w-5" />}
        title="Key Features"
        subtitle="Feature bullets stored from the product page."
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {products.map((product, index) => {
          const features = safeArray(product.featureBullets);

          return (
            <div
              key={product.id || index}
              className="rounded-2xl border border-border/70 bg-card/60 p-4"
            >
              <h3 className="line-clamp-2 font-semibold">
                {product.productName || `Product ${index + 1}`}
              </h3>

              {features.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {features.slice(0, 6).map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex gap-2 text-sm leading-6 text-muted-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  No features available.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BestForPanel = ({
  items,
}: {
  items: {
    label?: string;
    productName?: string;
    reason?: string;
  }[];
}) => {
  return (
    <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft sm:p-6">
      <PanelHeading
        icon={<Award className="h-5 w-5" />}
        title="Best For"
        subtitle="Which product fits which use case."
      />

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="rounded-2xl border border-border/70 bg-card/60 p-4"
          >
            <Badge className="mb-3 rounded-full bg-primary-gradient text-white">
              {item.label || "Use case"}
            </Badge>

            <h3 className="font-semibold">{item.productName}</h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComparisonTablePanel = ({
  products,
  comparisonTable,
}: {
  products: Product[];
  comparisonTable: {
    feature?: string;
    values?: Record<string, string>;
  }[];
}) => {
  const productNames = products.map(
    (product) => product.productName || "Product",
  );

  return (
    <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft sm:p-6">
      <PanelHeading
        icon={<GitCompareArrows className="h-5 w-5" />}
        title="AI Comparison Table"
        subtitle="Key differences generated by AI."
        gradient
      />

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border/70">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-card/70">
            <tr>
              <th className="w-52 px-4 py-3 text-left font-semibold">
                Feature
              </th>

              {productNames.map((name, index) => (
                <th
                  key={`${name}-${index}`}
                  className="px-4 py-3 text-left font-semibold"
                >
                  <span className="line-clamp-2">{name}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {comparisonTable.map((row, index) => (
              <tr key={`${row.feature}-${index}`} className="border-t">
                <td className="px-4 py-3 font-medium">
                  {row.feature || "Feature"}
                </td>

                {productNames.map((name, productIndex) => (
                  <td
                    key={`${name}-${productIndex}`}
                    className="px-4 py-3 text-muted-foreground"
                  >
                    {row.values?.[name] || "Not available"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InsightsPanel = ({ insights }: { insights: CompareInsights }) => {
  const keyDifferences = Array.isArray(insights.keyDifferences)
    ? insights.keyDifferences
    : [];

  const reasons = Array.isArray((insights as any).reasons)
    ? ((insights as any).reasons as string[])
    : [];

  const hasInsights =
    keyDifferences.length > 0 ||
    reasons.length > 0 ||
    insights.priceVerdict ||
    insights.qualityVerdict;

  if (!hasInsights) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {insights.priceVerdict && (
        <InsightCard
          title="Price Verdict"
          value={String(insights.priceVerdict)}
          icon={<PackageCheck className="h-5 w-5" />}
        />
      )}

      {insights.qualityVerdict && (
        <InsightCard
          title="Quality Verdict"
          value={String(insights.qualityVerdict)}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      )}

      {(keyDifferences.length > 0 || reasons.length > 0) && (
        <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft lg:col-span-1">
          <h3 className="mb-3 font-semibold">Why this recommendation?</h3>

          <ul className="space-y-2 text-sm text-muted-foreground">
            {[...keyDifferences, ...reasons].slice(0, 6).map((item, index) => (
              <li key={index} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const InsightCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
};

const LiveEventsPanel = ({ events }: { events: CompareSocketEvent[] }) => {
  const latestEvents = events.slice(-5).reverse();

  return (
    <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft">
      <h3 className="mb-3 font-semibold">Live activity</h3>

      <div className="space-y-2">
        {latestEvents.map((event, index) => (
          <div
            key={`${event.type}-${index}`}
            className="flex flex-col gap-2 rounded-2xl bg-card/60 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-muted-foreground">
              {event.message || event.type}
            </span>

            <Badge variant="secondary" className="w-fit rounded-full text-[10px]">
              {event.type}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompareSkeleton = () => {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="glass rounded-3xl border border-border/70 p-4 shadow-soft sm:p-5"
          >
            <div className="grid gap-5 sm:grid-cols-[160px_1fr] lg:grid-cols-[180px_1fr]">
              <div className="aspect-square animate-pulse rounded-2xl bg-muted" />

              <div className="space-y-3">
                <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
                <div className="h-7 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-20 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl border border-border/70 p-5 shadow-soft sm:p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
};

const CompareProductLoadingGrid = ({ total }: { total: number }) => {
  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
      {Array.from({ length: Math.min(total || 2, 4) }).map((_, index) => (
        <div
          key={index}
          className="glass rounded-3xl border border-border/70 p-4 shadow-soft sm:p-5"
        >
          <div className="grid gap-5 sm:grid-cols-[160px_1fr] lg:grid-cols-[180px_1fr]">
            <div className="aspect-square animate-pulse rounded-2xl bg-muted" />

            <div className="space-y-3">
              <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
              <div className="h-7 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-20 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const PanelHeading = ({
  icon,
  title,
  subtitle,
  gradient = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient?: boolean;
}) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          gradient
            ? "bg-primary-gradient text-white shadow-glow"
            : "bg-primary/10 text-primary"
        }`}
      >
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

export default CompareResults;