"use client";

import { Input } from "@heroui/input";
import InputSearchAnimation from "./InputSearchAnimation";
import { SearchIcon } from "@components/icons";
import { useRef } from "react";

export default function InputSearch() {
  const inputSearch = useRef(null);
  return (
    <>
      <InputSearchAnimation inputSearch={inputSearch} />
      <Input
        baseRef={inputSearch}
        className="w-full max-w-[640px]"
        classNames={{
          input: "font-regular tex2t-lg placeholder:text-gray !text-blue-dark",
          inputWrapper: "h-auto px-8 py-4 text-gray",
          innerWrapper: "flex align-center gap-x-5",
          base: "w-full",
        }}
        placeholder="Busca títulos, temas o categorías..."
        startContent={<SearchIcon />}
      />
    </>
  );
}
