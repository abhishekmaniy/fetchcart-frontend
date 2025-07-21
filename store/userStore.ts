import { create } from 'zustand'
import { User, Token } from '../types'

interface UserState {
  user: User | null
  token: Token | null
  setUser: (user: User) => void
  clearUser: () => void
  setToken: (token: Token) => void
  clearToken: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null })
}))
