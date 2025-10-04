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
import Image from "next/image";
import { ALL_SIZES } from "@/services/product";

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
    .number()
    .refine((val) => !isNaN(val), {
      message: "O preço do produto deve ser um número.",
    })
    .positive("O preço do produto deve ser maior que zero."),
  size: z.array(z.string()).min(1, "Selecione pelo menos um tamanho."),
  category: z.string().min(1, "Selecione uma categoria."),
  inStock: z.boolean(),
  imageFiles: z
    .array(z.instanceof(File))
    .max(5, "No máximo 5 imagens.")
    .optional()
    .nullable(),
  currentImageUrls: z.array(z.string()).optional().nullable(),
});

type ProductFormSchema = z.infer<typeof productSchema>;
type ApiError = { response?: { data?: { message?: string } } };

const Page: React.FC = () => {
  const queryClient = useQueryClient();

  const availableSizes = [...ALL_SIZES];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProducts = products?.products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category?.name.toLowerCase().includes(term) ||
      product.size.some((size: string) => size.toLowerCase().includes(term))
    );
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
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
      imageFiles: null,
      currentImageUrls: null,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      console.log("Page.tsx: editingProduct completo:", editingProduct);
      console.log(
        "Page.tsx: Valor de editingProduct.imageUrl:",
        editingProduct.imageUrl
      );

      const sizes = editingProduct.size || [];

      reset({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        size: sizes,
        category:
          typeof editingProduct.category === "string"
            ? editingProduct.category
            : editingProduct.category._id,
        inStock: editingProduct.inStock,
        imageFiles: null,
        currentImageUrls: editingProduct.imageUrl,
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
      imageFiles: data.imageFiles || null,
      currentImageUrls: data.currentImageUrls || null,
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
      <section className="py-8 flex flex-col max-w-[100vw]">
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
              <Search value={searchTerm} setValue={setSearchTerm} />
            </div>
            <div className="btn-container">
              <GeneralButton
                color="bg-primary-accent-light dark:bg-primary-accent-dark text-button-text-light dark:text-button-text-dark hover:bg-primary-accent-dark dark:hover:bg-primary-accent-light"
                border=" rounded-xl"
                onClick={handleOpenCreateModal}
              >
                <FaPlus />
                <span className="hidden md:block">Novo Produto</span>
              </GeneralButton>
            </div>
          </div>
        </header>

        <div
          className="content mt-8 max-w-[85%] sm:max-w-[85%] md:max-w-[70%]
 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-blue-500 scrollbar-track-gray-200 mx-auto"
        >
          <DashboardCard>
            <table className="table-custom text-center w-full">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Tamanho</th>
                  <th>Categoria</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product: Product) => (
                  <tr key={product._id}>
                    <td>
                      <Image
                        src={product.imageUrl[0]}
                        width={48}
                        height={48}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-2xl border-2 border-primary-accent-light dark:border-primary-accent-dark cursor-pointer"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>R$ {product.price.toFixed(2)}</td>
                    <td>
                      {Array.isArray(product.size)
                        ? product.size.join(", ")
                        : product.size}
                    </td>
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
          <div className="flex flex-col gap-2 w-[60%] mx-auto">
            <span className="font-semibold">Tamanhos disponíveis</span>
            <div className="flex gap-4 flex-wrap">
              {availableSizes.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-1 font-semibold"
                >
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
            name="imageFiles"
            rhfRegister={register("imageFiles")}
            error={errors.imageFiles?.message}
            setValue={setValue} // 🔑 obrigatórios
            getValues={getValues} // 🔑 obrigatórios
          />
        </Form>
      </SideForm>
    </>
  );
};

export default Page;
