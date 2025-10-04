import { ProductInCart } from "@/services/carts";

export interface CartItem {
  _id: string;
  product: ProductInCart;
  price: number;
  quantity: number;
  size: string;
}
