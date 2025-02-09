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

export default function FolderModal({
  disclosureHook,
  parentFolderId,
  onSaveFolder,
  backdrop,
}: {
  disclosureHook: ReturnType<typeof useDisclosure>;
  parentFolderId: string;
  onSaveFolder: (folderId: string) => void;
  backdrop: "transparent" | "opaque" | "blur" | undefined;
}) {
  const { isOpen, onOpenChange } = disclosureHook;
  const [inputValue, setInputValue] = useState("");
  const editingMode = false;

  async function handleEditFolder() {}

  async function handleCreateFolder() {
    const folderId = await FolderModel.saveFolder({
      name: inputValue,
      parentId: parentFolderId,
      id: Date.now().toString(),
    });
    onSaveFolder(folderId);
    setInputValue("");
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
                  (editingMode ? handleEditFolder() : handleCreateFolder())
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cerrar
              </Button>
              <Button
                color="primary"
                onPress={editingMode ? handleEditFolder : handleCreateFolder}
              >
                {editingMode ? "Editar" : "Crear"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
