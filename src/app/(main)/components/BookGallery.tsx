"use client";

import Filter from "./Filter";
import InputSearch from "./InputSearch";
import { Category } from "@app-types/models/Category";
import { FilterBookContextProvider } from "context/useFilterBookContext";
import BookList from "./BookList";

export interface BookGalleryProps {
  filteringTags: Category[];
  params: {
    page: number;
    search: string;
    tags: string[];
  }
}

export default function BookGallery({
  filteringTags,
  params,
}: BookGalleryProps) {
  return (
    <FilterBookContextProvider initialParams={params}>
      <InputSearch />
      <div className="grid grid-cols-[320px_1fr] gap-4 w-full mt-10">
        <div className="flex flex-col gap-y-4 rounded-2xl shadow py-5">
          <Filter title="Categorías" tags={filteringTags} />
        </div>
        <BookList />
      </div>
    </FilterBookContextProvider>
  );
}
