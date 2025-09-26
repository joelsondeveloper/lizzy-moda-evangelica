"use client";

import { IoClose } from "react-icons/io5";
import NavButton from "../ui/NavButton";
import { sideProps } from "@/app/layout";
import GrayScreen from "../ui/GrayScreen";
import ConfirmationModal from "../ui/ConfirmationModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import React, { useState, ReactElement } from "react";

interface SideDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<sideProps>>;
}

interface setIsConfirmingProps {
  setIsConfirming: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

const SideDrawer = ({ children, isOpen, setIsOpen }: SideDrawerProps) => {

  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const { logout } = useAuth();
  const {updateItemQuantityLocal} = useCart();

  if (isConfirming) setIsOpen("none");

  return (
    <>
      <aside
        className={`fixed flex flex-col top-0 right-0 overflow-y-auto bg-page-background-light dark:bg-page-background-dark md:w-[40%] w-full aspect-[3/5] h-full z-3 transition duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="btn-container absolute top-4 right-4">
          <NavButton size="w-8" handleClick={() => {
            setIsOpen("none");
            updateItemQuantityLocal();
          }}>
            <IoClose size="50%" />
          </NavButton>
        </div>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as ReactElement<setIsConfirmingProps>, { setIsConfirming, isOpen });
          }
          return child;
        })}
      </aside>
      {isOpen && (
        <GrayScreen
          onClick={() => {
            setIsOpen("none");
            setIsConfirming(false);
          }}
        />
      )}
      {isConfirming && <GrayScreen onClick={() => setIsConfirming(false)} />}
      <ConfirmationModal
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={() => logout()}
        title="Logout"
        message="Tem certeza que deseja sair?"
        confirmText="Sim"
        cancelText="Cancelar"
      />
    </>
  );
};

export default SideDrawer;
