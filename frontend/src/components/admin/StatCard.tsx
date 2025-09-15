import { JSX } from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface StatCardProps {
  data: {
    title: string;
    value: number;
    icon: JSX.Element;
    change: number;
  };
}

const StatCard = ({ data }: StatCardProps) => {
  // console.log(data);

  return (
    <article className="p-6 w-[clamp(200px,50vw,240px)]  rounded-2xl shadow-xl bg-page-background-light dark:bg-page-background-dark">
      <header className="flex items-center justify-between">
        <div className="icon w-12 aspect-square rounded-2xl flex items-center justify-center bg-secondary-accent-light dark:bg-secondary-accent-dark text-button-text-light dark:text-button-text-dark">
          {data.icon}
        </div>
        <div
          className={` flex flex-col items-center text-xs font-medium ${
            data.change >= 0
              ? "text-success-light dark:text-success-dark"
              : "text-danger-light dark:text-danger-dark"
          }`}
        >
          {data.change >= 0 ? (
            <>
              <FiTrendingUp />
              <span>+{data.change}</span>
            </>
          ) : (
            <>
              <FiTrendingDown />
              <span>-{data.change}</span>
            </>
          )}
        </div>
      </header>
      <div className="content flex flex-col gap-1">
        <div className="total font-bold text-3xl">{data.value}</div>
        <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark" >{data.title}</p>
      </div>
    </article>
  );
};

export default StatCard;
