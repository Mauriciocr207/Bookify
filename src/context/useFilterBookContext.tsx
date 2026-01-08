import { BookCard } from "@app-types/models/BookCard";
import { GetBookResponse } from "@app-types/responses";
import { LocalBookModel } from "@models";
import { BookGalleryProps } from "app/(main)/components/BookGallery";
import { useDebouncedEffect } from "hooks/useDebouncedEffect";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

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
  initialBooks,
  initialPagination,
  initialFilter,
}: {
  children: React.ReactNode;
  initialBooks: BookCard[];
  initialPagination: Pagination;
  initialFilter: BookGalleryProps["params"];
}) {
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialFilter.search);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tags, setTags] = useState<string[]>(initialFilter.tags);
  const [books, setBooks] = useState<BookCard[]>(initialBooks);
  const [controlledPage, setControlledPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const abortController = useRef<AbortController | null>(null);
  const firstRender = useRef(true);

  useDebouncedEffect(
    () => {
      setControlledPage(1);
      setDebouncedSearch(search);
    },
    [search],
    500
  );

  const fetchBooks = useCallback(async () => {
    try {
      abortController.current?.abort();
      abortController.current = new AbortController();

      setLoading(true);

      const res = await fetch(
        `/api/book/get?search=${debouncedSearch}&tags=${tags.join(
          ","
        )}&page=${controlledPage}`,
        { signal: abortController.current.signal }
      );

      const data = await res.json();

      const booksSaved: LocalBookCard[] = await Promise.all(
        data.books.map(async (book: BookCard) => ({
          ...book,
          isSaved: await LocalBookModel.isBookSaved({ id: String(book.id) }),
        }))
      );

      setBooks(booksSaved);
      setPagination(data.pagination);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.warn("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, controlledPage, tags]);

  useEffect(() => {
    if(firstRender.current) {
        firstRender.current = false;
        return;
    }

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
