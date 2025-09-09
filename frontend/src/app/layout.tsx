import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

import Header from "@/components/layouts/layouts/Header";

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

export const metadata: Metadata = {
  title: "Lizzy Moda Evangélica",
  description: "Sua loja de moda evangélica online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="">
      <body
        className={`${InterFont.variable} ${PlayfairFont.variable} font-inter antialiased text-primary-accent-light dark:text-primary-accent-dark  bg-card-background-light dark:bg-page-background-dark`}
      >
        <AuthProvider>
          <Header />
          <main className="pt-32">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
