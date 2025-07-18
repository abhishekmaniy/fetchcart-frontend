import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Eye, Heart, ShoppingCart, Calendar, Users, Percent } from "lucide-react";

const TrendsAnalytics = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [category, setCategory] = useState("all");

  const trendingProducts = [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      category: "Electronics",
      priceChange: 12.5,
      views: 45200,
      wishlistAdds: 8900,
      purchases: 2100,
      trend: "up",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop"
    },
    {
      id: "2",
      name: "Stanley Tumbler",
      category: "Home & Kitchen",
      priceChange: -8.3,
      views: 32100,
      wishlistAdds: 5600,
      purchases: 3400,
      trend: "hot",
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop"
    },
    {
      id: "3",
      name: "Nike Air Max 97",
      category: "Footwear",
      priceChange: 5.2,
      views: 28900,
      wishlistAdds: 4200,
      purchases: 1800,
      trend: "up",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop"
    },
    {
      id: "4",
      name: "MacBook Air M3",
      category: "Electronics",
      priceChange: -15.7,
      views: 67300,
      wishlistAdds: 12400,
      purchases: 890,
      trend: "down",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop"
    }
  ];

  const marketInsights = [
    {
      title: "Electronics Leading Growth",
      description: "Electronics category shows 23% increase in searches this week",
      type: "growth",
      change: "+23%"
    },
    {
      title: "Sustainable Products Rising",
      description: "Eco-friendly products gaining 18% more traction",
      type: "trend",
      change: "+18%"
    },
    {
      title: "Luxury Items Declining",
      description: "High-end products seeing 12% decrease in interest",
      type: "decline",
      change: "-12%"
    }
  ];

  const categoryTrends = [
    { name: "Electronics", growth: 23, color: "bg-blue-500" },
    { name: "Home & Kitchen", growth: 18, color: "bg-green-500" },
    { name: "Fashion", growth: -8, color: "bg-red-500" },
    { name: "Sports", growth: 15, color: "bg-purple-500" },
    { name: "Beauty", growth: 12, color: "bg-pink-500" }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "hot":
        return <span className="text-orange-600 text-sm">🔥</span>;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="h-8 w-8 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Market Trends & Analytics</h2>
        </div>
        <p className="text-muted-foreground">
          Real-time insights into shopping trends and market dynamics
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Kitchen</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Market Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketInsights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                  <Badge variant={insight.type === "decline" ? "destructive" : "default"}>
                    {insight.change}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Percent className="h-5 w-5" />
            <span>Category Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryTrends.map((cat, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium">{cat.name}</div>
                <div className="flex-1 bg-secondary/30 rounded-full h-3 relative">
                  <div 
                    className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                    style={{ width: `${Math.abs(cat.growth) * 2}%` }}
                  ></div>
                </div>
                <div className={`text-sm font-semibold w-12 ${cat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {cat.growth >= 0 ? '+' : ''}{cat.growth}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-orange-600">🔥</span>
            <span>Trending Products</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingProducts.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="text-lg font-bold text-muted-foreground w-8">
                  #{index + 1}
                </div>
                
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{product.name}</h4>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(product.trend)}
                      <span className={`text-sm font-medium ${
                        product.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.priceChange >= 0 ? '+' : ''}{product.priceChange}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <Badge variant="outline">{product.category}</Badge>
                    
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(product.views)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{formatNumber(product.wishlistAdds)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <ShoppingCart className="h-3 w-3" />
                      <span>{formatNumber(product.purchases)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Seasonal & Event-Based Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Back to School Season</h4>
              <p className="text-sm text-blue-600 mb-3">Electronics and stationery seeing 40% increase</p>
              <div className="flex space-x-2">
                <Badge className="bg-blue-500">+40% searches</Badge>
                <Badge variant="outline">2 weeks left</Badge>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Holiday Prep</h4>
              <p className="text-sm text-green-600 mb-3">Home decor and gifts trending upward</p>
              <div className="flex space-x-2">
                <Badge className="bg-green-500">+25% interest</Badge>
                <Badge variant="outline">Early trend</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsAnalytics;