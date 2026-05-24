import { useEffect, useState } from "react";
import { Globe, Search, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SearchLoadingAnimationProps {
  query: string;
}

const steps = [
  {
    icon: Search,
    title: "Analyzing your request",
    description: "Understanding what you're looking for...",
  },
  {
    icon: Globe,
    title: "Searching the internet",
    description: "Scanning stores, products, reviews, and prices...",
  },
  {
    icon: Zap,
    title: "AI processing",
    description: "Comparing price, quality, ratings, and product fit...",
  },
];

const SearchLoadingAnimation = ({ query }: SearchLoadingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <section className="relative flex min-h-[calc(100vh-220px)] flex-col items-center justify-center overflow-hidden px-3 py-10 text-center sm:min-h-[70vh] sm:px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ scale: [0.85, 1.08], opacity: [0.35, 0.65] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -left-24 -top-24 h-[230px] w-[230px] rounded-full bg-primary/25 blur-3xl sm:h-[300px] sm:w-[300px]"
        />
        <motion.div
          animate={{ scale: [0.8, 1.1], opacity: [0.3, 0.6] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute -right-24 bottom-0 h-[230px] w-[230px] rounded-full bg-sky-400/25 blur-3xl sm:h-[300px] sm:w-[300px]"
        />
      </div>

      <div className="w-full max-w-2xl text-center">
        <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground shadow-soft">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Live AI search
        </div>

        <h2 className="mt-5 font-display text-3xl tracking-tight sm:text-5xl">
          Searching for{" "}
          <span className="text-gradient italic">your best match</span>
        </h2>

        <div className="glass mt-5 rounded-2xl px-4 py-4 text-sm text-foreground/80 shadow-soft sm:px-5 sm:text-base">
          “{query}”
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6 sm:mt-12 sm:gap-7">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28">
          <div className="absolute inset-0 rounded-full border border-border/70 bg-card/70 shadow-soft" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
          <div className="absolute inset-3 rounded-full bg-primary-gradient opacity-20 blur-xl" />
          <div className="absolute inset-0 flex items-center justify-center text-primary">
            <CurrentIcon className="h-8 w-8 sm:h-9 sm:w-9" />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
            {steps[currentStep].title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-primary-gradient shadow-glow"
                  : "w-2.5 bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Live search in progress...
        </div>
      </div>
    </section>
  );
};

export default SearchLoadingAnimation;