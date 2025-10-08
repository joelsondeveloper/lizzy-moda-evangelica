import PageClient from "./PageClient";

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const normalized = {
    search: searchParams?.search as string | undefined,
    category: searchParams?.category as string | undefined,
    minPrice: searchParams?.minPrice as string | undefined,
    maxPrice: searchParams?.maxPrice as string | undefined,
    size: searchParams?.size as string | undefined,
    page: searchParams?.page as string | undefined,
    limit: searchParams?.limit as string | undefined,
  };

  return <PageClient searchParams={normalized} />;
}
