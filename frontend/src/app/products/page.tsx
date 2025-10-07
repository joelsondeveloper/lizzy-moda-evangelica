// app/products/page.tsx (Server Component por padrão)

import PageClient from "./PageClient";

type SearchParams = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  size?: string;
  page?: string;
  limit?: string;
};

interface ProductsPageProps {
  searchParams?: SearchParams;
}

export default function Page({ searchParams }: ProductsPageProps) {
  return <PageClient searchParams={searchParams as SearchParams} />;
}
