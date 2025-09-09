"use client";

import Image from "next/image";
import Link from "next/link";
import NavButton from "../ui/NavButton";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";

import { sideProps } from "@/app/layout";

const Header = ({ sideDrawer }: { sideDrawer: (side: sideProps) => void }) => {
  const navLinks = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Categorias",
      path: "/categories",
    },
    {
      title: "Sobre",
      path: "/about",
    },
    {
      title: "Novidades",
      path: "/news",
    },
  ];

  return (
    <header className="px-[clamp(1rem,5vw,5rem)] py-4 gap-4 flex flex-col fixed w-full backdrop-blur-sm z-2">
      <div className="header-top flex items-center justify-between gap-4">
        <div className="logo-section flex gap-4 flex-shrink-0">
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

        <div className="search-bar relative h-12 w-[600px] flex items-center justify-center rounded-xl bg-link-light dark:bg-link-dark border">
          <button type="submit" className="absolute right-2">
            <FaSearch />
          </button>
          <input
            type="text"
            className="w-full h-full px-4 py-2 rounded-full focus:outline-none"
            placeholder="Buscar..."
          />
        </div>
        <div className="actions flex gap-5">
          <NavButton size="w-12" handleClick={() => sideDrawer("auth")}>
            <HiOutlineUser />
          </NavButton>
          <NavButton size="w-12" handleClick={() => sideDrawer("cart")}>
            <span
              className="cart-count absolute top-0 right-0 w-4 aspect-square text-xs text-white bg-primary-accent-light
            dark:bg-primary-accent-dark rounded-full flex items-center justify-center"
            >
              0
            </span>
            <HiOutlineShoppingBag />
          </NavButton>
        </div>
      </div>
      <nav>
        <ul className="flex gap-12 justify-center">
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
