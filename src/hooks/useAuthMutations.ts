import {
  loginUser,
  registerUser,
  type LoginPayload,
  type ManualRegisterPayload,
} from '@/api/auth.api'
import { useMutation } from '@tanstack/react-query'

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload: ManualRegisterPayload) => registerUser(payload),
  })
}