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

  const {login, isAuthenticated, isAdmin, isLoading: authLoading} = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou senha incorretos.');
      console.error("Erro no login:", err);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, router, isAdmin, authLoading]); 

  return (
    <section className="flex items-center justify-center">
      <Form
        title="Login"
        subtitle="Faça Entre em sua conta para continuar suas compras"
        textButton="Entrar"
      >
        <div className="inputs flex flex-col gap-6 w-full">
          <GroupForm
            spanText="Email"
            value=""
            type="email"
            setValue={() => {}}
          />
          <GroupForm
            spanText="Senha"
            value=""
            type="password"
            setValue={() => {}}
          />
        </div>
      </Form>
    </section>
  );
};

export default page;
