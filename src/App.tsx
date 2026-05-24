import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import AuthPage from "./pages/AuthPage";
import Checkout from "./pages/Checkout";
import CheckoutPage from "./pages/CheckoutPage";
import Community from "./pages/Community";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/LandingPage/Index";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import CompareCreatePage from "./pages/CompareCreate";

const queryClient = new QueryClient();

const App = () => {
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

              {/* <Route path="/checkout" element={<CheckoutPage />} /> */}

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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;