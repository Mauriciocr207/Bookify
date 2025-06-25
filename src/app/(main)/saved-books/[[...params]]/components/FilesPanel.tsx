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
} from "@heroui/react";
import { BookInterface } from "@interfaces";
import { useFolderContext } from "@context";
import React from "react";

const books: BookInterface[] = Array(5)
  .fill(null)
  .map((_, index) => ({
    id: `book-${index + 1}`,
    title: "Física para todos",
    imageUrl: "/1.jpg",
    author: "Albert Einstein",
    category: "Física",
    likes: 145,
    downloadUrl: `/download/${index + 1}`, // Ejemplo de URL de descarga
  }));

export default function FilesPanel() {
  const { currentFolder, breadcrumbs, setFolder, isLoading } =
    useFolderContext();

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
      {books?.length > 0 && (
        <section className="mt-11 w-full">
          <h3 className="font-medium text-blue-night text-xl">Tus libros</h3>
          <div className="flex flex-wrap gap-4 mt-8">
            {books.map((book, i) => (
              <BookItem key={i} book={book} isSaved={true} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-11 w-full">
        <h3 className="font-medium text-blue-night text-xl">Tus carpetas</h3>
        <div className="flex flex-wrap gap-8 mt-8">
          {!isLoading &&
            currentFolder.folders?.map((folder, i) => (
              <FolderItem key={i} folder={folder} />
            ))}
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton className="rounded-xl w-[190px] h-12" key={i} />
            ))}
        </div>
      </section>
    </>
  );
}
