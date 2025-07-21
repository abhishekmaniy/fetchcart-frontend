import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-md">
      {/* Animated Colorful Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="h-1 w-full bg-gradient-to-r from-indigo-500 via-pink-400 to-yellow-400"
        style={{ transformOrigin: "left" }}
      />
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -12, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="p-2 bg-gradient-to-br from-indigo-500 via-pink-400 to-yellow-400 rounded-lg shadow"
            >
              <ShoppingCart className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
              FetchCart
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-indigo-700 font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-pink-600 font-medium transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground hover:text-yellow-500 font-medium transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-muted-foreground hover:text-indigo-700 font-medium transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="http://localhost:8080/signin">
              <Button className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white shadow hover:scale-105 transition-transform">
                Login with Google
              </Button>
            </a>
            <Button variant="ghost" onClick={() => navigate('/signin')}>Sign In</Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white shadow hover:scale-105 transition-transform"
            >
              Try Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t bg-white/95 shadow-lg rounded-b-xl"
          >
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-muted-foreground hover:text-indigo-700 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-pink-600 font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-muted-foreground hover:text-yellow-500 font-medium transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-muted-foreground hover:text-indigo-700 font-medium transition-colors"
              >
                FAQ
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" onClick={() => navigate('/signin')}>Sign In</Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white shadow hover:scale-105 transition-transform"
                >
                  Try Now
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header