"use client";

import GeneralButton from "@/components/layouts/ui/GeneralButton";
import DashboardCard from "@/components/admin/DashboardCard";
import Search from "@/components/layouts/ui/Search";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/layouts/ui/ConfirmationModal";
import {
  Category,
  createCategory,
  CreateCategoryData,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/category";
import SideDrawer from "@/components/layouts/layouts/SideDrawer";
import SideForm from "@/components/layouts/layouts/SideForm";
import Form from "@/components/layouts/layouts/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import GroupForm from "@/components/layouts/ui/GroupForm";
import HookFormInput from "@/components/layouts/ui/HookFormInput";
import { useRouter } from "next/navigation";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 3 caracteres.")
    .max(50, "O nome da categoria deve ter no máximo 50 caracteres."),
});

type CategoryFormData = z.infer<typeof categorySchema>;
type ApiError = { response?: { data?: { message?: string } } };

const Page: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const resetForm = (category?: Category | null) => {
    reset({
      name: category?.name ?? "",
    });
  };

  useEffect(() => {
    resetForm(editingCategory);
  }, [editingCategory, reset]);

  const { data, isLoading, isError, error } = useQuery<Category[], Error>({
    queryKey: ["adminCategories"],
    queryFn: getCategories,
  });

  const filteredCategories = data?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleError = (error: ApiError, fallback: string) => {
    const message = error.response?.data?.message || fallback;
    toast.error(message);
    if (message.includes("já existe")) {
      setError("name", { type: "manual", message });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Categoria excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: (error: ApiError) => {
      handleError(error, "Erro ao excluir categoria.");
      console.error("Erro ao excluir categoria:", error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      handleCloseFormModal();
    },
    onError: (error: ApiError) => {
      handleError(error, "Erro ao criar categoria.");
      console.error("Erro ao criar categoria:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoryData }) =>
      updateCategory(id, data),
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({
        queryKey: ["adminCategory", editingCategory?._id],
      });
      handleCloseFormModal();
    },
    onError: (error: ApiError) => {
      handleError(error, "Erro ao atualizar categoria.");
      console.error("Erro ao atualizar categoria:", error);
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    console.log(data);
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
    resetForm();
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete._id);
    }
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  if (isLoading) {
    return (
      <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-center mt-8">
        Carregando categorias...
      </p>
    );
  }

  if (isError) {
    toast.error(error?.message || "Erro ao carregar categorias.");
    return (
      <p className="text-red-500 text-center mt-8">
        Erro ao carregar categorias: {(error as Error).message}
      </p>
    );
  }

  return (
    <>
      <section className="py-8 flex flex-col">
        <header className="flex flex-col items-center gap-4">
          <div className="title flex flex-col justify-center text-center gap-2">
            <h2 className="font-playfair text-3xl font-bold">
              Gerenciar Categorias
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Organize suas categorias de produtos
            </p>
          </div>
          <div className="actions flex items-center justify-between gap-4">
            <div className="search-container">
              <Search value={searchTerm} setValue={setSearchTerm} />
            </div>
            <div className="btn-container">
              <GeneralButton
                color="bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light"
                border=" rounded-xl"
                onClick={handleOpenCreateModal}
              >
                <FaPlus />
                <span className="hidden md:block">Nova Categoria</span>
              </GeneralButton>
            </div>
          </div>
        </header>
        <div className="content mt-8">
          <DashboardCard>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories?.map((category) => (
                  <tr key={category._id}>
                    <td >{category.name}</td>
                    <td>{category.createdAt.substring(0, 10)}</td>
                    <td>
                      <button
                        onClick={() => handleOpenEditModal(category)}
                        className="mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteClick(category)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DashboardCard>
        </div>
      </section>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Categoria"
        message={`Você tem certeza que deseja excluir a categoria ${categoryToDelete?.name}?`}
        onConfirm={() => {
          handleConfirmDelete();
        }}
      />

      <SideForm isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen}>
        <Form
          title={editingCategory ? "Editar Categoria" : "Criar Categoria"}
          textButton={editingCategory ? "Salvar" : "Criar"}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        >
          <HookFormInput
            spanText="Nome da categoria"
            {...register("name")}
            error={errors.name}
          />
        </Form>
      </SideForm>
    </>
  );
};

export default Page;
