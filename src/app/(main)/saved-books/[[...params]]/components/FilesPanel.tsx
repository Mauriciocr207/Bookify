"use client";

import { BookItem } from "@components/common";
import FolderItem from "./FolderItem";
import { useAppDispatch, useAppSelector } from "@hooks";
import CreateFolderButton from "./CreateFolderButton";
import { useEffect, useState } from "react";
import { setFolder, updateFolder } from "@store";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { BookInterface, FolderInterface } from "@interfaces";
import { KeyboardEvent } from "@react-types/shared";
import { FolderModel } from "@models";

const books: BookInterface[] = Array(5).fill(null).map((_, index) => ({
  id: `book-${index + 1}`,
  title: "Física para todos",
  imageUrl: "/1.jpg",
  author: "Albert Einstein",
  category: "Física",
  likes: 145,
  downloadUrl: `/download/${index + 1}`, // Ejemplo de URL de descarga
}));

export default function FilesPanel({ parentId }: { parentId: string }) {
  const { folders, id } = useAppSelector((state) => state.folder);
  const {
    id: activeFolderId,
    name: activeFolderName,
    parentId: activeFolderParentId,
  } = useAppSelector((state) => state.activeFolder);
  const dispatch = useAppDispatch();
  const [breadcrumbs, setBreadcrumbs] = useState<FolderInterface[]>([]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (parentId === "root") return setBreadcrumbs([]);
      const breadcrumbs = await FolderModel.getBreadcrumbs(id);
      setBreadcrumbs(breadcrumbs);
    })();
  }, [id, parentId]);

  useEffect(() => {
    (async () => {
      await dispatch(setFolder(parentId));
    })();
  }, [parentId, dispatch]);

  useEffect(() => {
    setInputValue(activeFolderName);
  }, [activeFolderId, activeFolderName]);

  const handleEditFolder = () => {
    dispatch(
      updateFolder({
        id: activeFolderId,
        name: inputValue,
        parentId: activeFolderParentId,
      })
    );
    onClose();
  };

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
                      <DropdownItem key={id} href={item.href}>
                        {item.children}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                {separator}
              </div>
            )}
          >
            <BreadcrumbItem key={"/saved-books"} href="/saved-books">
              ~
            </BreadcrumbItem>
            {breadcrumbs.map((folder) => (
              <BreadcrumbItem
                
                key={folder.id}
                href={`/saved-books/${folder.id}`}
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
      {folders?.length > 0 && (
        <>
          <section className="mt-11 w-full">
            <h3 className="font-medium text-blue-night text-xl">
              Tus carpetas
            </h3>
            <div className="flex flex-wrap gap-8 mt-8">
              {folders.map((folder, i) => (
                <FolderItem key={i} folder={folder} onOpenModal={onOpen} />
              ))}
            </div>
          </section>
          <Modal
            isOpen={isOpen}
            placement="bottom"
            onOpenChange={onOpenChange}
            backdrop="blur"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Nombre de la carpeta
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      label="Nombre de la carpeta"
                      placeholder="Carpeta 1"
                      type="text"
                      variant="underlined"
                      autoFocus
                      defaultValue={inputValue}
                      name="folderName"
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e: KeyboardEvent) =>
                        e.key === "Enter" && handleEditFolder()
                      }
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Cerrar
                    </Button>
                    <Button color="primary" onPress={handleEditFolder}>
                      Crear
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}
