import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Checkout from './pages/Checkout'
import Community from './pages/Community'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignInPage from './components/SigninPage/SignInPage'
import SignUpPage from './components/SigninPage/SignUpPage'
import VerifyPage from './components/VerifyPage/VerifyPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AuthProvider from './components/AuthProvider'

const queryClient = new QueryClient()

const App = () => (
  <AuthProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route
                path='/'
                element={
                  <PublicRoute>
                    <Index />
                  </PublicRoute>
                }
              />
              <Route
                path='/signin'
                element={
                  <PublicRoute>
                    <SignInPage />
                  </PublicRoute>
                }
              />
              <Route
                path='/signup'
                element={
                  <PublicRoute>
                    <SignUpPage />
                  </PublicRoute>
                }
              />

              {/* Open Verification Route */}
              <Route
                path='/user/:userId/verify/:token'
                element={<VerifyPage />}
              />

              {/* Protected Routes */}
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path='/'
                element={
                  <ProtectedRoute>
                    <SmartSearch />
                  </ProtectedRoute>
                }
              /> */}

              <Route
                path='/checkout'
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/community'
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
              {/* 404 */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </AuthProvider>
)

export default App
