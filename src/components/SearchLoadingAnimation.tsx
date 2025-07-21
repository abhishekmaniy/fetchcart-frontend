import { useState, useEffect } from "react";
import { Globe, Search, Zap, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface SearchLoadingAnimationProps {
  query: string;
}

const SearchLoadingAnimation = ({ query }: SearchLoadingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Analyzing your request",
      description: "Understanding what you're looking for...",
      color: "from-indigo-500 via-pink-400 to-yellow-400"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Searching the internet",
      description: "Scanning thousands of retailers and products...",
      color: "from-blue-400 via-green-300 to-indigo-400"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI processing",
      description: "Comparing prices, reviews, and features...",
      color: "from-yellow-400 via-pink-400 to-purple-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] space-y-10 relative">
      {/* Animated Colorful Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-24 -left-24 w-[250px] h-[250px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-20 blur-2xl"
        />
        <motion.div
          initial={{ scale: 0.7, opacity: 0.4 }}
          animate={{ scale: 1.1, opacity: 0.7 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute top-1/2 right-0 w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-20 blur-2xl"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0.3 }}
          animate={{ scale: 1.05, opacity: 0.5 }}
          transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute bottom-0 left-1/2 w-[120px] h-[120px] rounded-full bg-gradient-to-tl from-green-300 via-blue-300 to-indigo-400 opacity-10 blur-2xl"
        />
      </div>

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
          <div className={`w-24 h-24 border-4 border-t-transparent rounded-full animate-spin absolute top-0 left-0 bg-gradient-to-r ${steps[currentStep].color}`}></div>
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
        {steps.map((step, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index < currentStep
                ? "bg-gradient-to-r from-indigo-500 via-pink-400 to-yellow-400 shadow"
                : index === currentStep
                ? "bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-500 shadow-lg scale-125"
                : "bg-secondary"
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
    </section>
  );
};

export default SearchLoadingAnimation;