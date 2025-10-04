"use client"
import Image from "next/image"
import { Order } from "@/services/order"

interface InvoiceTemplateProps {
    order: Order
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({order}) => {

    // const getStatusLabel = (statusValue: string) => {
    //     return orderStatuses.find((status) => status.value === statusValue)?.label;
    //   };

  return (
    <article className="w-[4.135in] bg-white p-5">
      <header className="pb-4 border-b border-b-text-muted-light">
        <div className="logo flex gap-4 items-center justify-center">
            <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="h-12 w-12 aspect-square rounded-full object-cover"
            />
            <div className="title">
                <h1 className="font-playfair text-lg font-bold">Lizzy Moda Evangélica</h1>
                <p className="uppercase font-bold text-text-primary-light">Comprovante de Pedido</p>
            </div>
        </div>
      </header>
      <div className="customer flex flex-col gap-3 py-4">
        <h2 className="font-semibold text-text-secondary-light">Informações do Cliente:</h2>
        <div className="details font-medium text-sm text-text-muted-light">
            <p>Nome: {order.user.name}</p>
            <p>Email: {order.user.email}</p>

        </div>
      </div>
      <div className="separator w-full h-0.5 bg-text-muted-light"></div>
      <div className="payment flex flex-col gap-3 py-4">
        <h2 className="font-semibold text-text-secondary-light">Informações de Pagamento:</h2>
        <div className="details font-medium text-sm text-text-muted-light">
            <p>Forma de Pagamento: Pagamento via Pix</p>
            <p>status: {order.status}</p>
        </div>
      </div>
      <div className="separator w-full h-0.5 bg-text-muted-light"></div>
      <table className="table-custom">
        <caption className="text-text-secondary-light text-start font-semibold">Itens do Pedido:</caption>
        <thead className="text-text-muted-light">
          <tr>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Preço</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody className="text-text-muted-light">
          {order.items.map((product) => (
            <tr key={product.product._id}>
              <td>{product.product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
              <td>{product.price * product.quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="text-text-muted-light">
          <tr>
            <td colSpan={3} className="font-bold text-sm">Total do pedido:</td>
            <td className="font-bold text-primary-accent-light">{order.totalPrice}</td>
          </tr>
        </tfoot>
      </table>
      <footer className="text-center">
        <p className="text-text-muted-light font-semibold text-sm">Obrigado por escolher a Lizzy Moda Evangélica!</p>
        <p className="font-medium text-xs text-text-muted-light">WhatsApp: (81) 987612791 | Email: vicentejoelson80@gmail.com</p>
      </footer>
    </article>
  )
}

export default InvoiceTemplate
