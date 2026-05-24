import { useAppAuth } from '@/hooks/useAppAuth'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isAuthInitialized } = useAppAuth()

  if (!isAuthInitialized) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/search" replace />
  }

  return children
}

export default PublicRoute