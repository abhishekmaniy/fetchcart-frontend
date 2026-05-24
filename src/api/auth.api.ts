import { api } from '@/lib/api'
import type {
  AuthResponse,
  LoginPayload,
  ManualRegisterPayload,
} from '@/types/auth.types'

export const loginUser = async (payload: LoginPayload) => {
  const response = await api.post<AuthResponse>('/user/login', payload, {
    withCredentials: true,
    _skipAuthRefresh: true,
  } as any)

  return response.data
}

export const registerUser = async (payload: ManualRegisterPayload) => {
  const response = await api.post<AuthResponse>('/user/register', payload, {
    _skipAuthRefresh: true,
  } as any)

  return response.data
}

export const refreshUser = async () => {
  const response = await api.post<AuthResponse>(
    '/user/refresh',
    {},
    {
      withCredentials: true,
      _skipAuthRefresh: true,
    } as any
  )

  return response.data
}