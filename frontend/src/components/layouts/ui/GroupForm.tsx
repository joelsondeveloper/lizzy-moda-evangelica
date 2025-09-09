import React from 'react'

const GroupForm = ({spanText, type = "text", value, setValue}: {spanText: string, type: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>>}) => {
  return (
    <label className='flex flex-col gap-2 items-start flex-1'>
      <span className='font-semibold'>{spanText}</span>
      <input type={type} value={value} className='p-2 rounded-lg border w-full bg-card-background-light dark:bg-card-background-dark border-primary-accent-light dark:border-primary-accent-dark' onChange={(e) => setValue(e.target.value)} />
    </label>
  )
}

export default GroupForm
