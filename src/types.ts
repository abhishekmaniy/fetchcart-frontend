export interface User {
  id: number
  name: string
  email: string
  imageUrl?: string | null
  password?: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Token {
  id: string
  userId: string
  token: string
  createdAt: Date
}

export interface UserInputManual {
  name: string
  email: string
  password: string
}

export interface UserInputGoogle {
  name: string
  email: string
  imageUrl?: string | null
}