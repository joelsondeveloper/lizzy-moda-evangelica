"use client";

import GeneralButton from "@/components/layouts/ui/GeneralButton";
import DashboardCard from "@/components/admin/DashboardCard";
import Search from "@/components/layouts/ui/Search";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/layouts/ui/ConfirmationModal";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  getProducts,
  ProductFormData,
} from "@/services/product";
import { getCategories, Category } from "@/services/category";
import SideForm from "@/components/layouts/layouts/SideForm";
import Form from "@/components/layouts/layouts/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import HookFormInput from "@/components/layouts/ui/HookFormInput";
import ImageUploadField from "@/components/admin/ImageUploadField";

const productSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do produto deve ter pelo menos 3 caracteres.")
    .max(100, "O nome do produto deve ter no máximo 100 caracteres."),
  description: z
    .string()
    .min(10, "A descrição do produto deve ter pelo menos 10 caracteres.")
    .max(500, "A descrição do produto deve ter no máximo 500 caracteres."),
  price: z
    .number({ invalid_type_error: "O preço do produto deve ser um número." })
    .positive("O preço do produto deve ser maior que zero."),
  size: z.array(z.string()).min(1, "Selecione pelo menos um tamanho."),
  category: z.string().min(1, "Selecione uma categoria."),
  inStock: z.boolean(),
  imageFile: z.instanceof(File).optional().nullable(),
  currentImageUrl: z.string().optional().nullable(),
});

type ProductFormSchema = z.infer<typeof productSchema>;
type ApiError = { response?: { data?: { message?: string } } };

const Page: React.FC = () => {
  const queryClient = useQueryClient();

  const availableSizes = ["P", "M", "G", "GG", "GGG"];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["adminProducts"],
    queryFn: getProducts,
  });

  const { data: categories } = useQuery<Category[], Error>({
    queryKey: ["adminCategories"],
    queryFn: getCategories,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      size: Array.isArray(editingProduct?.size)
        ? editingProduct.size
        : editingProduct?.size
        ? [editingProduct.size]
        : [],
      category: "",
      inStock: true,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        size: editingProduct.size || [],
        category:
          typeof editingProduct.category === "string"
            ? editingProduct.category
            : editingProduct.category._id,
        inStock: editingProduct.inStock,
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        size: [],
        category: "",
        inStock: true,
      });
    }
  }, [editingProduct, reset]);

  const handleError = (error: ApiError, fallback: string) => {
    const message = error.response?.data?.message || fallback;
    toast.error(message);
    if (message.includes("já existe")) {
      setError("name", { type: "manual", message });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Produto excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: ApiError) =>
      handleError(error, "Erro ao excluir produto."),
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setIsEditModalOpen(false);
    },
    onError: (error: ApiError) => handleError(error, "Erro ao criar produto."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setIsEditModalOpen(false);
    },
    onError: (error: ApiError) =>
      handleError(error, "Erro ao atualizar produto."),
  });

  const onSubmit = (data: ProductFormSchema) => {
    const payload: ProductFormData = {
      name: data.name,
      description: data.description,
      price: data.price,
      size: data.size,
      category: data.category,
      inStock: data.inStock,
      imageFile: data.imageFile ?? null, // força File | null
      currentImageUrl: data.currentImageUrl ?? "", // força string | null
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete._id);
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  if (isLoading)
    return <p className="text-center mt-8">Carregando produtos...</p>;
  if (isError)
    return <p className="text-red-500 text-center mt-8">{error?.message}</p>;

  return (
    <>
      <section className="py-8 flex flex-col">
        <header className="flex flex-col items-center gap-4">
          <div className="title flex flex-col justify-center text-center gap-2">
            <h2 className="font-playfair text-3xl font-bold">
              Gerenciar Produtos
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Organize seus produtos
            </p>
          </div>
          <div className="actions flex items-center justify-between gap-4">
            <div className="search-container">
              <Search />
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
            <table className="table-custom w-full text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Tamanho</th>
                  <th>Categoria</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr key={product._id}>
                    <td>#{product._id.substring(0, 8)}</td>
                    <td>{product.name}</td>
                    <td>R$ {product.price.toFixed(2)}</td>
                    <td>{product.size}</td>
                    <td>
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name}
                    </td>
                    <td>{product.inStock ? "Disponível" : "Indisponível"}</td>
                    <td>
                      <button
                        className="mr-2"
                        onClick={() => handleOpenEditModal(product)}
                      >
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteClick(product)}>
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
        title="Excluir Produto"
        message={`Você tem certeza que deseja excluir o produto ${productToDelete?.name}?`}
        onConfirm={handleConfirmDelete}
      />

      <SideForm isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen}>
        <Form
          title={editingProduct ? "Editar Produto" : "Criar Produto"}
          textButton={editingProduct ? "Salvar" : "Criar"}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          isSideBar
        >
          <HookFormInput
            spanText="Nome do produto"
            {...register("name")}
            error={errors.name}
          />
          <HookFormInput
            spanText="Descrição"
            {...register("description")}
            error={errors.description}
          />
          <HookFormInput
            spanText="Preço"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            error={errors.price}
          />
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Tamanhos disponíveis</span>
            <div className="flex gap-4">
              {availableSizes.map((s) => (
                <label key={s} className="flex items-center gap-1 font-semibold">
                  <input
                    className="w-4 aspect-square "
                    type="checkbox"
                    value={s}
                    {...register("size")}
                    defaultChecked={editingProduct?.size?.includes(s) || false}
                  />
                  {s}
                </label>
              ))}
            </div>
            {errors.size && (
              <p className="text-red-500 text-sm">{errors.size.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Categoria</span>
            <select
              {...register("category")}
              className="border rounded-lg p-2"
              defaultValue=""
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("inStock")} />
            <span>Disponível em estoque</span>
          </div>
          <ImageUploadField
            label="Imagem do produto"
            id="imageFile"
            register={register("imageFile")}
            error={errors.imageFile?.message}
            currentImageUrl={editingProduct?.imageUrl || null}
            onImageChange={(file) => {
              if (file) {
                reset({ ...getValues(), imageFile: file });
              }
            }}
            onRemoveCurrentImage={() => {
              reset({ ...getValues(), imageFile: null });
            }}
          />
        </Form>
      </SideForm>
    </>
  );
};

export default Page;
