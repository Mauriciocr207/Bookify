import { BookCard } from "@app-types/models/BookCard";
import { GetBookResponse } from "@app-types/responses";
import { LocalBookModel } from "@models";
import { BookGalleryProps } from "app/(main)/components/BookGallery";
import { useDebouncedEffect } from "hooks/useDebouncedEffect";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export type Pagination = NonNullable<GetBookResponse["pagination"]>;

export type LocalBookCard = BookCard & { isSaved?: boolean };

interface FilterBookContextType {
  isLoading: boolean;
  search: string;
  tags: string[];
  books: LocalBookCard[];
  pagination: Pagination;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setControlledPage: React.Dispatch<React.SetStateAction<number>>;
}

const FilterBookContext = createContext<FilterBookContextType | null>(null);

export function FilterBookContextProvider({
  children,
  initialParams,
}: {
  children: React.ReactNode;
  initialParams: BookGalleryProps["params"];
}) {
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialParams.search);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tags, setTags] = useState<string[]>(initialParams.tags);
  const [books, setBooks] = useState<BookCard[]>([]);
  const [controlledPage, setControlledPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: initialParams.page,
    pageSize: 5,
    totalPages: 0,
    totalItems: 0,
  });
  const abortController = useRef<AbortController | null>(null);

  useDebouncedEffect(
    () => {
      setControlledPage(1);
      setDebouncedSearch(search);
    },
    [search],
    500
  );

  async function fetchBooks() {
    try {
      abortController.current?.abort();
      abortController.current = new AbortController();

      setLoading(true);
      await fetch(
        "/api/book/get?search=" +
          debouncedSearch +
          "&tags=" +
          tags.join(",") +
          "&page=" +
          controlledPage,
        { signal: abortController.current.signal }
      )
        .then((res) => res.json())
        .then((data: { books: BookCard[]; pagination: Pagination }) => {
          const booksSaved: LocalBookCard[] = [];
          data.books.forEach(async (book) => {
            const isSaved = await LocalBookModel.isBookSaved({
              id: String(book.id),
            });
            booksSaved.push({
              ...book,
              isSaved,
            });
          });
          return { books: booksSaved, pagination }
        })
        .then((data: { books: BookCard[]; pagination: Pagination }) => {
          setBooks(data.books);
          setPagination(data.pagination);
        });
      setLoading(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn("books fetch aborted");
        return;
      }

      console.warn("Error fetching books:", error);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, [debouncedSearch, tags, controlledPage]);

  return (
    <FilterBookContext.Provider
      value={{
        isLoading,
        books,
        search,
        tags,
        pagination,
        setSearch,
        setTags,
        setControlledPage,
      }}
    >
      {children}
    </FilterBookContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export const useFilterBookContext = () => {
  const context = useContext(FilterBookContext);
  if (!context) {
    throw new Error(
      "FilterBookContext debe usarse dentro de un FilterBookContextProvider"
    );
  }
  return context;
};
