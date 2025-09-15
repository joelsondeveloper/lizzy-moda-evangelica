"use client";

import React, { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSideBar from "@/components/admin/AdminSideBar";
import { toast } from "react-toastify";
import NavButton from "@/components/layouts/ui/NavButton";

import { FiMenu } from "react-icons/fi";
import {
  HiOutlineViewColumns,
  HiOutlineTag,
  HiOutlineArchiveBox,
} from "react-icons/hi2";
import { FaShoppingCart, FaUsers } from "react-icons/fa";



const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const navLinks = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: <HiOutlineViewColumns />,
    },
    {
      title: "Categorias",
      path: "/admin/category",
      icon: <HiOutlineTag />,
    },
    {
      title: "Produtos",
      path: "/admin/product",
      icon: <HiOutlineArchiveBox />,
    },
    {
      title: "Pedidos",
      path: "/admin/order",
      icon: <FaShoppingCart />,
    },
    {
      title: "Usuarios",
      path: "/admin/user",
      icon: <FaUsers />,
    },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Voce precisa estar logado para acessar essa pagina!");
        router.push("/login");
      } else if (!isAdmin) {
        toast.error(
          "Acesso negado! Voce nao tem permissao para acessar essa pagina!"
        );
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router, user]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-page-background-light)] dark:bg-[var(--color-page-background-dark)]">
        <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-lg">
          Verificando permissões de administrador...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen text-primary-accent-light dark:text-primary-accent-dark  bg-card-background-light dark:bg-card-background-dark">
      <div className="menu absolute top-4 right-4 md:hidden">
        <NavButton size="w-12 h-12" handleClick={() => setIsOpen(true)}>
          <FiMenu size="50%" />
        </NavButton>
      </div>
      <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} navLinks={navLinks} />
      <main className="flex-1 p-8 pt-0">{React.cloneElement(children as React.ReactElement<{ navLinks: typeof navLinks }>, { navLinks }) }</main>
    </div>
  );
};

export default AdminLayout;
