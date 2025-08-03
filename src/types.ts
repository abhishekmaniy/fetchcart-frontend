export interface Product {
  id: string
  searchId: string
  compareId?: string | null

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

  createdAt: Date
}

export interface Search {
  id: string
  userId: string
  query: string
  isFavorite: boolean
  createdAt: Date
  products: Product[]
}

export interface Compare {
  id: string
  userId: string
  title: string
  productUrl?: string
  summary: string
  insights?: Record<string, any>
  createdAt: Date
  products: Product[] 
}

export interface User {
  id: string
  name: string
  email: string
  imageUrl?: string | null
  password?: string
  verified: boolean
  createdAt: Date
  updatedAt: Date

  searches?: Search[]
  comparisons?: Compare[]
}

export interface Token {
  id: string
  userId: string
  token: string
  createdAt: Date
}

export interface Alert {
  id: string
  productName: string
  productUrl: string
  currentPrice: number
  targetPrice: number
  isActive: boolean
  createdAt: string
}

export type Deal = {
  id: string
  name: string
  originalPrice: number
  currentPrice: number
  discount: number
  endsIn: string
  store: string
}

export type ComparedProduct = {
  id: string
  name: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  store: string
  image: string
}

export type AssistantFeature =
  | 'compare'
  | 'summarize'
  | 'priceTrack'
  | 'deals'
  | 'recommendations'
  | 'history'
