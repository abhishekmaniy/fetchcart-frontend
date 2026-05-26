import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import AuthPage from "./pages/AuthPage";
import Checkout from "./pages/Checkout";
import Community from "./pages/Community";
import Compare from "./pages/Compare";
import CompareCreatePage from "./pages/CompareCreate";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/LandingPage/Index";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import { useAppAuth } from "./hooks/useAppAuth";
import History from "./pages/History";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => {

  const { isAuthInitialized } = useAppAuth()

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">
          Loading application...
        </div>
      </div>
    )
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner
            position="top-right"
            theme="dark"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast:
                  "!bg-zinc-950 !border !border-zinc-800 !text-zinc-100 !shadow-2xl",
                title: "!text-white !font-medium",
                description: "!text-zinc-400",
                success:
                  "!bg-emerald-500/10 !border-emerald-500/20 !text-emerald-300",
                error: "!bg-red-500/10 !border-red-500/20 !text-red-300",
              },
            }}
          />

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />

              <Route
                path="/auth"
                element={
                  <PublicRoute>
                    <AuthPage />
                  </PublicRoute>
                }
              />

              <Route path="/verify-email/:token" element={<VerifyEmail />} />

              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* search form page */}
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* search results page */}
              <Route
                path="/search/:searchId"
                element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                }
              />

              {/* comparison creation page */}
              <Route
                path="/compare"
                element={
                  <ProtectedRoute>
                    <CompareCreatePage />
                  </ProtectedRoute>
                }
              />

              {/* comparison result page */}
              <Route
                path="/compare/:compareId"
                element={
                  <ProtectedRoute>
                    <Compare />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;