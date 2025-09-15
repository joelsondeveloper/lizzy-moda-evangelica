import { boolean } from "zod";
import api from "../lib/api";

export interface Product {
    _id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    size: string[];
    category: {
        _id: string;
        name: string;
    };
    imageUrl: string;
    inStock: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    size: string | string[];
    category: string;
    imageFile: File | null;
    currentImageUrl: string;
    inStock: boolean;
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("size", JSON.stringify(data.size));
    formData.append("category", data.category);
    formData.append("inStock", data.inStock.toString());

    if (data.imageFile) {
        formData.append("image", data.imageFile);
    } else if (data.currentImageUrl) {
        formData.append("image", data.currentImageUrl);
    }

    const response = await api.post("/products", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateProduct = async (id: string, data: ProductFormData): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("size", JSON.stringify(data.size));
    formData.append("category", data.category);
    formData.append("inStock", data.inStock.toString());

    if (data.imageFile) {
        formData.append("image", data.imageFile);
    } else if (data.currentImageUrl) {
        formData.append("image", data.currentImageUrl);
    } else {
        formData.append("image", "");
    }

    const response = await api.put(`/products/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};