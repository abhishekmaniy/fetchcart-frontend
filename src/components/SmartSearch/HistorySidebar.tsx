import { useState, useMemo } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Clock, Search, Trash2, Star, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUserStore } from '@/store/userStore'

interface HistoryItem {
  id: string
  query: string
  timestamp: Date
  resultsCount: number
  category?: string
  isFavorite: boolean
}

interface HistorySidebarProps {
  children: React.ReactNode
  onSelectHistory?: (item: HistoryItem) => void
}

const HistorySidebar = ({ children, onSelectHistory }: HistorySidebarProps) => {
  const { user } = useUserStore()
  const [filter, setFilter] = useState<'all' | 'favorites' | 'recent'>('all')
  const [open, setOpen] = useState(false)

  const parsedSearches: HistoryItem[] = useMemo(() => {
    const searches = user?.searches ?? []
    return searches.map(search => ({
      id: search.id,
      query: search.query || 'Untitled',
      timestamp: new Date(search.createdAt || Date.now()),
      resultsCount: search.products?.length || 0,
      isFavorite: search.isFavorite ?? false,
      category: undefined
    }))
  }, [user])

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const filteredHistory = parsedSearches.filter(item => {
    if (filter === 'favorites') return item.isFavorite
    if (filter === 'recent')
      return new Date().getTime() - item.timestamp.getTime() < 24 * 60 * 60 * 1000
    return true
  })

  const toggleFavorite = (id: string) => {
    console.log('Toggle favorite for:', id)
    // TODO: Update Zustand store or send PATCH request
  }

  const deleteHistoryItem = (id: string) => {
    console.log('Delete history item:', id)
    // TODO: Remove from Zustand or send DELETE request
  }

  const handleHistoryItemClick = (item: HistoryItem) => {
    // update URL with searchId
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('searchId', item.id)
    window.history.pushState({}, '', newUrl.toString())

    

    // trigger any callback
    onSelectHistory?.(item)

    // close sidebar
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </SheetTrigger>
      <SheetContent side='left' className='w-96 p-0'>
        <SheetHeader className='p-6 pb-4 border-b'>
          <SheetTitle className='flex items-center space-x-2'>
            <Clock className='h-5 w-5' />
            <span>Search History</span>
          </SheetTitle>
        </SheetHeader>

        {/* Filter Buttons */}
        <div className='p-4 border-b bg-secondary/20'>
          <div className='flex space-x-2'>
            <Button size='sm' variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
              All
            </Button>
            <Button
              size='sm'
              variant={filter === 'recent' ? 'default' : 'outline'}
              onClick={() => setFilter('recent')}
              className='flex items-center space-x-1'
            >
              <Calendar className='h-3 w-3' />
              <span>Recent</span>
            </Button>
            <Button
              size='sm'
              variant={filter === 'favorites' ? 'default' : 'outline'}
              onClick={() => setFilter('favorites')}
              className='flex items-center space-x-1'
            >
              <Star className='h-3 w-3' />
              <span>Favorites</span>
            </Button>
          </div>
        </div>

        {/* History Items */}
        <ScrollArea className='flex-1'>
          <div className='p-4 space-y-3'>
            {filteredHistory.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <Search className='h-12 w-12 mx-auto mb-3 opacity-50' />
                <p>No search history found</p>
                <p className='text-sm'>Start searching to see your history here</p>
              </div>
            ) : (
              filteredHistory.map(item => (
                <div
                  key={item.id}
                  className='group bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/50'
                  onClick={() => handleHistoryItemClick(item)}
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-sm leading-tight mb-1 group-hover:text-primary transition-colors'>
                        {item.query}
                      </h4>
                      <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                        <span>{getTimeAgo(item.timestamp)}</span>
                        <span>•</span>
                        <span>{item.resultsCount} results</span>
                        {item.category && (
                          <>
                            <span>•</span>
                            <Badge variant='secondary' className='text-xs py-0'>
                              {item.category}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-6 w-6'
                        onClick={e => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                      >
                        <Star
                          className={`h-3 w-3 ${
                            item.isFavorite ? 'text-yellow-400 fill-current' : ''
                          }`}
                        />
                      </Button>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-6 w-6 hover:bg-destructive/10 hover:text-destructive'
                        onClick={e => {
                          e.stopPropagation()
                          deleteHistoryItem(item.id)
                        }}
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className='p-4 border-t bg-secondary/20'>
          <Button variant='outline' size='sm' className='w-full'>
            <Trash2 className='h-4 w-4 mr-2' />
            Clear All History
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default HistorySidebar
