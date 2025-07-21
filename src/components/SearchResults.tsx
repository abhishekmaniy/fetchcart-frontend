import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ExternalLink,
  Heart,
  GitCompare,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import ProductComparisonModal from "./ProductComparisonModal";
import { motion } from "framer-motion";

interface SearchResultsProps {
  results: any;
  onNewSearch: () => void;
}

const SearchResults = ({ results, onNewSearch }: SearchResultsProps) => {
  const [comparisonModal, setComparisonModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleBuyNow = (product: any) => {
    setSelectedProduct(product);
    setComparisonModal(true);
  };

  const handleCompare = (product: any) => {
    setSelectedProduct(product);
    setComparisonModal(true);
  };

  return (
    <>
      <section className="relative py-12">
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

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onNewSearch}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
                  Search Results
                </h1>
                <p className="text-muted-foreground">
                  Found {results.products.length} products for "{results.query}"
                </p>
              </div>
            </div>
            <Button onClick={onNewSearch} className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white shadow">
              New Search
            </Button>
          </div>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {results.products.map((product: any, idx: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08, duration: 0.6, type: "spring" }}
                className="bg-white/90 border border-indigo-100 rounded-2xl p-6 hover:shadow-2xl transition-shadow group relative overflow-hidden"
              >
                {/* Product Image */}
                <div className="aspect-square bg-secondary/30 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg leading-tight bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                    {product.name}
                  </h3>

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
                      <Button size="icon" variant="ghost" onClick={() => handleCompare(product)}>
                        <GitCompare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      className="flex-1 group hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 text-white"
                      onClick={() => handleBuyNow(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                      Buy Now
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 hover:scale-105 transition-transform duration-200"
                      onClick={() => handleCompare(product)}
                    >
                      <GitCompare className="h-4 w-4 mr-2" />
                      Compare
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-8">
            <Button variant="outline" size="lg" className="hover:bg-pink-50 hover:border-pink-300 transition-colors">
              Load More Results
            </Button>
          </div>
        </div>
      </section>

      {/* Product Comparison Modal */}
      <ProductComparisonModal
        isOpen={comparisonModal}
        onClose={() => setComparisonModal(false)}
        initialProduct={selectedProduct}
        searchResults={results.products}
        pastSearches={[
          "Best wireless headphones under $200",
          "Ergonomic office chair for home",
          "Gaming laptop with RTX 4060",
        ]}
      />
    </>
  );
};

export default SearchResults;