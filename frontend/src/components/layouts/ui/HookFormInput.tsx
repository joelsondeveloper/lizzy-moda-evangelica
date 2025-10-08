import React from "react";
import { FieldError } from "react-hook-form";

type HookFormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  spanText: string;
  error?: FieldError | string | undefined; // pra exibir mensagens do RHF
};

const HookFormInput = ({ spanText, error, ...props }: HookFormInputProps) => {
  return (
    <label className="flex flex-col gap-2 items-start flex-1">
      <span className="font-semibold">{spanText}</span>
      <input
        className={`w-full rounded-lg border p-2 sm:p-3 bg-card-background-light dark:bg-card-background-dark border-primary-accent-light dark:border-primary-accent-dark focus:outline-none focus:ring-2 focus:ring-primary-accent-light dark:focus:ring-primary-accent-dark transition-colors duration-200 ${error ? "border-red-500 focus:ring-red-500" : ""}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs sm:text-sm">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}
    </label>
  );
};

export default HookFormInput;
