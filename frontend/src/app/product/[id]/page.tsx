"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductById, Product } from "@/services/product";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import GeneralButton from "@/components/layouts/ui/GeneralButton";

const Page = () => {
  const params = useParams();
  const productId = params.id as string;

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const { addItem, isLoading: isLoadingCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setMainImageIndex(0);
      setSelectedSize(null);
    }
  }, [product]);

  console.log(product);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Por favor, selecione uma tamanho.");
      return;
    }
    try {
      await addItem(product._id, 1);
      toast.success("Item adicionado ao carrinho com sucesso.");
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
      toast.error("Erro ao adicionar item ao carrinho.");
    }
  };

  if (isLoading) {
    return (
      <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-center mt-8">
        Carregando detalhes do produto...
      </p>
    );
  }

  if (isError) {
    toast.error(error?.message || "Erro ao carregar produto.");
    return (
      <p className="text-red-500 text-center mt-8">
        Erro ao carregar produto: {(error as Error).message}
      </p>
    );
  }
  if (!product) {
    return (
      <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-center mt-8">
        Produto não encontrado.
      </p>
    );
  }

  return (
    <section className="p-[clamp(1rem,2vw,2.5rem)] gap-[clamp(1rem,3vw,3.75rem)] flex flex-col md:flex-row justify-center items-center md:items-start ">
      <div className="gallery max-w-130 flex gap-5">
        <div className="thumbnail flex flex-col gap-3">
          {product.imageUrl.map((imageUrl, index) => (
            <div
              key={index}
              className="img-container relative w-[clamp(3rem,calc(3rem+2rem*((100vw-20rem)/60rem)),5rem)] aspect-square"
            >
              <Image
                src={imageUrl}
                alt={`Imagem ${index + 1}`}
                fill
                className="thumbnail-image cursor-pointer hover:scale-105 transition duration-300"
                onClick={() => setMainImageIndex(index)}
                sizes="100%"
              />
            </div>
          ))}
        </div>
        <div
          className="mainImage relative w-[clamp(20rem,calc(20rem+11.25rem*((100vw-20rem)/60rem)),31.25rem)]
           aspect-square"
        >
          {product.imageUrl[mainImageIndex] &&
            product.imageUrl.map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                alt={product.name}
                fill
                sizes="100%"
                className={`${
                  index === mainImageIndex ? "active" : "opacity-0"
                } transition duration-500 ease-in-out`}
              />
            ))}
        </div>
      </div>
      <div className="info flex flex-col flex-1 max-w-130 justify-center items-center gap-6">
        <header className="text-center">
          <h2 className="font-playfair text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {product.name}
          </h2>
        </header>
        <div className="pricing w-full flex flex-col gap-2">
          <p className="price font-playfair text-4xl font-bold">
            {product.price ? `R$ ${product.price.toFixed(2)}` : "Indisponível"}
          </p>
          <p className="installments text-sm text-text-secondary-light dark:text-text-secondary-dark">
            ou R$ {(product.price / 3).toFixed(2)} em 3x sem juros
          </p>
        </div>
        <div className="description w-full">
          <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
            Descrição:
          </p>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {product.description}
          </p>
        </div>
        <div className="sizes w-full flex flex-col gap-3">
          <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
            Tamanhos:
          </p>
          <div className="size-container flex gap-3">
            {product.size.map((size) => (
              <input
                key={size}
                type="radio"
                name="size"
                id={size}
                value={size}
                className="hidden"
              />
            ))}
            {product.size.map((size) => (
              <label
                key={size}
                htmlFor={size}
                className="text-text-secondary-light dark:text-text-secondary-dark cursor-pointer"
              >
                {size}
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
