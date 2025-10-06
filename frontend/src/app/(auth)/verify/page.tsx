import VerifyForm from "./VerifyForm";

interface PageProps {
  searchParams: {
    email: string;
  };
}

export default function Page({
  searchParams,
}: PageProps) {

  // Pega o email se existir
  const email = searchParams?.email ?? "";

  return <VerifyForm initialEmail={email} />;
}
