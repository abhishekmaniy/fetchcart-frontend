import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  TrendingUp, 
  Tag, 
  Shield, 
  Zap, 
  Target,
  ChevronRight,
  Sparkles,
  Search,
  Link,
  Star,
  DollarSign,
  Bell,
  Plus,
  Minus,
  Check,
  X,
  Upload,
  Camera,
  Clock,
  Percent,
  User,
  Eye,
  Heart,
  ShoppingCart
} from "lucide-react";

const AIShoppingAssistant = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Trends states
  const [productUrl, setProductUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  
  // Quick Compare states
  const [compareProducts, setCompareProducts] = useState(["", ""]);
  const [comparedResults, setComparedResults] = useState<any[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  
  // Budget Optimizer states
  const [budget, setBudget] = useState([500]);
  const [budgetCategory, setBudgetCategory] = useState("");
  const [timeframe, setTimeframe] = useState("month");
  const [savingsGoal, setSavingsGoal] = useState([100]);
  const [optimizedProducts, setOptimizedProducts] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Authenticity Check states
  const [authUrl, setAuthUrl] = useState("");
  const [authResult, setAuthResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  // Deal Alerts states
  const [newAlert, setNewAlert] = useState({
    productUrl: "",
    targetPrice: "",
    alertType: "price"
  });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  
  const features = [
    {
      icon: TrendingUp,
      title: "Price Trends",
      description: "Track price history and predict future changes",
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      action: "Analyze Trends"
    },
    {
      icon: Zap,
      title: "Quick Compare",
      description: "Compare products from your history or new URLs",
      color: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
      action: "Compare Products"
    },
    {
      icon: Target,
      title: "Budget Optimizer",
      description: "Set budgets and find the best value products",
      color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
      action: "Optimize Budget"
    },
    {
      icon: Shield,
      title: "Authenticity Check",
      description: "Verify product authenticity and seller reputation",
      color: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
      action: "Check Product"
    },
    {
      icon: Bell,
      title: "Deal Alerts",
      description: "Get notified about new deals and discounts",
      color: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
      action: "Set Alerts"
    },
    {
      icon: Brain,
      title: "Smart Recommendations",
      description: "AI-powered product suggestions",
      color: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      action: "Get Recommendations"
    }
  ];

  const searchHistory = [
    "Sony WH-1000XM4 Wireless Headphones",
    "Apple iPhone 15 Pro Max", 
    "Samsung Galaxy Watch",
    "MacBook Air M3",
    "AirPods Pro 2nd Gen"
  ];

  const currentDeals = [
    {
      id: "deal1",
      name: "Sony WH-1000XM4",
      originalPrice: 349.99,
      currentPrice: 279.99,
      discount: 20,
      endsIn: "2 days",
      store: "Amazon"
    },
    {
      id: "deal2", 
      name: "Apple Watch Series 9",
      originalPrice: 399.99,
      currentPrice: 329.99,
      discount: 17.5,
      endsIn: "5 hours",
      store: "Best Buy"
    }
  ];

  // Handler functions
  const analyzePriceTrend = async () => {
    if (!productUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a product URL to analyze price trends.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockHistory = [
      { date: "2024-01-01", price: 299.99 },
      { date: "2024-01-15", price: 279.99 },
      { date: "2024-02-01", price: 259.99 },
      { date: "2024-02-15", price: 249.99 },
      { date: "2024-03-01", price: 239.99 },
      { date: "2024-03-15", price: 219.99 }
    ];
    
    setPriceHistory(mockHistory);
    setIsAnalyzing(false);
    toast({
      title: "Analysis Complete!",
      description: "Price trend analysis is ready."
    });
  };

  const compareProductsHandler = async () => {
    const validProducts = compareProducts.filter(p => p.trim());
    if (validProducts.length < 2) {
      toast({
        title: "Need More Products",
        description: "Please enter at least 2 products to compare.",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults = [
      {
        id: "1",
        name: "Sony WH-1000XM4 Wireless Headphones",
        price: 279.99,
        originalPrice: 349.99,
        rating: 4.7,
        reviews: 8932,
        store: "Amazon",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
      },
      {
        id: "2", 
        name: "Bose QuietComfort 45 Headphones",
        price: 299.99,
        originalPrice: 329.99,
        rating: 4.5,
        reviews: 5647,
        store: "Best Buy",
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop"
      }
    ];
    
    setComparedResults(mockResults);
    setIsComparing(false);
    toast({
      title: "Comparison Ready!",
      description: "Products have been analyzed and compared."
    });
  };

  const optimizeBudget = async () => {
    if (!budgetCategory) {
      toast({
        title: "Category Required",
        description: "Please select a category to optimize your budget.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockOptimized = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        originalPrice: 149.99,
        rating: 4.6,
        valueScore: 95,
        savings: 60,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
      }
    ];
    
    setOptimizedProducts(mockOptimized);
    setIsOptimizing(false);
    toast({
      title: "Budget Optimized!",
      description: "Found products that maximize your budget value."
    });
  };

  const checkAuthenticity = async () => {
    if (!authUrl.trim()) {
      toast({
        title: "URL Required", 
        description: "Please enter a product URL to check authenticity.",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAuthResult({
      overallScore: 85,
      productAuthenticity: "genuine",
      sellerReputation: "good",
      checks: [
        { name: "Product Images", status: "pass", message: "High-quality official product images detected" },
        { name: "Price Analysis", status: "warning", message: "Price is slightly below market average" },
        { name: "Seller Verification", status: "pass", message: "Seller has verified business credentials" }
      ]
    });
    
    setIsChecking(false);
    toast({
      title: "Analysis Complete!",
      description: "Authenticity check results are ready."
    });
  };

  const createAlert = async () => {
    if (!newAlert.productUrl || !newAlert.targetPrice) {
      toast({
        title: "Missing Information",
        description: "Please provide a product URL and target price.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingAlert(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const alert = {
      id: Date.now().toString(),
      productName: "New Product Alert",
      currentPrice: 99.99,
      targetPrice: parseFloat(newAlert.targetPrice),
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAlerts(prev => [alert, ...prev]);
    setNewAlert({ productUrl: "", targetPrice: "", alertType: "price" });
    setIsCreatingAlert(false);
    
    toast({
      title: "Alert Created!",
      description: "You'll be notified when the price meets your criteria."
    });
  };

  const addCompareProduct = () => {
    if (compareProducts.length < 4) {
      setCompareProducts([...compareProducts, ""]);
    }
  };

  const removeCompareProduct = (index: number) => {
    if (compareProducts.length > 2) {
      setCompareProducts(compareProducts.filter((_, i) => i !== index));
    }
  };

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case "Price Trends":
        return (
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Link className="h-5 w-5" />
                  <span>Product Price Trend Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="product-url" className="text-foreground">Product URL</Label>
                  <Input
                    id="product-url"
                    placeholder="Paste any product URL to analyze its price history..."
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <Button 
                  onClick={analyzePriceTrend}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Search className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing price trends...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Price Trend
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {priceHistory.length > 0 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Price History & Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">${priceHistory[priceHistory.length - 1]?.price}</div>
                        <div className="text-sm text-muted-foreground">Current Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">-26.7%</div>
                        <div className="text-sm text-muted-foreground">Price Drop</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">${priceHistory[0]?.price}</div>
                        <div className="text-sm text-muted-foreground">Highest Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">Next Week</div>
                        <div className="text-sm text-muted-foreground">Best Time to Buy</div>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/30 dark:bg-secondary/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-foreground">Price Trend Insights</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Price has been steadily declining over the past 3 months</li>
                        <li>• Predicted to reach lowest point next week ($199.99)</li>
                        <li>• Historical data shows prices typically rise after seasonal sales</li>
                        <li>• 89% chance of further price drops in the next 7 days</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "Quick Compare":
        return (
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Zap className="h-5 w-5" />
                  <span>Products to Compare</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {compareProducts.map((product, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Label htmlFor={`product-${index}`} className="text-foreground">Product {index + 1}</Label>
                        <Input
                          id={`product-${index}`}
                          placeholder="Enter product name or URL..."
                          value={product}
                          onChange={(e) => {
                            const newProducts = [...compareProducts];
                            newProducts[index] = e.target.value;
                            setCompareProducts(newProducts);
                          }}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      {compareProducts.length > 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCompareProduct(index)}
                          className="mt-6"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Quick selection from search history */}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground mr-2">Quick select:</span>
                      {searchHistory.slice(0, 3).map((item, historyIndex) => (
                        <Button
                          key={historyIndex}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            const newProducts = [...compareProducts];
                            newProducts[index] = item;
                            setCompareProducts(newProducts);
                          }}
                        >
                          {item.length > 20 ? item.substring(0, 20) + "..." : item}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex space-x-2">
                  {compareProducts.length < 4 && (
                    <Button variant="outline" onClick={addCompareProduct}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  )}
                  
                  <Button 
                    onClick={compareProductsHandler}
                    disabled={isComparing}
                    className="flex-1"
                  >
                    {isComparing ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Comparing products...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Compare Products
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {comparedResults.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {comparedResults.map((product) => (
                  <Card key={product.id} className="border-border bg-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex space-x-4">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1 space-y-2">
                            <h4 className="font-semibold line-clamp-2 text-foreground">{product.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-foreground">{product.rating}</span>
                              <span className="text-muted-foreground">({product.reviews})</span>
                            </div>
                            <Badge variant="outline">{product.store}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-primary">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>

                        <Button className="w-full">
                          View Product
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case "Budget Optimizer":
        return (
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Target className="h-5 w-5" />
                  <span>Budget & Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-foreground">Budget: ${budget[0]}</Label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-foreground">Product Category</Label>
                    <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timeframe" className="text-foreground">Budget Timeframe</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="quarter">Quarterly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-foreground">Savings Goal: ${savingsGoal[0]} per {timeframe}</Label>
                  <div className="mt-2">
                    <Slider
                      value={savingsGoal}
                      onValueChange={setSavingsGoal}
                      max={500}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button 
                  onClick={optimizeBudget}
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

            {optimizedProducts.length > 0 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Optimized Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizedProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-4 p-4 bg-secondary/30 dark:bg-secondary/50 rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold text-foreground">{product.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-primary">${product.price}</span>
                            <Badge className="bg-green-500 text-white">Value Score: {product.valueScore}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "Authenticity Check":
        return (
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Shield className="h-5 w-5" />
                  <span>Product & Seller Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="auth-url" className="text-foreground">Product URL</Label>
                  <Input
                    id="auth-url"
                    placeholder="Paste product URL to analyze authenticity..."
                    value={authUrl}
                    onChange={(e) => setAuthUrl(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Upload Product Images (Optional)</Label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={checkAuthenticity}
                  className="w-full"
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <>
                      <Shield className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing authenticity...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Check Authenticity
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {authResult && (
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="text-4xl font-bold text-primary">{authResult.overallScore}/100</div>
                      <Shield className="h-12 w-12 text-primary" />
                    </div>
                    
                    <div className="space-y-2">
                      <Badge className="text-lg px-4 py-2 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                        Product appears {authResult.productAuthenticity.toUpperCase()}
                      </Badge>
                      
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        Seller reputation: {authResult.sellerReputation.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-3 mt-6">
                      {authResult.checks.map((check: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-secondary/30 dark:bg-secondary/50 rounded-lg">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{check.name}</div>
                            <div className="text-sm text-muted-foreground">{check.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "Deal Alerts":
        return (
          <div className="space-y-6">
            {/* Current Deals */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Tag className="h-5 w-5" />
                  <span>New Deals for You</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-3 bg-secondary/30 dark:bg-secondary/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">{deal.name}</h4>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-lg font-bold text-primary">${deal.currentPrice}</span>
                          <span className="text-muted-foreground line-through">${deal.originalPrice}</span>
                          <Badge className="bg-green-500 text-white">{deal.discount}% OFF</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {deal.store} • Ends in {deal.endsIn}
                        </div>
                      </div>
                      <Button size="sm">View Deal</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create Alert */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Plus className="h-5 w-5" />
                  <span>Create New Alert</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="alert-url" className="text-foreground">Product URL</Label>
                  <Input
                    id="alert-url"
                    placeholder="Paste product URL from any supported store..."
                    value={newAlert.productUrl}
                    onChange={(e) => setNewAlert({...newAlert, productUrl: e.target.value})}
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="target-price" className="text-foreground">Target Price ($)</Label>
                  <Input
                    id="target-price"
                    type="number"
                    placeholder="0.00"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <Button 
                  onClick={createAlert}
                  className="w-full"
                  disabled={isCreatingAlert}
                >
                  {isCreatingAlert ? (
                    <>
                      <Bell className="h-4 w-4 mr-2 animate-spin" />
                      Creating alert...
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Create Price Alert
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            {alerts.length > 0 && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Your Price Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-secondary/30 dark:bg-secondary/50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-foreground">{alert.productName}</h4>
                          <div className="text-sm text-muted-foreground">
                            Target: ${alert.targetPrice} • Created {alert.createdAt}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={alert.isActive} />
                          <Button size="sm" variant="destructive">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Shopping Assistant
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Leverage the power of AI to make smarter shopping decisions, save money, and discover the perfect products for your needs.
        </p>
      </div>

      {!activeFeature && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20 cursor-pointer bg-card border-border"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors text-foreground">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary/10 group-hover:text-primary transition-all"
                    onClick={() => setActiveFeature(feature.title)}
                  >
                    {feature.action}
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">$2,500</div>
              <div className="text-sm text-muted-foreground">Money Saved</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-sm text-muted-foreground">Products Compared</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">23</div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">4.9</div>
              <div className="text-sm text-muted-foreground">Satisfaction Score</div>
            </div>
          </div>
        </>
      )}

      {activeFeature && (
        <div className="mt-8">
          <Button 
            variant="outline" 
            onClick={() => setActiveFeature(null)}
            className="mb-6"
          >
            ← Back to Features
          </Button>
          
          {renderFeatureContent()}
        </div>
      )}
    </div>
  );
};

export default AIShoppingAssistant;