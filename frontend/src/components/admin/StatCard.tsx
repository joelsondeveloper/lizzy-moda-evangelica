import { JSX } from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface StatCardProps {
  data: {
    title: string;
    value: number;
    icon: Element;
  };
}

const StatCard = ({ data }: StatCardProps) => {
  return (
    <article>
      <header>
        <div className="icon">{data.icon}</div>
        <div className="trends"></div>
      </header>
      <div className="content">
        <div className="total"></div>
        <p>Total de {data.title}</p>
      </div>
    </article>
  );
};

export default StatCard;
