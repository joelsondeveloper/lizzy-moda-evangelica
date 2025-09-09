
"use client"
import { ReactNode } from "react"
import { ToastContainer } from "react-toastify"

interface ToastProviderProps {
    children: ReactNode
}

const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
  return (
    <>
      {children}
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" />
    </>
  )
}

export default ToastProvider
