"use client";

import { IoClose } from "react-icons/io5";
import NavButton from "../ui/NavButton";
import GrayScreen from "../ui/GrayScreen";
import ConfirmationModal from "../ui/ConfirmationModal";
import { useAuth } from "@/context/AuthContext";

import React, { useState, ReactElement, useEffect } from "react";

type sideProps = boolean;

interface SideDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<sideProps>>;
}

interface setIsConfirmingProps {
  setIsConfirming: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideForm = ({ children, isOpen, setIsOpen }: SideDrawerProps) => {

  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const { logout } = useAuth();

  useEffect(() => {
  if (isConfirming) {
    setIsOpen(false);
  }
}, [isConfirming, setIsOpen]);

  return (
    <>
      <aside
        className={`fixed flex flex-col justify-center items-center top-0 right-0 overflow-y-auto bg-page-background-light dark:bg-page-background-dark md:w-[40%] w-full aspect-[3/5] h-full z-3 transition duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="btn-container absolute top-4 right-4">
          <NavButton size="w-8" handleClick={() => setIsOpen(false)}>
            <IoClose size="50%" />
          </NavButton>
        </div>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as ReactElement<setIsConfirmingProps>, { setIsConfirming });
          }
          return child;
        })}
      </aside>
      {isOpen && (
        <GrayScreen
          onClick={() => {
            setIsOpen(false);
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

export default SideForm;
