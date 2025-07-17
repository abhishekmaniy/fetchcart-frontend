
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Sparkles, Globe, Brain, ShoppingBag } from "lucide-react";
import SearchLoadingAnimation from "@/components/SearchLoadingAnimation";
import AIFormGenerator from "@/components/AIFormGenerator";

interface SearchInterfaceProps {
  onSearchComplete: (results: any) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
}

const SearchInterface = ({ onSearchComplete, isSearching, setIsSearching }: SearchInterfaceProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPhase, setSearchPhase] = useState<'input' | 'searching' | 'form' | 'fetching'>('input');
  const [generatedForm, setGeneratedForm] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchPhase('searching');
    
    // Simulate internet search
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Move to form generation phase
    setSearchPhase('form');
    setGeneratedForm({
      budget: { min: 0, max: 1000 },
      category: "electronics",
      preferences: ["quality", "reviews", "warranty"]
    });
  };

  const handleFormSubmit = async (formData: any) => {
    setSearchPhase('fetching');
    
    // Simulate final search and results
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
          savings: "$50.00"
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
          savings: "$50.00"
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
          savings: "$70.00"
        }
      ]
    };
    
    onSearchComplete(mockResults);
    setIsSearching(false);
  };

  if (searchPhase === 'searching') {
    return <SearchLoadingAnimation query={searchQuery} />;
  }

  if (searchPhase === 'form') {
    return (
      <AIFormGenerator 
        query={searchQuery}
        onSubmit={handleFormSubmit}
        onBack={() => setSearchPhase('input')}
      />
    );
  }

  if (searchPhase === 'fetching') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="animate-spin">
          <ShoppingBag className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Fetching Your Results</h3>
          <p className="text-muted-foreground">Analyzing products and finding the best deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="p-3 bg-primary rounded-xl">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
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
            className="absolute bottom-3 right-3"
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
            "Professional camera for beginners"
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
        <div className="text-center space-y-3">
          <div className="p-3 bg-secondary rounded-lg w-fit mx-auto">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Internet Search</h3>
          <p className="text-sm text-muted-foreground">
            We search across thousands of retailers in real-time
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="p-3 bg-secondary rounded-lg w-fit mx-auto">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">AI Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Our AI understands your needs and preferences
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="p-3 bg-secondary rounded-lg w-fit mx-auto">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Best Results</h3>
          <p className="text-sm text-muted-foreground">
            Get curated recommendations with best prices
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;
