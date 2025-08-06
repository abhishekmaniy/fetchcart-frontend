import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Star, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProductModal = ({
  product,
  open,
  onClose,
}: {
  product: any;
  open: boolean;
  onClose: () => void;
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6 bg-background border-none shadow-xl rounded-2xl">
        <ScrollArea className="h-[80vh]">
          <Card className="rounded-xl bg-muted shadow-sm p-6">
            <CardContent className="space-y-8">
              {/* Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full max-w-md mx-auto object-contain rounded-xl border shadow"
                  />
                  {product.images?.length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center">
                      {product.images.map((img: string, index: number) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Product image ${index + 1}`}
                          className="w-20 h-20 object-contain border rounded-md hover:scale-105 transition"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{product.productName}</h2>
                  <div className="text-muted-foreground space-y-2">
                    <p>
                      <strong>Brand:</strong> {product.brand}
                    </p>
                    <p>
                      <strong>Model:</strong> {product.model}
                    </p>
                    <p>
                      <strong>Category:</strong> {product.category}
                    </p>
                    <p>
                      <strong>Price:</strong>{" "}
                      <span className="text-green-600 font-medium">{product.price}</span>
                    </p>
                    <p>
                      <strong>Original Price:</strong>{" "}
                      <span className="line-through">{product.originalPrice}</span>
                    </p>
                    <p>
                      <strong>Savings:</strong> {product.savings}
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span>{product.rating}</span>
                      <span className="text-sm">({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      <span>{product.store}</span>
                    </div>
                    <p>
                      <strong>ASIN:</strong> {product.asin}
                    </p>
                  </div>

                  <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full mt-4" size="lg">
                      <BadgeCheck className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </a>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-1">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Feature Bullets */}
              {product.featureBullets?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-1">Features</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {product.featureBullets.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Product Info Table */}
              {product.productInfo && Object.keys(product.productInfo).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-1">Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
                    {Object.entries(product.productInfo).map(([key, value], i) => (
                      <div key={i} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pros & Cons */}
              {(product.pros?.length > 0 || product.cons?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.pros?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-green-600">Pros</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {product.pros.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.cons?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-red-500">Cons</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {product.cons.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
