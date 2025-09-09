import React from 'react'


interface NavButtonProps {
  children: React.ReactNode,
  size?: string,
  handleClick?: () => void
}

const NavButton = ({children, size, handleClick}: NavButtonProps) => {
  return (
    <button className={`aspect-square cursor-pointer relative flex items-center justify-center rounded-full hover:scale-105 bg-page-background-light dark:bg-page-background-dark hover:bg-secondary-accent-light dark:hover:bg-secondary-accent-dark
    hover:text-white border transition duration-300 ${size}`} onClick={handleClick}>
      {children}
    </button>
  )
}

export default NavButton
