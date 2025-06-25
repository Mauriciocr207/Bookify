"use client";

import { AddIcon } from "@components/icons";
import { useFolderContext } from "@context";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { FolderModel } from "@models";
import { KeyboardEvent } from "@react-types/shared";
import { useState } from "react";

export default function CreateFolderButton() {
  const { currentFolderId, setFolder } = useFolderContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState("Carpeta 1");

  async function handleCreateFolder() {
    await FolderModel.saveFolder({
      name: inputValue,
      parentId: currentFolderId,
      id: Date.now().toString(),
    });

    setFolder(currentFolderId);
    onClose();
  }

  function handleEnterEvent(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleCreateFolder();
    }
  }

  return (
    <>
      <Button onPress={onOpen} className="bg-blue-night px-12 py-1 rounded-md">
        <AddIcon />
        <p className="text-white font-bold text-sm">Crear carpeta</p>
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
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
                  onFocus={(e) => e.target.select()}
                  name="folderName"
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleEnterEvent}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  className="bg-blue text-white"
                  onPress={handleCreateFolder}
                >
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
