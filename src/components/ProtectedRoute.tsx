import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useUserStore } from '@/store/userStore'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation()
  const { setUser, isAuthenticated, setIsAuthenticated } = useUserStore()

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/verify`,
          {}, 
          { withCredentials: true }
        )

        setUser(res.data.user) 
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      }
    }

    verify()
  }, [setUser, setIsAuthenticated])

  if (isAuthenticated === null) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 mb-4'>
          FetchKart
        </h1>
        <Loader2 className='w-12 h-12 text-indigo-600 animate-spin mb-2' />
        <p className='text-gray-600 text-lg'>
          Verifying authentication, please wait...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/signin' state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
