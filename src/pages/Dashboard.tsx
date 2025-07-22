import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SearchInterface from '@/components/SearchInterface'
import SearchResults from '@/components/SearchResults'
import AIShoppingAssistant from '@/components/AIShoppingAssistant'
import TrendsAnalytics from '@/components/features/TrendsAnalytics'
import {
  ShoppingCart,
  History,
  Sparkles,
  TrendingUp,
  Users,
  Bell,
  Menu,
  Home,
  Search
} from 'lucide-react'
import { motion } from 'framer-motion'
import HistorySidebar from '@/components/SmartSearch/HistorySidebar'
import Header from '@/components/SmartSearch/Header'
import { useUserStore } from '@/store/userStore'

const Dashboard = () => {
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'assistant' | 'trends'>(
    'search'
  )
  const {user} = useUserStore()

  console.log(user)

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-indigo-100'>
      {/* Animated Colorful Background */}
      <div className='absolute inset-0 -z-10 pointer-events-none'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className='absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-20 blur-3xl'
        />
        <motion.div
          initial={{ scale: 0.7, opacity: 0.4 }}
          animate={{ scale: 1.1, opacity: 0.7 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 1
          }}
          className='absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-20 blur-2xl'
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0.3 }}
          animate={{ scale: 1.05, opacity: 0.5 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.5
          }}
          className='absolute bottom-0 left-1/2 w-[250px] h-[250px] rounded-full bg-gradient-to-tl from-green-300 via-blue-300 to-indigo-400 opacity-10 blur-2xl'
        />
      </div>
      {/* Header */}
      <Header/>

      <main className='max-w-7xl mx-auto px-6 py-8'>
        {/* Quick Stats */}

        {/* Tab Navigation */}
        <div className='flex space-x-1 mb-8 p-1 bg-secondary/50 rounded-xl w-fit'>
          <Button
            variant={activeTab === 'search' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('search')}
            className='rounded-lg transition-all'
          >
            <Search className='h-4 w-4 mr-2' />
            Smart Search
          </Button>
          <Button
            variant={activeTab === 'assistant' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('assistant')}
            className='rounded-lg transition-all'
          >
            <Sparkles className='h-4 w-4 mr-2' />
            AI Assistant
          </Button>
          <Button
            variant={activeTab === 'trends' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('trends')}
            className='rounded-lg transition-all'
          >
            <TrendingUp className='h-4 w-4 mr-2' />
            Trends
          </Button>
        </div>

        {/* Content Area */}
        <div className='space-y-8'>
          {activeTab === 'search' && (
            <div>
              {searchResults ? (
                <SearchResults
                  results={searchResults}
                  onNewSearch={() => setSearchResults(null)}
                />
              ) : (
                <SearchInterface
                  onSearchComplete={setSearchResults}
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                />
              )}
            </div>
          )}

          {activeTab === 'assistant' && <AIShoppingAssistant />}

          {activeTab === 'trends' && <TrendsAnalytics />}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
