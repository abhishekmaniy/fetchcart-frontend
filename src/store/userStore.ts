import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Token, Search, Product } from '../types'

interface UserState {
  user: User | null
  token: Token | null
  isAuthenticated: boolean
  searches: Search[] | null
  products: Product[] | null

  setUser: (user: User) => void
  clearUser: () => void

  setToken: (token: Token) => void
  clearToken: () => void

  setIsAuthenticated: (auth: boolean) => void

  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      searches: null,
      products: null,

      setUser: (user) =>
        set({
          user,
          searches: user.searches ?? null,
          products: user.searches
            ? user.searches.flatMap((s) => s.products || [])
            : null
        }),

      clearUser: () =>
        set({
          user: null,
          searches: null,
          products: null
        }),

      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),

      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          searches: null,
          products: null
        })
    }),
    {
      name: 'user-auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        searches: state.searches,
        products: state.products
      })
    }
  )
)
