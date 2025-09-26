import api from "../lib/api";

export interface ProductInCart {
    _id: string;
    name: string;
    imageUrl: string[];
    price: number;
}

export interface CartItem {
    _id: string;
    product: ProductInCart;
    quantity: number;
}

export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

interface AddToCartData {
    productId: string;
    quantity: number;
}

interface UpdateCartItemData {
    productId: string;
    quantity: number;
}

export const getCart = async (): Promise<Cart> => {
    const response = await api.get(`/cart`);
    return response.data;
};

export const addToCart = async (productId: string, quantity: number): Promise<Cart> => {
    const response = await api.post(`/cart`, { productId, quantity } as AddToCartData);
    return response.data;
};

export const updateCartItem = async (productId: string, quantity: number): Promise<Cart> => {
    const response = await api.put(`/cart`, { productId, quantity } as UpdateCartItemData);
    return response.data;
};

export const removeItem = async (productId: string): Promise<Cart> => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
};

export const clearCart = async (): Promise<Cart> => {
    const response = await api.delete(`/cart`);
    return response.data;
};