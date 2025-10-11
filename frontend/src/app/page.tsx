import BannerHome from "@/components/home/BannerHome";
import CategoriesGridSection from "@/components/home/CategoriesGridSection";
import ProductGridSection from "@/components/home/ProductGridSection";
import { getCategories } from "@/services/category";
import { link } from "fs";


export default async function Home() {

  const imagesBanner = [
    {
      src: "/img/moda.png",
      alt: "Banner 1",
      url: "/",
    }
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
      <CategoriesGridSection />
      {conjuntosId && <ProductGridSection title="conjuntos" description="veja os produtos mais recentes" displayType="categoria" categoryId={conjuntosId} limit={6} />}
    </main>
  );
}
