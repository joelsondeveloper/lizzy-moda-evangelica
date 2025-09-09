import Link from "next/link";

interface MenuLinkProps {
  text: string;
  link: string;
  icon: React.ReactNode;
}

const MenuLink = ({ text, link, icon }: MenuLinkProps) => {
  return (
    <Link href={link} className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </Link>
  );
};

export default MenuLink;
