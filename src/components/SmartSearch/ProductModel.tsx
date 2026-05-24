import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  Heart,
  Loader2,
  ShieldCheck,
  Star,
  Store,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ProductModal = ({
  product,
  open,
  onClose,
  onToggleLike,
  isLikeLoading = false,
}: {
  product: any;
  open: boolean;
  onClose: () => void;
  onToggleLike?: () => void;
  isLikeLoading?: boolean;
}) => {
  const productTitle = product?.productName || product?.name || "Product";

  const productImages = useMemo(() => {
    if (!product) return ["/placeholder.png"];

    const images = [
      product.image,
      ...(Array.isArray(product.images) ? product.images : []),
    ].filter(Boolean);

    return Array.from(new Set(images.length ? images : ["/placeholder.png"]));
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(productImages[0]);

  useEffect(() => {
    setSelectedImage(productImages[0]);
  }, [productImages]);

  if (!product) return null;

  const featureBullets = Array.isArray(product.featureBullets)
    ? product.featureBullets
    : [];
  const pros = Array.isArray(product.pros) ? product.pros : [];
  const cons = Array.isArray(product.cons) ? product.cons : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl border border-border/70 bg-background/90 backdrop-blur-xl p-0 shadow-elegant">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

          <ScrollArea className="relative h-[88vh]">
            <div className="p-6 sm:p-8">
              <Card className="rounded-3xl glass border-border/70 shadow-soft">
                <CardContent className="p-5 sm:p-6 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="aspect-square rounded-3xl bg-card/70 border border-border/70 overflow-hidden flex items-center justify-center shadow-soft">
                        <img
                          src={selectedImage || "/placeholder.png"}
                          alt={productTitle}
                          className="h-full w-full object-contain p-4 transition-all duration-300"
                        />
                      </div>

                      {productImages.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                          {productImages.slice(0, 10).map((img, index) => {
                            const isActive = selectedImage === img;

                            return (
                              <button
                                key={`${img}-${index}`}
                                type="button"
                                onClick={() => setSelectedImage(img)}
                                className={`aspect-square rounded-2xl border bg-card/70 overflow-hidden transition-all ${
                                  isActive
                                    ? "border-primary ring-2 ring-primary/40 shadow-glow"
                                    : "border-border/70 hover:border-primary/60 hover:shadow-soft"
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`Product image ${index + 1}`}
                                  className="h-full w-full object-contain p-2"
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="text-2xl font-semibold leading-tight">
                            {productTitle}
                          </h2>

                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            disabled={isLikeLoading || !onToggleLike}
                            onClick={onToggleLike}
                            className="h-10 w-10 shrink-0 rounded-2xl border-border/70 bg-card/70 hover:bg-red-500/10 hover:text-red-500"
                          >
                            {isLikeLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Heart
                                className={`h-4 w-4 ${
                                  product.isLiked
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                            )}
                          </Button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {product.rating && (
                            <Badge className="rounded-full bg-accent text-primary hover:bg-accent">
                              <Star className="h-3.5 w-3.5 mr-1 fill-primary" />
                              {product.rating}
                              {product.reviews ? ` (${product.reviews})` : ""}
                            </Badge>
                          )}

                          {product.store && (
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-card/70 border border-border/70"
                            >
                              <Store className="h-3.5 w-3.5 mr-1" />
                              {product.store}
                            </Badge>
                          )}

                          {product.savings && (
                            <Badge className="rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10">
                              Save {product.savings}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="rounded-3xl glass border border-border/70 p-5">
                        <div className="flex items-end gap-3 flex-wrap">
                          <span className="text-4xl font-bold text-primary">
                            {product.price || "Price not available"}
                          </span>

                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through mb-1">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <InfoItem label="Brand" value={product.brand} />
                          <InfoItem label="Model" value={product.model} />
                          <InfoItem label="Category" value={product.category} />
                          <InfoItem label="ASIN" value={product.asin} />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {product.productUrl ? (
                          <a
                            href={product.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button
                              size="lg"
                              className="w-full rounded-2xl bg-primary-gradient text-white shadow-elegant hover:shadow-glow"
                            >
                              <BadgeCheck className="h-4 w-4 mr-2" />
                              Buy Now
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </a>
                        ) : (
                          <Button
                            size="lg"
                            disabled
                            className="flex-1 rounded-2xl"
                          >
                            Buy link unavailable
                          </Button>
                        )}

                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-2xl border-border/70 bg-card/70 hover:bg-accent"
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Verified
                        </Button>
                      </div>
                    </div>
                  </div>

                  {product.description && (
                    <Section title="Description">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                    </Section>
                  )}

                  {featureBullets.length > 0 && (
                    <Section title="Features">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {featureBullets.map((item: string, index: number) => (
                          <div
                            key={index}
                            className="flex gap-3 rounded-2xl bg-card/70 border border-border/70 p-4 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  {product.productInfo &&
                    Object.keys(product.productInfo).length > 0 && (
                      <Section title="Specifications">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(product.productInfo).map(
                            ([key, value], index) => (
                              <div
                                key={index}
                                className="rounded-2xl bg-card/70 border border-border/70 p-4 text-sm"
                              >
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                  {key}
                                </div>
                                <div className="mt-1 font-medium">
                                  {String(value)}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </Section>
                    )}

                  {(pros.length > 0 || cons.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {pros.length > 0 && (
                        <Section title="Pros">
                          <ul className="space-y-3">
                            {pros.map((item: string, index: number) => (
                              <li
                                key={index}
                                className="flex gap-3 text-sm text-muted-foreground"
                              >
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </Section>
                      )}

                      {cons.length > 0 && (
                        <Section title="Cons">
                          <ul className="space-y-3">
                            {cons.map((item: string, index: number) => (
                              <li
                                key={index}
                                className="flex gap-3 text-sm text-muted-foreground"
                              >
                                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </Section>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  if (!value) return null;

  return (
    <div className="rounded-2xl bg-card/70 border border-border/70 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium text-foreground">{value}</div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="rounded-3xl glass border border-border/70 p-5 shadow-soft">
      <h3 className="mb-4 text-lg font-semibold tracking-tight">{title}</h3>
      {children}
    </section>
  );
};

export default ProductModal;