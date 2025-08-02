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

export type Tab = 'search' | 'trends' | 'compare' | 'deals' | 'recommendations'

interface MainContentProps {
  selectedSearch: string | null
  setSelectedSearch: (item: string) => void
  activeTab: Tab
  searchResults: Search[] | null
  setSearchResults: (results: Search[] | null) => void
  isSearching: boolean
  setIsSearching: (val: boolean) => void
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
  selectedSearch,
  setSelectedSearch,
  activeTab,
  searchResults,
  setSearchResults,
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
  console.log(user)
  console.log(user?.searches?.find(s => s.id === selectedSearch))

  const searchFromStore = useMemo(() => {
    return user?.searches?.find(s => s.id === selectedSearch)
  }, [selectedSearch, user])

  console.log(user)
  console.log(selectedSearch)

  return (
    <main className="px-6 py-8">
      <div className='space-y-8'>
        {activeTab === 'search' && (
          <>
            {searchFromStore ? (
              <SearchResults
                key={selectedSearch}
                results={searchFromStore}
                onNewSearch={() => {
                  const newUrl = new URL(window.location.href)
                  newUrl.searchParams.delete('searchId')
                  window.history.replaceState({}, '', newUrl.toString())
                  // Optional: trigger reactivity
                  window.dispatchEvent(new PopStateEvent('popstate'))
                  setSelectedSearch(null)
                  setSearchResults(null)

                }}
              />
            ) : (
              <SearchInterface
                onSearchComplete={newSearch => {
                  console.log("Reach in the onsearchComplete")
                  console.log(newSearch)
                  setSearchResults([newSearch])
                  setSelectedSearch(newSearch.id)
                  setIsSearching(false)
                }}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
              />
            )}
          </>
        )}

        <>
          {activeTab === 'compare' && <QuickCompare />}
          {activeTab === 'deals' && (
            <DealAlerts
              currentDeals={[]}
              newAlert={newAlert}
              setNewAlert={setNewAlert}
              isCreatingAlert={isCreatingAlert}
              createAlert={createAlert}
              alerts={alerts}
            />
          )}
          {activeTab === 'recommendations' && <SmartRecommendations />}
          {!activeTab && (
            <div className='text-muted'>
              Select a feature from the sidebar.
            </div>
          )}
        </>


        {activeTab === 'trends' && <TrendsAnalytics />}
      </div>
    </main>
  )
}

export default MainContent
