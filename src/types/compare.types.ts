import type { Product } from '@/types/search.types'

export type CompareSource = 'EXISTING_PRODUCTS' | 'PRODUCT_URLS'

export type CompareHistoryFilter = 'all' | 'recent' | 'favorites'

export type CreateComparePayload =
  | {
      source: 'EXISTING_PRODUCTS'
      productIds: string[]
      productUrls?: never
    }
  | {
      source: 'PRODUCT_URLS'
      productUrls: string[]
      productIds?: never
    }

export type CompareStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | string

export type CompareInsights = {
  source?: CompareSource
  status?: CompareStatus

  totalProducts?: number
  processedProducts?: number
  failedProducts?: number

  errorMessage?: string | null
  isFavorite?: boolean
  completedAt?: string | null

  recommendation?: string
  keyDifferences?: string[]
  priceVerdict?: string
  qualityVerdict?: string

  winner?: {
    productName?: string
    reason?: string
  } | null

  bestFor?: {
    label?: string
    productName?: string
    reason?: string
  }[]

  comparisonTable?: {
    feature?: string
    values?: Record<string, string>
  }[]

  [key: string]: unknown
}

export type Compare = {
  id: string
  userId?: string

  title: string
  productUrl?: string[]

  summary: string
  insights?: CompareInsights | null

  createdAt?: string

  status?: CompareStatus
  totalProducts?: number
  processedProducts?: number
  failedProducts?: number
  errorMessage?: string | null
  isFavorite?: boolean
  completedAt?: string | null
}

export type CompareWithProducts = Compare & {
  products?: Product[]
}

export type CreateCompareResponse = {
  message: string
  compare: {
    id: string
    title: string
    source: CompareSource
    status: CompareStatus
    productIds?: string[]
    productUrls?: string[]
    createdAt: string
  }
}

export type GetCompareByIdResponse = {
  compare: CompareWithProducts
}

export type CompareHistoryParams = {
  page?: number
  limit?: number
  filter?: CompareHistoryFilter
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type GetCompareHistoryResponse = {
  success: boolean
  filter: CompareHistoryFilter
  pagination: PaginationMeta
  compares: Compare[]
}

export type ToggleCompareFavoriteResponse = {
  success: boolean
  compare: {
    id: string
    isFavorite: boolean
  }
}

export type DeleteCompareResponse = {
  success: boolean
  message: string
}