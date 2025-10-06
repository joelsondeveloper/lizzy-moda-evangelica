"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

import { isAxiosError } from "@/utils/typeguards";
import { BackendErrorResponse } from "@/types/api";

import Form from "@/components/layouts/layouts/Form";
import HookFormInput from "@/components/layouts/ui/HookFormInput";
import Link from "next/link";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { verifyUser } from "@/services/auth";

const verificationSchema = z.object({
  email: z.string().email("Email inválido"),
  code: z
    .string()
    .min(7, "O código deve ter 7 caracteres")
    .max(7, "O código deve ter 7 caracteres"),
});

type VerificationFormSchema = z.infer<typeof verificationSchema>;

type Props = {
    initialEmail: string
};

const Page: React.FC<Props> = ({initialEmail}) => {
  const router = useRouter();
//   const searchParams = useSearchParams();
//   const initialEmail = searchParams.get("email") || "";

  const { isAuthenticated, isAdmin, isLoading: authLoading, refetchUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<VerificationFormSchema>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      email: initialEmail,
      code: "",
    },
  });

  useEffect(() => {
    if (initialEmail) {
      setValue("email", initialEmail);
    }

    // if (!authLoading && isAuthenticated) {
    //   if (isAdmin) {
    //     router.push("/admin");
    //   } else {
    //     router.push("/");
    //   }
    // }
  }, [initialEmail, setValue, router, isAuthenticated, isAdmin, authLoading]);

  const onSubmit = async (data: VerificationFormSchema) => {
    setError("root", { message: "" });
    try {
      const response = await verifyUser(data);
      toast.success(response.message || "Usuário verificado com sucesso!");
      refetchUser();
      router.push("/login");
    } catch (err: unknown) {
      let errorMessage = "Erro ao verificar usuário.";

      if (isAxiosError(err)) {
        const errorData = err.response?.data as BackendErrorResponse;
        errorMessage = errorData.message || errorMessage;
      }
      setError("root", { message: errorMessage });
      toast.error(errorMessage);
      console.error("Erro ao verificar usuário:", err);
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
  <section className="flex items-center justify-center py-12">
    <Form
      title="Verifique seu email"
      subtitle="Um código foi enviado para o seu email."
      textButton={isSubmitting ? "Verificando..." : "Verificar"}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <div className="inputs w-full flex flex-col gap-7">
        <HookFormInput
          spanText="E-mail"
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register("email")}
          error={errors.email?.message}
          autoComplete="email"
          disabled={!!initialEmail}
          className={
            !!initialEmail
              ? "cursor-not-allowed bg-[var(--color-border-light)] dark:bg-[var(--color-border-dark)] opacity-70"
              : ""
          } // Estilo para desabilitado
        />
        <HookFormInput
          spanText="Código"
          id="code"
          type="text"
          placeholder="123456"
          {...register("code")}
          maxLength={7}
          autoComplete="off"
        />
        {errors.root && (
          <p className="text-red-500 text-sm">{errors.root.message}</p>
        )}
      </div>
      <Link
        href="/resend-verification"
        className="text-[var(--color-link-light)] dark:text-[var(--color-link-dark)] hover:underline font-medium"
      >
        Não recebeu o código? Reenviar
      </Link>
    </Form>
  </section>
);
};

export default Page;
