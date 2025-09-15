import React from "react";
import { FieldError } from "react-hook-form";

type HookFormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  spanText: string;
  error?: FieldError; // pra exibir mensagens do RHF
};

const HookFormInput = ({ spanText, error, ...props }: HookFormInputProps) => {
  return (
    <label className="flex flex-col gap-2 items-start flex-1">
      <span className="font-semibold">{spanText}</span>
      <input
        className={`p-2 rounded-lg border w-full 
        bg-card-background-light dark:bg-card-background-dark 
        border-primary-accent-light dark:border-primary-accent-dark 
        ${error ? "border-red-500" : ""}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </label>
  );
};

export default HookFormInput;
