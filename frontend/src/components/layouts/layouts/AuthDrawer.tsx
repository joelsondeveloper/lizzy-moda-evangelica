import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

import {
  FiShoppingBag, // sacola
  FiUser, // usuário
  FiSettings, // configuração
  FiMapPin, // dot location
  FiMail, // carta/email
  FiLogOut, // quadrado com seta pra sair
} from "react-icons/fi"; // Feather Icons - todos outline
import MenuLink from "../ui/MenuLink";

const AuthDrawer = () => {
  const { user, isAuthenticated, isLoading, isAdmin, logout } = useAuth();

  const navLinksUser = [
    {
      title: "Meus Pedidos",
      path: "/my-orders",
      icon: <FiShoppingBag />,
    },
    {
      title: "Minha Conta / Perfil",
      path: "/my-account",
      icon: <FiUser />,
    },
    {
      title: "Configuracoes",
      path: "/settings",
      icon: <FiSettings />,
    },
    {
      title: "Nossa Loja Fisica",
      path: "/addresses",
      icon: <FiMapPin />,
    },
    {
      title: "Contato",
      path: "/support",
      icon: <FiMail />,
    },
  ];

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
              <MenuLink
                text={link.title}
                link={link.path}
                icon={link.icon}
              />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default AuthDrawer;
