import BannerHome from "@/components/home/BannerHome";
import ProductGridSection from "@/components/home/ProductGridSection";
import { getCategories } from "@/services/category";


export default async function Home() {

  const imagesBanner = [
    "/img/moda.png",
  ]

  const categories = await getCategories();
  const conjuntosId = categories.find(
    (category) => category.name === "conjuntos"
  )?._id;

  return (
    <main>
      <BannerHome images={imagesBanner} />
      <ProductGridSection title="ultimos produtos" description="veja os produtos mais recentes" displayType="novidade" limit={6}  />
      <ProductGridSection title="Melhores Conjuntos" description="veja os melhores Conjuntos disponiveis" displayType="categoria" categoryId={conjuntosId || ""} limit={6}  />
    </main>
  );
}
