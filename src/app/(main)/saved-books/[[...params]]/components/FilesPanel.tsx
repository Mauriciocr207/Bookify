"use client";

import { BookItem } from "@components/common";
import FolderItem from "./FolderItem";
import CreateFolderButton from "./CreateFolderButton";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  Spinner,
} from "@heroui/react";
import { useFolderContext } from "@context";
import React, { useEffect, useState } from "react";
import { BookCard } from "@app-types/models/BookCard";
import { LocalBookModel } from "@models";
import { BookInterface } from "@app-types/indexeddb";
import { GetBookByIdResponse } from "@app-types/responses";
import Image from "next/image";

export default function FilesPanel() {
  const [isBooksLoading, setIsBooksLoading] = useState(false);
  const [books, setBooks] = useState<BookCard[]>([]);
  const { currentFolder, breadcrumbs, setFolder, isLoading: isFoldersLoading } =
    useFolderContext();

  useEffect(() => {
    updateBooks();
  }, [currentFolder]);

  async function updateBooks() {
    try {
      setIsBooksLoading(true);
      const localBooks: BookInterface[] = await LocalBookModel.getBooksByFolder(
        {
          folderId: currentFolder.id,
        }
      );
      const { error, books }: GetBookByIdResponse = await fetch(
        "/api/book/get-multiple?ids=" + localBooks.map((b) => b.id).join(",")
      ).then((res) => res.json());

      if (error) {
        throw new Error(error);
      }

      setBooks(books);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching books:", error.message);
      }
      setBooks([]);
    } finally {
      setIsBooksLoading(false);
    }
  }

  function updateLocalBooks(deletedBookId: string) {
    setBooks((prevBooks) => {
        return prevBooks.filter((b) => String(b.id) !== deletedBookId);
    })
  }

  return (
    <>
      <section className="flex justify-between items-center">
        {breadcrumbs.length > 0 ? (
          <Breadcrumbs
            itemsAfterCollapse={2}
            itemsBeforeCollapse={1}
            maxItems={3}
            renderEllipsis={({ items, ellipsisIcon, separator }) => (
              <div key={"ellipsis"} className="flex items-center">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      className="min-w-6 w-6 h-6"
                      size="sm"
                      variant="flat"
                    >
                      {ellipsisIcon}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Routes">
                    {items.map((item, id) => (
                      <DropdownItem key={id} onPress={item.onPress}>
                        {item.children}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                {separator}
              </div>
            )}
          >
            <BreadcrumbItem key={"root"} onPress={() => setFolder("root")}>
              ~
            </BreadcrumbItem>
            {breadcrumbs.map((folder) => (
              <BreadcrumbItem
                key={folder.id}
                data-folderid={folder.id}
                onPress={() => setFolder(folder.id)}
              >
                {folder.name}
              </BreadcrumbItem>
            ))}
          </Breadcrumbs>
        ) : (
          <div>
            <h2 className="text-2xl text-blue-night font-bold">
              Este es un espacio para tí
            </h2>
            <label className="text-base text-blue-night font-extralight">
              Organiza tus libros favoritos aquí
            </label>
          </div>
        )}
        <CreateFolderButton />
      </section>

      <section className="mt-11 w-full">
        {/* <h3 className="font-medium text-blue-night text-xl">Tus carpetas</h3> */}
        <div className="flex flex-wrap gap-8 mt-8">
          {!isFoldersLoading &&
            currentFolder.folders?.map((folder, i) => (
              <FolderItem key={i} folder={folder} />
            ))}
          {isFoldersLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton className="rounded-xl w-[190px] h-12" key={i} />
            ))}
        </div>
      </section>

      <section className="mt-11 w-full">
        <h3 className="font-medium text-blue-night text-xl">Tus libros</h3>
        {!isBooksLoading && books.length === 0 && (
          <div className="w-full flex flex-col items-center h-full justify-center">
            <Image
              src="/no-data.jpg"
              alt="no data"
              width={250}
              height={100}
              className="mt-4"
            />
            <p className="text-center mt-4 text-gray text-xl font-bold">
              ¡Oops!
            </p>
            <p className="text-center mt-2 text-gray-2 text-sm">
              Parece que aquí no hay nada
            </p>
          </div>
        )}
        {isBooksLoading && (
          <div className="w-full flex flex-col items-center h-full justify-center">
            <Spinner
              classNames={{ label: "text-foreground mt-4" }}
              variant="wave"
              size="lg"
            />
          </div>
        )}
        {!isBooksLoading && books?.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-8">
            {books.map((book, i) => (
              <BookItem
                key={i}
                book={book}
                isSaved={true}
                onDeleteLocalBook={updateLocalBooks}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
