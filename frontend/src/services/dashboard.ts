import api from "../lib/api";   

export interface MetricValueAndChange {
    value: number;
    change: number;
}

export interface DashboardMetrics {
    totalProducts: number;
    totalCategories: number;
    totalUsers: number;
    ordersCount: MetricValueAndChange;
    pendingOrdersCount: MetricValueAndChange;
    newUsersCount: MetricValueAndChange;
    newProductsCount: MetricValueAndChange;
}

export interface RecentOrder {
    _id: string;
    clientName: string;
    clientEmail: string;
    total: number;
    status: string;
    date: string;
    itensSummary: {
        name: string;
        quantity: number;
    }[];
}

export interface PopularProduct {
    _id: string;
    name: string;
    imageUrl: string;
    quantitySold: number;
    totalRevenue: number;
}

export interface DashboardData {
    metrics: DashboardMetrics;
    recentOrders: RecentOrder[];
    popularProducts: PopularProduct[];
}

interface DashboardParams {
    startDate?: string;
    endDate?: string;
}

export const getDashboardData = async (startDate?: string, endDate?: string): Promise<DashboardData> => {    
    const params: DashboardParams = {};  
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/dashboard', {params});
    return response.data;
}