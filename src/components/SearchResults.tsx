
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Heart, Compare, ArrowLeft } from "lucide-react";

interface SearchResultsProps {
  results: any;
  onNewSearch: () => void;
}

const SearchResults = ({ results, onNewSearch }: SearchResultsProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onNewSearch}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              Found {results.products.length} products for "{results.query}"
            </p>
          </div>
        </div>
        <Button onClick={onNewSearch}>New Search</Button>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.products.map((product: any) => (
          <div key={product.id} className="bg-background border rounded-xl p-6 hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="aspect-square bg-secondary/30 rounded-lg mb-4 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                )}
                {product.savings && (
                  <Badge variant="secondary" className="text-green-600">
                    Save {product.savings}
                  </Badge>
                )}
              </div>

              {/* Store */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Sold by {product.store}
                </span>
                <div className="flex space-x-2">
                  <Button size="icon" variant="ghost">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Compare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button className="flex-1">
                  Buy Now
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="flex-1">
                  Compare
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button variant="outline" size="lg">
          Load More Results
        </Button>
      </div>
    </div>
  );
};

export default SearchResults;
