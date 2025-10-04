
import Image from "next/image"
import {HiOutlineMinusCircle, HiOutlinePlusCircle, HiOutlineTrash} from "react-icons/hi"
import { useCart } from "@/context/CartContext"
import { CartItem as CartItemType } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ProductItemCartProps {
  item: CartItemType
}

const ProductItemCart: React.FC<ProductItemCartProps> = ({item}) => {

  const Router = useRouter();

  const { updateItemQuantity, modifyLocalCart } = useCart();

  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const [localSize] = useState(item.size);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleDecreaseQuantity = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (localQuantity > 1) {
      setLocalQuantity(localQuantity - 1);
      modifyLocalCart(item.product._id, -1, item.size);
    }
  };

  const handleIncreaseQuantity = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLocalQuantity(localQuantity + 1);
    modifyLocalCart(item.product._id, 1, item.size);
  };

  const handleChangeSize = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  e.stopPropagation();
  updateItemQuantity(item.product._id, localQuantity, e.target.value);
};

  const handleRemoveItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await updateItemQuantity(item.product._id, 0);
  };

  return (
    <article className="p-5 flex gap-3 items-center border-b border-text-secondary-light dark:border-text-secondary-dark">
      <div className="img-container relative w-15 aspect-square rounded-xl overflow-hidden" onClick={() => {
        Router.push(`/product/${item.product._id}`);
      }}>
        <Image src={item.product.imageUrl[0]} alt={item.product.name} fill style={{ objectFit: "cover" }} />
      </div>
      <div className="info flex flex-col gap-2">
        <h3 className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">{item.product.name}</h3>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">R$ {item.product.price}</p>
        <div className="controls flex items-center gap-2">
          <button className="w-5 aspect-square text-text-secondary-light dark:text-text-secondary-dark" onClick={handleDecreaseQuantity}>
            <HiOutlineMinusCircle size="100%"/>
          </button>
          <span className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">{localQuantity}</span>
          <button className="w-5 aspect-square text-text-secondary-light dark:text-text-secondary-dark" onClick={handleIncreaseQuantity}>
            <HiOutlinePlusCircle size="100%" />
          </button>
          <button className="w-5 aspect-square text-error-light dark:text-error-dark" onClick={handleRemoveItem}>
            <HiOutlineTrash size="100%" />
          </button>
          <select value={localSize} onChange={handleChangeSize}>
            {item.product.size.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
    </article>
  )
}

export default ProductItemCart
