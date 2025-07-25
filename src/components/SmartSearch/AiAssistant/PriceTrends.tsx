import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link2, Search } from 'lucide-react'

const PriceTrends = ({
  isAnalyzing,
  setProductUrl,
  productUrl,
  priceHistory,
  analyzePriceTrend
}: {
  isAnalyzing: boolean
  setProductUrl: (url: string) => void
  productUrl: string
  priceHistory: any[]
  analyzePriceTrend: () => void
}) => {
  return (
    <div className='space-y-6'>
      <Card className='border-border bg-card'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2 text-foreground'>
            <Link2 className='h-5 w-5' />
            <span>Product Price Trend Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='product-url' className='text-foreground'>
              Product URL
            </Label>
            <Input
              id='product-url'
              placeholder='Paste any product URL to analyze its price history...'
              value={productUrl}
              onChange={e => setProductUrl(e.target.value)}
              className='bg-background border-border text-foreground'
            />
          </div>
          <Button
            onClick={analyzePriceTrend}
            disabled={isAnalyzing}
            className='w-full'
          >
            {isAnalyzing ? (
              <>
                <Search className='h-4 w-4 mr-2 animate-spin' />
                Analyzing price trends...
              </>
            ) : (
              <>
                <Search className='h-4 w-4 mr-2' />
                Analyze Price Trend
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {priceHistory.length > 0 && (
        <Card className='border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-foreground'>
              Price History & Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-primary'>
                    ${priceHistory[priceHistory.length - 1]?.price}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Current Price
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                    -26.7%
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Price Drop
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                    ${priceHistory[0]?.price}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Highest Price
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                    Next Week
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Best Time to Buy
                  </div>
                </div>
              </div>

              <div className='bg-secondary/30 dark:bg-secondary/50 p-4 rounded-lg'>
                <h4 className='font-semibold mb-2 text-foreground'>
                  Price Trend Insights
                </h4>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li>
                    • Price has been steadily declining over the past 3 months
                  </li>
                  <li>• Predicted to reach lowest point next week ($199.99)</li>
                  <li>
                    • Historical data shows prices typically rise after seasonal
                    sales
                  </li>
                  <li>
                    • 89% chance of further price drops in the next 7 days
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PriceTrends
