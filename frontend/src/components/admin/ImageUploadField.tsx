"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { UseFormRegisterReturn, UseFormSetValue, UseFormGetValues, FieldError } from "react-hook-form";
import Image from "next/image";
import { HiOutlineUpload, HiOutlineTrash, HiOutlinePhotograph } from "react-icons/hi";
import { toast } from "react-toastify";

interface ProductFormImagesData {
  imageFiles?: File[] | null;
  currentImageUrls?: string[] | null;
}

interface ImageUploadFieldProps {
  label: string;
  id: string;
  register: UseFormRegisterReturn;
  error?: string | FieldError;
  setValue: UseFormSetValue<ProductFormImagesData>;
  getValues: UseFormGetValues<ProductFormImagesData>;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  id,
  register,
  error,
  setValue,
  getValues,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]); 

  const [isDragging, setIsDragging] = useState(false);

  const errorMessage = typeof error === "string" ? error : error?.message;

  const currentImageUrls = getValues("currentImageUrls") || [];
  const selectedFiles = getValues("imageFiles") || [];

  useEffect(() => {
    const urls = selectedFiles.map((file) => ({ url: URL.createObjectURL(file), file }));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url.url));
    };
  }, [selectedFiles]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const existingImagesCount = currentImageUrls.length;
      const availableSlots = 5 - existingImagesCount;
      if (filesArray.length > availableSlots) {
        toast.error("Maximo de 5 imagens permitidas.");
        e.target.value = "";
        return;
      }

      setValue("imageFiles", filesArray, { shouldValidate: true });
    } else {
      setValue("imageFiles", null, { shouldValidate: true });
    }
  }, [setValue, getValues]);

  const handleRemoveImage = useCallback((indexToRemove: number, isNewFile: boolean) => {
    
    if (isNewFile) {
      const updatedFiles = (getValues("imageFiles") || []).filter((_, index) => index !== indexToRemove);
      setValue("imageFiles", updatedFiles, { shouldValidate: true });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      const updatedUrls = (getValues("currentImageUrls") || []).filter((_, index) => index !== indexToRemove);
      setValue("currentImageUrls", updatedUrls, { shouldValidate: true });
    }
    toast.info("Imagem excluida com sucesso!");

  }, [setValue, getValues]);


  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const syntheticEvent = {
        target: { files: e.dataTransfer.files }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const allImagesToDisplay = [
    ...currentImageUrls.map((url) => ({ url, isNewFile: false })),
    ...previews.map((preview) => ({ url: preview.url, isNewFile: true }))
  ];

  return (
    <div className="flex flex-col gap-2 items-center" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <label htmlFor={id}>{label}</label>
      <div className="relative w-24 aspect-square">
            <label className={`flex flex-col items-center justify-center w-full h-full rounded-2xl ${isDragging ? " outline-4 outline-dashed" : "border-2"} border-primary-accent-light dark:border-primary-accent-dark cursor-pointer`}>
              <HiOutlineUpload className="h-4 w-4 text-text-secondary-light dark:text-text-secondary-dark mb-2" />
              <span className="text-xs text-center text-text-secondary-light dark:text-text-secondary-dark">
                Arraste e solte ou <br />
                clique para enviar
              </span>
                <input
                  type="file"
                  id={id}
                  multiple
                  accept="image/*"
                  {...register}
                  className="hidden"
                  onChange={handleFileChange}
                  ref={(e) => {
                    register.ref(e);
                    fileInputRef.current = e;
                  }}
                />
            </label>
        </div>
        {error && (
          <p className="text-danger-light dark:text-danger-dark">{errorMessage}</p>
        )}
        {allImagesToDisplay.length > 0 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="flex flex-wrap gap-2">
              {allImagesToDisplay.map(({ url, isNewFile }, index) => (
                <div
                  key={url}
                  className="relative w-24 aspect-square"
                >
                  <Image
                    src={url}
                    alt={`Imagem ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="w-full h-full object-cover rounded-2xl"
                  />
            <button
              className="absolute top-0 right-0 p-1 rounded-full hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)]"
              type="button"
              onClick={() => handleRemoveImage(index, isNewFile)}
              aria-label="Remover imagem"
            >
              <HiOutlineTrash size="1.5rem" />
            </button>
                </div>
              ))}
            </div>
          </div>): null
        }
      </div>
  );
};

export default ImageUploadField;
