import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
  Cart,
} from "@/services/carts";

import { isAxiosError } from "@/utils/typeguards";
import { BackendErrorResponse } from "@/types/api";

export interface ProductInCart {
  _id: string;
  name: string;
  price: number;
  imageUrl: string[];
  size: string[];
}

export interface CartItem {
  _id: string;
  product: ProductInCart;
  quantity: number;
  size: string;
}

export interface CartContextType {
  cart: Cart | null;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  errorCart: string | null;
  addItem: (
    productId: string,
    quantity: number,
    size?: string
  ) => Promise<void>;
  updateItemQuantity: (
    productId: string,
    quantity: number,
    size: string
  ) => Promise<void>;
  removeItem: (productId: string, size?: string) => Promise<void>;
  modifyLocalCart: (productId: string, quantity: number, size?: string) => void;
  updateItemQuantityLocal: () => void;
  localCart: CartItem[];
  clearUserCart: () => Promise<void>;
  refetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [errorCart, setErrorCart] = useState<string | null>(null);
  const [localCart, setLocalCart] = useState([]);

  const fetchUserCart = useCallback(async () => {
    if (authLoading) {
      setIsLoadingCart(true);
      return;
    }
    if (!isAuthenticated) {
      setCart(null);
      setTotalItems(0);
      setTotalPrice(0);
      setIsLoadingCart(false);
      return;
    }

    setIsLoadingCart(true);
    setErrorCart(null);

    try {
      const fetchedCart = await getCart();
      setCart(fetchedCart);
      const itemsCount = fetchedCart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalVal = fetchedCart.items.reduce((total, item) => {
        if (!item.product || typeof item.product.price !== "number")
          return total;
        return total + item.product.price * item.quantity;
      }, 0);
      setTotalItems(itemsCount);
      setTotalPrice(totalVal);
    } catch (error: unknown) {
      console.error("Erro ao buscar carrinho:", error);
      let errorMessage = 400;
      if (isAxiosError(error)) {
        errorMessage = error.response?.status || 400;
      }
      if (errorMessage === 404) {
        setCart({
          _id: "",
          user: user?._id || "",
          items: [],
          createdAt: "",
          updatedAt: "",
        });
        setTotalItems(0);
        setTotalPrice(0);
        setErrorCart(null);
      } else {
        setErrorCart(
          "Erro ao buscar carrinho"
        );
        setCart(null);
        setTotalItems(0);
        setTotalPrice(0);
      }
    } finally {
      setIsLoadingCart(false);
    }
  }, [authLoading, isAuthenticated, user]);

  useEffect(() => {
    fetchUserCart();
  }, [fetchUserCart]);

  const addItem = async (
    productId: string,
    quantity: number = 1,
    size?: string
  ) => {
    if (!isAuthenticated) {
      toast.error(
        "Você precisa estar logado para adicionar produtos ao carrinho."
      );
      return;
    }
    setIsLoadingCart(true);
    try {
      const response = await addToCart(productId, quantity, size);
      setCart(response);
      const itemsCount = response.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalVal = response.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      setTotalItems(itemsCount);
      setTotalPrice(totalVal);
      toast.success("Produto adicionado ao carrinho com sucesso!");
    } catch (error: unknown) {
      let errorMessage;
      if (isAxiosError(error)) {
        errorMessage = error.response?.data as BackendErrorResponse;
      }
      toast.error(
        errorMessage?.message || "Erro ao adicionar produto ao carrinho."
      );
    } finally {
      setIsLoadingCart(false);
    }
  };

  const modifyLocalCart = (
    productId: string,
    quantity: number,
    size: string
  ) => {
    console.log("[modifyLocalCart] params:", { productId, quantity, size });
    setLocalCart((prevCart: CartItem[]) => {
      const existing = prevCart.find(
        (item) => item._id === productId && item.size === size
      );
      if (existing) {
        return prevCart.map((item) =>
          item._id === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity, size }
            : item
        );
      } else {
        // Se não existir, adiciona novo
        return [...prevCart, { _id: productId, quantity, size }];
      }
    });
  };

  const updateItemQuantity = async (
    productId: string,
    quantity: number,
    size: string
  ) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para atualizar o carrinho.");
      return;
    }
    setIsLoadingCart(true);
    try {
      const response = await updateCartItem(productId, quantity, size);
      setCart(response);
      const itemsCount = response.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalVal = response.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      setTotalItems(itemsCount);
      setTotalPrice(totalVal);
      toast.success("Produto atualizado no carrinho com sucesso!");
    } catch (error: unknown ) {
      let errorMessage;
      if (isAxiosError(error)) {
        errorMessage = error.response?.data as BackendErrorResponse;
      }
      toast.error(
        errorMessage?.message ||
          "Erro ao atualizar produto no carrinho."
      );
    } finally {
      setIsLoadingCart(false);
    }
  };

  const updateItemQuantityLocal = () => {
    if (localCart.length === 0) return;
    localCart.forEach((item: CartItem) => {
      const product = cart?.items.find(
        (p: CartItem) => p.product._id === item._id && p.size === item.size
      );
      if (item.quantity === 0) return;
      console.log(item._id, cart?.items);
      const productQuantity = product?.quantity ?? 0;
      updateItemQuantity(item._id, item.quantity + productQuantity, item.size);
    });
    setLocalCart([]);
  };

  const removeItem = async (productId: string, size?: string) => {
    if (!isAuthenticated) {
      toast.error(
        "Você precisa estar logado para remover produtos do carrinho."
      );
      return;
    }
    setIsLoadingCart(true);
    try {
      const response = await removeItem(productId, size);
      setCart(response);
      const itemsCount = response.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalVal = response.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      setTotalItems(itemsCount);
      setTotalPrice(totalVal);
      toast.info("Produto removido do carrinho com sucesso!");
    } catch (error: unknown) {
      let errorMessage
      if (isAxiosError(error)) {
        errorMessage = error.response?.data as BackendErrorResponse;
      }
      toast.error(
        errorMessage?.message || "Erro ao remover produto do carrinho."
      );
    } finally {
      setIsLoadingCart(false);
    }
  };

  const clearUserCart = async () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para limpar o carrinho.");
      return;
    }
    setIsLoadingCart(true);
    try {
      const response = await clearCart();
      setCart(response);
      setTotalItems(0);
      setTotalPrice(0);
      toast.info("Carrinho limpo com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao limpar carrinho.");
    } finally {
      setIsLoadingCart(false);
    }
  };

  const contextValue: CartContextType = {
    cart,
    totalItems,
    totalPrice,
    isLoading: isLoadingCart,
    errorCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearUserCart,
    modifyLocalCart,
    updateItemQuantityLocal,
    localCart,
    refetchCart: fetchUserCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};
