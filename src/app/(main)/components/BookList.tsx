import { BookItem } from "@components/common";
import { useFilterBookContext } from "@context";
import Image from "next/image";
import BookPagination from "./BookPagination";
import { Spinner } from "@heroui/react";

export default function BookList() {
  const { isLoading, books, pagination } = useFilterBookContext();
  return (
    <div className="h-full">
      {!isLoading && books.length === 0 && (
        <div className="flex flex-col items-center h-full justify-center">
          <Image
            src="/no-data.jpg"
            alt="no data"
            width={400}
            height={300}
            className="mt-4"
          />
          <p className="text-center mt-4 text-gray text-3xl font-bold">
            ¡Oops!
          </p>
          <p className="text-center mt-2 text-gray-2">
            Parece que aquí no hay nada
          </p>
        </div>
      )}
      <div className="h-full flex flex-col justify-between">
        {isLoading && (
          <div className="flex flex-col items-center h-full justify-center">
            <Spinner
              classNames={{ label: "text-foreground mt-4" }}
              variant="wave"
              size="lg"
            />
          </div>
        )}
        {!isLoading && (
          <div className="flex flex-wrap gap-4 justify-center">
            {books.map((book, i) => (
              <BookItem key={i} book={book} isSaved={ book.isSaved } />
            ))}
          </div>
        )}
        {pagination?.totalPages > 1 && <BookPagination />}
      </div>
    </div>
  );
}
