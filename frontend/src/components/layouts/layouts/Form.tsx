import Link from "next/link";
import React from "react";

const Form = ({ children, title, subtitle, textButton }) => {
  return (
    <form className="flex flex-col gap-8 items-center justify-center w-[clamp(18.75rem,80vw,30rem)] p-[clamp(1rem,4vw,3rem)] rounded-xl shadow-2xl bg-page-background-light dark:bg-page-background-dark">
      <header className="flex flex-col items-center gap-4 justify-center text-primary-accent-light dark:text-primary-accent-dark">
        <h2 className="font-playfair text-3xl font-bold">{title}</h2>
        <p>{subtitle}</p>
      </header>
      {children}
      <button className="w-full p-3 rounded-xl hover:scale-105 bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light transition duration-300">{textButton}</button>
      <div className="options relative flex items-center w-full">
        <p className="mx-auto px-1 text-center bg-page-background-light dark:bg-page-background-dark z-1">ou</p>
        <div className="line h-1 w-full absolute border-b border-primary-accent-light dark:border-primary-accent-dark"></div>
      </div>
      <div className="register flex items-center gap-2 text-sm">
        <p className="text-text-primary-light dark:text-text-primary-light dark:text-link-dark">Não possui uma conta?</p>
        <Link href="/register" className="text-primary-accent-light dark:text-primary-accent-dark">Cadastre-se</Link>
      </div>
    </form>
  );
};

export default Form;
