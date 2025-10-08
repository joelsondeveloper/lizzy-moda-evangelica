import { MouseEventHandler } from "react"

interface Props {
    children: React.ReactNode
    color?: string
    border?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
    isLoading?: boolean
}

const GeneralButton = ({children, color, border, onClick, isLoading}: Props) => {
  return (
    <button className={`w-full p-3 cursor-pointer ${color} ${border} disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center justify-center gap-2 border-primary-accent-light dark:border-primary-accent-dark transition duration-200 ease-in-out`} disabled={isLoading} onClick={onClick}>{children}</button>
  )
}

export default GeneralButton
