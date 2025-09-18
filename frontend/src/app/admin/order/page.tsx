"use client";

import DashboardCard from "@/components/admin/DashboardCard";
import Search from "@/components/layouts/ui/Search";
import { FaTrash } from "react-icons/fa";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/layouts/ui/ConfirmationModal";
import {
  Order,
  getOrdersForAdmin,
  deleteOrder,
  updateOrderStatus,
  updateOrderStatusData,
} from "@/services/order";

type ApiError = { response?: { data?: { message?: string } } };

const Page: React.FC = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery<Order[], Error>({
    queryKey: ["adminOrders"],
    queryFn: getOrdersForAdmin,
  });

  const filteredProducts = orders?.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(term) ||
      order.user?.name.toLowerCase().includes(term) ||
      order.user?.email.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term)
    );
  });

  const handleError = (error: ApiError, fallback: string) => {
    const message = error.response?.data?.message || fallback;
    toast.error(message);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      toast.success("pedido excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: ApiError) =>
      handleError(error, "Erro ao excluir pedido."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: updateOrderStatusData }) =>
      updateOrderStatus(id, data),
    onSuccess: (updateOrder) => {
      toast.success(`Status do pedido #${updateOrder._id.substring(0, 8)} atualizado para ${updateOrder.status}`);
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
    onError: (error: ApiError) =>
      handleError(error, "Erro ao atualizar pedido."),
  });

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete._id);
    }
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateMutation.mutate({ id: orderId, data: { status: newStatus as updateOrderStatusData["status"] } });
  };

  if (isLoading) {
    return <p className="text-center mt-8">Carregando produtos...</p>;
  }

  return (
      <>
        <section className="py-8 flex flex-col">
        <header className="flex flex-col items-center gap-4">
          <div className="title flex flex-col justify-center text-center gap-2">
            <h2 className="font-playfair text-3xl font-bold">
              Gerenciar Pedidos
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Visualize e gerencie todos os pedidos da loja
            </p>
          </div>
          <div className="actions flex items-center justify-between gap-4">
            <div className="search-container">
              <Search value={searchTerm} setValue={setSearchTerm} />
            </div>
          </div>
        </header>

        <div className="content mt-8">
          {isError && <p>{(error as Error).message}</p>}
          <DashboardCard>
            {filteredProducts?.length === 0 ? (
              <p className="text-center">Nenhum pedido encontrado.</p>
            ) : (
              <table className="table-custom w-full text-center">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((order) => (
                  <tr key={order._id}>
                    <td onClick={() => {
                      router.push(`/orders/${order._id}`);
                    }} className="cursor-pointer">{order.user?.name || "Desconhecido"}</td>
                    <td>R$ {order.totalPrice.toFixed(2)}</td>
                    <td>
                      <select name="status" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                        <option value="pendente">Pendente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <button onClick={() => handleDeleteClick(order)}>
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
        title="Excluir Pedido"
        message="Tem certeza de que deseja excluir este pedido?"
      />
      </>
  );
};

export default Page;
