// src/types/index.ts

export interface Product {
  id: string
  searchId: string
  productName?: string
  price?: string
  originalPrice?: string
  savings?: string
  image?: string
  rating?: number
  reviews?: number
  store?: string
}

export interface Search {
  id: string
  userId: string
  query: string
  createdAt: Date
  isFavorite?: boolean
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
