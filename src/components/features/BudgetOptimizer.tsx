import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Target, DollarSign, Star, TrendingUp, Percent, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OptimizedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  store: string;
  valueScore: number;
  savings: number;
  category: string;
}

const BudgetOptimizer = () => {
  const [budget, setBudget] = useState([500]);
  const [category, setCategory] = useState("");
  const [priorities, setPriorities] = useState({
    price: 70,
    quality: 20,
    features: 10
  });
  const [optimizedProducts, setOptimizedProducts] = useState<OptimizedProduct[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const { toast } = useToast();

  const mockProducts: OptimizedProduct[] = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      originalPrice: 149.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      rating: 4.6,
      reviews: 2847,
      store: "Amazon",
      valueScore: 95,
      savings: 60,
      category: "Electronics"
    },
    {
      id: "2",
      name: "Fitness Tracker Smartwatch",
      price: 129.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop",
      rating: 4.4,
      reviews: 1923,
      store: "Best Buy",
      valueScore: 88,
      savings: 70,
      category: "Electronics"
    },
    {
      id: "3",
      name: "Premium Coffee Maker",
      price: 179.99,
      originalPrice: 249.99,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
      rating: 4.7,
      reviews: 1456,
      store: "Target",
      valueScore: 92,
      savings: 70,
      category: "Home & Kitchen"
    },
    {
      id: "4",
      name: "Ergonomic Office Chair",
      price: 99.99,
      originalPrice: 149.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
      rating: 4.3,
      reviews: 892,
      store: "Office Depot",
      valueScore: 85,
      savings: 50,
      category: "Furniture"
    }
  ];

  const handleOptimize = async () => {
    if (!category) {
      toast({
        title: "Category Required",
        description: "Please select a category to optimize your budget.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    // Simulate optimization
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Filter and sort products based on budget and priorities
    const filteredProducts = mockProducts.filter(product => 
      product.price <= budget[0] && 
      (category === "all" || product.category === category)
    );
    
    setOptimizedProducts(filteredProducts);
    setTotalSpent(filteredProducts.reduce((sum, product) => sum + product.price, 0));
    setIsOptimizing(false);
    
    toast({
      title: "Budget Optimized!",
      description: `Found ${filteredProducts.length} products that maximize your budget value.`
    });
  };

  const updatePriority = (type: keyof typeof priorities, value: number) => {
    const remaining = 100 - value;
    const otherKeys = Object.keys(priorities).filter(key => key !== type) as Array<keyof typeof priorities>;
    const otherTotal = otherKeys.reduce((sum, key) => sum + priorities[key], 0);
    
    const newPriorities = { ...priorities, [type]: value };
    
    if (otherTotal > 0) {
      otherKeys.forEach(key => {
        newPriorities[key] = Math.round((priorities[key] / otherTotal) * remaining);
      });
    }
    
    setPriorities(newPriorities);
  };

  const getTotalSavings = () => {
    return optimizedProducts.reduce((sum, product) => sum + product.savings, 0);
  };

  const getAverageValueScore = () => {
    if (optimizedProducts.length === 0) return 0;
    return Math.round(optimizedProducts.reduce((sum, product) => sum + product.valueScore, 0) / optimizedProducts.length);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Target className="h-8 w-8 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Budget Optimizer</h2>
        </div>
        <p className="text-muted-foreground">
          Find the best value products within your budget using AI optimization
        </p>
      </div>

      {/* Budget Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Budget & Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Slider */}
          <div>
            <Label>Budget: ${budget[0]}</Label>
            <div className="mt-2">
              <Slider
                value={budget}
                onValueChange={setBudget}
                max={2000}
                min={50}
                step={50}
                className="w-full"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <Label htmlFor="category">Product Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Sports">Sports & Outdoors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Sliders */}
          <div className="space-y-4">
            <Label>Optimization Priorities (Total: 100%)</Label>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Price ({priorities.price}%)</span>
                <span className="text-sm text-muted-foreground">Value for money</span>
              </div>
              <Slider
                value={[priorities.price]}
                onValueChange={(value) => updatePriority('price', value[0])}
                max={90}
                min={10}
                step={5}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Quality ({priorities.quality}%)</span>
                <span className="text-sm text-muted-foreground">Ratings & reviews</span>
              </div>
              <Slider
                value={[priorities.quality]}
                onValueChange={(value) => updatePriority('quality', value[0])}
                max={90}
                min={10}
                step={5}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Features ({priorities.features}%)</span>
                <span className="text-sm text-muted-foreground">Product capabilities</span>
              </div>
              <Slider
                value={[priorities.features]}
                onValueChange={(value) => updatePriority('features', value[0])}
                max={90}
                min={10}
                step={5}
              />
            </div>
          </div>

          <Button 
            onClick={handleOptimize}
            className="w-full"
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <Target className="h-4 w-4 mr-2 animate-spin" />
                Optimizing your budget...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Optimize Budget
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimizedProducts.length > 0 && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${(budget[0] - totalSpent).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Budget Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${getTotalSavings()}</div>
                  <div className="text-sm text-muted-foreground">Total Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{getAverageValueScore()}</div>
                  <div className="text-sm text-muted-foreground">Avg Value Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimized Products */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recommended Products</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {optimizedProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                          {product.valueScore}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold line-clamp-2">{product.name}</h4>
                        
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            <Percent className="h-3 w-3 mr-1" />
                            Save ${product.savings}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{product.store}</Badge>
                          <Button size="sm">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetOptimizer;