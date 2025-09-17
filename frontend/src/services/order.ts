import api from "../lib/api";

export interface OrderItem {
    product: {
        _id: string;
        name: string;
        imageUrl: string;
    }
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    }
    items: OrderItem[];
    totalPrice: number;
    status: "pendente" | "confirmado" | "cancelado";
    createdAt: string;
    updatedAt: string;
}

export interface updateOrderStatusData {
    status: "pendente" | "confirmado" | "cancelado";
}

export const getOrders = async (): Promise<Order[]> => {
    const response = await api.get("/orders");
    return response.data;
}

export const getOrderById = async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
}

export const updateOrderStatus = async (id: string, data: updateOrderStatusData): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, data);
    return response.data;
}

export const deleteOrder = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
}