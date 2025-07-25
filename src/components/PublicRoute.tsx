import { useUserStore } from '@/store/userStore'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useUserStore()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicRoute
