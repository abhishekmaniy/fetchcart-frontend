import {
  createCompare,
  deleteCompare,
  getCompareById,
  getCompareHistory,
  toggleCompareFavorite,
} from '@/api/compare.api'

import type {
  CompareHistoryParams,
  CreateComparePayload,
} from '@/types/compare.types'

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

export const compareKeys = {
  all: ['compare'] as const,

  history: (
    page?: number,
    limit?: number,
    filter?: string
  ) => ['compare', 'history', page, limit, filter] as const,

  detail: (compareId?: string) =>
    ['compare', 'detail', compareId] as const,
}

export const useCreateCompareMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateComparePayload) =>
      createCompare(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['compare', 'history'],
      })
    },
  })
}

export const useCompareByIdQuery = (compareId?: string) => {
  return useQuery({
    queryKey: compareKeys.detail(compareId),
    queryFn: () => getCompareById(compareId as string),
    enabled: Boolean(compareId),
  })
}

export const useCompareHistoryQuery = ({
  page = 1,
  limit = 10,
  filter = 'all',
}: CompareHistoryParams = {}) => {
  return useQuery({
    queryKey: compareKeys.history(page, limit, filter),
    queryFn: () =>
      getCompareHistory({
        page,
        limit,
        filter,
      }),
  })
}

export const useToggleCompareFavoriteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (compareId: string) =>
      toggleCompareFavorite(compareId),

    onSuccess: (_, compareId) => {
      queryClient.invalidateQueries({
        queryKey: ['compare', 'history'],
      })

      queryClient.invalidateQueries({
        queryKey: compareKeys.detail(compareId),
      })
    },
  })
}

export const useDeleteCompareMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (compareId: string) =>
      deleteCompare(compareId),

    onSuccess: (_, compareId) => {
      queryClient.invalidateQueries({
        queryKey: ['compare', 'history'],
      })

      queryClient.removeQueries({
        queryKey: compareKeys.detail(compareId),
      })
    },
  })
}