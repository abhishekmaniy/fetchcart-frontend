import { create } from 'zustand'

export type UserPlan = 'FREE' | 'PRO' | 'TEAM'

type AppState = {
  isAuthenticated: boolean
  isAuthInitialized: boolean
  plan: UserPlan

  setAuthenticated: (value: boolean) => void
  setAuthInitialized: (value: boolean) => void
  setPlan: (plan: UserPlan) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  isAuthInitialized: false,
  plan: 'FREE',

  setAuthenticated: (value) => set({ isAuthenticated: value }),

  setAuthInitialized: (value) => set({ isAuthInitialized: value }),

  setPlan: (plan) => set({ plan }),

  logout: () => {
    localStorage.removeItem('accessToken')

    set({
      isAuthenticated: false,
      isAuthInitialized: true,
      plan: 'FREE',
    })
  },
}))