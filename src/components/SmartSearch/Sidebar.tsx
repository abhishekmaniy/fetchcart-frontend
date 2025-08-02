import React from 'react'
import { Button } from '@/components/ui/button'
import { Search, Sparkles, TrendingUp, Tag, Star, GitCompareArrows } from 'lucide-react'

type Tab = 'search' | 'trends' | 'compare' | 'deals' | 'recommendations'

interface SidebarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <aside className='h-[calc(100vh-64px)] w-64 bg-white shadow-md border-r border-gray-200 sticky top-[64px] flex flex-col'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold text-gray-800'>Features</h2>
        <p className='text-sm text-gray-500'>Explore the tools available</p>
      </div>
      <div className='space-y-4 px-4 flex-1 overflow-y-auto'>
        <Button
          variant={activeTab === 'search' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('search')}
          className={`w-full justify-start rounded-lg ${activeTab === 'search' ? 'bg-blue-100 text-black hover:text-white' : 'hover:bg-blue-500 hover:text-white'
            }`}
        >
          <Search className='h-5 w-5 mr-3 text-blue-500' />
          Smart Search
        </Button>

        <Button
          variant={activeTab === 'compare' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('compare')}
          className={`w-full justify-start rounded-lg ${activeTab === 'compare' ? 'bg-green-100 text-black hover:text-white' : 'hover:bg-green-500 hover:text-white'
            }`}
        >
          <GitCompareArrows className='h-5 w-5 mr-3 text-green-500' />
          Product Comparison
        </Button>

        <Button
          variant={activeTab === 'deals' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('deals')}
          className={`w-full justify-start rounded-lg ${activeTab === 'deals' ? 'bg-yellow-100 text-black hover:text-white ' : 'hover:bg-yellow-500 hover:text-white'
            }`}
        >
          <Tag className='h-5 w-5 mr-3 text-yellow-500' />
          Find Best Deals
        </Button>

        <Button
          variant={activeTab === 'recommendations' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('recommendations')}
          className={`w-full justify-start rounded-lg ${activeTab === 'recommendations' ? 'bg-purple-100 text-black hover:text-white' : 'hover:bg-purple-500 hover:text-white'
            }`}
        >
          <Star className='h-5 w-5 mr-3 text-purple-500' />
          Recommendations
        </Button>

        <Button
          variant={activeTab === 'trends' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('trends')}
          className={`w-full justify-start rounded-lg ${activeTab === 'trends' ? 'bg-red-100 text-black hover:text-white' : 'hover:bg-red-500 hover:text-white'
            }`}
        >
          <TrendingUp className='h-5 w-5 mr-3 text-red-500' />
          Trends
        </Button>
      </div>
      <div className='px-4 py-4 border-t border-gray-200'>
        <p className='text-xs text-gray-500 text-center'>Need help? <a href='/support' className='text-blue-600 underline'>Contact support</a></p>
      </div>
    </aside>
  )
}

export default Sidebar