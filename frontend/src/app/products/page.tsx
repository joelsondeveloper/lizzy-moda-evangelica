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

interface PageProps {
  searchParams?: Promise<SearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};

  const normalized = {
    search: params.search,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    size: params.size,
    page: params.page,
    limit: params.limit,
  };

  return <PageClient searchParams={normalized} />;
}
