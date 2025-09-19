import { Product } from "@/services/product"
import Image from "next/image"
import GeneralButton from "../layouts/ui/GeneralButton"

const ProductCard = ({product}: {product: Product}) => {
  return (
    <article>
      <Image src={product.imageUrl} alt={product.name} width={200} height={200} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button>Adicionar ao carrinho</button>
    </article>
  )
}

export default ProductCard
