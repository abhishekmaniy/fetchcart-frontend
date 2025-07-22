
import { create } from 'zustand'
import { User, Token } from '../types'

interface UserState {
  user: User | null
  token: Token | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  clearUser: () => void
  setToken: (token: Token) => void
  clearToken: () => void
  setIsAuthenticated: (auth: boolean) => void
  logout: () => void
}


export const useUserStore = create<UserState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),

  setToken: token => set({ token }),
  clearToken: () => set({ token: null }),

  setIsAuthenticated: auth => set({ isAuthenticated: auth }),

  logout: () => set({ user: null, token: null, isAuthenticated: false })
}))
