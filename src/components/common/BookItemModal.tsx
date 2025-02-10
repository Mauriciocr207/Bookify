import { FolderIcon, ArrowRightIcon, AddFolderIcon } from "@components/icons";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { BookInterface, FolderInterface } from "@interfaces";
import { BookModel, FolderModel } from "@models";
import { useEffect, useState } from "react";
import FolderModal from "./FolderModal";

async function getFolders(parentFolderId: string) {
  return await FolderModel.getFoldersByParentId(parentFolderId);
}

export default function BookItemModal({
  disclosureHook,
  book,
  isSavedBook,
  onSave,
  onDelete,
}: {
  disclosureHook: ReturnType<typeof useDisclosure>;
  book: BookInterface;
  isSavedBook: boolean;
  onSave: (savedId: string) => void;
  onDelete: () => void;
}) {
  const { isOpen, onOpenChange, onClose } = disclosureHook;
  const disclosureFolder = useDisclosure();
  const [folderId, setFolderId] = useState("root");
  const [actualFolderId, setactualFolderId] = useState("root");
  const [folders, setFolders] = useState<FolderInterface[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<FolderInterface[]>([]);

  useEffect(() => {
    (async () => {
      const breadcrumbs =
        actualFolderId === "root"
          ? []
          : await FolderModel.getBreadcrumbs(actualFolderId);
      const folders = await getFolders(actualFolderId);
      setFolderId(actualFolderId);
      setFolders(folders);
      setBreadcrumbs(breadcrumbs);
    })();
  }, [actualFolderId, isOpen]);

  async function handleBookSave() {
    const savedBook = await BookModel.saveBook({
      ...book,
      parentId: folderId === "root" ? actualFolderId : folderId,
    });
    onClose();
    onSave(savedBook);
  }

  async function handleBookDelete() {
    await BookModel.deleteBook(book.id);
    onClose();
    onDelete();
  }

  async function onSaveFolder() {
    setFolders(await getFolders(actualFolderId));
    disclosureFolder.onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={onOpenChange}
      backdrop="blur"
      className="max-w-96"
      classNames={{
        base: "overflow-hidden",
      }}
    >
      {isSavedBook ? (
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2">
                <h3>¿Quieres eliminar este libro de tus guardados?</h3>
              </ModalHeader>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  onPress={handleBookDelete}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      ) : (
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 space-between">
                <h3>Elige un lugar para tu libro</h3>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <p className="text-sm">Ruta:</p>
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
                                <DropdownItem
                                  key={id}
                                  onPress={() =>
                                    setactualFolderId(item.id as string)
                                  }
                                >
                                  {item.children}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                          {separator}
                        </div>
                      )}
                    >
                      <BreadcrumbItem onPress={() => setactualFolderId("root")}>
                        ~
                      </BreadcrumbItem>
                      {breadcrumbs.map((folder) => (
                        <BreadcrumbItem
                          id={folder.id}
                          key={folder.id}
                          onPress={() => setactualFolderId(folder.id)}
                        >
                          {folder.name}
                        </BreadcrumbItem>
                      ))}
                    </Breadcrumbs>
                  </div>
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => disclosureFolder.onOpen()}
                  >
                    <AddFolderIcon />
                  </Button>
                  <FolderModal
                    backdrop="transparent"
                    onSaveFolder={onSaveFolder}
                    parentFolderId={actualFolderId}
                    disclosureHook={disclosureFolder}
                  />
                </div>
              </ModalHeader>
              <ModalBody className="p-0 max-h-52 min-h-52 overflow-y-auto shadow-small gap-0">
                <Listbox
                  className="p-0 gap-0 "
                  classNames={{
                    base: "h-full",
                    emptyContent: "p-0 m-auto flex justify-center",
                  }}
                  emptyContent={
                    <div className="flex justify-center items-center h-52 w-1/2 p-0 text-center">
                      <p>Oops! Parece que no hay nada por aquí</p>
                    </div>
                  }
                >
                  {folders.map((folder) => (
                    <ListboxItem
                      key={folder.id}
                      startContent={<FolderIcon />}
                      onPress={() =>
                        setFolderId(
                          folder.id === folderId ? actualFolderId : folder.id
                        )
                      }
                      classNames={{
                        base: `px-3 rounded-none gap-3 h-12 [&>button]:data-[hover=true]:opacity-100 data-[hover=true]:bg-gray-light-3 ${
                          folder.id === folderId ? "!bg-gray-transparent" : ""
                        }`,
                      }}
                      endContent={
                        <Button
                          onPress={() => setactualFolderId(folder.id)}
                          isIconOnly
                          variant="light"
                          className="opacity-0 transition-opacity"
                        >
                          <ArrowRightIcon />
                        </Button>
                      }
                      onDoubleClick={() => setactualFolderId(folder.id)}
                    >
                      {folder.name}
                    </ListboxItem>
                  ))}
                </Listbox>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleBookSave}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      )}
    </Modal>
  );
}
