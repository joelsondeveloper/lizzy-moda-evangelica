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

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  return <PageClient searchParams={searchParams as SearchParams} />;
}
