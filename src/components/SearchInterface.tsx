import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Sparkles, Globe, Brain, ShoppingBag } from "lucide-react";
import SearchLoadingAnimation from "@/components/SearchLoadingAnimation";
import AIFormGenerator from "@/components/AIFormGenerator";
import { motion } from "framer-motion";

interface SearchInterfaceProps {
  onSearchComplete: (results: any) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
}

const SearchInterface = ({
  onSearchComplete,
  isSearching,
  setIsSearching,
}: SearchInterfaceProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPhase, setSearchPhase] = useState<
    "input" | "searching" | "form" | "fetching"
  >("input");
  const [generatedForm, setGeneratedForm] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchPhase("searching");

    // Simulate internet search
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Move to form generation phase
    setSearchPhase("form");
    setGeneratedForm({
      budget: { min: 0, max: 1000 },
      category: "electronics",
      preferences: ["quality", "reviews", "warranty"],
    });
  };

  const handleFormSubmit = async (formData: any) => {
    setSearchPhase("fetching");

    // Simulate final search and results
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock results
    const mockResults = {
      query: searchQuery,
      products: [
        {
          id: 1,
          name: "Sony WH-1000XM5 Wireless Headphones",
          price: "$349.99",
          originalPrice: "$399.99",
          image: "/placeholder.svg",
          rating: 4.8,
          reviews: 2847,
          store: "Amazon",
          savings: "$50.00",
        },
        {
          id: 2,
          name: "Bose QuietComfort 45",
          price: "$279.99",
          originalPrice: "$329.99",
          image: "/placeholder.svg",
          rating: 4.6,
          reviews: 1923,
          store: "Best Buy",
          savings: "$50.00",
        },
        {
          id: 3,
          name: "Apple AirPods Max",
          price: "$479.99",
          originalPrice: "$549.99",
          image: "/placeholder.svg",
          rating: 4.7,
          reviews: 3421,
          store: "Apple Store",
          savings: "$70.00",
        },
      ],
    };

    onSearchComplete(mockResults);
    setIsSearching(false);
  };

  if (searchPhase === "searching") {
    return <SearchLoadingAnimation query={searchQuery} />;
  }

  if (searchPhase === "form") {
    return (
      <AIFormGenerator
        query={searchQuery}
        onSubmit={handleFormSubmit}
        onBack={() => setSearchPhase("input")}
      />
    );
  }

  if (searchPhase === "fetching") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="animate-spin"
        >
          <ShoppingBag className="h-12 w-12 text-primary" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Fetching Your Results</h3>
          <p className="text-muted-foreground">
            Analyzing products and finding the best deals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      {/* Animated Colorful Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-32 -left-32 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-pink-400 via-indigo-400 to-blue-400 opacity-20 blur-2xl"
        />
        <motion.div
          initial={{ scale: 0.7, opacity: 0.4 }}
          animate={{ scale: 1.1, opacity: 0.7 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute top-1/2 right-0 w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-purple-400 opacity-20 blur-2xl"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0.3 }}
          animate={{ scale: 1.05, opacity: 0.5 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute bottom-0 left-1/2 w-[200px] h-[200px] rounded-full bg-gradient-to-tl from-green-300 via-blue-300 to-indigo-400 opacity-10 blur-2xl"
        />
      </div>

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="p-3 bg-primary rounded-xl shadow"
          >
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </motion.div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
          What are you shopping for?
        </h1>
        <p className="text-xl text-muted-foreground">
          Describe what you're looking for and let our AI find the perfect products for you.
        </p>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-2xl space-y-4">
        <div className="relative">
          <Textarea
            placeholder="e.g., I need wireless headphones under $200 with good noise cancellation for working from home..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-h-[120px] text-lg resize-none pr-12"
          />
          <Button
            size="icon"
            className="absolute bottom-3 right-3 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white shadow"
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "Best laptop for college students",
            "Eco-friendly cleaning products",
            "Gaming setup under $1000",
            "Professional camera for beginners",
            "Affordable smartwatches",
            "Noise-cancelling earbuds",
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery(suggestion)}
              className="text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full mt-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
          className="text-center space-y-3"
        >
          <div className="p-3 bg-secondary rounded-lg w-fit mx-auto">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Internet Search</h3>
          <p className="text-sm text-muted-foreground">
            We search across thousands of retailers in real-time
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18, duration: 0.6, type: "spring" }}
          className="text-center space-y-3"
        >
          <div className="p-3 bg-secondary rounded-lg w-fit mx-auto">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">AI Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Our AI understands your needs and preferences
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.26, duration: 0.6, type: "spring" }}
          className="text-center space-y-3"
        >
          <div className="p-3 bg-secondary rounded-lg w-fit mx-auto">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Best Results</h3>
          <p className="text-sm text-muted-foreground">
            Get curated recommendations with best prices
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchInterface;