"use client";

import DashboardCard from "@/components/admin/DashboardCard";
import Search from "@/components/layouts/ui/Search";
import { FaTrash } from "react-icons/fa";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/layouts/ui/ConfirmationModal";
import { User, getUsers, deleteUser } from "@/services/user";

type ApiError = { response?: { data?: { message?: string } } };

const Page: React.FC = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["adminUsers"],
    queryFn: getUsers,
  });

  const filteredUsers = users?.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user._id?.toLowerCase().includes(term) ||
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  });

  const handleError = (error: ApiError, fallback: string) => {
    const message = error.response?.data?.message || fallback;
    toast.error(message);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("usuario excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: ApiError) => handleError(error, "Erro ao excluir usuario."),
  });

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete._id);
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  if (isLoading) {
    return <p className="text-center mt-8">Carregando usuarios...</p>;
  }

  if (isError) {
    toast.error(error?.message || "Erro ao carregar usuários.");
    return (
      <p className="text-[var(--color-error-light)] dark:text-[var(--color-error-dark)] text-center mt-8">
        Erro ao carregar usuários: {(error as Error).message}
      </p>
    );
  }

  return (
    <>
      <section className="py-8 flex flex-col">
        <header className="flex flex-col items-center gap-4">
          <div className="title flex flex-col justify-center text-center gap-2">
            <h2 className="font-playfair text-3xl font-bold">
              Gerenciar Usuários
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Visualize e gerencie todos os usuários da loja
            </p>
          </div>
          <div className="actions flex items-center justify-between gap-4">
            <div className="search-container">
              <Search value={searchTerm} setValue={setSearchTerm} />
            </div>
          </div>
        </header>

        <div className="content mt-8">
          <DashboardCard>
            {filteredUsers?.length === 0 ? (
              <p className="text-center">Nenhum usuário encontrado.</p>
            ) : (
              <table className="table-custom w-full text-center">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Verificado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map((user) => (
                    <tr key={user._id}>
                      <td
                        onClick={() => {
                          router.push(`/users/${user._id}`);
                        }}
                        className="cursor-pointer"
                      >
                        {user?.name || "Desconhecido"}
                      </td>
                      <td>{user?.email || "Desconhecido"}</td>
                      <td>
                        {user.isAdmin ? (
                          <span className="text-[var(--color-success-light)] dark:text-[var(--color-success-dark)]">
                            Sim
                          </span>
                        ) : (
                          <span className="text-[var(--color-error-light)] dark:text-[var(--color-error-dark)]">
                            Nao
                          </span>
                        )}
                      </td>
                      <td>
                        {user.isVerified ? (
                          <span className="text-[var(--color-success-light)] dark:text-[var(--color-success-dark)]">
                            Sim
                          </span>
                        ) : (
                            <span className="text-[var(--color-error-light)] dark:text-[var(--color-error-dark)]">
                                Nao
                            </span>
                        )}
                      </td>
                      <td>
                        <button onClick={() => handleDeleteClick(user)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </DashboardCard>
        </div>
      </section>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Usuário"
        message="Tem certeza de que deseja excluir este usuário?"
      />
    </>
  );
};

export default Page;
