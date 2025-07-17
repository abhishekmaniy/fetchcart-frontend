
import { Zap, Shield, Users, Search, ShoppingBag, TrendingUp } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Search",
      description: "Find products across thousands of stores in seconds with our advanced AI algorithms."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Price Protection",
      description: "Never overpay again. We track prices and alert you to the best deals automatically."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Personalized Recommendations",
      description: "Get product suggestions tailored to your preferences, budget, and shopping history."
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Smart Comparison",
      description: "Compare features, prices, and reviews across multiple retailers instantly."
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "One-Click Purchase",
      description: "Buy from your favorite stores with secure, streamlined checkout process."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Trend Analysis",
      description: "Stay ahead with insights on trending products and seasonal deals."
    }
  ];

  return (
    <section id="features" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Powerful Features for Smart Shopping
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with intuitive design to revolutionize your shopping experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
