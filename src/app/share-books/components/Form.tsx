"use client";

import { BookFormIcon, TagsFileIcon, UploadFileIcon } from "@components/icons";
import { addToast, Button, Input } from "@heroui/react";

import InputTag from "./InputTag";
import DragAndDrop from "./DragAndDrop";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import CreateBookSchema from "@validation/CreateBookSchema";
import { BiLoaderAlt } from "react-icons/bi";
import CategoryInput from "./CategoryInput";

type CreateBookSchemaType = typeof CreateBookSchema._type;

export interface FormValues {
  title: string | null;
  author: string | null;
  categorySlug: string | null;
  file: CreateBookSchemaType["file"] | null;
  image: CreateBookSchemaType["image"] | null;
  tags?: Array<{ name: string }> | null;
}

export default function Form() {
  const methods = useForm({
    resolver: zodResolver(CreateBookSchema),
  });
  const { register, handleSubmit, formState, control, reset, getValues } =
    methods;
  const [isLoading, setIsLoading] = useState(false);

  const { errors } = formState;

  useEffect(() => {
    console.log({
      errors: formState.errors,
      values: getValues(),
    });
  }, [formState]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/book/save", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      addToast({
        title: "Enviado",
        description: "Tu libro se ha publicado correctamente",
        color: "success",
      });

      reset();
    } catch {
      addToast({
        title: "Error",
        description: "Ha habido un error al publicar tu libro",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="m-auto mt-9 max-w-5xl flex flex-col md:grid md:grid-cols-[656px,1fr] grid-rows-1 gap-6"
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
              classNames={{
                helperWrapper: "absolute -bottom-6 right-0",
              }}
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
              classNames={{
                helperWrapper: "absolute -bottom-6 right-0",
              }}
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
          <div className="flex justify-between my-2">
            <span className="text-xs text-blue-dark font-light">
              Se acepta .pdf
            </span>
            {errors.file?.message && (
              <span className="block text-tiny text-danger font-normal">
                {errors.file.message}
              </span>
            )}
          </div>
          <div className="justify-end hidden md:flex">
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
        <div className="w-full bg-white rounded-2xl p-6 h-fit md:max-w-[330px]">
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
            <CategoryInput />
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
                  placeholder="ficción,fantasía,biografía"
                  aria-label="tags"
                  onChangeTags={(tags) => field.onChange(tags)}
                />
              )}
            />
            <span className="text-xs text-blue-dark font-light">
              Hasta 3 etiquetas, separadas por comas (,)
            </span>
          </div>
          <div className="justify-end flex md:hidden mt-4">
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
      </form>
    </FormProvider>
  );
}
