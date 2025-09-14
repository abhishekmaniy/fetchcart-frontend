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

const Dashboard = () => {
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'trends' | 'compare' | 'deals' | 'recommendations'>(
    'search'
  )

  const [selectedSearch, setSelectedSearch] = useState<string | null>(null)
  const [selectedCompare, setSelectedCompare] = useState<string | null>(null)
  console.log("searchResults", searchResults)
  console.log("selectedSearch", selectedSearch)

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-pink-50 to-indigo-100">


      <div className="h-16 flex-shrink-0">
        <Header setActiveTab={setActiveTab} setSelectedCompare={setSelectedCompare} setSelectedSearch={setSelectedSearch} />
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto flex h-full overflow-hidden">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <MainContent
              selectedCompare={selectedCompare}
              setSelectedCompare={setSelectedCompare}
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
              activeTab={activeTab}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
