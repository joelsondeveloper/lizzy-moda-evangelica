"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOrderById, Order } from "@/services/order";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import GeneralButton from "@/components/layouts/ui/GeneralButton";
import { HiArrowLeft } from "react-icons/hi";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceTemplate from "@/components/order/InvoiceTemplate";

const Page: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const {
    user: currentUser,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  const invoiceTemplateRef = useRef<HTMLDivElement>(null);

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery<Order, Error>({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId && isAuthenticated && !authLoading,
  });

  const handleGeneratePdf = async () => {
    if (!order) {
      toast.error("O pedido não foi encontrado.");
      return;
    }

    if (!invoiceTemplateRef.current) {
      toast.error("O template da fatura não foi encontrado.");
      return;
    }

    toast.info("Gerando fatura...");

    try {
      const canvas = await html2canvas(invoiceTemplateRef.current, {
        scale: 2,
        useCORS: true,
      });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`fatura-${order._id}.pdf`);

      toast.success("Fatura gerada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar fatura:", error);
      toast.error("Erro ao gerar fatura.");
    }
  };

  const infoArr = [
    { label: "Cliente", value: `${order?.user.name} (${order?.user.email})` },
    { label: "Total", value: `R$ ${order?.totalPrice.toFixed(2)}` },
    { label: "Status", value: order?.status },
    {
      label: "Data do pedido",
      value: order?.createdAt
    ? new Date(order.createdAt).toLocaleString().split(",")[0]
    : "Data não disponível",
    },
  ];

  useEffect(() => {
    if (!authLoading && !isLoading && !isError) {
      if (!isAuthenticated) {
        toast.error("Por favor, faça login novamente.");
        router.push("/login");
      } else if (
        order &&
        !currentUser?.isAdmin &&
        order.user._id.toString() !== currentUser?._id?.toString()
      ) {
        toast.error("Acesso não autorizado.");
        router.push("/");
      }
    }
  }, [
    authLoading,
    isLoading,
    isError,
    isAuthenticated,
    currentUser,
    order,
    router,
  ]);

  if (isLoading || authLoading) {
    return (
      <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-center mt-8">
        Carregando detalhes do pedido...
      </p>
    );
  }

  if (isError) {
    toast.error(error?.message || "Erro ao carregar detalhes do pedido.");
    return (
      <p className="text-red-500 text-center mt-8">
        Erro ao carregar pedido: {(error as Error).message}
      </p>
    );
  }
  if (!order) {
    return (
      <p className="text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] text-center mt-8">
        Pedido não encontrado.
      </p>
    );
  }

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
            Detalhes do pedido {order._id.slice(0, 8)}
          </h2>
        </header>
        <div className="profile-section flex flex-col gap-6">
          <h3 className="font-playfair text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Informações do pedido
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
                    info.value === "entregue" &&
                    "text-success-light dark:text-success-dark font-medium text-sm "
                  } ${
                    info.value === "cancelado" &&
                    "text-error-light dark:text-error-dark font-medium text-sm "
                  } ${
                    info.value === "pendente" &&
                    "text-warning-light dark:text-warning-dark font-medium text-sm "
                  }`}
                >
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="separator w-full h-[1px] bg-text-muted-light dark:bg-text-muted-dark"></div>
        <div className="orders-section flex flex-col gap-6">
          <h3 className="font-playfair text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Itens do pedido ({order.items.length})
          </h3>
          <div className="orders flex flex-col gap-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-5 bg-card-background-light dark:bg-card-background-dark rounded-xl gap-4"
              >
                <Image
                  src={item.product.imageUrl[0]}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className=" aspect-square object-cover rounded-xl"
                />
                <div className="details flex flex-col gap-2">
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {item.product.name}
                  </h4>
                  <p className="font-medium text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {item.quantity} x R$ {item.price.toFixed(2)} = R${" "}
                    {(item.quantity * item.price).toFixed(2)}
                  </p>
                  <Link
                    href={`/products/${item.product._id}`}
                    className="font-medium text-sm"
                  >
                    Ver produto
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="separator w-full h-[1px] bg-text-muted-light dark:bg-text-muted-dark"></div>
          <div className="preview flex justify-center">
            <div className="preview-pdf w-min" ref={invoiceTemplateRef}>
              {order && <InvoiceTemplate order={order} />}
            </div>
        </div>

        <div className="actions">
          <GeneralButton
            onClick={handleGeneratePdf}
            color="bg-error-light dark:bg-error-dark text-button-text-light dark:text-button-text-dark hover:bg-error-dark dark:hover:bg-error-light"
            border=" rounded-xl"
          >
            Gerar PDF
          </GeneralButton>
        </div>
      </div>
    </section>
  );
};

export default Page;
