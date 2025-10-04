'use client'

import { Product } from "@/services/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {toast} from "react-toastify"
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }: { product: Product }) => {

  const Router = useRouter();

  const { addItem } = useCart();

  const [isHovered, setIsHovered] = useState(false);

  const handleProductClick = () => {
    Router.push(`/product/${product._id}`);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      addItem(product._id, 1, product.size[0]);
    } catch (error) {
      console.log("Erro ao adicionar item ao carrinho:", error);
      toast.error("Erro ao adicionar item ao carrinho.");
    }
  };

  return (
    <article className="w-70 rounded-xl overflow-hidden flex flex-col cursor-pointer" onClick={handleProductClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="img-container w-70 aspect-square relative">
        <Image
          src={product.imageUrl[0]}
          alt={product.name}
          fill
          style={{ objectFit: "cover", scale: isHovered ? 1.1 : 1, transition: "all 0.3s ease-in-out" }}
        />
      </div>
      <div className="info p-6 flex flex-col gap-3  bg-card-background-light dark:bg-card-background-dark flex-1">
        <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{product.name}</h3>
        <p className="font-bold text-lg ">R$ {product.price}</p>
        <button className="w-full text-center bg-primary-accent-light dark:bg-primary-accent-dark
        hover:bg-primary-accent-dark
        hover:dark:bg-primary-accent-light text-button-text-light dark:text-button-text-dark py-2 rounded transition duration-300 mt-auto " onClick={handleButtonClick}>Adicionar ao carrinho</button>
      </div>
    </article>
  );
};

export default ProductCard;
