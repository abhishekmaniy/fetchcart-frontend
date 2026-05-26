import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCompareHistory } from "@/api/compare.api";
import { getSearchHistory } from "@/api/search.api";
import { useAppStore } from "@/store/app.store";
import type {
  SearchHistoryFilter,
  SearchHistoryItem,
} from "@/types/search.types";
import type { Compare, CompareHistoryFilter } from "@/types/compare.types";
import {
  useDeleteSearchMutation,
  useToggleSearchFavoriteMutation,
} from "@/hooks/useSearchMutations";
import {
  useDeleteCompareMutation,
  useToggleCompareFavoriteMutation,
} from "@/hooks/useCompareMutations";
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
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

type ActiveTab = "searches" | "comparisons";
type HistoryFilter = SearchHistoryFilter | CompareHistoryFilter;

type HistoryPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type SearchPageCache = {
  items: SearchHistoryItem[];
  pagination: HistoryPagination;
};

type ComparePageCache = {
  items: Compare[];
  pagination: HistoryPagination;
};

const DEFAULT_PAGINATION: HistoryPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

const filterOptions: {
  label: string;
  value: HistoryFilter;
  icon: React.ElementType;
}[] = [
  { label: "All", value: "all", icon: Clock },
  { label: "Recent", value: "recent", icon: Calendar },
  { label: "Favorites", value: "favorites", icon: Star },
];

const getCacheKey = ({
  page,
  filter,
}: {
  page: number;
  filter: HistoryFilter;
}) => {
  return `${filter}:${page}`;
};

