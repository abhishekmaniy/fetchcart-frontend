
import { useState, useEffect } from "react";
import { Globe, Search, Zap, ShoppingCart } from "lucide-react";

interface SearchLoadingAnimationProps {
  query: string;
}

const SearchLoadingAnimation = ({ query }: SearchLoadingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Analyzing your request",
      description: "Understanding what you're looking for..."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Searching the internet",
      description: "Scanning thousands of retailers and products..."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI processing",
      description: "Comparing prices, reviews, and features..."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      {/* Query Display */}
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-semibold mb-2">Searching for:</h2>
        <p className="text-lg text-muted-foreground bg-secondary/50 p-4 rounded-lg">
          "{query}"
        </p>
      </div>

      {/* Loading Animation */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-secondary rounded-full"></div>
          <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center text-primary">
            {steps[currentStep].icon}
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">{steps[currentStep].title}</h3>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex space-x-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index <= currentStep ? 'bg-primary' : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Real-time updates */}
      <div className="text-center space-y-2 max-w-md">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live search in progress...</span>
        </div>
      </div>
    </div>
  );
};

export default SearchLoadingAnimation;
