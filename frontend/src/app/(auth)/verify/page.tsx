import VerifyForm from "./VerifyForm";

type SearchParams = {
  email?: string;
};

interface PageProps {
  searchParams?: Promise<SearchParams>;
}

export default async function Page({
  searchParams,
}: PageProps) {

  const params = searchParams ? await searchParams : {};
  
  const email = params?.email ?? "";

  return <VerifyForm initialEmail={email} />;
}