const HistoryPageContent = () => {
  const navigate = useNavigate();

  const {
    searches,
    comparisons,
    historyMeta,
    setSearches,
    setComparisons,
    updateSearchFavorite,
    updateComparisonFavorite,
    removeSearch,
    removeComparison,
  } = useAppStore(
    useShallow((state) => ({
      searches: state.searches,
      comparisons: state.comparisons,
      historyMeta: state.historyMeta,
      setSearches: state.setSearches,
      setComparisons: state.setComparisons,
      updateSearchFavorite: state.updateSearchFavorite,
      updateComparisonFavorite: state.updateComparisonFavorite,
      removeSearch: state.removeSearch,
      removeComparison: state.removeComparison,
    }))
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("searches");
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const [searchPage, setSearchPage] = useState(1);
  const [comparePage, setComparePage] = useState(1);

  const [initialSearchLoading, setInitialSearchLoading] = useState(false);
  const [initialCompareLoading, setInitialCompareLoading] = useState(false);

  const [searchPageFetching, setSearchPageFetching] = useState(false);
  const [comparePageFetching, setComparePageFetching] = useState(false);

  const [searchPageCache, setSearchPageCache] = useState<
    Record<string, SearchPageCache>
  >({});

  const [comparePageCache, setComparePageCache] = useState<
    Record<string, ComparePageCache>
  >({});

  const [deletingSearchId, setDeletingSearchId] = useState<string | null>(null);
  const [favoriteUpdatingSearchId, setFavoriteUpdatingSearchId] = useState<
    string | null
  >(null);

  const [deletingCompareId, setDeletingCompareId] = useState<string | null>(
    null
  );
  const [favoriteUpdatingCompareId, setFavoriteUpdatingCompareId] = useState<
    string | null
  >(null);

  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const limit = 10;

  const deleteSearchMutation = useDeleteSearchMutation();
  const toggleSearchFavoriteMutation = useToggleSearchFavoriteMutation();

  const deleteCompareMutation = useDeleteCompareMutation();
  const toggleCompareFavoriteMutation = useToggleCompareFavoriteMutation();

  const isSearchTab = activeTab === "searches";

  const selectedFilter = filterOptions.find(
    (option) => option.value === filter
  );

  const SelectedFilterIcon = selectedFilter?.icon || Clock;

  const activeTotalLabel = isSearchTab ? "searches" : "comparisons";

  const pagination: HistoryPagination =
    (isSearchTab
      ? historyMeta.searchPagination
      : historyMeta.comparePagination) || DEFAULT_PAGINATION;

  const isActivePageFetching = isSearchTab
    ? searchPageFetching
    : comparePageFetching;

  const showPagination = pagination.total > limit;

  const showInitialSkeleton =
    (isSearchTab &&
      initialSearchLoading &&
      !historyMeta.isSearchHistoryLoaded &&
      searches.length === 0) ||
    (!isSearchTab &&
      initialCompareLoading &&
      !historyMeta.isCompareHistoryLoaded &&
      comparisons.length === 0);

  const showTableSkeleton = showInitialSkeleton || isActivePageFetching;

  useEffect(() => {
    const handleCloseActionMenu = () => {
      setOpenActionId(null);
    };

    document.addEventListener("click", handleCloseActionMenu);

    return () => {
      document.removeEventListener("click", handleCloseActionMenu);
    };
  }, []);

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

  const formatDate = (date?: string) => {
    if (!date) return "Unknown";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const loadSearchHistory = async ({
    force = false,
    page = searchPage,
    selectedFilter = filter,
  }: {
    force?: boolean;
    page?: number;
    selectedFilter?: HistoryFilter;
  } = {}) => {
    const cacheKey = getCacheKey({
      page,
      filter: selectedFilter,
    });

    const cachedPage = searchPageCache[cacheKey];

    if (!force && cachedPage) {
      setSearches(cachedPage.items, cachedPage.pagination);
      setSearchPage(cachedPage.pagination.page);
      return;
    }

    try {
      if (!historyMeta.isSearchHistoryLoaded && searches.length === 0) {
        setInitialSearchLoading(true);
      } else {
        setSearchPageFetching(true);
      }

      const response = await getSearchHistory({
        page,
        limit,
        filter: selectedFilter as SearchHistoryFilter,
      });

      const nextItems = response.searches || [];
      const nextPagination = response.pagination || {
        ...DEFAULT_PAGINATION,
        page,
        limit,
      };

      setSearches(nextItems, nextPagination);
      setSearchPage(nextPagination.page || page);

      setSearchPageCache((prev) => ({
        ...prev,
        [cacheKey]: {
          items: nextItems,
          pagination: nextPagination,
        },
      }));
    } catch (error) {
      console.error("LOAD_SEARCH_HISTORY_ERROR", error);
    } finally {
      setInitialSearchLoading(false);
      setSearchPageFetching(false);
    }
  };

  const loadCompareHistory = async ({
    force = false,
    page = comparePage,
    selectedFilter = filter,
  }: {
    force?: boolean;
    page?: number;
    selectedFilter?: HistoryFilter;
  } = {}) => {
    const cacheKey = getCacheKey({
      page,
      filter: selectedFilter,
    });

    const cachedPage = comparePageCache[cacheKey];

    if (!force && cachedPage) {
      setComparisons(cachedPage.items, cachedPage.pagination);
      setComparePage(cachedPage.pagination.page);
      return;
    }

    try {
      if (!historyMeta.isCompareHistoryLoaded && comparisons.length === 0) {
        setInitialCompareLoading(true);
      } else {
        setComparePageFetching(true);
      }

      const response = await getCompareHistory({
        page,
        limit,
        filter: selectedFilter as CompareHistoryFilter,
      });

      const nextItems = response.compares || [];
      const nextPagination = response.pagination || {
        ...DEFAULT_PAGINATION,
        page,
        limit,
      };

      setComparisons(nextItems, nextPagination);
      setComparePage(nextPagination.page || page);

      setComparePageCache((prev) => ({
        ...prev,
        [cacheKey]: {
          items: nextItems,
          pagination: nextPagination,
        },
      }));
    } catch (error) {
      console.error("LOAD_COMPARE_HISTORY_ERROR", error);
    } finally {
      setInitialCompareLoading(false);
      setComparePageFetching(false);
    }
  };

  useEffect(() => {
    if (activeTab === "searches") {
      loadSearchHistory();
      return;
    }

    loadCompareHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleFilterChange = async (value: HistoryFilter) => {
    setFilter(value);
    setSearchPage(1);
    setComparePage(1);
    setFilterOpen(false);
    setOpenActionId(null);

    if (isSearchTab) {
      await loadSearchHistory({
        page: 1,
        selectedFilter: value,
      });

      return;
    }

    await loadCompareHistory({
      page: 1,
      selectedFilter: value,
    });
  };

  const handleRefresh = async () => {
    setOpenActionId(null);

    if (isSearchTab) {
      await loadSearchHistory({
        force: true,
        page: searchPage,
        selectedFilter: filter,
      });

      return;
    }

    await loadCompareHistory({
      force: true,
      page: comparePage,
      selectedFilter: filter,
    });
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setFilterOpen(false);
    setOpenActionId(null);
  };

  const handleCreateNew = () => {
    if (isSearchTab) {
      navigate("/search");
      return;
    }

    navigate("/compare");
  };

  const handleActionToggle = (id: string) => {
    setOpenActionId((current) => {
      if (current === id) return null;
      if (current) return null;
      return id;
    });
  };

  const handleSearchClick = (item: SearchHistoryItem) => {
    navigate(`/search/${item.id}`);
  };

  const handleCompareClick = (item: Compare) => {
    navigate(`/compare/${item.id}`);
  };

  const toggleSearchFavorite = async (id: string) => {
    const currentItem = searches.find((item) => item.id === id);
    const nextFavorite = !Boolean(currentItem?.isFavorite);

    try {
      setFavoriteUpdatingSearchId(id);
      updateSearchFavorite(id, nextFavorite);

      setSearchPageCache((prev) => {
        const nextCache = { ...prev };

        Object.keys(nextCache).forEach((key) => {
          nextCache[key] = {
            ...nextCache[key],
            items: nextCache[key].items.map((item) =>
              item.id === id ? { ...item, isFavorite: nextFavorite } : item
            ),
          };
        });

        return nextCache;
      });

      await toggleSearchFavoriteMutation.mutateAsync(id);
    } catch (error) {
      updateSearchFavorite(id, Boolean(currentItem?.isFavorite));

      setSearchPageCache((prev) => {
        const nextCache = { ...prev };

        Object.keys(nextCache).forEach((key) => {
          nextCache[key] = {
            ...nextCache[key],
            items: nextCache[key].items.map((item) =>
              item.id === id
                ? { ...item, isFavorite: Boolean(currentItem?.isFavorite) }
                : item
            ),
          };
        });

        return nextCache;
      });

      console.error("Toggle search favorite error:", error);
    } finally {
      setFavoriteUpdatingSearchId(null);
    }
  };

  const deleteSearch = async (id: string) => {
    const previousSearches = searches;
    const previousCache = searchPageCache;

    try {
      setDeletingSearchId(id);
      setOpenActionId(null);
      removeSearch(id);

      setSearchPageCache((prev) => {
        const nextCache = { ...prev };

        Object.keys(nextCache).forEach((key) => {
          nextCache[key] = {
            ...nextCache[key],
            items: nextCache[key].items.filter((item) => item.id !== id),
          };
        });

        return nextCache;
      });

      await deleteSearchMutation.mutateAsync(id);

      if (searches.length === 1 && pagination.hasPrevPage) {
        await loadSearchHistory({
          force: true,
          page: pagination.page - 1,
          selectedFilter: filter,
        });
      } else {
        await loadSearchHistory({
          force: true,
          page: pagination.page,
          selectedFilter: filter,
        });
      }
    } catch (error) {
      setSearches(previousSearches, historyMeta.searchPagination);
      setSearchPageCache(previousCache);
      console.error("Delete search error:", error);
    } finally {
      setDeletingSearchId(null);
    }
  };

  const toggleCompareFavorite = async (id: string) => {
    const currentItem = comparisons.find((item) => item.id === id);
    const currentFavorite =
      Boolean(currentItem?.isFavorite) ||
      Boolean(currentItem?.insights?.isFavorite);

    const nextFavorite = !currentFavorite;

    try {
      setFavoriteUpdatingCompareId(id);
      updateComparisonFavorite(id, nextFavorite);

      setComparePageCache((prev) => {
        const nextCache = { ...prev };

        Object.keys(nextCache).forEach((key) => {
          nextCache[key] = {
            ...nextCache[key],
            items: nextCache[key].items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    isFavorite: nextFavorite,
                    insights: item.insights
                      ? {
                          ...item.insights,
                          isFavorite: nextFavorite,
                        }
                      : item.insights,
                  }
                : item
            ),
          };
        });

        return nextCache;
      });

      await toggleCompareFavoriteMutation.mutateAsync(id);
    } catch (error) {
      updateComparisonFavorite(id, currentFavorite);

      setComparePageCache((prev) => {
        const nextCache = { ...prev };

        Object.keys(nextCache).forEach((key) => {
          nextCache[key] = {
            ...nextCache[key],
            items: nextCache[key].items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    isFavorite: currentFavorite,
                    insights: item.insights
                      ? {
                          ...item.insights,
                          isFavorite: currentFavorite,
                        }
                      : item.insights,
                  }
                : item
            ),
          };
        });

        return nextCache;
      });

      console.error("Toggle compare favorite error:", error);
    } finally {
      setFavoriteUpdatingCompareId(null);
    }
  };

  const deleteCompare = async (id: string) => {
    const previousComparisons = comparisons;
    const previousCache = comparePageCache;

    try {
      setDeletingCompareId(id);
      setOpenActionId(null);
      removeComparison(id);

      setComparePageCache((prev) => {
        const nextCache = { ...prev };

        Object.keys(nextCache).forEach((key) => {
          nextCache[key] = {
            ...nextCache[key],
            items: nextCache[key].items.filter((item) => item.id !== id),
          };
        });

        return nextCache;
      });

      await deleteCompareMutation.mutateAsync(id);

      if (comparisons.length === 1 && pagination.hasPrevPage) {
        await loadCompareHistory({
          force: true,
          page: pagination.page - 1,
          selectedFilter: filter,
        });
      } else {
        await loadCompareHistory({
          force: true,
          page: pagination.page,
          selectedFilter: filter,
        });
      }
    } catch (error) {
      setComparisons(previousComparisons, historyMeta.comparePagination);
      setComparePageCache(previousCache);
      console.error("Delete compare error:", error);
    } finally {
      setDeletingCompareId(null);
    }
  };

  const handlePrevPage = async () => {
    if (!pagination.hasPrevPage || isActivePageFetching) return;

    setOpenActionId(null);

    const previousPage = Math.max(pagination.page - 1, 1);

    if (isSearchTab) {
      await loadSearchHistory({
        page: previousPage,
        selectedFilter: filter,
      });

      return;
    }

    await loadCompareHistory({
      page: previousPage,
      selectedFilter: filter,
    });
  };

  const handleNextPage = async () => {
    if (!pagination.hasNextPage || isActivePageFetching) return;

    setOpenActionId(null);

    const nextPage = pagination.page + 1;

    if (isSearchTab) {
      await loadSearchHistory({
        page: nextPage,
        selectedFilter: filter,
      });

      return;
    }

    await loadCompareHistory({
      page: nextPage,
      selectedFilter: filter,
    });
  };

  const NewButtonIcon = isSearchTab ? Search : GitCompareArrows;
  const newButtonLabel = isSearchTab ? "New Search" : "New Comparison";

  return (
    <section className="relative z-10 min-h-full space-y-5 pb-8 sm:space-y-6 sm:pb-12">
      <div className="glass relative z-[100] overflow-visible rounded-3xl border border-border/70 p-3 shadow-soft sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full rounded-2xl border border-border/70 bg-card/50 p-1 shadow-soft sm:w-auto">
            <div className="grid grid-cols-2 gap-1 sm:flex sm:w-fit">
              <button
                type="button"
                onClick={() => handleTabChange("searches")}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all sm:min-w-36 ${
                  activeTab === "searches"
                    ? "bg-primary-gradient text-white shadow-soft"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                }`}
              >
                <Search className="h-4 w-4" />
                Searches
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("comparisons")}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all sm:min-w-40 ${
                  activeTab === "comparisons"
                    ? "bg-primary-gradient text-white shadow-soft"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                }`}
              >
                <GitCompareArrows className="h-4 w-4" />
                Comparisons
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              disabled={isActivePageFetching}
              onClick={handleRefresh}
              className="rounded-xl border-border/70 bg-card/70"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isActivePageFetching ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>

            <div className="relative z-[100]">
              <Button
                type="button"
                variant="outline"
                disabled={isActivePageFetching}
                onClick={() => {
                  setFilterOpen((prev) => !prev);
                  setOpenActionId(null);
                }}
                className="w-full justify-between gap-2 rounded-xl border-border/70 bg-card/70 sm:w-40"
              >
                <span className="inline-flex items-center gap-2">
                  <SelectedFilterIcon className="h-4 w-4" />
                  {selectedFilter?.label}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {filterOpen && (
                <div className="absolute right-0 top-12 z-[9999] w-full min-w-44 rounded-2xl border border-border/70 bg-background/95 p-1.5 shadow-elegant backdrop-blur-xl sm:w-44">
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
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              type="button"
              disabled={isActivePageFetching}
              onClick={handleCreateNew}
              className="rounded-xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow"
            >
              <NewButtonIcon className="mr-2 h-4 w-4" />
              {newButtonLabel}
            </Button>
          </div>
        </div>
      </div>

      {showTableSkeleton ? (
        <HistoryTableSkeleton />
      ) : isSearchTab ? (
        searches.length === 0 ? (
          <EmptyState activeTab={activeTab} filter={filter} />
        ) : (
          <SearchHistoryTable
            items={searches}
            getTimeAgo={getTimeAgo}
            formatDate={formatDate}
            deletingId={deletingSearchId}
            favoriteUpdatingId={favoriteUpdatingSearchId}
            openActionId={openActionId}
            onActionToggle={handleActionToggle}
            onRowClick={handleSearchClick}
            onToggleFavorite={toggleSearchFavorite}
            onDelete={deleteSearch}
          />
        )
      ) : comparisons.length === 0 ? (
        <EmptyState activeTab={activeTab} filter={filter} />
      ) : (
        <CompareHistoryTable
          items={comparisons}
          getTimeAgo={getTimeAgo}
          formatDate={formatDate}
          deletingId={deletingCompareId}
          favoriteUpdatingId={favoriteUpdatingCompareId}
          openActionId={openActionId}
          onActionToggle={handleActionToggle}
          onRowClick={handleCompareClick}
          onToggleFavorite={toggleCompareFavorite}
          onDelete={deleteCompare}
        />
      )}

      {showPagination && (
        <div className="glass rounded-3xl border border-border/70 p-4 shadow-soft">
          <div className="mb-3 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>

            <span>
              {pagination.total} total {activeTotalLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage || isActivePageFetching}
              onClick={handlePrevPage}
              className="flex-1 rounded-xl border-border/70 bg-card/70"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage || isActivePageFetching}
              onClick={handleNextPage}
              className="flex-1 rounded-xl border-border/70 bg-card/70"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

const SearchHistoryTable = ({
  items,
  getTimeAgo,
  formatDate,
  deletingId,
  favoriteUpdatingId,
  openActionId,
  onActionToggle,
  onRowClick,
  onToggleFavorite,
  onDelete,
}: {
  items: SearchHistoryItem[];
  getTimeAgo: (date?: string) => string;
  formatDate: (date?: string) => string;
  deletingId: string | null;
  favoriteUpdatingId: string | null;
  openActionId: string | null;
  onActionToggle: (id: string) => void;
  onRowClick: (item: SearchHistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <HistoryTableShell
      headers={[
        "Title",
        "User query",
        "Results",
        "Status",
        "Created at",
        "Favorite",
        "Action",
      ]}
    >
      {items.map((item) => (
        <SearchHistoryRow
          key={item.id}
          item={item}
          getTimeAgo={getTimeAgo}
          formatDate={formatDate}
          isDeleting={deletingId === item.id}
          isFavoriteUpdating={favoriteUpdatingId === item.id}
          isActionOpen={openActionId === item.id}
          onActionToggle={() => onActionToggle(item.id)}
          onClick={() => onRowClick(item)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </HistoryTableShell>
  );
};

const CompareHistoryTable = ({
  items,
  getTimeAgo,
  formatDate,
  deletingId,
  favoriteUpdatingId,
  openActionId,
  onActionToggle,
  onRowClick,
  onToggleFavorite,
  onDelete,
}: {
  items: Compare[];
  getTimeAgo: (date?: string) => string;
  formatDate: (date?: string) => string;
  deletingId: string | null;
  favoriteUpdatingId: string | null;
  openActionId: string | null;
  onActionToggle: (id: string) => void;
  onRowClick: (item: Compare) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <HistoryTableShell
      headers={[
        "Title",
        "Query",
        "Products",
        "Status",
        "Created at",
        "Favorite",
        "Action",
      ]}
    >
      {items.map((item) => (
        <CompareHistoryRow
          key={item.id}
          item={item}
          getTimeAgo={getTimeAgo}
          formatDate={formatDate}
          isDeleting={deletingId === item.id}
          isFavoriteUpdating={favoriteUpdatingId === item.id}
          isActionOpen={openActionId === item.id}
          onActionToggle={() => onActionToggle(item.id)}
          onClick={() => onRowClick(item)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </HistoryTableShell>
  );
};

const HistoryTableShell = ({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) => {
  return (
    <div className="glass overflow-visible rounded-3xl border border-border/70 shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-separate border-spacing-0">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`border-b border-border/70 bg-card/50 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground ${
                    index === 0 ? "rounded-tl-3xl" : ""
                  } ${
                    index === headers.length - 1
                      ? "rounded-tr-3xl text-right"
                      : ""
                  } ${header === "Favorite" ? "text-center" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
};

const SearchHistoryRow = ({
  item,
  getTimeAgo,
  formatDate,
  onClick,
  onToggleFavorite,
  onDelete,
  isDeleting,
  isFavoriteUpdating,
  isActionOpen,
  onActionToggle,
}: {
  item: SearchHistoryItem;
  getTimeAgo: (date?: string) => string;
  formatDate: (date?: string) => string;
  onClick: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isFavoriteUpdating: boolean;
  isActionOpen: boolean;
  onActionToggle: () => void;
}) => {
  const title = item.title || item.query || "Untitled Search";
  const query = item.query || "No query available";
  const status = item.status || "UNKNOWN";

  return (
    <HistoryTableRow
      isDeleting={isDeleting}
      onClick={onClick}
      titleCell={
        <HoverText text={title} className="font-semibold text-foreground" />
      }
      queryCell={<HoverText text={query} className="text-muted-foreground" />}
      countCell={`${item.productsCount || 0} results`}
      statusCell={<StatusBadge status={status} />}
      createdAtCell={
        <CreatedAtCell
          date={formatDate(item.createdAt)}
          timeAgo={getTimeAgo(item.createdAt)}
        />
      }
      favoriteCell={
        <FavoriteButton
          isFavorite={Boolean(item.isFavorite)}
          isLoading={isFavoriteUpdating}
          onClick={onToggleFavorite}
        />
      }
      actionCell={
        <ActionMenu
          isOpen={isActionOpen}
          onToggle={onActionToggle}
          isDeleting={isDeleting}
          onDelete={onDelete}
        />
      }
    />
  );
};

const CompareHistoryRow = ({
  item,
  getTimeAgo,
  formatDate,
  onClick,
  onToggleFavorite,
  onDelete,
  isDeleting,
  isFavoriteUpdating,
  isActionOpen,
  onActionToggle,
}: {
  item: Compare;
  getTimeAgo: (date?: string) => string;
  formatDate: (date?: string) => string;
  onClick: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isFavoriteUpdating: boolean;
  isActionOpen: boolean;
  onActionToggle: () => void;
}) => {
  const totalProducts =
    item.totalProducts ||
    item.insights?.totalProducts ||
    item.productUrl?.length ||
    0;

  const status = item.status || item.insights?.status || "UNKNOWN";

  const isFavorite =
    Boolean(item.isFavorite) || Boolean(item.insights?.isFavorite);

  const title = item.title || "Untitled Comparison";
  const summary = item.summary || "Comparison is being generated...";

  return (
    <HistoryTableRow
      isDeleting={isDeleting}
      onClick={onClick}
      titleCell={
        <HoverText text={title} className="font-semibold text-foreground" />
      }
      queryCell={
        <HoverText text={summary} className="text-muted-foreground" />
      }
      countCell={`${totalProducts} ${
        totalProducts === 1 ? "product" : "products"
      }`}
      statusCell={<StatusBadge status={status} />}
      createdAtCell={
        <CreatedAtCell
          date={formatDate(item.createdAt)}
          timeAgo={getTimeAgo(item.createdAt)}
        />
      }
      favoriteCell={
        <FavoriteButton
          isFavorite={isFavorite}
          isLoading={isFavoriteUpdating}
          onClick={onToggleFavorite}
        />
      }
      actionCell={
        <ActionMenu
          isOpen={isActionOpen}
          onToggle={onActionToggle}
          isDeleting={isDeleting}
          onDelete={onDelete}
        />
      }
    />
  );
};

const HistoryTableRow = ({
  titleCell,
  queryCell,
  countCell,
  statusCell,
  createdAtCell,
  favoriteCell,
  actionCell,
  isDeleting,
  onClick,
}: {
  titleCell: React.ReactNode;
  queryCell: React.ReactNode;
  countCell: React.ReactNode;
  statusCell: React.ReactNode;
  createdAtCell: React.ReactNode;
  favoriteCell: React.ReactNode;
  actionCell: React.ReactNode;
  isDeleting: boolean;
  onClick: () => void;
}) => {
  return (
    <tr
      onClick={onClick}
      className={`group cursor-pointer transition-colors hover:bg-accent/40 ${
        isDeleting ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <td className="border-b border-border/50 px-5 py-4 align-middle">
        {titleCell}
      </td>

      <td className="border-b border-border/50 px-5 py-4 align-middle">
        {queryCell}
      </td>

      <td className="border-b border-border/50 px-5 py-4 align-middle">
        <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {countCell}
        </span>
      </td>

      <td className="border-b border-border/50 px-5 py-4 align-middle">
        {statusCell}
      </td>

      <td className="border-b border-border/50 px-5 py-4 align-middle">
        {createdAtCell}
      </td>

      <td className="border-b border-border/50 px-5 py-4 text-center align-middle">
        <div className="flex justify-center">{favoriteCell}</div>
      </td>

      <td className="border-b border-border/50 px-5 py-4 text-right align-middle">
        {actionCell}
      </td>
    </tr>
  );
};

const HoverText = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className="group/tooltip relative max-w-[260px]">
      <p className={`truncate text-sm ${className}`}>{text}</p>

      <div className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-[9999] hidden w-80 rounded-2xl border border-border/70 bg-popover/95 p-3 text-sm text-popover-foreground shadow-2xl backdrop-blur-xl group-hover/tooltip:block">
        {text}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toUpperCase();

  const getStatusClass = () => {
    if (normalizedStatus === "COMPLETED") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
    }

    if (normalizedStatus === "FAILED") {
      return "border-red-500/20 bg-red-500/10 text-red-500";
    }

    if (
      normalizedStatus === "PROCESSING" ||
      normalizedStatus === "QUEUED" ||
      normalizedStatus === "GENERATING"
    ) {
      return "border-primary/20 bg-primary/10 text-primary";
    }

    return "border-border/70 bg-muted text-muted-foreground";
  };

  return (
    <Badge
      variant="secondary"
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusClass()}`}
    >
      {normalizedStatus}
    </Badge>
  );
};

const CreatedAtCell = ({
  date,
  timeAgo,
}: {
  date: string;
  timeAgo: string;
}) => {
  return (
    <div>
      <p className="text-sm font-medium text-foreground">{date}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo}</p>
    </div>
  );
};

const FavoriteButton = ({
  isFavorite,
  isLoading,
  onClick,
}: {
  isFavorite: boolean;
  isLoading: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      disabled={isLoading}
      className="h-9 w-9 rounded-xl hover:bg-accent"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Star
          className={`h-4 w-4 ${
            isFavorite ? "fill-yellow-400 text-yellow-400" : ""
          }`}
        />
      )}
    </Button>
  );
};

const ActionMenu = ({
  isOpen,
  onToggle,
  isDeleting,
  onDelete,
}: {
  isOpen: boolean;
  onToggle: () => void;
  isDeleting: boolean;
  onDelete: () => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = 54;
    const gap = 8;

    const shouldOpenUp = rect.bottom + gap + menuHeight > window.innerHeight;

    setMenuPosition({
      top: shouldOpenUp ? rect.top - menuHeight - gap : rect.bottom + gap,
      left: Math.max(12, rect.right - menuWidth),
    });
  };

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!isOpen) {
      updateMenuPosition();
    }

    onToggle();
  };

  useEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();

    const handleReposition = () => {
      updateMenuPosition();
    };

    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isOpen]);

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        size="icon"
        variant="ghost"
        disabled={isDeleting}
        className="h-9 w-9 rounded-xl hover:bg-accent"
        onClick={handleToggle}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MoreVertical className="h-4 w-4" />
        )}
      </Button>

      {isOpen &&
        createPortal(
          <div
            className="fixed z-[99999] w-40 rounded-2xl border border-border/70 bg-background/95 p-1.5 text-left shadow-2xl backdrop-blur-xl"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button
              type="button"
              disabled={isDeleting}
              onClick={(event) => {
                event.stopPropagation();
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
          </div>,
          document.body
        )}
    </>
  );
};

const HistoryTableSkeleton = () => {
  return (
    <div className="glass overflow-hidden rounded-3xl border border-border/70 shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-separate border-spacing-0">
          <thead>
            <tr>
              {[
                "Title",
                "User query",
                "Results",
                "Status",
                "Created at",
                "Favorite",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="border-b border-border/70 bg-card/50 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                <td className="border-b border-border/50 px-5 py-4">
                  <Skeleton className="h-4 w-52" />
                </td>

                <td className="border-b border-border/50 px-5 py-4">
                  <Skeleton className="h-4 w-64" />
                </td>

                <td className="border-b border-border/50 px-5 py-4">
                  <Skeleton className="h-8 w-24 rounded-full" />
                </td>

                <td className="border-b border-border/50 px-5 py-4">
                  <Skeleton className="h-7 w-24 rounded-full" />
                </td>

                <td className="border-b border-border/50 px-5 py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </td>

                <td className="border-b border-border/50 px-5 py-4 text-center">
                  <Skeleton className="mx-auto h-9 w-9 rounded-xl" />
                </td>

                <td className="border-b border-border/50 px-5 py-4 text-right">
                  <Skeleton className="ml-auto h-9 w-9 rounded-xl" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-border/70 bg-card/70 p-8 text-center shadow-soft backdrop-blur-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow">
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

export default HistoryPageContent;