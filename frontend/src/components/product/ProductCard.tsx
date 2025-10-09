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

  return (
  <article
    className="rounded-xl overflow-hidden flex flex-col cursor-pointer w-full max-w-[20rem] transition-transform duration-300 hover:scale-[1.02]"
    onClick={handleProductClick}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* Imagem do produto */}
    <div className="relative aspect-square w-full overflow-hidden">
      <Image
        src={product.imageUrl[0]}
        alt={product.name}
        fill
        style={{
          objectFit: "cover",
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.3s ease-in-out",
        }}
      />
    </div>

    {/* Info */}
    <div className="info p-[clamp(0.8rem,1.5vw,1.5rem)] flex flex-col gap-3 bg-card-background-light dark:bg-card-background-dark flex-1">
      <h3 className="font-semibold text-[clamp(1rem,1.5vw,1.1rem)] text-text-primary-light dark:text-text-primary-dark line-clamp-2 leading-snug">
        {product.name}
      </h3>
      <p className="font-bold text-[clamp(1rem,1.8vw,1.25rem)] text-text-primary-light dark:text-text-primary-dark">
        R$ {product.price}
      </p>

      <button
        className="w-full text-center bg-primary-accent-light dark:bg-primary-accent-dark hover:bg-primary-accent-dark hover:dark:bg-primary-accent-light text-button-text-light dark:text-button-text-dark py-[clamp(0.6rem,1vw,0.8rem)] rounded-lg transition-colors duration-300 mt-auto font-medium"
      >
        Ver Produto
      </button>
    </div>
  </article>
);

};

export default ProductCard;
