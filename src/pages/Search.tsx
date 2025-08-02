import Header from '@/components/SmartSearch/Header'
import MainContent from '@/components/SmartSearch/MainContent'
import Sidebar from '@/components/SmartSearch/Sidebar'
import { useUserStore } from '@/store/userStore'
import { Alert, AssistantFeature } from '@/types'
import { motion } from 'framer-motion'
import { useState } from 'react'

const newAlert: Alert = {
  id: 'alert-001',
  productName: 'Sony WH-1000XM4 Wireless Headphones',
  productUrl: 'https://www.amazon.com/dp/B08MVCLBYF',
  currentPrice: 279.99,
  targetPrice: 250.0,
  isActive: true,
  createdAt: '2025-07-20T10:15:00Z'
}

const Search = () => {
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'assistant' | 'trends'>(
    'search'
  )
  const [activeFeature, setActiveFeature] = useState<AssistantFeature | null>(
    null
  )
  const [selectedSearch, setSelectedSearch] = useState("")

  const { user } = useUserStore()

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-indigo-100'>
      {/* Animated Background */}
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

      <Header setSelectedSearch={setSelectedSearch} />

      {/* Main Layout: Sidebar + Content */}
      <div className='max-w-7xl mx-auto px-6 py-8 flex'>
        {/* Sidebar */}
        <Sidebar
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content */}
        <MainContent
          selectedSearch={selectedSearch}
          setSelectedSearch={setSelectedSearch}
          alerts={[]}
          authResult={[]}
          compareProducts={[]}
          compareProductsHandler={() => { }}
          comparedResults={[]}
          createAlert={() => { }}
          isComparing={false}
          isCreatingAlert={false}
          isSearching={isSearching}
          newAlert={newAlert}
          removeCompareProduct={() => { }}
          setAuthResult={() => { }}
          setBudget={() => { }}
          setCompareProducts={() => { }}
          setIsSearching={setIsSearching}
          setNewAlert={() => { }}
          setSearchResults={setSearchResults}
          history={[]}
          searchResults={searchResults}
          activeFeature={activeFeature}
          activeTab={activeTab}
        />
      </div>
    </div>
  )
}

export default Search
