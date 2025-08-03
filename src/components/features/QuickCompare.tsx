import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Zap,
  Search,
  Plus,
  Star,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Product } from '@/types'
import { useUserStore } from '@/store/userStore'

function isValidURL(input: string): boolean {
  try {
    const url = new URL(input)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

const QuickCompare = ({ selectedCompare, setSelectedCompare }: { setSelectedCompare: (item: string) => void, selectedCompare: string }) => {
  const [searchQueries, setSearchQueries] = useState(['', ''])
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonId, setComparisonId] = useState<string | null>(null)
  const [searchHistory] = useState([
    'Sony WH-1000XM4 Wireless Headphones',
    'Apple AirPods Pro (2nd Gen)',
    'Bose QuietComfort 45',
    'iPhone 15 Pro Max',
    'Samsung Galaxy S24 Ultra'
  ])
  const { toast } = useToast()
  const { addCompareWithProducts, user } = useUserStore()
  const comparisonData = user?.comparisons?.find(c => c.id === selectedCompare)
  const products = comparisonData?.products || []

  console.log(products.length)

  const handleCompare = async () => {
    const trimmedQueries = searchQueries.map(q => q.trim())

    if (trimmedQueries.some(q => q === '')) {
      toast({
        title: 'Empty Input',
        description: 'All product fields must be filled before comparing.',
        variant: 'destructive'
      })
      return
    }

    for (let i = 0; i < trimmedQueries.length; i++) {
      const q = trimmedQueries[i]
      if (q.startsWith('http') && !isValidURL(q)) {
        toast({
          title: 'Invalid URL',
          description: `Product ${i + 1
            } contains an invalid URL. Please correct it.`,
          variant: 'destructive'
        })
        return
      }
    }

    try {
      setIsComparing(true)
      console.log(trimmedQueries)

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/compare/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queries: trimmedQueries, userId: user.id })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch product data')
      }

      const data = await response.json()
      setComparisonId(data.compare.id)
      addCompareWithProducts(data.compare)

      toast({
        title: 'Comparison Ready!',
        description: 'Products have been analyzed and compared.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive'
      })
    } finally {
      setIsComparing(false)
    }
  }

  const addProduct = () => {
    if (searchQueries.length < 4) {
      setSearchQueries([...searchQueries, ''])
    }
  }

  const removeProduct = (index: number) => {
    if (searchQueries.length > 2) {
      setSearchQueries(searchQueries.filter((_, i) => i !== index))
    }
  }

  const getBetterValue = (products: Product[], field: 'price' | 'rating') => {
    if (products.length < 2) return null

    if (field === 'price') {
      const minPrice = Math.min(
        ...products.map(p => parseFloat(p.price || '0'))
      )
      return products.findIndex(p => parseFloat(p.price || '0') === minPrice)
    } else {
      const maxRating = Math.max(...products.map(p => p.rating || 0))
      return products.findIndex(p => (p.rating || 0) === maxRating)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <div className='flex items-center justify-center space-x-2'>
          <Zap className='h-8 w-8 text-primary animate-pulse' />
          <h2 className='text-2xl font-bold'>Quick Compare</h2>
        </div>
        <p className='text-muted-foreground'>
          Instantly compare similar products across different platforms
        </p>
      </div>

      {!selectedCompare && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Search className='h-5 w-5' />
              <span>Products to Compare</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {searchQueries.map((query, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <div className='flex-1'>
                    <Label htmlFor={`product-${index}`}>
                      Product {index + 1}
                    </Label>
                    <Input
                      id={`product-${index}`}
                      placeholder='Enter product name or URL...'
                      value={query}
                      onChange={e => {
                        const newQueries = [...searchQueries]
                        newQueries[index] = e.target.value
                        setSearchQueries(newQueries)
                      }}
                    />
                  </div>
                  {searchQueries.length > 2 && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => removeProduct(index)}
                      className='mt-6'
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                  )}
                </div>

                <div className='flex flex-wrap gap-1'>
                  <span className='text-xs text-muted-foreground mr-2'>
                    Quick select:
                  </span>
                  {searchHistory.slice(0, 3).map((item, historyIndex) => (
                    <Button
                      key={historyIndex}
                      variant='ghost'
                      size='sm'
                      className='h-6 px-2 text-xs'
                      onClick={() => {
                        const newQueries = [...searchQueries]
                        newQueries[index] = item
                        setSearchQueries(newQueries)
                      }}
                    >
                      {item.length > 20 ? item.substring(0, 20) + '...' : item}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <div className='flex space-x-2'>
              {searchQueries.length < 4 && (
                <Button variant='outline' onClick={addProduct}>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Product
                </Button>
              )}
              <Button
                onClick={handleCompare}
                disabled={isComparing}
                className='flex-1'
              >
                {isComparing ? (
                  <>
                    <Zap className='h-4 w-4 mr-2 animate-spin' />
                    Comparing products...
                  </>
                ) : (
                  <>
                    <Zap className='h-4 w-4 mr-2' />
                    Compare Products
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {products.length > 0 && selectedCompare && (
        <div className='space-y-6'>
          <h3 className='text-xl font-semibold text-left'>
            Comparison Results
          </h3>

          <Card>
            <CardHeader>
              <CardTitle>Quick Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center space-x-2'>
                  <TrendingDown className='h-5 w-5 text-green-600' />
                  <span>
                    Best Price:{' '}
                    {
                      products[getBetterValue(products, 'price') ?? 0]
                        ?.productName
                    }
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <TrendingUp className='h-5 w-5 text-blue-600' />
                  <span>
                    Highest Rated:{' '}
                    {
                      products[getBetterValue(products, 'rating') ?? 0]
                        ?.productName
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {products.map((product, index) => (
              <Card key={product.id} className='relative'>
                {index === getBetterValue(products, 'price') && (
                  <Badge className='absolute top-4 right-4 bg-green-500'>
                    Best Price
                  </Badge>
                )}
                {index === getBetterValue(products, 'rating') && (
                  <Badge className='absolute top-4 right-4 bg-blue-500'>
                    Top Rated
                  </Badge>
                )}
                <CardContent className='p-6'>
                  <div className='space-y-4'>
                    <div className='flex space-x-4'>
                      <img
                        src={product.image}
                        alt={product.productName}
                        className='w-24 h-24 rounded-lg object-cover'
                      />
                      <div className='flex-1 space-y-2'>
                        <h4 className='font-semibold line-clamp-2'>
                          {product.productName}
                        </h4>
                        <div className='flex items-center space-x-2'>
                          <Star className='h-4 w-4 text-yellow-400 fill-current' />
                          <span>{product.rating}</span>
                          <span className='text-muted-foreground'>
                            ({product.reviews})
                          </span>
                        </div>
                        <Badge variant='outline'>{product.store}</Badge>
                      </div>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <span className='text-2xl font-bold text-primary'>
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className='text-lg text-muted-foreground line-through'>
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h5 className='font-medium mb-2'>Key Features</h5>
                      <div className='flex flex-wrap gap-1'>
                        {product.featureBullets?.map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant='secondary'
                            className='text-xs'
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className='font-medium mb-2 text-green-600'>Pros</h5>
                      <ul className='space-y-1'>
                        {product.pros?.map((pro, idx) => (
                          <li
                            key={idx}
                            className='text-sm flex items-start space-x-2'
                          >
                            <span className='text-green-600'>+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className='font-medium mb-2 text-red-600'>Cons</h5>
                      <ul className='space-y-1'>
                        {product.cons?.map((con, idx) => (
                          <li
                            key={idx}
                            className='text-sm flex items-start space-x-2'
                          >
                            <span className='text-red-600'>-</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button onClick={() => { }} className='w-full'>
                      View Product
                      <ArrowRight className='h-4 w-4 ml-2' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickCompare
