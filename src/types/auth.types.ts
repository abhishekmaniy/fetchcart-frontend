import { AuthProvider } from "@/constants/auth.enums"

export type UserPlan = 'FREE' | 'PRO' | 'MAX'

export type AppUser = {
  id: string
  name: string
  email: string
  imageUrl: string | null
  verified: boolean
  createdAt: string | null
  updatedAt: string | null
  plan: UserPlan
  userPlan: {
    id?: string
    plan: UserPlan
    effectivePlan: UserPlan
    startsAt: string | null
    expiresAt: string | null
    isActive: boolean
    isExpired: boolean
    lastPaymentId?: string | null
    createdAt?: string | null
    updatedAt?: string | null
  }
}

export type CurrentUserResponse = {
  success: boolean
  message: string
  data: {
    user: AppUser
  }
}

export type AuthResponse = {
  success: boolean
  message: string
  accessToken?: string
  data?: {
    user?: AppUser
  }
}

export type CredentialsLoginPayload = {
  provider: AuthProvider.CREDENTIALS
  email: string
  password: string
}

export type GoogleLoginPayload = {
  provider: AuthProvider.GOOGLE
  idToken: string
}

export type LoginPayload = CredentialsLoginPayload | GoogleLoginPayload

export type ManualRegisterPayload = {
  name: string
  email: string
  password: string
}