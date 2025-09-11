import Link from "next/link";
import React from "react";
import GeneralButton from "../ui/generalButton";

interface FormProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  textButton: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
  otherWay?: React.ReactNode;
}

const Form = ({ children, title, subtitle, textButton, onSubmit, isLoading, otherWay }: FormProps) => {
  return (
    <form className="flex flex-col gap-8 items-center justify-center w-[clamp(18.75rem,80vw,30rem)] p-[clamp(1rem,4vw,3rem)] rounded-xl shadow-2xl bg-page-background-light dark:bg-page-background-dark" onSubmit={onSubmit}>
      <header className="flex flex-col items-center gap-4 justify-center text-primary-accent-light dark:text-primary-accent-dark">
        <h2 className="font-playfair text-3xl font-bold">{title}</h2>
        <p>{subtitle}</p>
      </header>
      {children}
      <GeneralButton color="bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light" border=" rounded-xl" isLoading={isLoading}>{textButton}</GeneralButton>
      <div className="options relative flex items-center w-full">
        <p className="mx-auto px-1 text-center bg-page-background-light dark:bg-page-background-dark z-1">ou</p>
        <div className="line h-1 w-full absolute border-b border-primary-accent-light dark:border-primary-accent-dark"></div>
      </div>
      {otherWay}
    </form>
  );
};

export default Form;
