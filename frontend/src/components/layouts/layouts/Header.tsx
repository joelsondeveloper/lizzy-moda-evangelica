"use client";

import Image from "next/image";
import Link from "next/link";
import NavButton from "../ui/NavButton";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi2";

import { getCategories } from "@/services/category";

import { sideProps } from "@/app/layout";
import Search from "../ui/Search";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface NavLink {
  title: string;
  path: string;
}

const Header = ({ sideDrawer }: { sideDrawer: (side: sideProps) => void }) => {
  // const navLinks = [
  //   {
  //     title: "Home",
  //     path: "/",
  //   },
  //   {
  //     title: "Categorias",
  //     path: "/categories",
  //   },
  //   {
  //     title: "Sobre",
  //     path: "/about",
  //   },
  //   {
  //     title: "Novidades",
  //     path: "/news",
  //   },
  // ];

  const router = useRouter();
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { totalItems } = useCart()

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      const links = categories.map((category) => ({
        title: category.name,
        path: `/products?category=${category._id}`,
      }));
      setNavLinks(links);
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <header className="px-[clamp(1rem,5vw,5rem)] py-4 gap-4 flex flex-col fixed w-full backdrop-blur-sm z-2">
      <div className="header-top flex items-center justify-between gap-4">
        <div className="logo-section flex gap-4 flex-shrink-0 cursor-pointer" onClick={() => router.push("/")}>
          <div className="image-container relative w-12 h-12 border rounded-full">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="h-12 w-12 aspect-square rounded-full object-cover"
            />
          </div>
          <div className="brand-text hidden md:block ">
            <h1 className="font-playfair text-3xl font-bold">Lizzy Moda</h1>
            <p className="text-sm">Evangélica</p>
          </div>
        </div>

        <form onSubmit={handleSearch}>
          <Search value={searchTerm} setValue={setSearchTerm} />
        </form>
        <div className="actions flex gap-5">
          <NavButton size="w-12" handleClick={() => sideDrawer("auth")}>
            <HiOutlineUser />
          </NavButton>
          <NavButton size="w-12" handleClick={() => sideDrawer("cart")}>
            <span
              className="cart-count absolute top-0 right-0 w-4 aspect-square text-xs text-white bg-primary-accent-light
            dark:bg-primary-accent-dark rounded-full flex items-center justify-center"
            >
              {totalItems}
            </span>
            <HiOutlineShoppingBag />
          </NavButton>
        </div>
      </div>
      <nav className="overflow-hidden">
        <ul className="flex gap-12 justify-center mx-auto w-max ">
          {navLinks.map((link, index) => (
            <li
              className="font-medium text-primary-accent-light dark:text-primary-accent-dark"
              key={index}
            >
              <Link href={link.path}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
