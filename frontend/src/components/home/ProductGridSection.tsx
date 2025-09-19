"use client"

import { getProducts, ProductFilterParams, Product } from "@/services/product"
import ProductCard from "../product/ProductCard"

import { useState, useEffect } from "react"

interface ProductGridSectionProps extends ProductFilterParams {
    title: string
    description: string

}

const ProductGridSection = ({title, description, displayType, categoryId, limit  }: ProductGridSectionProps) => {

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts({displayType, categoryId, limit});
      setProducts(products);
    }
    fetchProducts()
  }, [displayType, categoryId, limit])

  return (
    <section>
      <header>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      <div className="grid">
        {products.length > 0 && products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default ProductGridSection
