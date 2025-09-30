"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserById, deleteUser, User } from "@/services/user"
import { getOrdersByUserId, Order } from "@/services/order"
import { toast } from "react-toastify"
import { useAuth } from "@/context/AuthContext"
import { HiArrowLeft } from "react-icons/hi2"
import GeneralButton from "@/components/layouts/ui/GeneralButton"
import ConfirmationModal from "@/components/layouts/ui/ConfirmationModal"
import { FaTrash, FaEdit, FaEye } from "react-icons/fa"
import SideDrawer from "@/components/layouts/layouts/SideDrawer"

const orderStatuses = [
  {value: 'pendente', label: 'Pendente'},
  {value: 'confirmado', label: 'Confirmado'},
  {value: 'cancelado', label: 'Cancelado'},
]

type ApiError = {
  response?: {
    data?: {
      message?: string
    }
  }
}

const Page: React.FC = () => {

  const params = useParams()
  const router = useRouter()
  const id = params.id as string  

  const { user: currentUser, isAuthenticated, isAdmin, isLoading: authLoading, refetchUser } = useAuth()

  const queryClient = useQueryClient()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const { data: user, isLoading: userLoading, isError: isUserError, error: userError } = useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id && isAuthenticated && !authLoading,
  })

  const { data: orders, isLoading: orderLoading, isError: isOrderError, error: orderError } = useQuery<Order[], Error>({
    queryKey: ['orders', id],
    queryFn: () => getOrdersByUserId(id),
    enabled: !!id && isAuthenticated && !authLoading,
  })

  useEffect(() => {
    if (!authLoading && !userLoading && !isUserError) {
      if (!isAuthenticated) {
        toast.error('Usuário não autenticado')
        router.push('/login')
      } else if (user && !currentUser?.isAdmin && currentUser?._id !== user._id) {
        toast.error('Acesso negado. Você não tem permissão para ver esse usuário.')
        router.push(`/users/${currentUser?._id}`)
      }
    }
  }, [isAuthenticated, userLoading, isUserError, user, currentUser, authLoading, router])

  const handleError = (error: ApiError, fallback: string) => {
    const message = error.response?.data?.message || fallback
    toast.error(message)
    console.error('Erro ao buscar usuário:', error)
  }

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
      toast.success('Usuário deletado com sucesso')
      if (currentUser?.isAdmin) {
        router.push('/admin/users')
      } else {
        toast.info("Por favor, faça login novamente.");
        router.push('/login');
      }
    },
    onError: (error: ApiError) => {
      handleError(error, 'Erro ao deletar usuário')
    }
  })

  const handleDeleteUserClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (user) {
      deleteUserMutation.mutate(user._id)
    }
    setIsDeleteModalOpen(false)
  }

  if (userLoading || 
    orderLoading || authLoading) {
    return <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-center mt-8">Carregando perfil e pedidos...</p>;
  }

  if (isUserError || isOrderError) {
    toast.error(userError?.message || orderError?.message || 'Erro ao carregar dados.');
    return <p className="text-red-500 text-center mt-8">Erro ao carregar dados: {(userError || orderError as Error)?.message}</p>;
  }
  if (!user) {
    return <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-center mt-8">Perfil de usuário não encontrado.</p>;
  }

  const isViewingOwnProfile = currentUser?._id === user._id;

  return (
    <div>
      
    </div>
  )
}

export default Page
