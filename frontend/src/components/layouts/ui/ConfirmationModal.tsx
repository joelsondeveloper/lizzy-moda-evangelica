import { HiX } from "react-icons/hi"

interface Props {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
}

const ConfirmationModal: React.FC<Props> = ({isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar"}) => {

    if (!isOpen) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center p-4 rounded-2xl bg-page-background-light dark:bg-page-background-dark bg-opacity-50">
{/* Cabeçalho do Modal */}
    <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] mb-4">
      <h3 className="font-playfair text-xl font-bold text-[var(--color-primary-accent-light)] dark:text-[var(--color-primary-accent-dark)]">
        {title}
      </h3>
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-2 right-2  p-1 rounded-full hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)]"
      >
        <HiX className="h-5 w-5" />
      </button>
    </div>

    {/* Corpo da Mensagem */}
    <p className="mb-6 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
      {message}
    </p>

    {/* Botões de Ação */}
    <div className="flex justify-end space-x-3">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-md border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]
                   text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]
                   hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)] transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 rounded-md font-semibold bg-error-light dark:bg-error-dark
        hover:opacity-90 transition-opacity"
      >
        {confirmText}
      </button>
    </div>
  </div>
  )
}

export default ConfirmationModal
