import React from 'react'

const NavButton = ({children}: {children: React.ReactNode}) => {
  return (
    <button className='w-12 aspect-square cursor-pointer relative flex items-center justify-center rounded-full hover:scale-105 bg-link-light hover:bg-link-dark  dark:bg-link-dark dark:hover:bg-link-light border transition duration-300 '>
      {children}
    </button>
  )
}

export default NavButton
