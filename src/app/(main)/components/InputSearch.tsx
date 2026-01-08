"use client";

import { Input } from "@heroui/input";
import InputSearchAnimation from "./InputSearchAnimation";
import { SearchIcon } from "@components/icons";
import { useRef } from "react";
import { useFilterBookContext } from "@context";

export default function InputSearch() {
  const inputSearch = useRef(null);
  const { search, setSearch } = useFilterBookContext()
  return (
    <>
      <InputSearchAnimation inputSearch={inputSearch} />
      <Input
        baseRef={inputSearch}
        className="w-full max-w-[640px] relative z-30"
        classNames={{
          input: "font-regular text-lg placeholder:text-gray !text-blue-night dark:!text-blue-light dark:placeholder:text-gray dark:!text-blue-light dark:text-lg",
          inputWrapper:
            "h-auto px-8 py-4 text-gray dark:!bg-blue-night-2 dark:!text-blue-light dark:hover:!bg-blue-night-3 dark:!focus:bg-blue-night-3",
          innerWrapper: "flex align-center gap-x-5",
          base: "w-full",
        }}
        placeholder="Busca títulos, temas o categorías..."
        startContent={<SearchIcon />}
        value={search}
        onValueChange={setSearch}
      />
    </>
  );
}
