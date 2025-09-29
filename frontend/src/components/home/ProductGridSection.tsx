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

  if (loading === true) {
    return (
      <section className="px-10 py-20 flex flex-col gap-12 justify-center items-center bg-page-background-light dark:bg-page-background-dark">
        <header className="flex flex-col gap-3 text-center">
          <h2 className="font-playfair text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {title}
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {description}
          </p>
        </header>
        <div
          className={`grid-container w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
          }`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="w-70 rounded-xl overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="img-container w-70 aspect-square relative">
                <div className="skeleton absolute top-0 left-0 w-full h-full"></div>
              </div>
              <div className="info p-6 flex flex-col gap-3  bg-card-background-light dark:bg-card-background-dark flex-1">
                <h3 className="skeleton h-6 w-full"></h3>
                <p className="skeleton h-7 w-[50%] "></p>
                <button
                  className="skeleton h-8 w-full"
                  onClick={(e) => e.preventDefault()}
                >
                  {" "}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  } else {
    return (
      <section className="px-10 py-20 flex flex-col gap-12 justify-center items-center bg-page-background-light dark:bg-page-background-dark">
        <header className="flex flex-col gap-3 text-center">
          <h2 className="font-playfair text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {title}
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {description}
          </p>
        </header>
        <div
          className={`grid-container w-full ${
            products.length > 5
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "flex flex-row gap-8 flex-wrap justify-center"
          }`}
        >
          {products.length > 0 &&
            products.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </section>
    );
  }
};

export default ProductGridSection;
