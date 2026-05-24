import { api } from '@/lib/api'

import type {
  CompareHistoryParams,
  CreateComparePayload,
  CreateCompareResponse,
  DeleteCompareResponse,
  GetCompareByIdResponse,
  GetCompareHistoryResponse,
  ToggleCompareFavoriteResponse,
} from '@/types/compare.types'

export const createCompare = async (
  payload: CreateComparePayload
) => {
  const response = await api.post<CreateCompareResponse>(
    '/compare/create',
    payload
  )

  return response.data
}

export const getCompareById = async (compareId: string) => {
  const response = await api.get<GetCompareByIdResponse>(
    `/compare/${compareId}`
  )

  return response.data
}

export const getCompareHistory = async ({
  page = 1,
  limit = 10,
  filter = 'all',
}: CompareHistoryParams = {}) => {
  const response = await api.get<GetCompareHistoryResponse>(
    '/compare',
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

export const toggleCompareFavorite = async (compareId: string) => {
  const response = await api.patch<ToggleCompareFavoriteResponse>(
    `/compare/${compareId}/favorite`
  )

  return response.data
}

export const deleteCompare = async (compareId: string) => {
  const response = await api.delete<DeleteCompareResponse>(
    `/compare/${compareId}`
  )

  return response.data
}