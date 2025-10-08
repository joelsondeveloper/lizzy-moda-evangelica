// app/products/page.tsx (Server Component por padrão)

import PageClient from "./PageClient";

type PageProps = {
  searchParams?: {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    page?: string;
    limit?: string;
  };
};

export default function Page({ searchParams }: PageProps) {
  return <PageClient searchParams={searchParams ?? {}} />;
}
