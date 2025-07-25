import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge, Target } from 'lucide-react'
import React from 'react'

type Timeframe = 'day' | 'week' | 'month' | 'year' // Adjust as needed
type Product = {
  id: string
  name: string
  price: number
  originalPrice: number
  rating: number
  valueScore: number
  savings: number
  image: string
}

const BudgetOptimizer = ({
  budget,
  setBudget,
  setBudgetCategory,
  timeframe,
  budgetCategory,
  setTimeframe,
  savingsGoal,
  setSavingsGoal,
  optimizeBudget,
  isOptimizing,
  optimizedProducts
}: {
  budget: number[]
  setBudget: React.Dispatch<React.SetStateAction<number[]>>
  setBudgetCategory: (value: string) => void
  timeframe: Timeframe
  budgetCategory: string
  setTimeframe: (value: string) => void
  savingsGoal: number[]
  setSavingsGoal: React.Dispatch<React.SetStateAction<number[]>>
  optimizeBudget: () => void
  isOptimizing: boolean
  optimizedProducts: Product[]
}) => {
  return (
    <div className='space-y-6'>
      <Card className='border-border bg-card'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2 text-foreground'>
            <Target className='h-5 w-5' />
            <span>Budget & Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <Label className='text-foreground'>Budget: ${budget[0]}</Label>
            <div className='mt-2'>
              <Slider
                value={budget}
                onValueChange={setBudget}
                max={2000}
                min={50}
                step={50}
                className='w-full'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='category' className='text-foreground'>
                Product Category
              </Label>
              <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                <SelectTrigger className='bg-background border-border'>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  <SelectItem value='Electronics'>Electronics</SelectItem>
                  <SelectItem value='Home & Kitchen'>Home & Kitchen</SelectItem>
                  <SelectItem value='Furniture'>Furniture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='timeframe' className='text-foreground'>
                Budget Timeframe
              </Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className='bg-background border-border'>
                  <SelectValue placeholder='Select timeframe' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='week'>Weekly</SelectItem>
                  <SelectItem value='month'>Monthly</SelectItem>
                  <SelectItem value='quarter'>Quarterly</SelectItem>
                  <SelectItem value='year'>Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className='text-foreground'>
              Savings Goal: ${savingsGoal[0]} per {timeframe}
            </Label>
            <div className='mt-2'>
              <Slider
                value={savingsGoal}
                onValueChange={setSavingsGoal}
                max={500}
                min={10}
                step={10}
                className='w-full'
              />
            </div>
          </div>

          <Button
            onClick={optimizeBudget}
            className='w-full'
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <Target className='h-4 w-4 mr-2 animate-spin' />
                Optimizing your budget...
              </>
            ) : (
              <>
                <Target className='h-4 w-4 mr-2' />
                Optimize Budget
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {optimizedProducts.length > 0 && (
        <Card className='border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-foreground'>
              Optimized Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {optimizedProducts.map(product => (
                <div
                  key={product.id}
                  className='flex items-center space-x-4 p-4 bg-secondary/30 dark:bg-secondary/50 rounded-lg'
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-16 h-16 rounded-lg object-cover'
                  />
                  <div className='flex-1 space-y-2'>
                    <h4 className='font-semibold text-foreground'>
                      {product.name}
                    </h4>
                    <div className='flex items-center space-x-2'>
                      <span className='text-lg font-bold text-primary'>
                        ${product.price}
                      </span>
                      <Badge className='bg-green-500 text-white'>
                        Value Score: {product.valueScore}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BudgetOptimizer
