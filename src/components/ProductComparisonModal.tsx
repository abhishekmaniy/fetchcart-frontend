import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, X, Star, Heart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  store: string;
  savings?: string;
}

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product;
  searchResults?: Product[];
  pastSearches?: string[];
}

const ProductComparisonModal = ({
  isOpen,
  onClose,
  initialProduct,
  searchResults = [],
  pastSearches = []
}: ProductComparisonModalProps) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    initialProduct ? [initialProduct] : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<"results" | "new" | "history">("results");
  const { toast } = useToast();

  const mockNewSearchResults: Product[] = [
    {
      id: "new1",
      name: "Similar Product Alternative",
      price: "$89.99",
      originalPrice: "$129.99",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      rating: 4.3,
      reviews: 892,
      store: "TechMart",
      savings: "$40"
    },
    {
      id: "new2",
      name: "Budget-Friendly Option",
      price: "$45.99",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
      rating: 4.1,
      reviews: 634,
      store: "ValueShop"
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSearching(false);
    setSearchMode("new");
  };

  const addToComparison = (product: Product) => {
    if (selectedProducts.length >= 4) {
      toast({
        title: "Maximum products reached",
        description: "You can compare up to 4 products at once.",
        variant: "destructive"
      });
      return;
    }

    if (selectedProducts.find(p => p.id === product.id)) {
      toast({
        title: "Product already added",
        description: "This product is already in your comparison.",
        variant: "destructive"
      });
      return;
    }

    setSelectedProducts([...selectedProducts, product]);
    toast({
      title: "Product added",
      description: "Product added to comparison successfully.",
    });
  };

  const removeFromComparison = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const ProductCard = ({ product, isSelected = false }: { product: Product; isSelected?: boolean }) => (
    <div className={`group relative bg-card border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="aspect-square bg-secondary/30 rounded-lg mb-3 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <h4 className="font-medium text-sm leading-tight mb-2">{product.name}</h4>

      <div className="flex items-center mb-2">
        <Star className="h-3 w-3 text-yellow-400 fill-current" />
        <span className="ml-1 text-xs">{product.rating}</span>
        <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <span className="font-bold text-primary">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
          )}
        </div>
        {product.savings && (
          <Badge variant="secondary" className="text-xs">Save {product.savings}</Badge>
        )}
      </div>

      <Button
        size="sm"
        className="w-full"
        onClick={() => isSelected ? removeFromComparison(product.id) : addToComparison(product)}
        variant={isSelected ? "destructive" : "default"}
      >
        {isSelected ? <X className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
        {isSelected ? "Remove" : "Add to Compare"}
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-8 bg-background border-none shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 bg-muted/30 rounded-xl space-y-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-3xl font-semibold tracking-tight">
              Product Comparison
            </DialogTitle>
          </DialogHeader>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Comparing Products ({selectedProducts.length}/4)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} isSelected={true} />
                ))}
              </div>

              {selectedProducts.length >= 2 && (
                <div className="text-center pt-4">
                  <Button size="lg" className="animate-pulse">
                    View Detailed Comparison
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for products to compare..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant={searchMode === "results" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchMode("results")}
              >
                Current Results
              </Button>
              <Button
                variant={searchMode === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchMode("new")}
              >
                New Search
              </Button>
              <Button
                variant={searchMode === "history" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchMode("history")}
              >
                Past Searches
              </Button>
            </div>
          </div>

          {/* Product Result Grids */}
          <div className="space-y-4">
            {searchMode === "results" && (
              <div>
                <h4 className="font-semibold mb-3">From Current Search Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelected={selectedProducts.some((p) => p.id === product.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {searchMode === "new" && (
              <div>
                <h4 className="font-semibold mb-3">Search Results for "{searchQuery}"</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockNewSearchResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelected={selectedProducts.some((p) => p.id === product.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {searchMode === "history" && (
              <div>
                <h4 className="font-semibold mb-3">From Past Searches</h4>
                <div className="space-y-2">
                  {pastSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch();
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

  );
};

export default ProductComparisonModal;