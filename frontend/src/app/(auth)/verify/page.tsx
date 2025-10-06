import VerifyForm from "./VerifyForm";

type SearchParams = {
  email?: string;
};

interface PageProps {
  searchParams?: SearchParams | Promise<SearchParams>;
}

export default async function Page({
  searchParams,
}: PageProps) {

  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  
  const email = params?.email ?? "";

  return <VerifyForm initialEmail={email} />;
}
