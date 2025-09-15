import api from "@/lib/api";

export interface Category {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryData {
    name: string;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
}

export const createCategory = async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
}

export const updateCategory = async (id: string, data: CreateCategoryData): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
}

export const deleteCategory = async (id: string): Promise<{message: string}> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
}