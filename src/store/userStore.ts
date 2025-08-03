import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Token, Search, Product, Compare } from '../types'

interface UserState {
  user: User | null
  token: Token | null
  isAuthenticated: boolean

  setUser: (user: User) => void
  clearUser: () => void

  setToken: (token: Token) => void
  clearToken: () => void

  setIsAuthenticated: (auth: boolean) => void

  addSearchWithProducts: (search: Search) => void
  addCompareWithProducts: (compare: Compare) => void


  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user: { ...user, searches: user.searches || [] } }),

      clearUser: () => set({ user: null }),

      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),

      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),

      addSearchWithProducts: (newSearch) => {
        const currentUser = get().user
        if (!currentUser) return

        const updatedUser = {
          ...currentUser,
          searches: [...(currentUser.searches || []), newSearch],
        }

        set({ user: updatedUser })
      },

      addCompareWithProducts: (newCompare) => {
        const currentUser = get().user
        if (!currentUser) return

        const updatedUser = {
          ...currentUser,
          comparisons: [...(currentUser.comparisons || []), newCompare],
        }

        set({ user: updatedUser })
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
    }),
    {
      name: 'user-auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
