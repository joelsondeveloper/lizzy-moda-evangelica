"use client";

import { useAuth } from "@/context/AuthContext";

import {
  FiUser,
  FiMail,
  FiLogOut,
} from "react-icons/fi";
import { HiOutlineViewColumns } from "react-icons/hi2";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import MenuLink from "../ui/MenuLink";
import GeneralButton from "../ui/GeneralButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  setIsConfirming: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthDrawer = ({ setIsConfirming }: Props) => {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();

  console.log(isAuthenticated);

  const navLinksUser = [
    {
      title: "Minha Conta / Perfil",
      path: `/users/${user?._id}`,
      icon: <FiUser />,
    },
    {
      title: "Contato / Loja fisica",
      path: "/contact",
      icon: <FiMail />,
    },
  ];

  const navLinksGuest = [
    {
      title: "Sobre a Lizzy Moda",
      path: "/contact",
    }
  ];

  const router = useRouter();

  const handleRouter = (route: string) => {
    router.push(route);
  };

  if (isAuthenticated && !isAdmin) {
    return (
      <>
        <header className="p-5 flex flex-col items-center gap-1">
          <h2 className="font-playfair text-xl font-bold">Olá, {user?.name}</h2>
          <p className="text-sm">{user?.email}</p>
        </header>
        <nav>
          <ul className="p-6 flex flex-col gap-6">
            {navLinksUser.map((link) => (
              <li key={link.title} className="">
                <MenuLink text={link.title} link={link.path} icon={link.icon} />
              </li>
            ))}
          </ul>
        </nav>
        <footer className="p-6 mt-auto">
          <GeneralButton
            color="bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light"
            border=" rounded-xl"
            onClick={() => setIsConfirming(true)}
            isLoading={isLoading}
          >
            <FiLogOut />
            <span>Sair</span>
          </GeneralButton>
        </footer>
      </>
    );
  }

  if (isAuthenticated && isAdmin) {
    return (
      <>
        <header className="p-5 flex flex-col items-center gap-1">
          <h2 className="font-playfair text-xl font-bold">Olá, {user?.name}</h2>
          <span className="text-sm px-2 py-1 rounded-2xl bg-secondary-accent-light dark:bg-secondary-accent-dark text-button-text-light dark:text-button-text-dark">
            Administrador
          </span>
          <p className="text-sm">{user?.email}</p>
        </header>
        <nav className="px-6">
          <GeneralButton
            color="bg-secondary-accent-light dark:bg-secondary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-secondary-accent-darkdark:hover:bg-secondary-accent-light"
            border=" rounded-xl"
            onClick={() => handleRouter("/admin")}
            isLoading={isLoading}
          >
            <HiOutlineViewColumns />
            <span>Painel Admin</span>
            <FaArrowUpRightFromSquare />
          </GeneralButton>
          <ul className=" flex py-6 flex-col gap-6">
            {navLinksUser.map((link) => (
              <li key={link.title} className="">
                <MenuLink text={link.title} link={link.path} icon={link.icon} />
              </li>
            ))}
          </ul>
        </nav>
        <footer className="p-6 mt-auto">
          <GeneralButton
            color="bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light"
            border=" rounded-xl"
            onClick={() => setIsConfirming(true)}
            isLoading={isLoading}
          >
            <FiLogOut />
            <span>Sair</span>
          </GeneralButton>
        </footer>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <header className="p-5 flex flex-col items-center gap-1">
          <h2 className="font-playfair text-xl font-bold">Bem vindo(a)!</h2>
        </header>
        <div className="content flex flex-col p-6 gap-8">
          <p className="text-center text-text-secondary-light dark:text-text-secondary-dark">Acesse sua conta ou crie uma nova para uma melhor experiência de compras.</p>
          <div className="actions flex flex-col gap-4">
            <GeneralButton
              color="bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light"
              border=" rounded-xl"
              onClick={() => handleRouter("/login")}
              isLoading={isLoading}
            >
              <span>Entrar</span>
            </GeneralButton>
            <GeneralButton
              color="bg-card-background-light dark:bg-card-background-darkhover:bg-card-background-dark dark:hover:bg-card-background-light border-2"
              border=" rounded-xl"
              onClick={() => handleRouter("/register")}
              isLoading={isLoading}
            >
              <span>Cadastrar</span>
            </GeneralButton>
          </div>
        </div>
        <footer className="flex flex-col gap-3 mt-auto p-6">
          <h2 className="text-text-secondary-light dark:text-text-secondary-dark">Links Uteis</h2>
          <nav>
            <ul className="flex flex-col gap-3">
              {navLinksGuest.map((link) => (
                <li key={link.title} className="">
                  <Link href={link.path}>
                    <span>{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </>
    );
  }
};

export default AuthDrawer;
