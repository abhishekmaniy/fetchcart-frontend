import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToggleProductLikeMutation } from "@/hooks/useProductMutations";
import { useSearchByIdQuery } from "@/hooks/useSearchMutations";
import { useSearchSocket } from "@/hooks/useSearchSocket";
import type { ProductLikeFilter } from "@/api/search.api";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  GitCompare,
  Heart,
  Loader2,
  ShoppingCart,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductComparisonModal from "./ProductComparisonModal";
import ProductModel from "./SmartSearch/ProductModel";

interface SearchResultsProps {
  onNewSearch: () => void;
}

const likeFilterOptions: {
  label: string;
  value: ProductLikeFilter;
}[] = [
  { label: "All products", value: "all" },
  { label: "Liked", value: "liked" },
  { label: "Not liked", value: "not-liked" },
];

const SearchResults = ({ onNewSearch }: SearchResultsProps) => {
  const { searchId } = useParams();
  const queryClient = useQueryClient();

  const [comparisonModal, setComparisonModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [likeFilter, setLikeFilter] = useState<ProductLikeFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [likingProductId, setLikingProductId] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError, error } = useSearchByIdQuery(
    searchId,
    likeFilter,
  );

  const toggleProductLikeMutation = useToggleProductLikeMutation();

  const search = data?.search;
  const products = search?.products || [];

  const shouldConnectSocket =
    Boolean(searchId) &&
    Boolean(search) &&
    likeFilter === "all" &&
    search.status !== "COMPLETED" &&
    search.status !== "FAILED";

  const { events, isConnected } = useSearchSocket({
    searchId,
    enabled: shouldConnectSocket,
  });

  const queryKey = ["search", searchId, likeFilter];

  useEffect(() => {
    if (!searchId || events.length === 0 || likeFilter !== "all") return;

    const latestEvent = events[events.length - 1];

    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.search) return oldData;

      const currentSearch = oldData.search;
      const currentProducts = currentSearch.products || [];

      if (latestEvent.type === "PRODUCTS_FOUND") {
        return {
          ...oldData,
          search: {
            ...currentSearch,
            status: "PROCESSING",
            totalProductsFound: latestEvent.total,
          },
        };
      }

      if (latestEvent.type === "PRODUCT_SAVED") {
        const exists = currentProducts.some(
          (product: any) => product.id === latestEvent.product.id,
        );

        return {
          ...oldData,
          search: {
            ...currentSearch,
            status: "PROCESSING",
            processedProducts: latestEvent.processed,
            totalProductsFound: latestEvent.total,
            products: exists
              ? currentProducts
              : [...currentProducts, latestEvent.product],
          },
        };
      }

      if (latestEvent.type === "PRODUCT_FAILED") {
        return {
          ...oldData,
          search: {
            ...currentSearch,
            status: "PROCESSING",
            processedProducts:
              latestEvent.processed ?? currentSearch.processedProducts,
            totalProductsFound:
              latestEvent.total ?? currentSearch.totalProductsFound,
            errorMessage: latestEvent.error || latestEvent.message,
          },
        };
      }

      if (latestEvent.type === "SEARCH_COMPLETED") {
        return {
          ...oldData,
          search: {
            ...currentSearch,
            status: "COMPLETED",
            processedProducts: latestEvent.processed,
            totalProductsFound: latestEvent.total,
          },
        };
      }

      if (latestEvent.type === "SEARCH_FAILED") {
        return {
          ...oldData,
          search: {
            ...currentSearch,
            status: "FAILED",
            errorMessage: latestEvent.error || latestEvent.message,
          },
        };
      }

      return oldData;
    });

    if (
      latestEvent.type === "SEARCH_COMPLETED" ||
      latestEvent.type === "SEARCH_FAILED"
    ) {
      queryClient.invalidateQueries({
        queryKey: ["search", searchId],
      });
    }
  }, [events, searchId, queryClient, likeFilter]);

  useEffect(() => {
    if (!selectedProduct) return;

    const freshProduct = products.find(
      (product: any) => product.id === selectedProduct.id,
    );

    if (freshProduct) {
      setSelectedProduct(freshProduct);
    }
  }, [products, selectedProduct?.id]);

  const selectedLikeFilter = likeFilterOptions.find(
    (option) => option.value === likeFilter,
  );

  const totalProducts = Number(search?.totalProductsFound || 0);

  const skeletonCount = useMemo(() => {
    if (likeFilter !== "all") return 6;
    if (!totalProducts && search?.status !== "COMPLETED") return 6;
    return Math.max(totalProducts - products.length, 0);
  }, [totalProducts, products.length, search?.status, likeFilter]);

  const statusText = useMemo(() => {
    if (isLoading) return "Loading your search...";

    if (isFetching && likeFilter !== "all") {
      return `Filtering ${selectedLikeFilter?.label.toLowerCase()}...`;
    }

    if (isError) {
      return error instanceof Error
        ? error.message
        : "Something went wrong while loading search";
    }

    if (search?.status === "COMPLETED") {
      if (likeFilter === "liked") {
        return `Showing ${products.length} liked products`;
      }

      if (likeFilter === "not-liked") {
        return `Showing ${products.length} not liked products`;
      }

      return `Found ${products.length} products for "${
        search.title || search.query
      }"`;
    }

    if (search?.status === "FAILED") {
      return search.errorMessage || "Search failed";
    }

    if (totalProducts > 0) {
      return `${products.length}/${totalProducts} products loaded`;
    }

    return "Fetching your perfect products...";
  }, [
    isLoading,
    isFetching,
    likeFilter,
    selectedLikeFilter,
    isError,
    error,
    search,
    products.length,
    totalProducts,
  ]);

  const handleCardClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCompare = (product: any) => {
    setSelectedProduct(product);
    setComparisonModal(true);
  };

  const handleLikeProduct = async (product: any) => {
    if (!product?.id) return;

    const nextIsLiked = !product.isLiked;

    try {
      setLikingProductId(product.id);

      await toggleProductLikeMutation.mutateAsync(product.id);

      queryClient.setQueriesData(
        { queryKey: ["search", searchId] },
        (oldData: any) => {
          if (!oldData?.search?.products) return oldData;

          const updatedProducts = oldData.search.products.map((item: any) =>
            item.id === product.id ? { ...item, isLiked: nextIsLiked } : item,
          );

          return {
            ...oldData,
            search: {
              ...oldData.search,
              products: updatedProducts,
            },
          };
        },
      );

      setSelectedProduct((prev: any) => {
        if (!prev || prev.id !== product.id) return prev;
        return {
          ...prev,
          isLiked: nextIsLiked,
        };
      });

      await queryClient.invalidateQueries({
        queryKey: ["search", searchId],
      });
    } catch (error) {
      console.error("Toggle product like error:", error);
    } finally {
      setLikingProductId(null);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-full space-y-5 pb-8 sm:space-y-6">
        <SearchResultsHeader
          title="Search Results"
          subtitle="Loading your search..."
          onNewSearch={onNewSearch}
          isConnected={false}
          likeFilter={likeFilter}
          filterOpen={filterOpen}
          onToggleFilter={() => setFilterOpen((prev) => !prev)}
          onFilterChange={(value) => {
            setLikeFilter(value);
            setFilterOpen(false);
          }}
        />

        <ProductSkeletonGrid count={6} />
      </section>
    );
  }

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading search";

    return (
      <section className="min-h-full space-y-5 pb-8 sm:space-y-6">
        <SearchResultsHeader
          title="Search Results"
          subtitle={message}
          onNewSearch={onNewSearch}
          isConnected={false}
          likeFilter={likeFilter}
          filterOpen={filterOpen}
          onToggleFilter={() => setFilterOpen((prev) => !prev)}
          onFilterChange={(value) => {
            setLikeFilter(value);
            setFilterOpen(false);
          }}
        />

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-500 shadow-soft sm:p-6">
          {message}
        </div>
      </section>
    );
  }

  const showFilterSkeleton = isFetching && likeFilter !== "all";

  return (
    <>
      <section className="relative z-10 min-h-full overflow-visible pb-8 sm:pb-12">
        <div className="relative z-10 space-y-5 sm:space-y-6">
          <SearchResultsHeader
            title="Search Results"
            subtitle={statusText}
            onNewSearch={onNewSearch}
            isConnected={isConnected}
            likeFilter={likeFilter}
            filterOpen={filterOpen}
            onToggleFilter={() => setFilterOpen((prev) => !prev)}
            onFilterChange={(value) => {
              setLikeFilter(value);
              setFilterOpen(false);
            }}
          />

          {totalProducts > 0 &&
            products.length < totalProducts &&
            likeFilter === "all" && (
              <div className="glass rounded-3xl border border-border/70 p-4 shadow-soft sm:p-5">
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground sm:text-sm">
                  <span>
                    Progress: {products.length}/{totalProducts}
                  </span>
                  <span>
                    {Math.round((products.length / totalProducts) * 100)}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary-gradient shadow-glow transition-all"
                    style={{
                      width: `${Math.round(
                        (products.length / totalProducts) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

          {search?.status === "FAILED" && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-500 shadow-soft sm:p-6">
              {search.errorMessage || "Search failed. Please try again."}
            </div>
          )}

          {showFilterSkeleton ? (
            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
              <ProductSkeletonGrid count={6} />
            </div>
          ) : products.length === 0 ? (
            <div className="glass rounded-3xl border border-border/70 p-8 text-center shadow-soft sm:p-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                <Heart className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-semibold">No products found</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing the filter to see more products.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
              {products.map((product: any, idx: number) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + idx * 0.04,
                    duration: 0.45,
                    type: "spring",
                  }}
                  className="glass group relative cursor-pointer overflow-hidden rounded-3xl border border-border/70 p-4 transition-all hover:-translate-y-1 hover:shadow-elegant sm:p-5"
                  onClick={() => handleCardClick(product)}
                >
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

                  <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-card/70">
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.productName || "Product"}
                      className="h-full w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="relative space-y-3">
                    <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
                      {product.productName || "Unnamed Product"}
                    </h3>

                    {(product.rating || product.reviews) && (
                      <div className="flex flex-wrap items-center gap-2">
                        {product.rating && (
                          <div className="flex items-center rounded-full bg-accent/70 px-2.5 py-1 text-xs">
                            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                            <span className="ml-1 font-medium">
                              {product.rating}
                            </span>
                          </div>
                        )}

                        {product.reviews && (
                          <span className="text-xs text-muted-foreground">
                            {product.reviews} reviews
                          </span>
                        )}
                      </div>
                    )}

                    {product.price ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl font-bold text-primary sm:text-2xl">
                          {product.price}
                        </span>

                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice}
                          </span>
                        )}

                        {product.savings && (
                          <Badge
                            variant="secondary"
                            className="rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                          >
                            Save {product.savings}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm italic text-muted-foreground">
                        Price not available
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-sm text-muted-foreground">
                        Sold by {product.store || "Unknown Store"}
                      </span>

                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={likingProductId === product.id}
                        className="shrink-0 rounded-xl hover:bg-red-500/10 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeProduct(product);
                        }}
                      >
                        {likingProductId === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart
                            className={`h-4 w-4 ${
                              product.isLiked ? "fill-red-500 text-red-500" : ""
                            }`}
                          />
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-[1fr_auto]">
                      <Button
                        className="rounded-xl bg-primary-gradient text-white shadow-soft hover:shadow-glow"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            product.url || product.productUrl,
                            "_blank",
                          );
                        }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                      </Button>

                      <Button
                        className="rounded-xl border-border/70 bg-card/70 hover:bg-accent"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompare(product);
                        }}
                      >
                        <GitCompare className="mr-2 h-4 w-4" />
                        Compare
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}

              {search?.status !== "COMPLETED" && likeFilter === "all" && (
                <ProductSkeletonGrid count={skeletonCount} />
              )}
            </div>
          )}
        </div>
      </section>

      <ProductComparisonModal
        isOpen={comparisonModal}
        onClose={() => setComparisonModal(false)}
        initialProduct={selectedProduct}
        searchResults={products}
        pastSearches={[]}
      />

      <ProductModel
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
        onToggleLike={() => handleLikeProduct(selectedProduct)}
        isLikeLoading={
          Boolean(selectedProduct?.id) && likingProductId === selectedProduct.id
        }
      />
    </>
  );
};

const SearchResultsHeader = ({
  title,
  subtitle,
  onNewSearch,
  isConnected,
  likeFilter,
  filterOpen,
  onToggleFilter,
  onFilterChange,
}: {
  title: string;
  subtitle: string;
  onNewSearch: () => void;
  isConnected: boolean;
  likeFilter: ProductLikeFilter;
  filterOpen: boolean;
  onToggleFilter: () => void;
  onFilterChange: (value: ProductLikeFilter) => void;
}) => {
  const selectedFilter = likeFilterOptions.find(
    (option) => option.value === likeFilter,
  );

  return (
    <div className="glass relative z-[100] flex flex-col gap-4 overflow-visible rounded-3xl border border-border/70 p-4 shadow-soft sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewSearch}
          className="shrink-0 rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            <span className="text-gradient italic">{title}</span>
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {subtitle}
            </p>

            {isConnected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative z-[100]">
          <Button
            type="button"
            variant="outline"
            onClick={onToggleFilter}
            className="w-full justify-between rounded-xl border-border/70 bg-card/70 sm:w-40"
          >
            <span>{selectedFilter?.label || "All products"}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {filterOpen && (
            <div className="absolute right-0 top-12 z-[9999] w-full min-w-44 space-y-1.5 rounded-2xl border border-border/70 bg-background/95 p-1.5 shadow-elegant backdrop-blur-xl sm:w-44">
              {likeFilterOptions.map((option) => {
                const isActive = option.value === likeFilter;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onFilterChange(option.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-primary-gradient text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <span>{option.label}</span>

                    {option.value === "liked" && (
                      <Heart
                        className={`h-3.5 w-3.5 ${
                          isActive ? "fill-white" : ""
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Button
          onClick={onNewSearch}
          className="rounded-xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          New Search
        </Button>
      </div>
    </div>
  );
};

const ProductSkeletonGrid = ({ count }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="glass rounded-3xl border border-border/70 p-4 animate-pulse sm:p-5"
        >
          <div className="mb-4 aspect-square rounded-2xl bg-muted" />

          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-6 w-1/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SearchResults;