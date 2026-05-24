import type { User } from '@/types'
import { AuthProvider } from '@/constants/auth.enums'

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

export type AuthResponse = {
  message: string
  user?: User
  accessToken?: string
}