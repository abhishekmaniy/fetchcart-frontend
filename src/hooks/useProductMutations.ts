import { toggleProductLike } from "@/api/product.api";
import { useMutation } from "@tanstack/react-query";

export const useToggleProductLikeMutation = () => {
  return useMutation({
    mutationFn: (productId: string) => toggleProductLike(productId),
  });
};