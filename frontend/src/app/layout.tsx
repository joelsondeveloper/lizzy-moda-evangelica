"use client";

// import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

import { useState } from "react";

import Header from "@/components/layouts/layouts/Header";
import ToastProvider from "@/providers/ToastProvider";

import "react-toastify/dist/ReactToastify.css";
import SideDrawer from "@/components/layouts/layouts/SideDrawer";
import AuthDrawer from "@/components/layouts/layouts/AuthDrawer";
import CartDrawer from "@/components/layouts/layouts/CartDrawer";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const PlayfairFont = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// export const metadata: Metadata = {
//   title: "Lizzy Moda Evangélica",
//   description: "Sua loja de moda evangélica online",
// };

export type sideProps = "auth" | "cart" | "none";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [wichSideDrawer, setWichSideDrawer] = useState<sideProps>("none");

  return (
    <html lang="pt-BR" className="">
      <body
        className={`${InterFont.variable} ${PlayfairFont.variable} font-inter antialiased overflow-x-hidden text-primary-accent-light dark:text-primary-accent-dark  bg-card-background-light dark:bg-card-background-dark`}
      >
        <AuthProvider>
          <ToastProvider>
            <Header sideDrawer={setWichSideDrawer}/>
            <main className="pt-32 relative">
              {children}
              <SideDrawer isOpen={wichSideDrawer !== "none"} setIsOpen={setWichSideDrawer}>
                {wichSideDrawer === "auth" && <AuthDrawer />}
                {wichSideDrawer === "cart" && <CartDrawer />}
              </SideDrawer>
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
