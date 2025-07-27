import {
  History,
  ShoppingCart,
  Sparkles,
  Users,
  LogOut,
} from 'lucide-react'
import React from 'react'
import { Badge } from '../ui/badge'
import HistorySidebar from './HistorySidebar'
import { Button } from '../ui/button'
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Header = () => {
  const { isAuthenticated, logout } = useUserStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
        {},
        { withCredentials: true }
      )
      logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <header className='border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div className='p-2 bg-gradient-to-br from-indigo-500 via-pink-400 to-yellow-400 rounded-xl'>
                <ShoppingCart className='h-6 w-6 text-white' />
              </div>
              <span className='text-2xl font-bold bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent'>
                FetchCart
              </span>
            </div>
            <Badge variant='secondary' className='hidden md:flex'>
              <Sparkles className='h-3 w-3 mr-1' />
              AI-Powered
            </Badge>
          </div>

          <div className='flex items-center space-x-4'>
            <HistorySidebar>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center space-x-2 hover:scale-105 transition-transform'
              >
                <History className='h-4 w-4' />
                <span className='hidden md:inline'>History</span>
              </Button>
            </HistorySidebar>

            <Button
              variant='outline'
              size='sm'
              className='hidden md:flex items-center space-x-2'
              onClick={() => (window.location.href = '/community')}
            >
              <Users className='h-4 w-4' />
              <span>Community</span>
            </Button>

            {isAuthenticated ? (
              <Button
                variant='ghost'
                size='sm'
                className='flex items-center space-x-1'
                onClick={handleLogout}
              >
                <LogOut className='h-4 w-4' />
                <span className='hidden md:inline'>Log Out</span>
              </Button>
            ) : (
              <Button
                size='sm'
                onClick={() => navigate('/signin')}
                className='bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white shadow'
              >
                Sign In
              </Button>
            )}

            <Button
              size='sm'
              className='relative overflow-hidden group bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white shadow'
            >
              <span className='relative z-10'>Upgrade Pro</span>
              <div className='absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity'></div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
