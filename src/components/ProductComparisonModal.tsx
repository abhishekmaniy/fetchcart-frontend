import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  X,
  Star,
  ArrowRight,
  GitCompareArrows,
  Sparkles
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name?: string
  productName?: string
  price: string
  originalPrice?: string
  image: string
  rating: number
  reviews: number
  store: string
  savings?: string
}

interface ProductComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  initialProduct?: Product
  searchResults?: Product[]
  pastSearches?: string[]
}

const ProductComparisonModal = ({
  isOpen,
  onClose,
  initialProduct,
  searchResults = [],
  pastSearches = []
}: ProductComparisonModalProps) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchMode, setSearchMode] = useState<'results' | 'new' | 'history'>(
    'results'
  )

  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && initialProduct) {
      setSelectedProducts(prev => {
        const exists = prev.some(product => product.id === initialProduct.id)
        return exists ? prev : [initialProduct, ...prev].slice(0, 4)
      })
    }
  }, [isOpen, initialProduct])

  const mockNewSearchResults: Product[] = [
    {
      id: 'new1',
      name: 'Similar Product Alternative',
      price: '$89.99',
      originalPrice: '$129.99',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 892,
      store: 'TechMart',
      savings: '$40'
    },
    {
      id: 'new2',
      name: 'Budget-Friendly Option',
      price: '$45.99',
      image:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
      rating: 4.1,
      reviews: 634,
      store: 'ValueShop'
    }
  ]

  const handleSearch = async () => {
    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsSearching(false)
    setSearchMode('new')
  }

  const addToComparison = (product: Product) => {
    if (selectedProducts.length >= 4) {
      toast({
        title: 'Maximum products reached',
        description: 'You can compare up to 4 products at once.',
        variant: 'destructive'
      })
      return
    }

    if (selectedProducts.find(p => p.id === product.id)) {
      toast({
        title: 'Product already added',
        description: 'This product is already in your comparison.',
        variant: 'destructive'
      })
      return
    }

    setSelectedProducts(prev => [...prev, product])

    toast({
      title: 'Product added',
      description: 'Product added to comparison successfully.'
    })
  }

  const removeFromComparison = (productId: string) => {
    setSelectedProducts(prev => prev.filter(product => product.id !== productId))
  }

  const ProductCard = ({
    product,
    isSelected = false
  }: {
    product: Product
    isSelected?: boolean
  }) => {
    const productTitle = product.productName || product.name || 'Unnamed Product'

    return (
      <div
        className={`group relative glass border rounded-3xl p-4 transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${
          isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border/70'
        }`}
      >
        <div className='absolute -top-16 -right-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity' />

        <div className='relative aspect-square bg-card/70 rounded-2xl mb-3 overflow-hidden border border-border/60'>
          <img
            src={product.image || '/placeholder.png'}
            alt={productTitle}
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>

        <h4 className='relative font-medium text-sm leading-tight mb-2 line-clamp-2'>
          {productTitle}
        </h4>

        <div className='relative flex items-center mb-2'>
          <Star className='h-3.5 w-3.5 text-primary fill-primary' />
          <span className='ml-1 text-xs'>{product.rating || 'N/A'}</span>
          {product.reviews && (
            <span className='text-xs text-muted-foreground ml-1'>
              ({product.reviews})
            </span>
          )}
        </div>

        <div className='relative flex items-center justify-between gap-2 mb-3'>
          <div className='min-w-0'>
            <span className='font-bold text-primary'>{product.price}</span>
            {product.originalPrice && (
              <span className='ml-1 text-xs text-muted-foreground line-through'>
                {product.originalPrice}
              </span>
            )}
          </div>

          {product.savings && (
            <Badge
              variant='secondary'
              className='rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px]'
            >
              Save {product.savings}
            </Badge>
          )}
        </div>

        <Button
          size='sm'
          className={`relative w-full rounded-xl ${
            isSelected
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
              : 'bg-primary-gradient text-white shadow-soft hover:shadow-glow'
          }`}
          onClick={() =>
            isSelected
              ? removeFromComparison(product.id)
              : addToComparison(product)
          }
          variant={isSelected ? 'ghost' : 'default'}
        >
          {isSelected ? (
            <X className='h-3.5 w-3.5 mr-1.5' />
          ) : (
            <Plus className='h-3.5 w-3.5 mr-1.5' />
          )}
          {isSelected ? 'Remove' : 'Add to Compare'}
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto border border-border/70 bg-background/90 backdrop-blur-xl shadow-elegant rounded-3xl p-0'>
        <div className='relative overflow-hidden rounded-3xl'>
          <div className='absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl' />
          <div className='absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl' />

          <div className='relative p-6 sm:p-8 space-y-8'>
            <DialogHeader>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-primary shadow-soft mb-3'>
                    <Sparkles className='h-3.5 w-3.5' />
                    AI comparison
                  </div>

                  <DialogTitle className='font-display text-4xl tracking-tight'>
                    Product{' '}
                    <span className='text-gradient italic'>Comparison</span>
                  </DialogTitle>

                  <p className='mt-2 text-sm text-muted-foreground'>
                    Compare up to 4 products from current results, new search,
                    or past searches.
                  </p>
                </div>
              </div>
            </DialogHeader>

            {selectedProducts.length > 0 && (
              <section className='space-y-4 rounded-3xl glass border border-border/70 p-5 shadow-soft'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                  <h3 className='text-lg font-semibold'>
                    Comparing Products ({selectedProducts.length}/4)
                  </h3>

                  {selectedProducts.length >= 2 && (
                    <Button className='rounded-xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow'>
                      View Detailed Comparison
                      <ArrowRight className='h-4 w-4 ml-2' />
                    </Button>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  {selectedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelected
                    />
                  ))}
                </div>
              </section>
            )}

            <section className='rounded-3xl glass border border-border/70 p-5 shadow-soft space-y-4'>
              <div className='flex flex-col sm:flex-row gap-2'>
                <div className='flex-1 relative'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Search for products to compare...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className='pl-11 h-11 rounded-xl bg-card/70 border-border/70'
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className='h-11 rounded-xl bg-primary-gradient text-white shadow-soft hover:shadow-glow'
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>

              <div className='flex flex-wrap gap-2'>
                {[
                  { key: 'results', label: 'Current Results' },
                  { key: 'new', label: 'New Search' },
                  { key: 'history', label: 'Past Searches' }
                ].map(item => (
                  <Button
                    key={item.key}
                    variant={searchMode === item.key ? 'default' : 'outline'}
                    size='sm'
                    onClick={() =>
                      setSearchMode(item.key as 'results' | 'new' | 'history')
                    }
                    className={`rounded-full ${
                      searchMode === item.key
                        ? 'bg-primary-gradient text-white shadow-soft'
                        : 'bg-card/70 border-border/70'
                    }`}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </section>

            <section className='space-y-4'>
              {searchMode === 'results' && (
                <>
                  <SectionTitle title='From Current Search Results' />
                  <ProductGrid
                    products={searchResults}
                    selectedProducts={selectedProducts}
                    ProductCard={ProductCard}
                  />
                </>
              )}

              {searchMode === 'new' && (
                <>
                  <SectionTitle title={`Search Results for "${searchQuery}"`} />
                  <ProductGrid
                    products={mockNewSearchResults}
                    selectedProducts={selectedProducts}
                    ProductCard={ProductCard}
                  />
                </>
              )}

              {searchMode === 'history' && (
                <div className='rounded-3xl glass border border-border/70 p-5 shadow-soft'>
                  <SectionTitle title='From Past Searches' />

                  <div className='mt-4 space-y-2'>
                    {pastSearches.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>
                        No past searches found.
                      </p>
                    ) : (
                      pastSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant='ghost'
                          className='w-full justify-start rounded-xl text-left hover:bg-accent/70'
                          onClick={() => {
                            setSearchQuery(search)
                            handleSearch()
                          }}
                        >
                          <Search className='h-4 w-4 mr-2' />
                          {search}
                        </Button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <h4 className='flex items-center gap-2 text-base font-semibold'>
      <span className='h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-primary'>
        <GitCompareArrows className='h-4 w-4' />
      </span>
      {title}
    </h4>
  )
}

const ProductGrid = ({
  products,
  selectedProducts,
  ProductCard
}: {
  products: Product[]
  selectedProducts: Product[]
  ProductCard: React.ComponentType<{
    product: Product
    isSelected?: boolean
  }>
}) => {
  if (!products.length) {
    return (
      <div className='rounded-3xl glass border border-border/70 p-8 text-center text-sm text-muted-foreground shadow-soft'>
        No products available.
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProducts.some(p => p.id === product.id)}
        />
      ))}
    </div>
  )
}

export default ProductComparisonModal