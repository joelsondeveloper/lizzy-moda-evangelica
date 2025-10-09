"use client";

import { getProducts, ProductFilterParams, Product } from "@/services/product";
import ProductCard from "../product/ProductCard";

import { useState, useEffect } from "react";

interface ProductGridSectionProps extends ProductFilterParams {
  title: string;
  description: string;
}

const ProductGridSection = ({
  title,
  description,
  displayType,
  categoryId,
  limit,
}: ProductGridSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts({ displayType, categoryId, limit });
      setProducts(products.products);
      setLoading(false);
    };
    fetchProducts();
  }, [displayType, categoryId, limit]);

   const gridClasses = `
    grid-container w-full grid 
    grid-cols-1 
    sm:grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-4 
    xl:grid-cols-5 
    gap-[clamp(1rem,2vw,2rem)]
  `;

  const sectionClasses = `
    px-[clamp(1rem,4vw,6rem)] 
    py-[clamp(2rem,6vw,8rem)] 
    flex flex-col gap-12 
    justify-center items-center 
    bg-page-background-light 
    dark:bg-page-background-dark
  `;

  return (
    <section className={sectionClasses}>
      <header className="flex flex-col gap-3 text-center px-2">
        <h2 className="font-playfair text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-text-primary-light dark:text-text-primary-dark leading-tight">
          {title}
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-[50ch] mx-auto text-[clamp(0.9rem,1.5vw,1.1rem)]">
          {description}
        </p>
      </header>

      {loading ? (
        <div className={gridClasses}>
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="rounded-xl overflow-hidden flex flex-col cursor-pointer w-full"
            >
              <div className="img-container aspect-square relative">
                <div className="skeleton absolute top-0 left-0 w-full h-full rounded-xl"></div>
              </div>
              <div className="info p-4 flex flex-col gap-3 bg-card-background-light dark:bg-card-background-dark flex-1">
                <h3 className="skeleton h-6 w-3/4 rounded"></h3>
                <p className="skeleton h-5 w-1/2 rounded"></p>
                <button className="skeleton h-8 w-full rounded"></button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div
          className={
            products.length > 5
              ? gridClasses
              : "flex flex-row gap-[clamp(1rem,2vw,2rem)] flex-wrap justify-center w-full"
          }
        >
          {products.length > 0 &&
            products.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      )}
    </section>
  );
};

export default ProductGridSection;
