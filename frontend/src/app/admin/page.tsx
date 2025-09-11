import { FaRotateLeft } from "react-icons/fa6";
// import { navLinks } from "./layout";
import StatCard from "@/components/admin/StatCard";

import {
  HiOutlineViewColumns,
  HiOutlineTag,
  HiOutlineArchiveBox,
} from "react-icons/hi2";
import { FaShoppingCart, FaUsers } from "react-icons/fa";

const Page = () => {
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

  return (
    <section className="flex flex-col p-8">
      <header className="flex flex-col items-center justify-between gap-2">
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
          hover:bg-primary-accent-light dark:hover:bg-primary-accent-dark hover:text-button-text-light dark:hover:text-button-text-dark text-text-primary-light dark:text-text-primary-dark"
          >
            <option value="30">Ultimos 30 dias</option>
            <option value="365">Ultimos 365 dias</option>
            <option value="all">Todos</option>
          </select>
          <button
            className="reset w-10 aspect-square flex items-center justify-center rounded-lg transition duration-300 bg-primary-accent-light dark:bg-primary-accent-dark
          hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light hover:scale-105 text-button-text-light dark:text-button-text-dark"
          >
            <FaRotateLeft size="50%" />
          </button>
        </div>
      </header>
      <div className="stats">
        {navLinks.map(
          (link) =>
            link.title !== "Dashboard" && (
              <StatCard key={link.title} data={link} />
            )
        )}
      </div>
    </section>
  );
};

export default Page;
