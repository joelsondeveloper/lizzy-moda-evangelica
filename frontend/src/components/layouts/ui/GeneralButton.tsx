import { MouseEventHandler } from "react"

interface Props {
    children: React.ReactNode
    color?: string
    border?: string
    onClick?: () => void | MouseEventHandler
    isLoading?: boolean
}

const GeneralButton = ({children, color, border, onClick, isLoading}: Props) => {
  return (
    <button className={`w-full p-3 cursor-pointer ${color} ${border}  hover:scale-105 flex items-center justify-center gap-2 border-primary-accent-light dark:border-primary-accent-dark transition duration-300`} disabled={isLoading} onClick={onClick}>{children}</button>
  )
}

export default GeneralButton
