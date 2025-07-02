"use client";

import {
  BookFormIcon,
  TagsFileIcon,
  UploadFileIcon,
} from "@components/icons";
import { Chip, Input, Select, SelectItem } from "@heroui/react";

import InputTag from "./InputTag";
import DragAndDrop from "./DragAndDrop";

export default function Form() {


  return (
    <form className="m-auto mt-9 max-w-5xl grid grid-cols-[656px,1fr] grid-rows-1 gap-6">
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
            name="title"
            type="text"
            aria-label="title"
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
            name="author"
            type="text"
            aria-label="author"
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
            htmlFor="key-words"
            className="font-semibold text-sm text-blue-night"
          >
            Palabras clave
          </label>
          <InputTag
            name="key-words"
            placeholder="Escribe tus tags aquí"
            aria-label="key-words"
            // onChangeTags={(tags) => console.log(tags)}
          />
        </div>
      </div>
    </form>
  );
}
