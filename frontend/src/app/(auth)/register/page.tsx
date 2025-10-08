"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Form from "@/components/layouts/layouts/Form";
import Register from "@/components/layouts/ui/Register";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import HookFormInput from "@/components/layouts/ui/HookFormInput";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

import { isAxiosError } from "@/utils/typeguards";
import { BackendErrorResponse } from "@/types/api";

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

const Page = () => {
  const {
    register: authRegister,
    isLoading: authLoading,
    isAuthenticated,
    isAdmin,
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

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const onSubmit = async (data: RegisterFormSchema) => {
    setFormError("root", { message: "" });

    try {
      console.log("tentando cadastrar");
      const response = await authRegister({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      console.log("cadastrado com sucesso", response);
      toast.success(
        "Usuário cadastrado com sucesso! Verifique seu email para ativar sua conta."
      );
      console.log("redirecionando para /verify");
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      let errorMessage =
        "Erro ao cadastrar usuário.";

      if (isAxiosError(err)) {
        const errorData = err.response?.data as BackendErrorResponse;
        errorMessage = errorData.message || errorMessage;
      }
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
          <>
            <div className=" text-center text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                className="w-full py-4 px-4 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-md flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)] transition-colors"
              >
                <FcGoogle size={24} />
                <span>Continuar com o Google</span>
              </Link>
            </div>
            <Register
              text="Já possui uma conta?"
              texLink="Faça login"
              link="/login"
            />
          </>
        }
      >
        <div className="inputs w-full flex flex-col gap-4">
          <HookFormInput
            spanText="Nome"
            error={errors.name}
            {...register("name")}
            placeholder="Seu nome"
            autoComplete="name"
            type="text"
          />
          <HookFormInput
            spanText="Email"
            error={errors.email}
            {...register("email")}
            placeholder="seu@email.com"
            autoComplete="email"
            type="email"
          />
          <HookFormInput
            spanText="Senha"
            error={errors.password}
            {...register("password")}
            placeholder="Minimo 6 caracteres"
            autoComplete="new-password"
            type="password"
          />
          <HookFormInput
            spanText="Confirmar senha"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
            placeholder="Confirmar senha"
            autoComplete="new-password"
            type="password"
          />
        </div>
      </Form>
    </section>
  );
};

export default Page;
