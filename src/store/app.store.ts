import { create } from "zustand";
import { getCurrentUser } from "@/api/auth.api";
import { getAccessToken } from "@/lib/api";
import type { AppUser, UserPlan } from "@/types/auth.types";
import type { SearchHistoryItem } from "@/types/search.types";
import type { Compare } from "@/types/compare.types";

type HistoryPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type HistoryMeta = {
  isSearchHistoryLoaded: boolean;
  isCompareHistoryLoaded: boolean;
  searchPagination: HistoryPagination | null;
  comparePagination: HistoryPagination | null;
};

type AppState = {
  user: AppUser | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  isAuthLoading: boolean;
  plan: UserPlan;

  searches: SearchHistoryItem[];
  comparisons: Compare[];
  historyMeta: HistoryMeta;

  initializeAuth: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;

  setUser: (user: AppUser | null) => void;
  setAuthenticated: (value: boolean) => void;
  setAuthInitialized: (value: boolean) => void;
  setPlan: (plan: UserPlan) => void;

  setSearches: (
    searches: SearchHistoryItem[],
    pagination?: HistoryPagination | null
  ) => void;
  setComparisons: (
    comparisons: Compare[],
    pagination?: HistoryPagination | null
  ) => void;

  upsertSearch: (search: SearchHistoryItem) => void;
  upsertComparison: (comparison: Compare) => void;

  updateSearchFavorite: (id: string, isFavorite: boolean) => void;
  updateComparisonFavorite: (id: string, isFavorite: boolean) => void;

  removeSearch: (id: string) => void;
  removeComparison: (id: string) => void;

  resetHistory: () => void;
  logout: () => void;
};

const sortByCreatedAtDesc = <T extends { createdAt?: string }>(items: T[]) => {
  return [...items].sort((a, b) => {
    const first = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const second = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return second - first;
  });
};

const initialHistoryMeta: HistoryMeta = {
  isSearchHistoryLoaded: false,
  isCompareHistoryLoaded: false,
  searchPagination: null,
  comparePagination: null,
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAuthInitialized: false,
  isAuthLoading: false,
  plan: "FREE",

  searches: [],
  comparisons: [],
  historyMeta: initialHistoryMeta,

  initializeAuth: async () => {
    const { isAuthInitialized, isAuthLoading } = get();

    if (isAuthInitialized || isAuthLoading) return;

    const token = getAccessToken();

    if (!token) {
      set({
        user: null,
        isAuthenticated: false,
        isAuthInitialized: true,
        isAuthLoading: false,
        plan: "FREE",
        searches: [],
        comparisons: [],
        historyMeta: initialHistoryMeta,
      });

      return;
    }

    try {
      set({ isAuthLoading: true });

      const response = await getCurrentUser();

      if (!response.success || !response.data?.user) {
        throw new Error(response.message || "Failed to fetch current user");
      }

      const user = response.data.user;
      const effectivePlan = user.plan || user.userPlan?.effectivePlan || "FREE";

      set({
        user,
        isAuthenticated: true,
        isAuthInitialized: true,
        isAuthLoading: false,
        plan: effectivePlan,
      });
    } catch (error) {
      console.error("INITIALIZE_AUTH_ERROR", error);

      localStorage.removeItem("accessToken");

      set({
        user: null,
        isAuthenticated: false,
        isAuthInitialized: true,
        isAuthLoading: false,
        plan: "FREE",
        searches: [],
        comparisons: [],
        historyMeta: initialHistoryMeta,
      });
    }
  },

  refreshCurrentUser: async () => {
    const token = getAccessToken();

    if (!token) {
      set({
        user: null,
        isAuthenticated: false,
        isAuthInitialized: true,
        isAuthLoading: false,
        plan: "FREE",
        searches: [],
        comparisons: [],
        historyMeta: initialHistoryMeta,
      });

      return;
    }

    try {
      set({ isAuthLoading: true });

      const response = await getCurrentUser();

      if (!response.success || !response.data?.user) {
        throw new Error(response.message || "Failed to refresh current user");
      }

      const user = response.data.user;
      const effectivePlan = user.plan || user.userPlan?.effectivePlan || "FREE";

      set({
        user,
        isAuthenticated: true,
        isAuthInitialized: true,
        isAuthLoading: false,
        plan: effectivePlan,
      });
    } catch (error) {
      console.error("REFRESH_CURRENT_USER_ERROR", error);

      localStorage.removeItem("accessToken");

      set({
        user: null,
        isAuthenticated: false,
        isAuthInitialized: true,
        isAuthLoading: false,
        plan: "FREE",
        searches: [],
        comparisons: [],
        historyMeta: initialHistoryMeta,
      });
    }
  },

  setUser: (user) =>
    set({
      user,
      plan: user?.plan || user?.userPlan?.effectivePlan || "FREE",
    }),

  setAuthenticated: (value) => set({ isAuthenticated: value }),

  setAuthInitialized: (value) => set({ isAuthInitialized: value }),

  setPlan: (plan) => set({ plan }),

  setSearches: (searches, pagination = null) =>
    set((state) => ({
      searches: sortByCreatedAtDesc(searches),
      historyMeta: {
        ...state.historyMeta,
        isSearchHistoryLoaded: true,
        searchPagination: pagination,
      },
    })),

  setComparisons: (comparisons, pagination = null) =>
    set((state) => ({
      comparisons: sortByCreatedAtDesc(comparisons),
      historyMeta: {
        ...state.historyMeta,
        isCompareHistoryLoaded: true,
        comparePagination: pagination,
      },
    })),

  upsertSearch: (search) =>
    set((state) => {
      const exists = state.searches.some((item) => item.id === search.id);

      const nextSearches = exists
        ? state.searches.map((item) => (item.id === search.id ? search : item))
        : [search, ...state.searches];

      return {
        searches: sortByCreatedAtDesc(nextSearches),
      };
    }),

  upsertComparison: (comparison) =>
    set((state) => {
      const exists = state.comparisons.some((item) => item.id === comparison.id);

      const nextComparisons = exists
        ? state.comparisons.map((item) =>
            item.id === comparison.id ? comparison : item
          )
        : [comparison, ...state.comparisons];

      return {
        comparisons: sortByCreatedAtDesc(nextComparisons),
      };
    }),

  updateSearchFavorite: (id, isFavorite) =>
    set((state) => ({
      searches: state.searches.map((item) =>
        item.id === id ? { ...item, isFavorite } : item
      ),
    })),

  updateComparisonFavorite: (id, isFavorite) =>
    set((state) => ({
      comparisons: state.comparisons.map((item) =>
        item.id === id
          ? {
              ...item,
              isFavorite,
              insights: item.insights
                ? {
                    ...item.insights,
                    isFavorite,
                  }
                : item.insights,
            }
          : item
      ),
    })),

  removeSearch: (id) =>
    set((state) => ({
      searches: state.searches.filter((item) => item.id !== id),
    })),

  removeComparison: (id) =>
    set((state) => ({
      comparisons: state.comparisons.filter((item) => item.id !== id),
    })),

  resetHistory: () =>
    set({
      searches: [],
      comparisons: [],
      historyMeta: initialHistoryMeta,
    }),

  logout: () => {
    localStorage.removeItem("accessToken");

    set({
      user: null,
      isAuthenticated: false,
      isAuthInitialized: true,
      isAuthLoading: false,
      plan: "FREE",
      searches: [],
      comparisons: [],
      historyMeta: initialHistoryMeta,
    });
  },
}));