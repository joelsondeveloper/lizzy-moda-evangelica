import api from "../lib/api";

export interface VerifyData {
    email: string;
    code: string;
};

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isVerified: boolean;
}

export const verifyUser = async (data: VerifyData): Promise<{message: string; user?: User}> => {

    try {
        const response = await api.post('/auth/verify', data);
        return response.data;
    } catch (error) {
        throw error;
    }
    
}

export const registerUser = async (data: RegisterData): Promise<User> => {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProfile = async (): Promise<User> => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async (): Promise<void> => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        throw error;
    }
};