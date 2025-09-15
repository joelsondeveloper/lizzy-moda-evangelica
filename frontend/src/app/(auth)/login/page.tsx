"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

import Form from "@/components/layouts/layouts/Form";
import GroupForm from "@/components/layouts/ui/GroupForm";
import Register from "@/components/layouts/ui/register";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);


  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    setError(null);
    setFormLoading(true);

    if (!email || !password) {
      setError("Preencha todos os campos.");
      toast.error("Preencha todos os campos.");
      setFormLoading(false);
      return;
    }

    try {
      await login({ email, password });
      toast.success("Login realizado com sucesso!, seja bem vindo!");
      router.push("/");
    } catch (err: string | any) {
      setError(err.response?.data?.message || "Email ou senha incorretos.");
      toast.error(error);
      console.error("Erro no login:", err);
    } finally {
      setFormLoading(false);
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
        textButton="Entrar"
        onSubmit={handleSubmit}
        isLoading={formLoading}
        otherWay={
          <Register
            text="Não possui uma conta?"
            texLink="Cadastre-se"
            link="/register"
          />
        }
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

export default Page;
