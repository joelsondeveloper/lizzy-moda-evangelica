import Image from "next/image";
import MenuLink from "../layouts/ui/MenuLink";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

import SideDrawer from "../layouts/layouts/SideDrawer";

import { FaUser } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: {
    title: string;
    path: string;
    icon: React.ReactNode;
  }[];
};

const AdminSideBar = ({ isOpen, setIsOpen, navLinks }: Props) => {
  const { user } = useAuth();

  const pathname = usePathname();

  

  return (
    <>
      <aside className="sticky flex-col top-0 left-0 bg-page-background-light dark:bg-page-background-dark h-screen z-3 hidden md:flex">
        <header className="p-6">
          <div className="logo-section flex gap-4 items-center">
            <div className="image-container relative w-10 h-10 border rounded-full">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="h-12 w-12 aspect-square rounded-full object-cover"
              />
            </div>
            <div className="brand-text flex flex-col gap-0.5">
              <h1 className="font-playfair text-xl font-semibold">
                Lizzy Admin
              </h1>
              <p className="text-sm">Painel Administrativo</p>
            </div>
          </div>
        </header>
        <nav className="p-4 flex-1">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.title}>
                <MenuLink
                  text={link.title}
                  link={link.path}
                  icon={link.icon}
                  active={pathname === link.path}
                />
              </li>
            ))}
          </ul>
        </nav>
        <footer className="p-4 flex items-center gap-3">
          <div className="profile w-9 aspect-square rounded-full flex items-center justify-center bg-primary-accent-dark dark:bg-primary-accent-light text-text-primary-dark dark:text-text-primary-light">
            <FaUser size="50%" />
          </div>
          <div className="info flex flex-col gap-0.5">
            <p className="name text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
              {user?.name}
            </p>
            <p className="email text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {user?.email}
            </p>
          </div>
        </footer>
      </aside>
      <div className="md:hidden">
        <SideDrawer isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
          <header className="p-6">
            <div className="logo-section flex gap-4 items-center">
              <div className="image-container relative w-10 h-10 border rounded-full">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="h-12 w-12 aspect-square rounded-full object-cover"
                />
              </div>
              <div className="brand-text flex flex-col gap-0.5">
                <h1 className="font-playfair text-xl font-semibold">
                  Lizzy Admin
                </h1>
                <p className="text-sm">Painel Administrativo</p>
              </div>
            </div>
          </header>
          <nav className="p-4 flex-1">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.title}>
                  <MenuLink
                    text={link.title}
                    link={link.path}
                    icon={link.icon}
                    active={pathname === link.path}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <footer className="p-4 flex items-center gap-3">
            <div className="profile w-9 aspect-square rounded-full flex items-center justify-center bg-primary-accent-dark dark:bg-primary-accent-light text-text-primary-dark dark:text-text-primary-light">
              <FaUser size="50%" />
            </div>
            <div className="info flex flex-col gap-0.5">
              <p className="name text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                {user?.name}
              </p>
              <p className="email text-xs text-text-secondary-light dark:text-text-secondary-dark">
                {user?.email}
              </p>
            </div>
          </footer>
        </SideDrawer>
      </div>
    </>
  );
};

export default AdminSideBar;
