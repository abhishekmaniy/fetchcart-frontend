import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  Tag, 
  Shield, 
  Zap, 
  Target,
  ChevronRight,
  Sparkles
} from "lucide-react";
import SmartRecommendations from "./features/SmartRecommendations";
import PriceTrends from "./features/PriceTrends";
import DealAlerts from "./features/DealAlerts";
import AuthenticityCheck from "./features/AuthenticityCheck";
import QuickCompare from "./features/QuickCompare";
import BudgetOptimizer from "./features/BudgetOptimizer";

const AIShoppingAssistant = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  const features = [
    {
      icon: Brain,
      title: "Smart Recommendations",
      description: "AI-powered product suggestions based on your preferences",
      color: "bg-blue-500/10 text-blue-600",
      action: "Get Recommendations"
    },
    {
      icon: TrendingUp,
      title: "Price Trends",
      description: "Track price history and predict future price changes",
      color: "bg-green-500/10 text-green-600",
      action: "View Trends"
    },
    {
      icon: Tag,
      title: "Deal Alerts",
      description: "Get notified when products go on sale",
      color: "bg-orange-500/10 text-orange-600",
      action: "Set Alerts"
    },
    {
      icon: Shield,
      title: "Authenticity Check",
      description: "Verify product authenticity and seller reputation",
      color: "bg-purple-500/10 text-purple-600",
      action: "Check Product"
    },
    {
      icon: Zap,
      title: "Quick Compare",
      description: "Instantly compare similar products across platforms",
      color: "bg-yellow-500/10 text-yellow-600",
      action: "Compare Now"
    },
    {
      icon: Target,
      title: "Budget Optimizer",
      description: "Find the best value within your budget",
      color: "bg-red-500/10 text-red-600",
      action: "Optimize Budget"
    }
  ];

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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20 cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
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

      {activeFeature && (
        <div className="mt-8">
          <Button 
            variant="outline" 
            onClick={() => setActiveFeature(null)}
            className="mb-6"
          >
            ← Back to Features
          </Button>
          
          {activeFeature === "Smart Recommendations" && <SmartRecommendations />}
          {activeFeature === "Price Trends" && <PriceTrends />}
          {activeFeature === "Deal Alerts" && <DealAlerts />}
          {activeFeature === "Authenticity Check" && <AuthenticityCheck />}
          {activeFeature === "Quick Compare" && <QuickCompare />}
          {activeFeature === "Budget Optimizer" && <BudgetOptimizer />}
        </div>
      )}
    </div>
  );
};

export default AIShoppingAssistant;