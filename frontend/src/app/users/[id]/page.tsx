"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, deleteUser, User } from "@/services/user";
import { getOrdersByUserId, Order } from "@/services/order";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { HiArrowLeft, HiEye } from "react-icons/hi2";
import GeneralButton from "@/components/layouts/ui/GeneralButton";
import ConfirmationModal from "@/components/layouts/ui/ConfirmationModal";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import SideDrawer from "@/components/layouts/layouts/SideDrawer";
import Link from "next/link";

const orderStatuses = [
  { value: "pendente", label: "Pendente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "cancelado", label: "Cancelado" },
];

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const Page: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    user: currentUser,
    isAuthenticated,
    isAdmin,
    isLoading: authLoading,
    refetchUser,
  } = useAuth();

  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const {
    data: user,
    isLoading: userLoading,
    isError: isUserError,
    error: userError,
  } = useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id && isAuthenticated && !authLoading,
  });

  const {
    data: orders,
    isLoading: orderLoading,
    isError: isOrderError,
    error: orderError,
  } = useQuery<Order[], Error>({
    queryKey: ["orders", id],
    queryFn: () => getOrdersByUserId(id),
    enabled: !!id && isAuthenticated && !authLoading,
  });

  useEffect(() => {
    if (!authLoading && !userLoading && !isUserError) {
      if (!isAuthenticated) {
        toast.error("Usuário não autenticado");
        router.push("/login");
      } else if (
        user &&
        !currentUser?.isAdmin &&
        currentUser?._id !== user._id
      ) {
        toast.error(
          "Acesso negado. Você não tem permissão para ver esse usuário."
        );
        router.push(`/users/${currentUser?._id}`);
      }
    }
  }, [
    isAuthenticated,
    userLoading,
    isUserError,
    user,
    currentUser,
    authLoading,
    router,
  ]);

  const infoArr = [
    {
      label: "Nome",
      value: user?.name,
    },
    {
      label: "Email",
      value: user?.email,
    },
    {
      label: "Admin",
      value: user?.isAdmin ? "Sim" : "Não",
    },
    {
      label: "Verificado",
      value: user?.isVerified ? "Sim" : "Não",
    },
    {
      label: "Registrado em",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
    },
  ];

  const handleError = (error: ApiError, fallback: string) => {
    const message = error.response?.data?.message || fallback;
    toast.error(message);
    console.error("Erro ao buscar usuário:", error);
  };

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("Usuário deletado com sucesso");
      if (currentUser?.isAdmin) {
        router.push("/admin/users");
      } else {
        toast.info("Por favor, faça login novamente.");
        router.push("/login");
      }
    },
    onError: (error: ApiError) => {
      handleError(error, "Erro ao deletar usuário");
    },
  });

  const handleDeleteUserClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (user) {
      deleteUserMutation.mutate(user._id);
    }
    setIsDeleteModalOpen(false);
  };

  const handleViewOrderClick = (order: Order) => {
    router.push(`/orders/${order._id}`);
  };

  if (userLoading || orderLoading || authLoading) {
    return (
      <section className="p-[clamp(1rem,2vw,2.5rem)]">
      <div className="profile p-[clamp(1rem,2vw,2.5rem)] max-w-200 mx-auto skeleton rounded-xl shadow-2xl flex flex-col gap-4 h-[500px]">
        </div>
        </section>
    );
  }

  if (isUserError || isOrderError) {
    return (
      <p className="text-red-500 text-center mt-8">
        Erro ao carregar dados: {(userError || (orderError as Error))?.message}
      </p>
    );
  }
  if (!user) {
    return (
      <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-center mt-8">
        Perfil de usuário não encontrado.
      </p>
    );
  }

  const isViewingOwnProfile = currentUser?._id === user._id;

  return (
    <section className="p-[clamp(1rem,2vw,2.5rem)]">
      <div className="profile p-[clamp(1rem,2vw,2.5rem)] max-w-200 mx-auto bg-page-background-light dark:bg-page-background-dark rounded-xl shadow-2xl flex flex-col gap-4">
        <header className="flex items-center gap-4">
          <Link
            href="/"
            className="w-10 aspect-square text-text-secondary-light dark:text-text-secondary-dark border-2 border-b-text-muted-light dark:border-b-text-muted-dark rounded-xl flex items-center justify-center hover:bg-primary-accent-light dark:hover:bg-primary-accent-dark hover:text-button-text-light dark:hover:text-button-text-dark transition ease-in-out duration-200"
          >
            <HiArrowLeft size="50%" />
          </Link>
          <h2 className="font-playfair text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {isAdmin && !isViewingOwnProfile
              ? `Usuário: ${user.name}`
              : `Minha Conta`}
          </h2>
        </header>
        <div className="profile-section flex flex-col gap-6">
          <h3 className="font-playfair text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Informações do perfil
          </h3>
          <div className="info flex flex-col gap-4">
            {infoArr.map((info, index) => (
              <div
                key={index}
                className="info-item flex items-center justify-between"
              >
                <span className="label font-medium text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {info.label}:
                </span>
                <span
                  className={`value font-semibold text-sm ${
                    info.value === "Sim" &&
                    "text-success-light dark:text-success-dark font-medium text-sm "
                  } ${
                    info.value === "Não" &&
                    "text-error-light dark:text-error-dark font-medium text-sm "
                  }`}
                >
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="separator w-full h-[1px] bg-text-muted-light dark:bg-text-muted-dark"></div>
        <div className="orders-section">
          <h3 className="font-playfair text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Pedidos
          </h3>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Total</th>
                <th>Status</th>
                <th>Data</th>
                <th>Açoes</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id}>
                  <td>R$ {order.totalPrice.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>{order.createdAt.split("T")[0]}</td>
                  <td>
                    <HiEye
                      className="mx-auto cursor-pointer"
                      onClick={() => handleViewOrderClick(order)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="separator w-full h-[1px] bg-text-muted-light dark:bg-text-muted-dark"></div>
        <div className="actions">
          <GeneralButton
            onClick={() => setIsDeleteModalOpen(true)}
            color="bg-error-light dark:bg-error-dark text-button-text-light dark:text-button-text-dark hover:bg-error-dark dark:hover:bg-error-light"
            border=" rounded-xl"
          >
            Excluir conta
          </GeneralButton>
        </div>
      </div>
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleConfirmDelete()}
          title="Excluir Conta"
          message="Tem certeza de que deseja excluir sua conta?"
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      )}
    </section>
  );
};

export default Page;
