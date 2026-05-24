import {
  createSearch,
  deleteSearchById,
  generateSearchForm,
  getSearchById,
  getSearchHistory,
  ProductLikeFilter,
  toggleSearchFavorite,
} from '@/api/search.api'

import type {
  CreateSearchPayload,
  GenerateFormPayload,
  SearchHistoryParams,
} from '@/types/search.types'

import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateSearchMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateSearchPayload) =>
      createSearch(payload),
  })
}

export const useGenerateSearchFormMutation = () => {
  return useMutation({
    mutationFn: (payload: GenerateFormPayload) =>
      generateSearchForm(payload),
  })
}

export const useSearchByIdQuery = (
  searchId?: string,
  likedFilter: ProductLikeFilter = "all"
) => {
  return useQuery({
    queryKey: ["search", searchId, likedFilter],
    queryFn: () => getSearchById(searchId as string, likedFilter),
    enabled: Boolean(searchId),
  });
};

export const useSearchHistoryQuery = ({
  page = 1,
  limit = 10,
  filter = 'all',
}: SearchHistoryParams = {}) => {
  return useQuery({
    queryKey: ['search-history', page, limit, filter],
    queryFn: () =>
      getSearchHistory({
        page,
        limit,
        filter,
      }),
  })
}

export const useDeleteSearchMutation = () => {
  return useMutation({
    mutationFn: (searchId: string) => deleteSearchById(searchId),
  });
};

export const useToggleSearchFavoriteMutation = () => {
  return useMutation({
    mutationFn: (searchId: string) => toggleSearchFavorite(searchId),
  });
};