"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Form from "@/components/layouts/layouts/Form";
import Register from "@/components/layouts/ui/Register";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import HookFormInput from "@/components/layouts/ui/HookFormInput";

const RegisterSchema = z
  .object({
    name: z.string().min(3, "Nome inválido"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type RegisterFormSchema = z.infer<typeof RegisterSchema>;
type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const Page = () => {
  const {
    register: authRegister,
    isAuthenticated,
    isAdmin,
    isLoading: authLoading,
  } = useAuth();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // useEffect(() => {
  //   if (!authLoading && isAuthenticated) {
  //     if (isAdmin) {
  //       router.push("/admin");
  //     } else {
  //       router.push("/");
  //     }
  //   }
  // }, [isAuthenticated, router, isAdmin, authLoading]);

  const onSubmit = async (data: RegisterFormSchema) => {
    setFormError("root", { message: "" });

    try {
      await authRegister({ name: data.name, email: data.email, password: data.password });
      toast.success("Usuário cadastrado com sucesso! Verifique seu email para ativar sua conta.");
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao cadastrar usuário.";
      setFormError("root", { message: errorMessage });
      toast.error(errorMessage);
      
      if (errorMessage.includes("já cadastrado")) {
        setFormError("email", { type: "manual", message: errorMessage });
      }
      
      console.error("Erro ao cadastrar usuário:", err);
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
        subtitle="Crie uma conta e comece a comprar!"
        textButton={isSubmitting ? "Cadastrando..." : "Cadastrar"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        otherWay={
          <Register
            text="Já possui uma conta?"
            texLink="Faça login"
            link="/login"
          />
        }
      >
        <div className="inputs w-full flex flex-col gap-4">
          <HookFormInput spanText="Nome" error={errors.name} {...register("name")} placeholder="Seu nome" autoComplete="name" type="text" />
          <HookFormInput spanText="Email" error={errors.email} {...register("email")} placeholder="seu@email.com" autoComplete="email" type="email" />
          <HookFormInput spanText="Senha" error={errors.password} {...register("password")} placeholder="Minimo 6 caracteres" autoComplete="new-password" type="password" />
          <HookFormInput spanText="Confirmar senha" error={errors.confirmPassword} {...register("confirmPassword")} placeholder="Confirmar senha" autoComplete="new-password" type="password" />
        </div>
      </Form>
    </section>
  );
};

export default Page;
