import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Tag, DollarSign, Percent, Clock, Check, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  productName: string;
  currentPrice: number;
  targetPrice: number;
  discountPercent?: number;
  isActive: boolean;
  createdAt: string;
  image: string;
}

const DealAlerts = () => {
  const [newAlert, setNewAlert] = useState({
    productUrl: "",
    targetPrice: "",
    discountPercent: "",
    alertType: "price"
  });
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      productName: "Apple AirPods Pro",
      currentPrice: 179.99,
      targetPrice: 150.00,
      isActive: true,
      createdAt: "2024-01-15",
      image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=100&h=100&fit=crop"
    },
    {
      id: "2",
      productName: "Samsung Galaxy Watch",
      currentPrice: 299.99,
      targetPrice: 250.00,
      discountPercent: 20,
      isActive: false,
      createdAt: "2024-01-10",
      image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=100&h=100&fit=crop"
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateAlert = async () => {
    if (!newAlert.productUrl || (!newAlert.targetPrice && !newAlert.discountPercent)) {
      toast({
        title: "Missing Information",
        description: "Please provide a product URL and either target price or discount percentage.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const alert: Alert = {
      id: Date.now().toString(),
      productName: "New Product Alert",
      currentPrice: 99.99,
      targetPrice: parseFloat(newAlert.targetPrice) || 0,
      discountPercent: parseFloat(newAlert.discountPercent) || undefined,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
    };

    setAlerts(prev => [alert, ...prev]);
    setNewAlert({ productUrl: "", targetPrice: "", discountPercent: "", alertType: "price" });
    setIsCreating(false);
    
    toast({
      title: "Alert Created!",
      description: "You'll be notified when the price meets your criteria."
    });
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed."
    });
  };

  const getAlertStatus = (alert: Alert) => {
    if (!alert.isActive) return { status: "paused", color: "bg-gray-500" };
    
    if (alert.discountPercent) {
      const discountMet = ((alert.currentPrice / alert.targetPrice) - 1) * 100 <= -alert.discountPercent;
      return discountMet 
        ? { status: "triggered", color: "bg-green-500" }
        : { status: "watching", color: "bg-blue-500" };
    } else {
      const priceMet = alert.currentPrice <= alert.targetPrice;
      return priceMet 
        ? { status: "triggered", color: "bg-green-500" }
        : { status: "watching", color: "bg-blue-500" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Bell className="h-8 w-8 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Deal Alerts</h2>
        </div>
        <p className="text-muted-foreground">
          Never miss a great deal - get notified when products reach your target price
        </p>
      </div>

      {/* Create New Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product-url">Product URL</Label>
            <Input
              id="product-url"
              placeholder="Paste product URL from any supported store..."
              value={newAlert.productUrl}
              onChange={(e) => setNewAlert({...newAlert, productUrl: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="alert-type">Alert Type</Label>
            <Select value={newAlert.alertType} onValueChange={(value) => setNewAlert({...newAlert, alertType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Target Price</SelectItem>
                <SelectItem value="discount">Discount Percentage</SelectItem>
                <SelectItem value="both">Both Price & Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(newAlert.alertType === "price" || newAlert.alertType === "both") && (
              <div>
                <Label htmlFor="target-price">Target Price ($)</Label>
                <Input
                  id="target-price"
                  type="number"
                  placeholder="0.00"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
                />
              </div>
            )}

            {(newAlert.alertType === "discount" || newAlert.alertType === "both") && (
              <div>
                <Label htmlFor="discount-percent">Minimum Discount (%)</Label>
                <Input
                  id="discount-percent"
                  type="number"
                  placeholder="0"
                  value={newAlert.discountPercent}
                  onChange={(e) => setNewAlert({...newAlert, discountPercent: e.target.value})}
                />
              </div>
            )}
          </div>

          <Button 
            onClick={handleCreateAlert}
            className="w-full"
            disabled={isCreating}
          >
            {isCreating ? (
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Price Alerts</h3>
          <Badge variant="secondary">{alerts.length} alerts</Badge>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const status = getAlertStatus(alert);
            return (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={alert.image} 
                      alt={alert.productName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{alert.productName}</h4>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                          <span className="text-sm capitalize">{status.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Current: ${alert.currentPrice}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Tag className="h-4 w-4" />
                          <span>Target: ${alert.targetPrice}</span>
                        </div>
                        
                        {alert.discountPercent && (
                          <div className="flex items-center space-x-1">
                            <Percent className="h-4 w-4" />
                            <span>-{alert.discountPercent}%</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Created {alert.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {alerts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No alerts yet</h3>
              <p className="text-muted-foreground">Create your first price alert to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DealAlerts;