"use client";

import Image from "next/image";
import Link from "next/link";
import { getCategories, Category } from "@/services/category";
import { getProducts } from "@/services/product";
import { useEffect, useState } from "react";

interface CategoryWithImage extends Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;

}

const CategoriesGridSection = () => {

  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getCategories();

        const categoriesWithImages = await Promise.all(
          allCategories.map(async (category: Category) => {
            const products = await getProducts({
              displayType: "categoria",
              categoryId: category._id,
              limit: 1,
            });

            const product = products?.products?.[0]

            console.log(product)

            if (product?.imageUrl?.length) {
              return {
                ...category,
                imageUrl: product.imageUrl[0],
              };
            }
            return null;
          })
        );

        setCategories(categoriesWithImages.filter(Boolean) as CategoryWithImage[]);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

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
      Categorias
    </h2>
    <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-[50ch] mx-auto text-[clamp(0.9rem,1.5vw,1.1rem)]">
      Conheça nossas categorias
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
    <>
      {/* MOBILE / TABLET: Carrossel horizontal */}
      <div className="w-full flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide px-2">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category._id}`}
            className="flex-shrink-0 w-[80%] sm:w-[45%] snap-center rounded-xl overflow-hidden bg-card-background-light dark:bg-card-background-dark cursor-pointer hover:scale-[1.02] transition"
          >
            <div className="relative aspect-square">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* DESKTOP: Grid fixo */}
      <div className="hidden lg:grid w-full grid-cols-4 xl:grid-cols-5 gap-[clamp(1rem,2vw,2rem)]">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category._id}`}
            className="rounded-xl overflow-hidden bg-card-background-light dark:bg-card-background-dark cursor-pointer hover:scale-[1.02] transition"
          >
            <div className="relative aspect-square">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  )}
</section>

  )
}

export default CategoriesGridSection
