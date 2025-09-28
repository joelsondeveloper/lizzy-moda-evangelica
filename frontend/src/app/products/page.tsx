"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getProducts,
  Product,
  ProductFilterParams,
  ProductListResponse,
} from "@/services/product";
import { getCategories, Category } from "@/services/category";
import ProductCard from "@/components/product/ProductCard";
import { toast } from "react-toastify";
import { HiOutlineAdjustments, HiOutlineRefresh } from "react-icons/hi";
import GeneralButton from "@/components/layouts/ui/GeneralButton";
import { ALL_SIZES } from "@/services/product";

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    searchParams.get("size")?.split(",") || []
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [productsPerPage, setProductsPerPage] = useState(
    parseInt(searchParams.get("limit") || "12")
  );

  const availableSizes = [...ALL_SIZES];

  const applyFilter = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (selectedSizes.length > 0) params.set("size", selectedSizes.join(","));
    params.set("page", currentPage.toString());
    params.set("limit", productsPerPage.toString());

    router.push(`/products?${params.toString()}`);
  }, [
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedSizes,
    currentPage,
    productsPerPage,
    router,
  ]);

  useEffect(() => {
    const currentSearchTerm = searchParams.get("search") || "";
    const currentCategory = searchParams.get("category") || "";
    const currentMinPrice = searchParams.get("minPrice") || "";
    const currentMaxPrice = searchParams.get("maxPrice") || "";
    const currentSizes =
      searchParams
        .get("size")
        ?.split(",")
        .filter((s) => s) || [];
    const currentPageParam = searchParams.get("page") || "1";
    const currentLimitParam = searchParams.get("limit") || "12";

    if (searchTerm !== currentSearchTerm) setSearchTerm(currentSearchTerm);

    if (
      searchTerm !== currentSearchTerm ||
      selectedCategory !== currentCategory ||
      minPrice !== currentMinPrice ||
      maxPrice !== currentMaxPrice ||
      JSON.stringify(selectedSizes) !== JSON.stringify(currentSizes) ||
      currentPage !== parseInt(currentPageParam) ||
      productsPerPage !== parseInt(currentLimitParam)
    ) {
      const debounceTimer = setTimeout(() => {
        applyFilter();
      }, 300);

      return () => {
        clearTimeout(debounceTimer);
      };
    }
  }, [
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedSizes,
    currentPage,
    productsPerPage,
    applyFilter,
    searchParams,
  ]);

  const {
    data: productListResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ProductListResponse, Error>({
    queryKey: ["products", searchParams.toString()],
    queryFn: () => {
      const apiParams: ProductFilterParams = {
        search: searchParams.get("search") || undefined,
        category: searchParams.get("category") || undefined,
        minPrice: searchParams.get("minPrice")
          ? parseFloat(searchParams.get("minPrice") as string)
          : undefined,
        maxPrice: searchParams.get("maxPrice")
          ? parseFloat(searchParams.get("maxPrice") as string)
          : undefined,
        size:
          searchParams
            .get("size")
            ?.split(",")
            .filter((s) => s) || undefined,
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "12"),
      };
      return getProducts(apiParams);
    },
    keepPreviousData: true,
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    if (type === "min") setMinPrice(value);
    if (type === "max") setMaxPrice(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSizes([]);
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
    setProductsPerPage(12);
    router.push("/products");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page.toString());
  };

  if (isLoading || categoriesLoading) {
    return (
      <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-center mt-8">
        Carregando produtos...
      </p>
    );
  }

  if (isError || categoriesError) {
    toast.error(
      error?.message ||
        (categoriesError
          ? "Erro ao carregar categorias."
          : "Erro ao carregar produtos.")
    );
    return (
      <p className="text-red-500 text-center mt-8">
        Erro ao carregar dados. {(error as Error)?.message}
      </p>
    );
  }

  const products = productListResponse || [];
  const totalProductsCount = productListResponse?.totalProductsCount || 0;
  const productsPerPageFromResponse =
    productListResponse?.productsPerPage || 12;
  const totalPages = Math.ceil(
    totalProductsCount / productsPerPage
  );

  console.log(productListResponse);

  return <section className="p-[clamp(2rem,5vw,10rem)] flex justify-center md:justify-start flex-col md:flex-row gap-8">
      <aside className="filter w-full md:w-70 flex flex-col gap-6 p-6 bg-page-background-light dark:bg-page-background-dark rounded-2xl">
        <header className="flex items-center justify-between w-full">
          <div className="title flex items-center gap-2">
            <HiOutlineAdjustments size="1.25rem"/>
          <h2 className="font-playfair text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Filtros</h2>
          </div>
          <div className="clear">
            <button onClick={handleResetFilters} className="px-3 py-1 rounded-lg flex items-center gap-2 border-2 border-text-muted-light dark:border-text-muted-dark text-text-muted-light dark:text-text-muted-dark">
              <HiOutlineRefresh size="1rem"/>
              <span className="text-sm">Limpar</span>
            </button>
          </div>
        </header>
        <div className="filter flex flex-row md:flex-col gap-5 flex-wrap justify-center">
          <label className="category flex flex-col gap-4">
            <span className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="p-2 rounded-lg border-2 w-full bg-card-background-light dark:bg-card-background-dark text-text-muted-light dark:text-text-muted-dark"
            >
              <option value="">Todas</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="price flex flex-col gap-2">
            <span className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">Preço:</span>
            <div className="inputs flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark">
              <input type="number" value={minPrice} onChange={(e) => handlePriceChange("min", e.target.value)} placeholder="50.00" className="px-3 py-1 border-2 rounded-xl max-w-[7rem]"/>
              <input type="number" value={maxPrice} onChange={(e) => handlePriceChange("max", e.target.value)} placeholder="300.00" className="px-3 py-1 border-2 rounded-xl max-w-[7rem]"/>

            </div>
          </label>
          <div className="sizes flex flex-col gap-3">
            <span className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">Tamanho:</span>
            <div className="inputs flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <label key={size} className="flex">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="hidden"
                  />
                  <span className={`w-10 h-8 flex items-center justify-center rounded-lg border-2 cursor-pointer ${selectedSizes.includes(size) ? "bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark" : "bg-card-background-light dark:bg-card-background-dark text-text-muted-light dark:text-text-muted-dark"} }`}>{size}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
      <div className="products flex flex-wrap gap-6 justify-center">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

  </section>;
};

export default Page;
