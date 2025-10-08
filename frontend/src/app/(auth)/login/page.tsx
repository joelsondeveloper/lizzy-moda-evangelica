"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { isAxiosError } from "@/utils/typeguards";
import { BackendErrorResponse } from '@/types/api';

import Form from "@/components/layouts/layouts/Form";
// import GroupForm from "@/components/layouts/ui/GroupForm";
import Register from "@/components/layouts/ui/Register";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import HookFormInput from "@/components/layouts/ui/HookFormInput";
import { FcGoogle } from "react-icons/fc";

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha inválida"),
});

type LoginFormSchema = z.infer<typeof LoginSchema>;

const Page = () => {

  const { login, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
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

  const onSubmit = async (data: LoginFormSchema) => {
    setFormError("root", { message: "" });
    try {
      await login({ email: data.email, password: data.password });
      toast.success("Login realizado com sucesso!, seja bem vindo!");
      router.push("/");
    } catch (err: unknown) {
      let errorMessage =
        "Email ou senha incorretos.";

      if (isAxiosError(err)) {
        const errorData = err.response?.data as BackendErrorResponse;
        errorMessage = errorData.message || errorMessage;
      }
      setFormError("root", { message: errorMessage });
      toast.error(errorMessage);

      if (errorMessage.includes("nao verificado")) {
        router.push(`/verify?email=${encodeURIComponent(data.email)}`);
      }

      console.error("Erro ao fazer login:", err);
    }
  };

  const formLoading = isSubmitting;

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
    <section className="min-h-screen flex items-center justify-center p-4">
      <Form
        title="Login"
        subtitle="Entre em sua conta para continuar suas compras"
        textButton={formLoading ? "Entrando..." : "Entrar"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={formLoading}
        otherWay={
          <>
            <div className=" w-full text-center text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                className="w-full py-4 px-4 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-md flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)] transition-colors"
              >
                <FcGoogle size={24} />
                <span>Continuar com o Google</span>
              </Link>
            </div>
            <Register
              text="Não possui uma conta?"
              texLink="Cadastre-se"
              link="/register"
            />
          </>
        }
      >
        {errors.root?.message && (
          <div className="bg-[var(--color-error-light)] dark:bg-[var(--color-error-dark)] bg-opacity-10 dark:bg-opacity-20 border border-[var(--color-error-light)] dark:border-[var(--color-error-dark)] text-button-text-light dark:text-button-text-dark px-4 py-3 rounded relative mb-4 text-sm">
            {errors.root.message}
          </div>
        )}
        <div className="inputs flex flex-col gap-6 w-full">
          <HookFormInput
            spanText="Email"
            error={errors.email}
            {...register("email")}
            id="email"
            placeholder="seu@email.com"
            autoComplete="email"
          />
          <HookFormInput
            spanText="Senha"
            error={errors.password}
            type="password"
            {...register("password")}
            id="password"
            placeholder="**********"
            autoComplete="current-password"
          />
        </div>
      </Form>
    </section>
  );
};

export default Page;
