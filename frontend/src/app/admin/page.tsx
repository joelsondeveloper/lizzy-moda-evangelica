"use client";

import { FaRotateRight } from "react-icons/fa6";
import StatCard from "@/components/admin/StatCard";

import {
  HiOutlineTag,
  HiOutlineArchiveBox,
} from "react-icons/hi2";
import { FaShoppingCart, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardData,
  DashboardData,
  DashboardMetrics,
} from "@/services/dashboard";
import React, { useEffect } from "react";
import DashboardCard from "@/components/admin/DashboardCard";
import Image from "next/image";


interface RecentOrdersSectionData {
  title: string;
  viewAllLink: string;
  orders: {
    _id: string;
    clientName: string;
    clientEmail: string;
    total: number;
    status: string;
    date: string;
  }[];
}

interface PopularProductsSectionData {
  title: string;
  viewAllLink: string;
  products: {
    _id: string;
    name: string;
    imageUrl: string;
    quantitySold: number;
    totalRevenue: number;
  }[];
}

const Page: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("30");
  const [startDate, setStartDate] = React.useState<string | undefined>(
    undefined
  );
  const [endDate, setEndDate] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    const today = new Date();
    let start = new Date();
    let end = today;

    if (selectedPeriod === "30") {
      start.setDate(today.getDate() - 30);
    } else if (selectedPeriod === "365") {
      start.setFullYear(today.getFullYear() - 1);
    } else if (selectedPeriod === "all") {
      start = new Date(0);
      end = today;
    }

    setStartDate(start.toISOString());
    setEndDate(end.toISOString());
  }, [selectedPeriod]);

  const {
    data: DashboardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<DashboardData, Error>({
    queryKey: ["adminDashboardMetrics", selectedPeriod, startDate, endDate],
    queryFn: () => getDashboardData(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Ocorreu um erro ao buscar os dados.");
    }
  }, [isError, error]);

  const handleReset = () => {
    refetch();
    toast.info("Dados do dashboard atualizados.");
  };

  const mapMetricsToStatCards = (metrics: DashboardMetrics | undefined) => {
    if (!metrics) return [];

    const cards = [
      {
        title: "Total de Produtos",
        value: metrics.totalProducts,
        change: metrics.newProductsCount.change,
        icon: <HiOutlineArchiveBox size="50%" />,
        isPositive: metrics.newProductsCount.change >= 0,
      },
      {
        title: "Total de Categorias",
        value: metrics.totalCategories,
        change: 0,
        icon: <HiOutlineTag size="50%" />,
        isPositive: true,
      },
      {
        title: "Total de Pedidos",
        value: metrics.ordersCount.value,
        change: metrics.ordersCount.change,
        icon: <FaShoppingCart size="50%" />,
        isPositive: metrics.ordersCount.change >= 0,
      },
      {
        title: "Total de Usuarios",
        value: metrics.totalUsers,
        change: metrics.newUsersCount.change,
        icon: <FaUsers size="50%" />,
        isPositive: metrics.newUsersCount.change >= 0,
      },
    ];

    return cards;
  };

  const recentOrdersDisplay: RecentOrdersSectionData = {
    title: "Pedidos Recentes",
    viewAllLink: "/admin/order",
    orders:
      DashboardData?.recentOrders?.map((order) => ({
        _id: order._id,
        clientName: order.clientName,
        clientEmail: order.clientEmail,
        total: order.total,
        status: order.status,
        date: order.date,
      })) ?? [],
  };

  const popularProductsDisplay: PopularProductsSectionData = {
    title: "Produtos Populares",
    viewAllLink: "/admin/product",
    products:
      DashboardData?.popularProducts?.map((product) => ({
        _id: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        quantitySold: product.quantitySold,
        totalRevenue: product.totalRevenue,
      })) ?? [],
  };

  // const navLinks = [

  //   {
  //     title: "Dashboard",
  //     path: "/admin",
  //     icon: <HiOutlineViewColumns />,
  //   },
  //   {
  //     title: "Categorias",
  //     path: "/admin/category",
  //     icon: <HiOutlineTag />,
  //   },
  //   {
  //     title: "Produtos",
  //     path: "/admin/product",
  //     icon: <HiOutlineArchiveBox />,
  //   },
  //   {
  //     title: "Pedidos",
  //     path: "/admin/order",
  //     icon: <FaShoppingCart />,
  //   },
  //   {
  //     title: "Usuarios",
  //     path: "/admin/user",
  //     icon: <FaUsers />,
  //   },
  // ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] z-5">
        <FaRotateRight className="animate-spin h-8 w-8 text-[var(--color-primary-accent-light)] dark:text-[var(--color-primary-accent-dark)] mb-4" />
        <p className="text-lg">Carregando dados do dashboard...</p>
      </div>
    );
  }

  const statCardsData = mapMetricsToStatCards(DashboardData?.metrics);

  function calculateDate(date: string) {
    const today = new Date();
    const targetDate = new Date(date);
    const timeDiff = today.getTime() - targetDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  }

  return (
    <section className="flex flex-col py-8">
      <header className="flex flex-col items-center text-center justify-between gap-2">
        <div className="title flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold font-playfair">
            Dashboard Administrativo
          </h2>
          <p className="text-text-primary-light dark:text-text-primary-dark">
            Visão geral do seu e-commerce
          </p>
        </div>
        <div className="actions flex gap-3">
          <select
            name="limit"
            className="p-2 rounded-lg transition duration-300 bg-page-background-light dark:bg-page-background-dark 
          hover:bg-primary-accent-light dark:hover:bg-primary-accent-dark hover:text-button-text-light dark:hover:text-button-text-dark text-text-primary-light dark:text-text-primary-dark" onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="30">Ultimos 30 dias</option>
            <option value="365">Ultimos 365 dias</option>
            <option value="all">Todos</option>
          </select>
          <button
            className="reset w-10 aspect-square flex items-center justify-center rounded-lg transition duration-300 bg-primary-accent-light dark:bg-primary-accent-dark
          hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light hover:scale-105 text-button-text-light dark:text-button-text-dark"
            onClick={handleReset}
          >
            <FaRotateRight size="50%" />
          </button>
        </div>
      </header>
      <div className="stats flex flex-wrap justify-center gap-6 py-8">
        {statCardsData.map((link) => (
          <StatCard key={link.title} data={link} />
        ))}
      </div>
      <div className="content flex flex-wrap justify-center gap-6">
        <DashboardCard title="Pedidos Recentes" router="/admin/orders">
          <table className="w-full table-custom">
            <thead>
              <tr className="flex justify-between">
                <th>Cliente</th>
                <th>total</th>
                <th>status</th>
                <th>data</th>
              </tr>
            </thead>
            <tbody className="flex flex-col">
              {recentOrdersDisplay.orders.map((order) => (
                <tr className="flex justify-between" key={order._id}>
                  <td>{order.clientName}</td>
                  <td>{order.total}</td>
                  <td>{order.status}</td>
                  <td>{calculateDate(order.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>

        <DashboardCard title="Produtos Recentes" router="/admin/products">
          <table className="w-full table-custom">
            <thead>
              <tr className="flex justify-between">
                <th>imagem</th>
                <th>total vendido</th>
                <th>total</th>
              </tr>
            </thead>
            <tbody className="flex flex-col">
              {popularProductsDisplay.products.map((product) => (
                <tr className="flex justify-between" key={product._id}>
                  <td>
                    <div className="img-container relative w-15 aspect-square rounded-2xl">
                      <Image src={product.imageUrl[0]} alt={product.name} fill className="h-12 w-12 aspect-square rounded-2xl object-cover"/>
                    </div>
                  </td>
                  <td className="flex flex-col gap-1">
                    <h4 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{product.name}</h4>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{product.quantitySold} vendas</p>
                  </td>
                  <td>R${product.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>
      </div>
    </section>
  );
};

export default Page;
