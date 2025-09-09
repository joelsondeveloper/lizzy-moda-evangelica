import { IoClose } from "react-icons/io5";
import NavButton from "../ui/NavButton";
import { sideProps } from "@/app/layout";

interface SideDrawerProps {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<sideProps>>;
}

const SideDrawer = ({ children, isOpen, setIsOpen }: SideDrawerProps) => {
  return (
    <aside className={`absolute top-0 right-0 bg-page-background-light dark:bg-page-background-dark aspect-[3/5] h-full z-3 transition duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="btn-container absolute top-4 right-4">
        <NavButton size="w-8" handleClick={() => setIsOpen("none")}>
          <IoClose size="50%" />
        </NavButton>
      </div>
      {children}
    </aside>
  );
};

export default SideDrawer;
