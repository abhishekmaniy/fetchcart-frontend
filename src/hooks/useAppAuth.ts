import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/store/app.store";

export const useAppAuth = () => {
  const {
    user,
    isAuthenticated,
    isAuthInitialized,
    isAuthLoading,
    plan,

    searches,
    comparisons,
    historyMeta,

    initializeAuth,
    logout,

    setUser,
    setPlan,

    setSearches,
    setComparisons,
    upsertSearch,
    upsertComparison,
    updateSearchFavorite,
    updateComparisonFavorite,
    removeSearch,
    removeComparison,
    resetHistory,
  } = useAppStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isAuthInitialized: state.isAuthInitialized,
      isAuthLoading: state.isAuthLoading,
      plan: state.plan,

      searches: state.searches,
      comparisons: state.comparisons,
      historyMeta: state.historyMeta,

      initializeAuth: state.initializeAuth,
      logout: state.logout,

      setUser: state.setUser,
      setPlan: state.setPlan,

      setSearches: state.setSearches,
      setComparisons: state.setComparisons,
      upsertSearch: state.upsertSearch,
      upsertComparison: state.upsertComparison,
      updateSearchFavorite: state.updateSearchFavorite,
      updateComparisonFavorite: state.updateComparisonFavorite,
      removeSearch: state.removeSearch,
      removeComparison: state.removeComparison,
      resetHistory: state.resetHistory,
    }))
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    isAuthenticated,
    isAuthInitialized,
    isAuthLoading,
    plan,

    searches,
    comparisons,
    historyMeta,

    logout,
    setUser,
    setPlan,

    setSearches,
    setComparisons,
    upsertSearch,
    upsertComparison,
    updateSearchFavorite,
    updateComparisonFavorite,
    removeSearch,
    removeComparison,
    resetHistory,
  };
};