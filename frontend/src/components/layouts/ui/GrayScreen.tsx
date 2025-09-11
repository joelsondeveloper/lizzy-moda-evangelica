import React from 'react'

type Props = {
    onClick?: () => void
    zIndex?: number
}

const GrayScreen = ({onClick, zIndex}: Props ) => {

  return (
    <div onClick={onClick} className={`absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 z-2`} >     
    </div>
  )
}

export default GrayScreen
