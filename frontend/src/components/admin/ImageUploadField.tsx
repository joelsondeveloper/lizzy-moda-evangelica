"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormGetValues,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import Image from "next/image";
import { HiOutlineUpload, HiOutlineTrash } from "react-icons/hi";
import { toast } from "react-toastify";

interface ImagesFields {
  imageFiles?: File[] | null;
  currentImageUrls?: string[] | null;
}

interface ImageUploadFieldProps<TFieldValues extends FieldValues> {
  label: string;
  id: string;
  name: Path<TFieldValues>;
  error?: string | FieldError;
  setValue: UseFormSetValue<TFieldValues>;
  getValues: UseFormGetValues<TFieldValues>;
  rhfRegister: UseFormRegisterReturn;
}

interface ImageFields {
  imageFiles?: File[] | null;
  currentImageUrls?: string[] | null;
}

const ImageUploadField = <TFieldValues extends FieldValues>({
  label,
  id,
  name,
  error,
  setValue,
  getValues,
  rhfRegister,
}: ImageUploadFieldProps<TFieldValues>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  const errorMessage = typeof error === "string" ? error : error?.message;

  const currentImageUrlsFromRHF = useMemo(() => {
    return (getValues("currentImageUrls" as Path<TFieldValues>) as string[] | null) || [];
  }, [getValues]);

  const imageFilesFromRHF = useMemo(() => {
    return (getValues("imageFiles" as Path<TFieldValues>) as File[] | null) || [];
  }, [getValues]);

  // useEffect(() => {
  //   console.log(
  //     "ImageUploadField: currentImageUrlsFromRHF (from RHF state):",
  //     currentImageUrlsFromRHF
  //   );
  //   console.log(
  //     "ImageUploadField: imageFilesFromRHF (newly selected files):",
  //     imageFilesFromRHF
  //   );
  //   console.log("ImageUploadField: previews (from createObjectURL):", previews);
  // }, [currentImageUrlsFromRHF, imageFilesFromRHF, previews]);

  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {

    objectUrlsRef.current.forEach(URL.revokeObjectURL);
    objectUrlsRef.current = []

    if (imageFilesFromRHF && imageFilesFromRHF.length > 0) {
      const urls = imageFilesFromRHF.map((file) => URL.createObjectURL(file));
      objectUrlsRef.current = urls

      setPreviews(urls);
      return () => {
        objectUrlsRef.current.forEach(URL.revokeObjectURL);
      };
    } else {
      if (previews.length > 0) {
        setPreviews([]);
      }
    }
  }, [imageFilesFromRHF]);

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (files) {
        const newFilesArray = Array.from(files);
        const existingFiles = imageFilesFromRHF

        const totalExistingImages =
          currentImageUrlsFromRHF.length + existingFiles.length;
        const availableSlots = 5 - totalExistingImages;

        if (newFilesArray.length > availableSlots) {
          toast.error(
            `Máximo de 5 imagens permitidas. Você pode adicionar no máximo ${availableSlots} imagens.`
          );
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }

        const updatedImageFiles = [...existingFiles, ...newFilesArray];
        setValue(name, updatedImageFiles as TFieldValues[keyof TFieldValues], { shouldValidate: true });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        if ((getValues("imageFiles" as Path<TFieldValues>) || []).length > 0) {
          setValue("imageFiles" as Path<TFieldValues>, [] as TFieldValues[keyof TFieldValues], { shouldValidate: true });
        }
      }
    },
    [
      imageFilesFromRHF,
      currentImageUrlsFromRHF,
      setValue,
      getValues,
      fileInputRef,
      name
    ]
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number, isNewFile: boolean) => {
      if (isNewFile) {
        const updatedFiles = (getValues("imageFiles" as Path<TFieldValues>) || []).filter(
          (_, index) => index !== indexToRemove
        );
        setValue("imageFiles" as Path<TFieldValues>, updatedFiles as TFieldValues[keyof TFieldValues], { shouldValidate: true });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const updatedUrls = (getValues("currentImageUrls" as Path<TFieldValues>) || []).filter(
          (_, index) => index !== indexToRemove
        );
        setValue("currentImageUrls" as Path<TFieldValues>, updatedUrls as TFieldValues[keyof TFieldValues], { shouldValidate: true });
      }
      toast.info("Imagem excluida com sucesso!");
    },
    [setValue, getValues]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFileChange(e.dataTransfer.files);
      }
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const allImagesToDisplay = useMemo(() => {
    return [...(currentImageUrlsFromRHF || []), ...previews];
  }, [currentImageUrlsFromRHF, previews]);

  console.log(currentImageUrlsFromRHF, previews);

  return (
    <div
      className="flex flex-col gap-2 items-center"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label htmlFor={id}>{label}</label>
      <div className="relative w-24 aspect-square">
        <label
          className={`flex flex-col items-center justify-center w-full h-full rounded-2xl ${
            isDragging ? " outline-4 outline-dashed" : "border-2"
          } border-primary-accent-light dark:border-primary-accent-dark cursor-pointer`}
        >
          <HiOutlineUpload className="h-4 w-4 text-text-secondary-light dark:text-text-secondary-dark mb-2" />
          <span className="text-xs text-center text-text-secondary-light dark:text-text-secondary-dark">
            Arraste e solte ou <br />
            clique para enviar
          </span>
          <input
            id={id}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            name={rhfRegister.name}
            onBlur={rhfRegister.onBlur}
            onChange={(e) => {
              rhfRegister.onChange(e);
              handleFileChange(e.target.files);
            }}
            ref={(e) => {
              fileInputRef.current = e;
              if (rhfRegister.ref) {
                if (typeof rhfRegister.ref === "function") {
                  rhfRegister.ref(e);
                } else if (
                  typeof rhfRegister.ref === "object" &&
                  rhfRegister.ref !== null
                ) {
                  (
                    rhfRegister.ref as React.MutableRefObject<HTMLInputElement | null>
                  ).current = e;
                }
              }
            }}
          />
        </label>
      </div>
      {error && (
        <p className="text-danger-light dark:text-danger-dark">
          {errorMessage}
        </p>
      )}
      {allImagesToDisplay.length > 0 ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="flex flex-wrap gap-2">
            {allImagesToDisplay.map((url, index) => (
              <div key={url + index} className="relative w-24 aspect-square">
                <Image
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="w-full h-full object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button
                  className="absolute top-0 right-0 p-1 rounded-full hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)]"
                  type="button"
                  onClick={() =>
                    handleRemoveImage(
                      index,
                      index >= currentImageUrlsFromRHF.length
                    )
                  }
                  aria-label="Remover imagem"
                >
                  <HiOutlineTrash size="1.5rem" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ImageUploadField;
