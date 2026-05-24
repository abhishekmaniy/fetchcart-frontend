import { useAppAuth } from '@/hooks/useAppAuth'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isAuthInitialized } = useAppAuth()
  const location = useLocation()

  if (!isAuthInitialized) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute