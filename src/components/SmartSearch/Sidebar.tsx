import React from 'react'
import { Button } from '@/components/ui/button'
import { Search, Sparkles, TrendingUp } from 'lucide-react'
import { AssistantFeature } from '@/types'

type Tab = 'search' | 'assistant' | 'trends'


interface SidebarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  activeFeature: AssistantFeature | null
  setActiveFeature: (feature: AssistantFeature | null) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeFeature,
  setActiveFeature
}) => {
  return (
    <aside className='w-64 pr-6 border-r border-muted/30'>
      <div className='space-y-2'>
        <Button
          variant={activeTab === 'search' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('search')}
          className='w-full justify-start rounded-lg'
        >
          <Search className='h-4 w-4 mr-2' />
          Smart Search
        </Button>

        <Button
          variant={activeTab === 'assistant' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('assistant')}
          className='w-full justify-start rounded-lg'
        >
          <Sparkles className='h-4 w-4 mr-2' />
          AI Assistant
        </Button>

        <Button
          variant={activeTab === 'trends' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('trends')}
          className='w-full justify-start rounded-lg'
        >
          <TrendingUp className='h-4 w-4 mr-2' />
          Trends
        </Button>
      </div>

      {activeTab === 'assistant' && (
        <div className='mt-4 space-y-2'>
          {[
            { id: 'compare', label: 'Product Comparison' },
            { id: 'deals', label: 'Find Best Deals' },
            { id: 'recommendations', label: 'Recommendations' },
          ].map((item) => (
            <Button
              key={item.id}
              variant={
                activeFeature === item.id ? 'default' : 'secondary'
              }
              className='w-full justify-start text-sm'
              onClick={() => setActiveFeature(item.id as AssistantFeature)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </aside>
  )
}

export default Sidebar
