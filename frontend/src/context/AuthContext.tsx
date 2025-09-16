"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, registerUser, logoutUser, getProfile } from "../services/auth";
import type { LoginCredentials, RegisterData } from "../services/auth";

interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isUserVerified: boolean;
    refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isUserVerified, setIsUserVerified] = useState<boolean>(false);

    const refetchUser = async () => {
        try {
            const response = await getProfile();
            setUser(response);
            console.log(response);
            setIsAuthenticated(response.isVerified);
            setIsUserVerified(response.isVerified);
            setIsAdmin(response.isAdmin);
        } catch (error) {
            console.error('Erro ao verificar status de autenticacao:', error);
            setUser(null);
            setIsAuthenticated(false);
            setIsUserVerified(false);
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        refetchUser();
        
}, []);

const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
        await loginUser(credentials);
        await refetchUser();
        return Promise.resolve();
    } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setIsUserVerified(false);
        setIsAdmin(false);
        throw error;
    } finally {
        setIsLoading(false);
    }
};

const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
        await registerUser(data);
        setUser(null);
        setIsAuthenticated(false);
        setIsUserVerified(false);
        setIsAdmin(false);
        return Promise.resolve();
    } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        throw error;
    } finally {
        setIsLoading(false);
    }
};

const logout = async () => {
    setIsLoading(true);
    try {
        await logoutUser();
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        window.location.href = '/login';
    } catch (error) {
        console.error('Erro ao deslogar:', error);
        throw error;
    } finally {
        setIsLoading(false);
    }
};

const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isUserVerified,
    refetchUser
};

return (
    <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
);  
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}