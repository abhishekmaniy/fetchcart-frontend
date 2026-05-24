import { api } from "@/lib/api";

export const toggleProductLike = async (productId: string) => {
  const response = await api.patch(`/products/${productId}/like`);

  return response.data;
};