import React from 'react'

type GroupFormProps = {
  spanText: string;
  type?: string; // opcional, default será "text"
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

const GroupForm = ({spanText, type = "text", value, setValue}: GroupFormProps) => {
  return (
    <label className='flex flex-col gap-2 items-start flex-1'>
      <span className='font-semibold'>{spanText}</span>
      <input type={type}  className='p-2 rounded-lg border w-full bg-card-background-light dark:bg-card-background-dark border-primary-accent-light dark:border-primary-accent-dark'
      value={value} onChange={(e) => setValue(e.target.value)} />
    </label>
  )
}

export default GroupForm
