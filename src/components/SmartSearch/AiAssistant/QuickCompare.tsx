import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ComparedProduct } from '@/types'
import { ChevronRight, Minus, Plus, Star, Zap } from 'lucide-react'
import React from 'react'



type QuickCompareProps = {
  compareProducts: string[]
  setCompareProducts: React.Dispatch<React.SetStateAction<string[]>>
  removeCompareProduct: (index: number) => void
  compareProductsHandler: () => void
  isComparing: boolean
  comparedResults: ComparedProduct[]
  addCompareProduct: () => void
  searchHistory: string[]
}

const QuickCompare = ({
  compareProducts,
  setCompareProducts,
  removeCompareProduct,
  compareProductsHandler,
  isComparing,
  comparedResults,
  addCompareProduct,
  searchHistory
}: QuickCompareProps) => {
  return (
    <div className='space-y-6'>
      <Card className='border-border bg-card'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2 text-foreground'>
            <Zap className='h-5 w-5' />
            <span>Products to Compare</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {compareProducts.map((product, index) => (
            <div key={index} className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <div className='flex-1'>
                  <Label
                    htmlFor={`product-${index}`}
                    className='text-foreground'
                  >
                    Product {index + 1}
                  </Label>
                  <Input
                    id={`product-${index}`}
                    placeholder='Enter product name or URL...'
                    value={product}
                    onChange={e => {
                      const newProducts = [...compareProducts]
                      newProducts[index] = e.target.value
                      setCompareProducts(newProducts)
                    }}
                    className='bg-background border-border text-foreground'
                  />
                </div>
                {compareProducts.length > 2 && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => removeCompareProduct(index)}
                    className='mt-6'
                  >
                    <Minus className='h-4 w-4' />
                  </Button>
                )}
              </div>

              {/* Quick selection from search history */}
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
                      const newProducts = [...compareProducts]
                      newProducts[index] = item
                      setCompareProducts(newProducts)
                    }}
                  >
                    {item.length > 20 ? item.substring(0, 20) + '...' : item}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          <div className='flex space-x-2'>
            {compareProducts.length < 4 && (
              <Button variant='outline' onClick={addCompareProduct}>
                <Plus className='h-4 w-4 mr-2' />
                Add Product
              </Button>
            )}

            <Button
              onClick={compareProductsHandler}
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

      {comparedResults.length > 0 && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {comparedResults.map(product => (
            <Card key={product.id} className='border-border bg-card'>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <div className='flex space-x-4'>
                    <img
                      src={product.image}
                      alt={product.name}
                      className='w-24 h-24 rounded-lg object-cover'
                    />
                    <div className='flex-1 space-y-2'>
                      <h4 className='font-semibold line-clamp-2 text-foreground'>
                        {product.name}
                      </h4>
                      <div className='flex items-center space-x-2'>
                        <Star className='h-4 w-4 text-yellow-400 fill-current' />
                        <span className='text-foreground'>
                          {product.rating}
                        </span>
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

                  <Button className='w-full'>
                    View Product
                    <ChevronRight className='h-4 w-4 ml-2' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuickCompare
