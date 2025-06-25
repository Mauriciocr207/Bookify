"use client";

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
import { useState } from "react";
import { KeyboardEvent } from "@react-types/shared";
import { FolderModel } from "@models";
import { FolderInterface } from "@interfaces";

export default function FolderModal({
  folder,
  disclosureHook,
  parentFolderId,
  onSaveFolder,
  onEditFolder,
  backdrop = "blur",
  editMode = false,
  value = "",
}: {
  disclosureHook: ReturnType<typeof useDisclosure>;
  parentFolderId?: string;
  onSaveFolder?: (folderId: string) => void;
  onEditFolder?: (folderId: string) => void;
  backdrop?: "transparent" | "opaque" | "blur" | undefined;
  folder?: FolderInterface;
  editMode?: boolean;
  value?: string;
}) {
    console.log(value);
  const { isOpen, onOpenChange } = disclosureHook;
  const [inputValue, setInputValue] = useState(value);

  async function handleEditFolder() {
    if (folder) {
      const folderId = await FolderModel.editFolder({
        name: inputValue,
        parentId: folder.parentId,
        id: folder.id,
      });

      onEditFolder?.(folderId);
      setInputValue(inputValue);
      disclosureHook.onClose();
    }
  }

  async function handleCreateFolder() {
    if(parentFolderId) {
        const folderId = await FolderModel.saveFolder({
          name: inputValue,
          parentId: parentFolderId,
          id: Date.now().toString(),
        });
        onSaveFolder?.(folderId);
        setInputValue("");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={onOpenChange}
      backdrop={backdrop}
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
                  e.key === "Enter" &&
                  (editMode ? handleEditFolder() : handleCreateFolder())
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cerrar
              </Button>
              <Button
                color="primary"
                onPress={editMode ? handleEditFolder : handleCreateFolder}
              >
                {editMode ? "Editar" : "Crear"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
