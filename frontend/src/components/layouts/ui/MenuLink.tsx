import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

interface MenuLinkProps {
  text: string;
  link: string;
  icon: React.ReactNode;
  active?: boolean;
}

const MenuLink = ({ text, link, icon, active }: MenuLinkProps) => {
  return (
    <Link
      href={link}
      className={`flex p-3 items-center justify-between gap-2 ${
        active
          ? "bg-secondary-accent-light dark:bg-secondary-accent-dark text-white"
          : "hover:bg-secondary-accent-light dark:hover:bg-secondary-accent-dark hover:text-white"
      } transition duration-300 rounded-2xl`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{text}</span>
      </div>
      <FiChevronRight className="text-primary-accent-light dark:text-primary-accent-dark hover:text-white" />
    </Link>
  );
};

export default MenuLink;
