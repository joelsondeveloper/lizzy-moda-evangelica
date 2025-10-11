import BannerHome from "@/components/home/BannerHome";
import ProductGridSection from "@/components/home/ProductGridSection";
import { getCategories } from "@/services/category";


export default async function Home() {

  const imagesBanner = [
    "/img/moda.png",
  ]

  const categories = await getCategories();
  console.log(categories);
  const conjuntosId = categories.find(
    (category) => category.name === "Conjuntos"
  )?._id;

  return (
    <main>
      <BannerHome images={imagesBanner} />
      <ProductGridSection title="ultimos produtos" description="veja os produtos mais recentes" displayType="novidade" limit={6}  />
      {conjuntosId && <ProductGridSection title="conjuntos" description="veja os produtos mais recentes" displayType="categoria" categoryId={conjuntosId} limit={6} />}
    </main>
  );
}
