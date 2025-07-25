import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Brain,
  Star,
  Sparkles,
  ShoppingCart,
  Heart,
  TrendingUp
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const SmartRecommendations = () => {
  const [preferences, setPreferences] = useState({
    budget: '',
    category: '',
    brand: '',
    priority: ''
  })
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const mockRecommendations = [
    {
      id: 'rec1',
      name: 'AI-Recommended Wireless Headphones',
      price: '$89.99',
      originalPrice: '$149.99',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 2847,
      matchScore: 95,
      reasons: ['Perfect for your budget', 'Highly rated', 'Trending']
    },
    {
      id: 'rec2',
      name: 'Smart Fitness Tracker',
      price: '$129.99',
      originalPrice: '$199.99',
      image:
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 1923,
      matchScore: 88,
      reasons: ['Based on your interests', 'Great value', 'Popular choice']
    },
    {
      id: 'rec3',
      name: 'Premium Coffee Maker',
      price: '$199.99',
      originalPrice: '$299.99',
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 1456,
      matchScore: 82,
      reasons: ['High quality', 'Energy efficient', "Editor's choice"]
    }
  ]

  const handleGetRecommendations = async () => {
    setIsLoading(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRecommendations(mockRecommendations)
    setIsLoading(false)
    toast({
      title: 'Recommendations Ready!',
      description:
        'AI has found the best products for you based on your preferences.'
    })
  }

  return (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <div className='flex items-center justify-center space-x-2'>
          <Brain className='h-8 w-8 text-primary animate-pulse' />
          <h2 className='text-2xl font-bold'>Smart Recommendations</h2>
        </div>
        <p className='text-muted-foreground'>
          Let our AI find the perfect products tailored to your preferences and
          budget
        </p>
      </div>

      {/* Preferences Form */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Sparkles className='h-5 w-5' />
            <span>Tell us your preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='budget'>Budget Range</Label>
              <Select
                value={preferences.budget}
                onValueChange={value =>
                  setPreferences({ ...preferences, budget: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select budget range' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='under-50'>Under $50</SelectItem>
                  <SelectItem value='50-100'>$50 - $100</SelectItem>
                  <SelectItem value='100-200'>$100 - $200</SelectItem>
                  <SelectItem value='200-500'>$200 - $500</SelectItem>
                  <SelectItem value='over-500'>Over $500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='category'>Category</Label>
              <Select
                value={preferences.category}
                onValueChange={value =>
                  setPreferences({ ...preferences, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='electronics'>Electronics</SelectItem>
                  <SelectItem value='clothing'>Clothing</SelectItem>
                  <SelectItem value='home'>Home & Garden</SelectItem>
                  <SelectItem value='health'>Health & Beauty</SelectItem>
                  <SelectItem value='sports'>Sports & Outdoors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='brand'>Preferred Brand</Label>
              <Input
                id='brand'
                placeholder='Enter brand name (optional)'
                value={preferences.brand}
                onChange={e =>
                  setPreferences({ ...preferences, brand: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor='priority'>Priority</Label>
              <Select
                value={preferences.priority}
                onValueChange={value =>
                  setPreferences({ ...preferences, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="What's most important?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='price'>Best Price</SelectItem>
                  <SelectItem value='quality'>Best Quality</SelectItem>
                  <SelectItem value='rating'>Highest Rated</SelectItem>
                  <SelectItem value='popularity'>Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGetRecommendations}
            className='w-full'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Brain className='h-4 w-4 mr-2 animate-spin' />
                AI is analyzing...
              </>
            ) : (
              <>
                <Sparkles className='h-4 w-4 mr-2' />
                Get Smart Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations Results */}
      {recommendations.length > 0 && (
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold flex items-center space-x-2'>
            <TrendingUp className='h-5 w-5' />
            <span>Your Personalized Recommendations</span>
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recommendations.map(product => (
              <Card
                key={product.id}
                className='group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]'
              >
                <CardContent className='p-4'>
                  <div className='relative mb-4'>
                    <div className='aspect-square bg-secondary/30 rounded-lg overflow-hidden'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                      />
                    </div>
                    <Badge className='absolute top-2 right-2 bg-green-500 text-white'>
                      {product.matchScore}% Match
                    </Badge>
                  </div>

                  <h4 className='font-semibold mb-2 line-clamp-2'>
                    {product.name}
                  </h4>

                  <div className='flex items-center mb-2'>
                    <Star className='h-4 w-4 text-yellow-400 fill-current' />
                    <span className='ml-1 text-sm'>{product.rating}</span>
                    <span className='text-sm text-muted-foreground ml-1'>
                      ({product.reviews})
                    </span>
                  </div>

                  <div className='flex items-center space-x-2 mb-3'>
                    <span className='text-lg font-bold text-primary'>
                      {product.price}
                    </span>
                    <span className='text-sm text-muted-foreground line-through'>
                      {product.originalPrice}
                    </span>
                  </div>

                  <div className='space-y-2 mb-4'>
                    <p className='text-sm font-medium'>
                      Why we recommend this:
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {product.reasons.map((reason: string, index: number) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='text-xs'
                        >
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='flex space-x-2'>
                    <Button size='sm' className='flex-1'>
                      <ShoppingCart className='h-4 w-4 mr-1' />
                      Add to Cart
                    </Button>
                    <Button size='sm' variant='outline'>
                      <Heart className='h-4 w-4' />
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

export default SmartRecommendations
