"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import { HiOutlineShoppingCart } from "react-icons/hi";
import GeneralButton from "../ui/GeneralButton";
import ProductItemCart from "@/components/product/ProductItemCart";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmationModal from "../ui/ConfirmationModal";

import { createOrder } from "@/services/order";
import { set } from "react-hook-form";

interface CartDrawerProps {
  isOpen: boolean;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    cart,
    totalItems,
    totalPrice,
    isLoading,
    clearUserCart,
    localCart,
    updateItemQuantityLocal
  } = useCart();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const router = useRouter();

  const localCartTotalQuantity = localCart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const LocalCartTotalPrice =
    cart?.items.reduce(
      (total, item) => total + item.product.price * localCartTotalQuantity,
      0
    ) || 0;

  // console.log(LocalCartTotalPrice);

  // console.log(localCartTotalQuantity, totalItems);

  const handleCheckout = async () => {
    setIsOpenModal(false);
      if (!cart || cart.items.length === 0) {
        toast.error("Seu carrinho está vazio.");
        return;
      }
      if (!isAuthenticated) {
        toast.error("Faça login para finalizar a compra.");
        router.push("/login");
        return;
      }
      try {
        updateItemQuantityLocal();
        const response = await createOrder();
        await clearUserCart();
        router.push(`/orders/${response._id}`);
      } catch (error) {
        console.error("Erro ao criar pedido:", error);
      }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
          Carregando carrinho...
        </p>
      </div>
    );
  }

  // console.log(cart?.items);

  return (
    <section>
      <header className="p-5 border-b border-primary-accent-light dark:border-primary-accent-dark">
        <h2 className="font-playfair text-lg font-bold">Meu carrinho</h2>
      </header>

      {!isAuthenticated && (
        <div className="login p-10 flex flex-col gap-6 justify-center items-center">
          <HiOutlineShoppingCart
            size="5rem"
            className="text-text-secondary-light dark:text-text-secondary-dark"
          />
          <div className="message flex flex-col gap-3 text-center">
            <p className="font-playfair font-semibold text-xl">
              Faça Login para ver seu Carrinho
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Sua sessão está salva em sua conta.
            </p>
          </div>
          <div className="buttons flex flex-col gap-3">
            <GeneralButton
              color="bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light"
              border=" rounded-lg px-8"
              onClick={() => router.push("/login")}
            >
              Fazer Login
            </GeneralButton>
            <GeneralButton
              color="border-2"
              border=" rounded-lg"
              onClick={() => router.push("/register")}
            >
              Criar Conta
            </GeneralButton>
          </div>
        </div>
      )}
      {cart?.items.length === 0 ? (
        <div className="empty p-10 flex flex-col gap-6 justify-center items-center">
          <HiOutlineShoppingCart
            size="5rem"
            className="text-text-secondary-light dark:text-text-secondary-dark"
          />
          <div className="message flex flex-col gap-3 text-center">
            <p className="font-playfair font-semibold text-xl">
              Seu carrinho está vazio
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Adicione produtos ao seu carrinho.
            </p>
          </div>
          <div className="buttons ">
            <GeneralButton
              color="bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light"
              border=" rounded-lg px-8"
              onClick={() => router.push("/products")}
            >
              Continuar comprando
            </GeneralButton>
          </div>
        </div>
      ) : (
        <>
          <div className="cart p-5 flex flex-col gap-6">
            {cart?.items?.map((item) => (
              <ProductItemCart
                item={item}
                isOpen={isOpen}
                key={item.product._id}
              />
            ))}
          </div>
          <footer className="absolute bottom-0 left-0 w-full p-5 flex flex-col gap-2">
            <div className="total flex flex-col gap-2 px-2">
              <div className="item-count flex justify-between text-sm text-text-primary-light dark:text-text-primary-dark">
                <p className="font-medium">Total de itens:</p>
                <p className="font-semibold">{totalItems + localCartTotalQuantity}</p>
              </div>
              <div className="subtotal flex justify-between text-sm">
                <p className="font-medium text-text-primary-light dark:text-text-primary-dark">Subtotal:</p>
                <p className="font-bold">${(totalPrice + LocalCartTotalPrice).toFixed(2)}</p>
              </div>
            </div>
            <div className="actions text-center flex flex-col gap-3">
              <GeneralButton
                color="bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light"
                border=" rounded-lg px-8"
                onClick={() => setIsOpenModal(true)}
              >
                Finalizar compra
              </GeneralButton>

              <p
                className="text-text-muted-light dark:text-text-muted-dark cursor-pointer"
                onClick={clearUserCart}
              >
                Limpar carrinho
              </p>
            </div>
          </footer>
          {isOpenModal && (
            <ConfirmationModal
              isOpen={isOpenModal}
              onClose={() => setIsOpenModal(false)}
              onConfirm={handleCheckout}
              title="Finalizar compra"
              message="Tem certeza de que deseja finalizar a compra?"
            />
          )}
        </>
      )}
    </section>
  );
};

export default CartDrawer;
