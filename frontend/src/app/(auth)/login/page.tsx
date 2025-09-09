"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Form from "@/components/layouts/layouts/Form";
import GroupForm from "@/components/layouts/ui/GroupForm";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    try {
      console.log(email, password);
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || "Email ou senha incorretos.");
      console.error("Erro no login:", err);
    } finally {
      setFormLoading(false);
      console.log(isAuthenticated);
    }
  };

  // useEffect(() => {
  //   if (!authLoading && isAuthenticated) {
  //     if (isAdmin) {
  //       router.push("/admin");
  //     } else {
  //       router.push("/");
  //     }
  //   }
  // }, [isAuthenticated, router, isAdmin, authLoading]);

  if (authLoading) {
    return (
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-[var(--color-page-background-light)] dark:bg-[var(--color-page-background-dark)]">
        <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-lg">
          Verificando sessão...
        </p>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center">
      <Form
        title="Login"
        subtitle="Faça Entre em sua conta para continuar suas compras"
        textButton="Entrar" onSubmit={handleSubmit} isLoading={formLoading}
      >
        <div className="inputs flex flex-col gap-6 w-full">
          <GroupForm
            spanText="Email"
            value={email}
            type="email"
            setValue={setEmail}
          />
          <GroupForm
            spanText="Senha"
            value={password}
            type="password"
            setValue={setPassword}
          />
        </div>
      </Form>
    </section>
  );
};

export default page;
