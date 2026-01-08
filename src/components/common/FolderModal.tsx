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
import { LocalFolderModel } from "@models";
import { FolderInterface } from "@app-types/indexeddb";
import { useFolderContext } from "@context";

export default function FolderModal({
  folder,
  disclosureHook,
  parentFolderId,
  onSaveFolder,
  onEditFolder,
  onDeleteFolder,
  backdrop = "blur",
  createMode = true,
  editMode = false,
  deleteMode = false,
  value = "",
}: {
  disclosureHook: ReturnType<typeof useDisclosure>;
  parentFolderId?: string;
  onSaveFolder?: (folderId: string) => void;
  onEditFolder?: (folderId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  backdrop?: "transparent" | "opaque" | "blur" | undefined;
  folder?: FolderInterface;
  createMode?: boolean;
  editMode?: boolean;
  deleteMode?: boolean;
  value?: string;
}) {
  const { isOpen, onOpenChange } = disclosureHook;
  const [inputValue, setInputValue] = useState(value);
  const { updateFolders } = useFolderContext();

  async function handleEditFolder() {
    if (folder) {
      const folderId = await LocalFolderModel.editFolder({
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
    if (parentFolderId) {
      const folderId = await LocalFolderModel.saveFolder({
        name: inputValue,
        parentId: parentFolderId,
        id: Date.now().toString(),
      });
      updateFolders();
      onSaveFolder?.(folderId);
      setInputValue("");
    }
  }

  async function handleDeleteFolder() {
    if (folder?.id) {
      await LocalFolderModel.deleteFolder(folder.id);
      onDeleteFolder?.(folder.id);
      disclosureHook.onClose();
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
            {(editMode || createMode) && (
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
                    onKeyDown={(e: KeyboardEvent) => {
                      if (e.key === "Enter") {
                        if (createMode) {
                          handleCreateFolder();
                          return;
                        }

                        if (editMode) {
                          handleEditFolder();
                        }
                      }
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      if (createMode) {
                        handleCreateFolder();
                        return;
                      }

                      if (editMode) {
                        handleEditFolder();
                      }
                    }}
                  >
                    {createMode && "Crear"}
                    {editMode && "Editar"}
                  </Button>
                </ModalFooter>
              </>
            )}
            {deleteMode && (
              <>
                <ModalHeader className="flex flex-col gap-2">
                  <h3>¿Quieres eliminar esta carpeta?</h3>
                  <p className="text-sm text-danger/90">
                    *Todo su contenido se perderá
                  </p>
                </ModalHeader>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    color="danger"
                    variant="solid"
                    onPress={handleDeleteFolder}
                  >
                    Eliminar
                  </Button>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
