// components/AuthProvider.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useUserStore } from '@/store/userStore'
import { Loader2 } from 'lucide-react'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,

    setUser,
    setIsAuthenticated,
    isAuthenticated
  } = useUserStore()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/verify`,
          {},
          { withCredentials: true }
        )
        console.log('Response', res)
        setUser(res.data.user.user)
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [])

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 mb-4'>
          FetchCart
        </h1>
        <Loader2 className='w-12 h-12 text-indigo-600 animate-spin mb-2' />
        <p className='text-gray-600 text-lg'>
          Verifying authentication, please wait...
        </p>
      </div>
    )
  }

  return children
}

export default AuthProvider
