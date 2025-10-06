import VerifyForm from "./VerifyForm";

export default function Page({ searchParams }: { searchParams: { email?: string } }) {
  return <VerifyForm initialEmail={searchParams.email ?? ""} />;
}
