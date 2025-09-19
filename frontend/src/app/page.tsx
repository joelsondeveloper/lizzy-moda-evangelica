import ProductGridSection from "@/components/home/ProductGridSection";


export default function Home() {
  return (
    <ProductGridSection title="ultimos produtos" description="veja os produtos mais recentes" displayType="novidade" limit={6}  />
  );
}
