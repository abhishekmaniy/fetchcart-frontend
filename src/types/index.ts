export type Token = {
  accessToken?: string
  refreshToken?: string
}

export type User = {
  id: string
  name: string
  email: string
  imageUrl?: string | null
  verified?: boolean
  createdAt?: string
  updatedAt?: string

  searches?: Search[]
  comparisons?: Compare[]
}

export type UserInputManual = {
  name: string
  email: string
  password: string
}

export type UserInputGoogle = {
  name: string
  email: string
  imageUrl?: string
}

export type Search = {
  id: string
  query: string
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

  createdAt?: string

  products?: Product[]
}

export type Product = {
  id: string

  productName?: string | null
  brand?: string | null
  model?: string | null

  price?: string | null
  originalPrice?: string | null
  savings?: string | null

  image?: string | null
  images?: string[] | null

  rating?: number | null
  reviews?: number | null

  productUrl?: string | null
  store?: string | null
  asin?: string | null

  category?: string | null
  description?: string | null

  productInfo?: Record<string, string>
  featureBullets?: string[]

  pros?: string[]
  cons?: string[]

  createdAt?: string
}

export type Compare = {
  id: string

  title: string

  productUrl?: string[]

  summary?: string

  insights?: Record<string, any>

  products?: Product[]

  createdAt?: string
}