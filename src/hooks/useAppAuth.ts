import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { getAccessToken } from '@/lib/api'
import { useAppStore } from '@/store/app.store'

export const useAppAuth = () => {
  const {
    isAuthenticated,
    isAuthInitialized,
    plan,
    setAuthenticated,
    setAuthInitialized,
    logout,
  } = useAppStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isAuthInitialized: state.isAuthInitialized,
      plan: state.plan,
      setAuthenticated: state.setAuthenticated,
      setAuthInitialized: state.setAuthInitialized,
      logout: state.logout,
    }))
  )

  useEffect(() => {
    const token = getAccessToken()

    setAuthenticated(Boolean(token))
    setAuthInitialized(true)
  }, [setAuthenticated, setAuthInitialized])

  return {
    isAuthenticated,
    isAuthInitialized,
    plan,
    logout,
  }
}