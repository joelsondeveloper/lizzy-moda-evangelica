"use client";

import React, { useState, useEffect, useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Image from "next/image";
import { HiOutlineUpload, HiOutlineTrash } from "react-icons/hi";

interface ImageUploadFieldProps {
  label: string;
  id: string;
  register: UseFormRegisterReturn;
  error?: string;
  currentImageUrl?: string | null;
  onImageChange: (file: File | null) => void;
  onRemoveCurrentImage: () => void;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  id,
  register,
  error,
  currentImageUrl,
  onImageChange,
  onRemoveCurrentImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreviewUrl(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    } else {
      setPreviewUrl(null);
      onImageChange(null);
    }
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviewUrl(null);
    onImageChange(null);
    onRemoveCurrentImage();
  };

  const displayImage = previewUrl;

  return (
    <div className="flex flex-col gap-2 items-center" onDragOver={(e) => {
      e.preventDefault();
      setIsDragging(true);
    }} onDragLeave={() => setIsDragging(false)} onDrop={((e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileChange({ target: { files: [file] } } as any);
    })}>
      <label htmlFor={id}>{label}</label>
      <div className="relative w-24 aspect-square">
        {displayImage ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              className="w-full h-full rounded-2xl border-2 border-primary-accent-light dark:border-primary-accent-dark"
              src={displayImage}
              alt={label}
              fill
              style={{ objectFit: "cover" }}
            />
            <button
              className="absolute top-0 right-0 p-1 rounded-full hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)]"
              type="button"
              onClick={handleRemoveImage}
              aria-label="Remover imagem"
            >
              <HiOutlineTrash size="1.5rem" />
            </button>
          </div>
        ) : (
            <label className={`flex flex-col items-center justify-center w-full h-full rounded-2xl ${isDragging ? " outline-4 outline-dashed" : "border-2"} border-primary-accent-light dark:border-primary-accent-dark cursor-pointer`}>
              <HiOutlineUpload className="h-4 w-4 text-text-secondary-light dark:text-text-secondary-dark mb-2" />
              <span className="text-xs text-center text-text-secondary-light dark:text-text-secondary-dark">
                Arraste e solte ou <br />
                clique para enviar
              </span>
                <input
                  type="file"
                  id={id}
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
          )}
        </div>
        {error && (
          <p className="text-danger-light dark:text-danger-dark">{error}</p>
        )}
      </div>
  );
};

export default ImageUploadField;
