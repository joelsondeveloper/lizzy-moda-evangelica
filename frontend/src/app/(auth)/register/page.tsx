"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Form from "@/components/layouts/layouts/Form";
import GroupForm from "@/components/layouts/ui/GroupForm";
import Register from "@/components/layouts/ui/register";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const {
    register,
    isAuthenticated,
    isAdmin,
    isLoading: authLoading,
  } = useAuth();

  const router = useRouter();

  // useEffect(() => {
  //   if (!authLoading && isAuthenticated) {
  //     if (isAdmin) {
  //       router.push("/admin");
  //     } else {
  //       router.push("/");
  //     }
  //   }
  // }, [isAuthenticated, router, isAdmin, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      toast.error("As senhas não coincidem.");
      setFormLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      setFormLoading(false);
      return;
    }

    try {
      await register({ name, email, password });
      toast.success("Usuário cadastrado com sucesso!");
      router.push("/");
    } catch (err: string | any) {
      setError(err.response?.data?.message || "Erro ao cadastrar usuário.");
      toast.error(error);
      console.error("Erro ao cadastrar usuário:", err);
    } finally {
      setFormLoading(false);
    }
  };

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
        title="Cadastre-se"
        subtitle="Crie uma conta"
        textButton="Cadastrar"
        onSubmit={handleSubmit}
        isLoading={formLoading}
        otherWay={
          <Register
            text="Já possui uma conta?"
            texLink="Faça login"
            link="/login"
          />
        }
      >
        <div className="inputs w-full flex flex-col gap-4">
          <GroupForm spanText="Nome" type="text" value={name} setValue={setName} />
          <GroupForm
            spanText="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          <GroupForm
            spanText="Senha"
            type="password"
            value={password}
            setValue={setPassword}
          />
          <GroupForm
            spanText="Confirmar Senha"
            type="password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
        </div>
      </Form>
    </section>
  );
};

export default Page;
