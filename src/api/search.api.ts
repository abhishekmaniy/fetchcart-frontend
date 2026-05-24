import { api } from '@/lib/api'

import type {
  CreateSearchPayload,
  GenerateFormPayload,
  GenerateFormResponse,
  GetSearchByIdResponse,
  GetSearchHistoryResponse,
  SearchHistoryParams,
  SearchResponse,
} from '@/types/search.types'

export const createSearch = async (
  payload: CreateSearchPayload
) => {
  const response = await api.post<SearchResponse>(
    '/search/create',
    payload
  )

  return response.data
}

export const generateSearchForm = async (
  payload: GenerateFormPayload
) => {
  const response = await api.post<GenerateFormResponse>(
    '/search/generate-form',
    payload
  )

  return response.data
}

export type ProductLikeFilter = "all" | "liked" | "not-liked";

export const getSearchById = async (
  searchId: string,
  likedFilter: ProductLikeFilter = "all"
) => {
  const params =
    likedFilter === "liked"
      ? { liked: true }
      : likedFilter === "not-liked"
        ? { liked: false }
        : undefined;

  const response = await api.get<GetSearchByIdResponse>(
    `/search/${searchId}`,
    {
      params,
    }
  );

  return response.data;
};

export const getSearchHistory = async ({
  page = 1,
  limit = 10,
  filter = 'all',
}: SearchHistoryParams = {}) => {
  const response = await api.get<GetSearchHistoryResponse>(
    '/search',
    {
      params: {
        page,
        limit,
        filter,
      },
    }
  )

  return response.data
}

export const deleteSearchById = async (searchId: string) => {
  const response = await api.delete(`/search/${searchId}`);

  return response.data;
};

export const toggleSearchFavorite = async (searchId: string) => {
  const response = await api.patch(`/search/${searchId}/favorite`);
  return response.data;
};