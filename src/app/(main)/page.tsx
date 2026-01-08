import { Metadata } from "next";
import { Button } from "@heroui/button";
import { ROUTES } from "@config";
import Link from "next/link";
import BookGallery, { BookGalleryProps } from "./components/BookGallery";
import { GetCategoriesResponse } from "@app-types/responses";
import getCategories from "@server/categories/getCategories";
import getBooks from "@server/books/getBooks";

export const metadata: Metadata = {
  title: "Bookify",
  description: "Bookify es una aplicación para explorar y compartir libros",
  applicationName: "Bookify",
};

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    tags?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const page = parseInt((await searchParams)?.page || "1", 10);
  const search = (await searchParams)?.search || "";
  const getTagParam = (await searchParams)?.tags;
  const tags = getTagParam
    ? getTagParam.split(",").filter((tag) => tag.trim() !== "")
    : [];

  const { books, pagination } = await getBooks({
    page,
    filter: {
      search,
      tags,
    },
  });

  const params: BookGalleryProps["params"] = {
    page,
    search,
    tags,
  };

  const { categories }: GetCategoriesResponse = await getCategories();
  return (
    <>
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center mt-20 relative z-40">
        <h1 className="max-w-4xl text-6xl font-black text-center text-blue-night dark:text-white">
          Explora, comparte y aprende con{" "}
          <span className="gradient-title">Bookify</span>.
        </h1>
        <p className="text-xl text-blue-night font-medium dark:text-white">
          El conocimiento al alcance de todos.
        </p>
        <div className="flex gap-4">
          <Button
            as={Link}
            href={ROUTES.saved_books}
            className="bg-blue-night text-white dark:bg-blue-light px-8 py-2 rounded-md font-bold"
          >
            Explora
          </Button>
          <Button
            as={Link}
            href={ROUTES.share_books}
            className="bg-white text-blue-night border-blue-night dark:text-blue-light dark:border-blue-ligth border-1 border-solid px-8 py-2 rounded-md font-bold"
          >
            Colabora
          </Button>
        </div>
      </main>
      <section className="flex flex-col items-center justify-center mt-20">
        <BookGallery
          books={books}
          pagination={pagination}
          filteringTags={categories}
          params={params}
        />
      </section>
    </>
  );
}
