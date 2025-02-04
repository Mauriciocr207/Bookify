import { Metadata } from "next";
import { Button } from "@heroui/button";
import { BookInterface } from "@interfaces";
import { BookItem } from "@components/common";
import { BookPagination, Filter, InputSearch } from "./components";
import { ROUTES } from "@constants";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Bookify',
    description: 'Bookify es una aplicación para explorar y compartir libros',
    applicationName: 'Bookify',
}

const filteringTags = [
  "Física",
  "Química",
  "Biología",
  "Matemáticas",
  "Astronomía",
  "Geología",
  "Ecología",
];

const books: BookInterface[] = [
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
  {
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
  },
];


export default function Home() {
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
          <Button as={Link} href={ROUTES.SAVED_BOOKS} className="bg-blue-night text-white dark:bg-blue-light px-8 py-2 rounded-md font-bold">
            Explora
          </Button>
          <Button as={Link} href={ROUTES.SHARE_BOOKS} className="bg-white text-blue-night border-blue-night dark:text-blue-light dark:border-blue-ligth border-1 border-solid px-8 py-2 rounded-md font-bold">
            Colabora
          </Button>
        </div>
      </main>
      <section className="flex flex-col items-center justify-center mt-20">
        <InputSearch />
        <div className="flex flex-col gap-y-4 mt-10">
          <Filter title="Ciencia" tags={filteringTags} />
          <Filter title="Categorías" tags={filteringTags} />
        </div>
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          {books.map((book, i) => (
            <BookItem key={i} {...book} />
          ))}
        </div>
        <BookPagination />
      </section>
    </>
  );
}
