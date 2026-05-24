import { SearchFormFieldType } from '@/constants/search.enums'

export type SearchFilters = Record<
  string,
  string | number | boolean | string[]
>

export type SearchHistoryFilter = 'all' | 'recent' | 'favorites'

export type CreateSearchPayload = {
  query: string
  filters?: SearchFilters
}

export type GenerateFormPayload = {
  query: string
}

export type FormField = {
  name: string
  label: string
  type: SearchFormFieldType | string
  min?: number
  max?: number
  step?: number
  options?: string[]
}

export type Product = {
  id?: string
  productName?: string
  brand?: string
  model?: string
  price?: string
  originalPrice?: string
  savings?: string
  image?: string
  images?: string[]
  rating?: number
  reviews?: number
  productUrl?: string
  store?: string
  asin?: string
  category?: string
  description?: string
  productInfo?: Record<string, string>
  featureBullets?: string[]
  pros?: string[]
  cons?: string[]
  createdAt?: string
}

export type SearchStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type SearchHistoryParams = {
  page?: number
  limit?: number
  filter?: SearchHistoryFilter
}

export type Search = {
  id: string
  userId?: string
  title?: string
  query: string
  status: SearchStatus | string
  totalProductsFound: number
  processedProducts: number
  failedProducts: number
  errorMessage?: string | null
  isFavorite: boolean
  createdAt?: string
  updatedAt?: string
  completedAt?: string | null
}

export type SearchHistoryItem = Search & {
  productsCount: number
}

export type SearchWithProducts = Search & {
  products?: Product[]
}

export type SearchResponse = {
  message?: string
  search: {
    id: string
    title?: string
    query: string
    status?: SearchStatus | string
    createdAt: string
    products?: Product[]
  }
}

export type GenerateFormResponse = {
  success?: boolean
  query?: string
  intent?: string
  productType?: string
  extractedFilters?: SearchFilters
  formSchema: FormField[]
}

export type GetSearchByIdResponse = {
  search: SearchWithProducts
}

export type GetSearchHistoryResponse = {
  success: boolean
  filter: SearchHistoryFilter
  pagination: PaginationMeta
  searches: SearchHistoryItem[]
}