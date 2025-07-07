"use client";

import { BookFormIcon, TagsFileIcon, UploadFileIcon } from "@components/icons";
import { Button, Chip, Input, Select, SelectItem } from "@heroui/react";

import InputTag from "./InputTag";
import DragAndDrop from "./DragAndDrop";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import CreateBookSchema from "@validation/CreateBookSchema";
import { BiLoaderAlt } from "react-icons/bi";

export default function Form() {
  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: zodResolver(CreateBookSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const { errors } = formState;

  useEffect(() => {
    console.log(formState);
  }, [formState]);

  const onSubmit = async () => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setIsLoading(false);
    reset();
  };

  return (
    <form
      className="m-auto mt-9 max-w-5xl grid grid-cols-[656px,1fr] grid-rows-1 gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full bg-white rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <BookFormIcon />
          <h3 className="text-blue-night font-medium text-xl">
            Información del libro
          </h3>
        </div>
        <div className="mt-4 flex w-full flex-col gap-2">
          <label
            htmlFor="title"
            className="font-semibold text-sm text-blue-night"
          >
            Título
          </label>
          <Input
            id="title"
            placeholder="Ciencia del espacio"
            type="text"
            aria-label="title"
            {...register("title")}
            isInvalid={!!errors.title}
            errorMessage={errors.title?.message}
          />
        </div>
        <div className="mt-6 flex w-full flex-col gap-2">
          <label
            htmlFor="author"
            className="font-semibold text-sm text-blue-night"
          >
            Autor
          </label>
          <Input
            id="author"
            placeholder="Javier Santaolalla"
            type="text"
            aria-label="author"
            {...register("author")}
            isInvalid={!!errors.author}
            errorMessage={errors.author?.message}
          />
        </div>
        <div className="flex items-center gap-2 mt-7">
          <UploadFileIcon />
          <h3 className="text-blue-night font-medium text-xl">Archivo</h3>
        </div>
        <span className="text-sm text-blue-night font-extralight">
          Sube aquí tu libro, puedes arrastrarlo y soltarlo o cargarlo desde
          Google Drive
        </span>
        <DragAndDrop />
        <span className="text-xs text-blue-dark font-light">
          Se acepta .pdf
        </span>
        <div className="flex justify-end">
          <Button
            className="bg-blue-night text-white flex justify-center"
            type="submit"
          >
            {isLoading ? (
              <BiLoaderAlt className="animate-spin h-[50%] w-fit" />
            ) : (
              "Enviar"
            )}
          </Button>
        </div>
      </div>
      <div className="w-full bg-white rounded-2xl p-6 h-fit max-w-[330px]">
        <div className="flex items-center gap-2">
          <TagsFileIcon />
          <h3 className="text-blue-night font-medium text-xl">
            Tags del libro
          </h3>
        </div>
        <div className="mt-4 flex w-full flex-col gap-2">
          <label
            htmlFor="category"
            className="font-semibold text-sm text-blue-night"
          >
            Categoría
          </label>
          <Select
            id="category"
            placeholder="Ciencia del libro"
            aria-label="category"
            name="category"
            renderValue={(items) => (
              <div className="flex gap-2 overflow-x-auto scrollbar">
                {items.map((item) => (
                  <Chip
                    key={item.key}
                    size="sm"
                    className="px-3.5 font-medium text-[10px] bg-blue-transparent/25 text-blue"
                  >
                    {item.textValue}
                  </Chip>
                ))}
              </div>
            )}
            className="max-w-full overflow-hidden"
          >
            <SelectItem>Matemáticas</SelectItem>
            <SelectItem>Física</SelectItem>
            <SelectItem>Biología</SelectItem>
            <SelectItem>Terror</SelectItem>
          </Select>
        </div>
        <div className="mt-6 flex w-full flex-col gap-2">
          <label
            htmlFor="tags"
            className="font-semibold text-sm text-blue-night"
          >
            Palabras clave
          </label>
          <Controller
            control={control}
            name="tags"
            defaultValue={[]}
            render={({ field }) => (
              <InputTag
                name="tags"
                placeholder="Escribe tus tags aquí"
                aria-label="tags"
                onChangeTags={(tags) =>
                  field.onChange(tags.map((tag) => ({ name: tag })))
                }
              />
            )}
          />
        </div>
      </div>
    </form>
  );
}
