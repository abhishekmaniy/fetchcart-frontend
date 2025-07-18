import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PriceTrends = () => {
  const [productUrl, setProductUrl] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [trendData, setTrendData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mockTrendData = {
    productName: "Apple AirPods Pro (2nd Generation)",
    currentPrice: 179.99,
    lowestPrice: 159.99,
    highestPrice: 249.99,
    averagePrice: 195.50,
    priceChange: -8.5,
    prediction: {
      nextWeek: 175.00,
      nextMonth: 165.00,
      confidence: 85
    },
    priceHistory: [
      { date: "Jan", price: 249.99 },
      { date: "Feb", price: 239.99 },
      { date: "Mar", price: 229.99 },
      { date: "Apr", price: 219.99 },
      { date: "May", price: 199.99 },
      { date: "Jun", price: 179.99 }
    ],
    alerts: [
      {
        type: "price_drop",
        message: "Price dropped 15% in the last 30 days",
        date: "2 days ago"
      },
      {
        type: "good_deal",
        message: "Currently 28% below highest recorded price",
        date: "Today"
      }
    ]
  };

  const handleAnalyzeTrends = async () => {
    if (!productUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a product URL to analyze price trends.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    setTrendData(mockTrendData);
    setIsLoading(false);
    toast({
      title: "Analysis Complete!",
      description: "Price trends and predictions are ready."
    });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const getPriceChangeColor = (change: number) => {
    return change < 0 ? "text-green-600" : "text-red-600";
  };

  const getPriceChangeIcon = (change: number) => {
    return change < 0 ? TrendingDown : TrendingUp;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <BarChart3 className="h-8 w-8 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Price Trends & Predictions</h2>
        </div>
        <p className="text-muted-foreground">
          Track price history and get AI-powered predictions for any product
        </p>
      </div>

      {/* Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Analyze Product Price Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product-url">Product URL</Label>
            <Input
              id="product-url"
              placeholder="Paste product URL from any supported store..."
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="time-range">Analysis Period</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleAnalyzeTrends}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <BarChart3 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing price trends...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyze Price Trends
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Trend Results */}
      {trendData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{trendData.productName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(trendData.currentPrice)}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(trendData.lowestPrice)}
                  </div>
                  <div className="text-sm text-muted-foreground">Lowest Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatPrice(trendData.highestPrice)}
                  </div>
                  <div className="text-sm text-muted-foreground">Highest Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatPrice(trendData.averagePrice)}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Price</div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 mb-6">
                {(() => {
                  const Icon = getPriceChangeIcon(trendData.priceChange);
                  return (
                    <>
                      <Icon className={`h-5 w-5 ${getPriceChangeColor(trendData.priceChange)}`} />
                      <span className={`text-lg font-semibold ${getPriceChangeColor(trendData.priceChange)}`}>
                        {Math.abs(trendData.priceChange)}% 
                        {trendData.priceChange < 0 ? " decrease" : " increase"}
                      </span>
                      <span className="text-muted-foreground">from last month</span>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Price History Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Price History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {trendData.priceHistory.map((point: any, index: number) => {
                  const height = ((point.price - trendData.lowestPrice) / (trendData.highestPrice - trendData.lowestPrice)) * 200 + 20;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-primary rounded-t-md w-full relative group cursor-pointer hover:bg-primary/80 transition-colors"
                        style={{ height: `${height}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatPrice(point.price)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">{point.date}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>AI Price Predictions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-lg font-semibold">{formatPrice(trendData.prediction.nextWeek)}</div>
                  <div className="text-sm text-muted-foreground">Predicted price next week</div>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-lg font-semibold">{formatPrice(trendData.prediction.nextMonth)}</div>
                  <div className="text-sm text-muted-foreground">Predicted price next month</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="secondary">
                  {trendData.prediction.confidence}% Confidence
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Price Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Price Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendData.alerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PriceTrends;