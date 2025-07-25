import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const ProductModel = ({ product, open, onClose }: {
  product: any,
  open: boolean,
  onClose: () => void
}) => {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
          <p><strong>Price:</strong> {product.price}</p>
          <p><strong>Original Price:</strong> {product.originalPrice}</p>
          <p><strong>Savings:</strong> {product.savings}</p>
          <p><strong>Rating:</strong> {product.rating} ⭐ ({product.reviews} reviews)</p>
          <p><strong>Store:</strong> {product.store}</p>
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            View on Store
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductModel
