import api from "../lib/api";

export interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get(`/users`);
    return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};