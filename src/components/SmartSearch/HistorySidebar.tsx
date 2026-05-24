import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  GitCompareArrows,
  Loader2,
  MoreVertical,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type {
  SearchHistoryFilter,
  SearchHistoryItem,
} from "@/types/search.types";

import type {
  Compare,
  CompareHistoryFilter,
} from "@/types/compare.types";

import {
  useDeleteSearchMutation,
  useSearchHistoryQuery,
  useToggleSearchFavoriteMutation,
} from "@/hooks/useSearchMutations";

import {
  useCompareHistoryQuery,
  useDeleteCompareMutation,
  useToggleCompareFavoriteMutation,
} from "@/hooks/useCompareMutations";

interface HistorySidebarProps {
  children: React.ReactNode;
}

type ActiveTab = "searches" | "comparisons";
type HistoryFilter = SearchHistoryFilter | CompareHistoryFilter;

const filterOptions: {
  label: string;
  value: HistoryFilter;
  icon: React.ElementType;
}[] = [
  { label: "All", value: "all", icon: Clock },
  { label: "Recent", value: "recent", icon: Calendar },
  { label: "Favorites", value: "favorites", icon: Star },
];

const HistorySidebar = ({ children }: HistorySidebarProps) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("searches");
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const [searchPage, setSearchPage] = useState(1);
  const [comparePage, setComparePage] = useState(1);

  const [deletingSearchId, setDeletingSearchId] = useState<string | null>(null);
  const [favoriteUpdatingSearchId, setFavoriteUpdatingSearchId] =
    useState<string | null>(null);

  const [deletingCompareId, setDeletingCompareId] = useState<string | null>(
    null
  );
  const [favoriteUpdatingCompareId, setFavoriteUpdatingCompareId] =
    useState<string | null>(null);

  const limit = 10;

  const searchHistoryQuery = useSearchHistoryQuery({
    page: searchPage,
    limit,
    filter: filter as SearchHistoryFilter,
  });

  const compareHistoryQuery = useCompareHistoryQuery({
    page: comparePage,
    limit,
    filter: filter as CompareHistoryFilter,
  });

  const deleteSearchMutation = useDeleteSearchMutation();
  const toggleSearchFavoriteMutation = useToggleSearchFavoriteMutation();

  const deleteCompareMutation = useDeleteCompareMutation();
  const toggleCompareFavoriteMutation = useToggleCompareFavoriteMutation();

  const searches = searchHistoryQuery.data?.searches ?? [];
  const searchPagination = searchHistoryQuery.data?.pagination;

  const compares = compareHistoryQuery.data?.compares ?? [];
  const comparePagination = compareHistoryQuery.data?.pagination;

  const isSearchTab = activeTab === "searches";
  const isCompareTab = activeTab === "comparisons";

  const activeIsLoading = isSearchTab
    ? searchHistoryQuery.isLoading
    : compareHistoryQuery.isLoading;

  const activeIsFetching = isSearchTab
    ? searchHistoryQuery.isFetching
    : compareHistoryQuery.isFetching;

  const activeIsError = isSearchTab
    ? searchHistoryQuery.isError
    : compareHistoryQuery.isError;

  const activeItemsLength = isSearchTab ? searches.length : compares.length;

  const showInitialSkeleton = activeIsLoading && activeItemsLength === 0;

  const activePagination = isSearchTab ? searchPagination : comparePagination;

  const showPagination =
    Boolean(activePagination) && Number(activePagination?.total || 0) > limit;

  const selectedFilter = filterOptions.find(
    (option) => option.value === filter
  );

  const SelectedFilterIcon = selectedFilter?.icon || Clock;

  const getTimeAgo = (date?: string) => {
    if (!date) return "Unknown";

    const timestamp = new Date(date);
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleFilterChange = (value: HistoryFilter) => {
    setFilter(value);
    setSearchPage(1);
    setComparePage(1);
    setFilterOpen(false);
  };

  const handleRefresh = () => {
    if (isSearchTab) {
      searchHistoryQuery.refetch();
      return;
    }

    compareHistoryQuery.refetch();
  };

  const handleSearchClick = (item: SearchHistoryItem) => {
    setOpen(false);
    navigate(`/search/${item.id}`);
  };

  const handleCompareClick = (item: Compare) => {
    setOpen(false);
    navigate(`/compare/${item.id}`);
  };

  const toggleSearchFavorite = async (id: string) => {
    try {
      setFavoriteUpdatingSearchId(id);
      await toggleSearchFavoriteMutation.mutateAsync(id);
      await searchHistoryQuery.refetch();
    } catch (error) {
      console.error("Toggle search favorite error:", error);
    } finally {
      setFavoriteUpdatingSearchId(null);
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      setDeletingSearchId(id);
      await deleteSearchMutation.mutateAsync(id);
      await searchHistoryQuery.refetch();
    } catch (error) {
      console.error("Delete search error:", error);
    } finally {
      setDeletingSearchId(null);
    }
  };

  const toggleCompareFavorite = async (id: string) => {
    try {
      setFavoriteUpdatingCompareId(id);
      await toggleCompareFavoriteMutation.mutateAsync(id);
      await compareHistoryQuery.refetch();
    } catch (error) {
      console.error("Toggle compare favorite error:", error);
    } finally {
      setFavoriteUpdatingCompareId(null);
    }
  };

  const deleteCompare = async (id: string) => {
    try {
      setDeletingCompareId(id);
      await deleteCompareMutation.mutateAsync(id);
      await compareHistoryQuery.refetch();
    } catch (error) {
      console.error("Delete compare error:", error);
    } finally {
      setDeletingCompareId(null);
    }
  };

  const handlePrevPage = () => {
    if (!activePagination || activeIsFetching) return;

    if (isSearchTab) {
      setSearchPage((prev) => Math.max(prev - 1, 1));
      return;
    }

    setComparePage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (!activePagination || activeIsFetching) return;

    if (isSearchTab) {
      setSearchPage((prev) => prev + 1);
      return;
    }

    setComparePage((prev) => prev + 1);
  };

  const activeTotalLabel = isSearchTab ? "searches" : "comparisons";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 border-l border-border/70 bg-background/95 backdrop-blur-xl"
      >
        <div className="relative h-full overflow-hidden">
          <div className="absolute -top-28 -left-28 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-28 -right-28 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="relative flex h-full flex-col">
            <SheetHeader className="border-b border-border/70 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SheetTitle className="font-display text-3xl tracking-tight">
                    <span className="text-gradient italic">History</span>
                  </SheetTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    View your searches and product comparisons.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={activeIsFetching}
                    onClick={handleRefresh}
                    className="h-9 w-9 rounded-xl border-border/70 bg-card/70"
                    title="Refresh history"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        activeIsFetching ? "animate-spin" : ""
                      }`}
                    />
                  </Button>

                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterOpen((prev) => !prev)}
                      className="rounded-xl border-border/70 bg-card/70 gap-2"
                    >
                      <SelectedFilterIcon className="h-3.5 w-3.5" />
                      {selectedFilter?.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>

                    {filterOpen && (
                      <div className="absolute right-0 top-11 z-50 w-40 rounded-2xl glass border border-border/70 p-1.5 shadow-elegant">
                        {filterOptions.map((option) => {
                          const Icon = option.icon;
                          const isActive = filter === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleFilterChange(option.value)}
                              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                                isActive
                                  ? "bg-primary-gradient text-white"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="border-b border-border/70 p-4">
              <div className="grid grid-cols-2 rounded-2xl glass border border-border/70 p-1 shadow-soft">
                <button
                  type="button"
                  onClick={() => setActiveTab("searches")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                    activeTab === "searches"
                      ? "bg-primary-gradient text-white shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                  }`}
                >
                  <Search className="h-4 w-4" />
                  Searches
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("comparisons")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                    activeTab === "comparisons"
                      ? "bg-primary-gradient text-white shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                  }`}
                >
                  <GitCompareArrows className="h-4 w-4" />
                  Comparisons
                </button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-3 p-4">
                {showInitialSkeleton ? (
                  <HistorySkeleton />
                ) : activeIsError ? (
                  <ErrorState onRetry={handleRefresh} />
                ) : isSearchTab ? (
                  searches.length === 0 ? (
                    <EmptyState activeTab={activeTab} filter={filter} />
                  ) : (
                    <>
                      {searches.map((item) => (
                        <SearchHistoryCard
                          key={item.id}
                          item={item}
                          getTimeAgo={getTimeAgo}
                          isDeleting={deletingSearchId === item.id}
                          isFavoriteUpdating={
                            favoriteUpdatingSearchId === item.id
                          }
                          onClick={() => handleSearchClick(item)}
                          onToggleFavorite={() => toggleSearchFavorite(item.id)}
                          onDelete={() => deleteSearch(item.id)}
                        />
                      ))}

                      {activeIsFetching && !showInitialSkeleton && (
                        <UpdatingState />
                      )}
                    </>
                  )
                ) : compares.length === 0 ? (
                  <EmptyState activeTab={activeTab} filter={filter} />
                ) : (
                  <>
                    {compares.map((item) => (
                      <CompareHistoryCard
                        key={item.id}
                        item={item}
                        getTimeAgo={getTimeAgo}
                        isDeleting={deletingCompareId === item.id}
                        isFavoriteUpdating={
                          favoriteUpdatingCompareId === item.id
                        }
                        onClick={() => handleCompareClick(item)}
                        onToggleFavorite={() => toggleCompareFavorite(item.id)}
                        onDelete={() => deleteCompare(item.id)}
                      />
                    ))}

                    {activeIsFetching && !showInitialSkeleton && (
                      <UpdatingState />
                    )}
                  </>
                )}
              </div>
            </ScrollArea>

            {showPagination && activePagination && (
              <div className="border-t border-border/70 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Page {activePagination.page} of{" "}
                    {activePagination.totalPages || 1}
                  </span>

                  <span>
                    {activePagination.total} total {activeTotalLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!activePagination.hasPrevPage || activeIsFetching}
                    onClick={handlePrevPage}
                    className="flex-1 rounded-xl border-border/70 bg-card/70"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!activePagination.hasNextPage || activeIsFetching}
                    onClick={handleNextPage}
                    className="flex-1 rounded-xl border-border/70 bg-card/70"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const SearchHistoryCard = ({
  item,
  getTimeAgo,
  onClick,
  onToggleFavorite,
  onDelete,
  isDeleting,
  isFavoriteUpdating,
}: {
  item: SearchHistoryItem;
  getTimeAgo: (date?: string) => string;
  onClick: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isFavoriteUpdating: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <HistoryCardShell
      icon={<Search className="h-4.5 w-4.5" />}
      isDeleting={isDeleting}
      onClick={onClick}
      menuOpen={menuOpen}
      setMenuOpen={setMenuOpen}
      isFavorite={Boolean(item.isFavorite)}
      isFavoriteUpdating={isFavoriteUpdating}
      onToggleFavorite={onToggleFavorite}
      onDelete={onDelete}
    >
      <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
        {item.title || item.query || "Untitled Search"}
      </h4>

      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
        {item.query}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>{getTimeAgo(item.createdAt)}</span>
        <span>•</span>
        <span>{item.productsCount} results</span>

        {item.status && (
          <Badge variant="secondary" className="rounded-full text-[10px]">
            {item.status}
          </Badge>
        )}
      </div>
    </HistoryCardShell>
  );
};

const CompareHistoryCard = ({
  item,
  getTimeAgo,
  onClick,
  onToggleFavorite,
  onDelete,
  isDeleting,
  isFavoriteUpdating,
}: {
  item: Compare;
  getTimeAgo: (date?: string) => string;
  onClick: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isFavoriteUpdating: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const totalProducts =
    item.totalProducts || item.insights?.totalProducts || item.productUrl?.length || 0;

  const status = item.status || item.insights?.status || "UNKNOWN";

  const isFavorite =
    Boolean(item.isFavorite) || Boolean(item.insights?.isFavorite);

  return (
    <HistoryCardShell
      icon={<GitCompareArrows className="h-4.5 w-4.5" />}
      isDeleting={isDeleting}
      onClick={onClick}
      menuOpen={menuOpen}
      setMenuOpen={setMenuOpen}
      isFavorite={isFavorite}
      isFavoriteUpdating={isFavoriteUpdating}
      onToggleFavorite={onToggleFavorite}
      onDelete={onDelete}
    >
      <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
        {item.title || "Untitled Comparison"}
      </h4>

      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
        {item.summary || "Comparison is being generated..."}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>{getTimeAgo(item.createdAt)}</span>
        <span>•</span>
        <span>
          {totalProducts} {totalProducts === 1 ? "product" : "products"}
        </span>

        {status && (
          <Badge variant="secondary" className="rounded-full text-[10px]">
            {status}
          </Badge>
        )}
      </div>
    </HistoryCardShell>
  );
};

const HistoryCardShell = ({
  children,
  icon,
  isDeleting,
  onClick,
  menuOpen,
  setMenuOpen,
  isFavorite,
  isFavoriteUpdating,
  onToggleFavorite,
  onDelete,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  isDeleting: boolean;
  onClick: () => void;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFavorite: boolean;
  isFavoriteUpdating: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) => {
  return (
    <div
      className={`group relative cursor-pointer rounded-3xl glass border border-border/70 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant ${
        isDeleting ? "pointer-events-none opacity-60" : ""
      }`}
      onClick={onClick}
    >
      <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-accent flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>

        <div className="min-w-0 flex-1 pr-20">{children}</div>

        <div className="absolute right-0 top-0 flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            disabled={isFavoriteUpdating}
            className="h-8 w-8 rounded-xl hover:bg-accent"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
          >
            {isFavoriteUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Star
                className={`h-4 w-4 ${
                  isFavorite ? "text-yellow-400 fill-yellow-400" : ""
                }`}
              />
            )}
          </Button>

          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              disabled={isDeleting}
              className="h-8 w-8 rounded-xl hover:bg-accent"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>

            {menuOpen && (
              <div
                className="absolute right-0 top-9 z-50 w-36 rounded-2xl border border-border/70 bg-card/95 p-1.5 shadow-elegant backdrop-blur-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HistorySkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl glass border border-border/70 p-4 shadow-soft"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({
  activeTab,
  filter,
}: {
  activeTab: ActiveTab;
  filter: HistoryFilter;
}) => {
  const Icon = activeTab === "searches" ? Search : GitCompareArrows;
  const label = activeTab === "searches" ? "searches" : "comparisons";

  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl glass border border-border/70 p-8 text-center shadow-soft">
      <div className="h-14 w-14 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-glow">
        <Icon className="h-6 w-6 text-white" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        No {filter !== "all" ? filter : ""} {label} found
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {activeTab === "searches"
          ? "Start searching products to see your history here."
          : "Create product comparisons to see them here."}
      </p>
    </div>
  );
};

const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl glass border border-border/70 p-8 text-center shadow-soft">
      <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
        <RefreshCw className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">Failed to load history</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong while fetching your history.
      </p>

      <Button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl bg-primary-gradient text-white"
      >
        Retry
      </Button>
    </div>
  );
};

const UpdatingState = () => {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card/60 py-2 text-xs text-muted-foreground">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Updating history...
    </div>
  );
};

export default HistorySidebar;