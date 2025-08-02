import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Star, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <DialogContent
        className="max-w-3xl p-8 bg-background border-none shadow-xl rounded-2xl"
      >
        <div className="p-6 bg-muted rounded-xl space-y-6">
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full max-w-sm h-auto object-contain rounded-lg border"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold leading-tight">
                    {product.name}
                  </h2>

                  <div className="space-y-1 text-base text-muted-foreground">
                    <div>
                      <strong>Price:</strong>{" "}
                      <span className="text-green-600 font-medium">
                        {product.price}
                      </span>
                    </div>
                    <div>
                      <strong>Original Price:</strong>{" "}
                      <span className="line-through">{product.originalPrice}</span>
                    </div>
                    <div>
                      <strong>Savings:</strong> {product.savings}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{product.rating}</span>
                      <span>({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Store className="w-4 h-4" />
                      <span>{product.store}</span>
                    </div>
                  </div>

                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full mt-4" size="lg">
                      <BadgeCheck className="w-4 h-4 mr-2" />
                      View on Store
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
