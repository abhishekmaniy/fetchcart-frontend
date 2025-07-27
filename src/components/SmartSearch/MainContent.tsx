import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import TrendsAnalytics from '../features/TrendsAnalytics'
import SearchInterface from '../SearchInterface'
import SearchResults from '../SearchResults'
import QuickCompare from '../features/QuickCompare'
import DealAlerts from './AiAssistant/DealAlerts'
import SmartRecommendations from '../features/SmartRecommendations'
import { useUserStore } from '@/store/userStore'
import { Search, Alert, ComparedProduct } from '@/types'

export type Tab = 'search' | 'assistant' | 'trends'

interface MainContentProps {
  activeTab: Tab
  searchResults: Search[] | null
  setSearchResults: (results: Search[] | null) => void
  isSearching: boolean
  setIsSearching: (val: boolean) => void
  activeFeature: string | null
  compareProducts: string[]
  setCompareProducts: (val: string[]) => void
  removeCompareProduct: (index: number) => void
  compareProductsHandler: () => void
  isComparing: boolean
  comparedResults: ComparedProduct[]
  alerts: Alert[]
  newAlert: Alert
  setNewAlert: (val: any) => void
  isCreatingAlert: boolean
  createAlert: () => void
  authResult: any
  setAuthResult: (val: any) => void
  setBudget: (val: number[]) => void
  history: string[]
}

const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  searchResults,
  setSearchResults,
  activeFeature,
  isSearching,
  setIsSearching,
  compareProducts,
  setCompareProducts,
  removeCompareProduct,
  compareProductsHandler,
  isComparing,
  comparedResults,
  alerts,
  newAlert,
  setNewAlert,
  isCreatingAlert,
  createAlert,
  authResult,
  setAuthResult,
  setBudget,
  history
}) => {
  const { user } = useUserStore()
  const [searchParams] = useSearchParams()
  const searchId = searchParams.get('searchId')

  const searchFromStore = useMemo(() => {
    return user?.searches?.find(s => s.id === searchId)
  }, [searchId, user?.searches])

  return (
    <main className='flex-1 px-6 py-8'>
      <div className='space-y-8'>
        {activeTab === 'search' && (
          <>
            {searchFromStore ? (
              <SearchResults
                key={searchId}
                results={searchFromStore}
                onNewSearch={() => {
                  const newUrl = new URL(window.location.href)
                  newUrl.searchParams.delete('searchId')
                  window.history.replaceState({}, '', newUrl.toString())
                  // Optional: trigger reactivity
                  window.dispatchEvent(new PopStateEvent('popstate'))
                }}
              />
            ) : (
              <SearchInterface
                onSearchComplete={setSearchResults}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
              />
            )}
          </>
        )}

        {activeTab === 'assistant' && (
          <>
            {activeFeature === 'compare' && <QuickCompare />}
            {activeFeature === 'deals' && (
              <DealAlerts
                currentDeals={[]}
                newAlert={newAlert}
                setNewAlert={setNewAlert}
                isCreatingAlert={isCreatingAlert}
                createAlert={createAlert}
                alerts={alerts}
              />
            )}
            {activeFeature === 'recommendations' && <SmartRecommendations />}
            {!activeFeature && (
              <div className='text-muted'>
                Select a feature from the sidebar.
              </div>
            )}
          </>
        )}

        {activeTab === 'trends' && <TrendsAnalytics />}
      </div>
    </main>
  )
}

export default MainContent
