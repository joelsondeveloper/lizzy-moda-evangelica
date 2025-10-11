import api from "../lib/api";

export interface OrderItem {
    product: {
        _id: string;
        name: string;
        imageUrl: string;
    }
    quantity: number;
    price: number;
    size: string;
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
    whatsappLink: string;
    createdAt: string;
    updatedAt: string;
}

export interface updateOrderStatusData {
    status: "pendente" | "confirmado" | "cancelado";
}

export const orderStatuses = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

export const getOrdersByUserId = async (id: string): Promise<Order[]> => {
    const response = await api.get(`/orders/user/${id}`);
    return response.data;
}

export const getOrders = async (): Promise<Order[]> => {
    const response = await api.get("/orders");
    return response.data;
}

export const getOrderById = async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
}

export const getOrdersForAdmin = async (): Promise<Order[]> => {
    const response = await api.get("/orders/admin");
    return response.data;
}

export const getOrderPyId = async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
}

export const updateOrderStatus = async (id: string, data: updateOrderStatusData): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
}

export const deleteOrder = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
}

export const createOrder = async (): Promise<Order> => {
    const response = await api.post("/orders");
    return response.data;
}