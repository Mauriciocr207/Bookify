"use client";

import Filter from "./Filter";
import InputSearch from "./InputSearch";
import { Category } from "@app-types/models/Category";
import {
  FilterBookContextProvider,
  Pagination,
} from "context/useFilterBookContext";
import BookList from "./BookList";
import { BookCard } from "@app-types/models/BookCard";

export interface BookGalleryProps {
  books: BookCard[];
  pagination: Pagination;
  filteringTags: Category[];
  params: {
    page: number;
    search: string;
    tags: string[];
  };
}

export default function BookGallery({
  books,
  pagination,
  filteringTags,
  params,
}: BookGalleryProps) {
  return (
    <FilterBookContextProvider initialBooks={books} initialPagination={pagination} initialFilter={params}>
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
