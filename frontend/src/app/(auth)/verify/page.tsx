import VerifyForm from "./VerifyForm";

interface PageProps {
  searchParams: {
    email: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  return <VerifyForm initialEmail={searchParams.email} />;
}
