"use client";

import { FolderModal } from "@components/common";
import { DotsIcon, FolderIcon } from "@components/icons";
import { useFolderContext } from "@context";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { FolderInterface } from "@app-types/indexeddb";
import { useState } from "react";

const MAX_LENGTH_NAME = 14;

interface Props {
  folder: FolderInterface;
}

export default function FolderItem({ folder }: Props) {
  const { currentFolderId, setFolder } = useFolderContext();
  const [modalMode, setModalMode] = useState<"edit" | "delete" | null>(null);
  const disclosureHook = useDisclosure();
  const formattedName =
    folder.name.length > MAX_LENGTH_NAME
      ? `${folder.name.substring(0, MAX_LENGTH_NAME)}...`
      : folder.name;

  const handleClick = () => {
    setFolder(folder.id);
  };

  const beginHandleEditFolder = () => {
    setModalMode("edit");
    disclosureHook.onOpen();
  };

  const handleEditFolder = () => {
    setModalMode(null);
    disclosureHook.onClose();
    setFolder(currentFolderId);
  };

  const beginHandleDeleteFolder = async () => {
    setModalMode("delete");
    disclosureHook.onOpen();
  };

  const handleDeleteFolder = () => {
    setModalMode(null);
    disclosureHook.onClose();
    setFolder(currentFolderId);
  };

  return (
    <div className="relative w-[190px] flex">
      <Button
        className="bg-gray-light-3 text-blue-night w-full h-fit px-[14px] py-3 flex justify-start items-center box-content relative folder-shadow"
        onPress={handleClick}
      >
        <FolderIcon />
        {formattedName}
      </Button>
      <Dropdown>
        <DropdownTrigger>
          <Button className="absolute bg-[transparent] p-0 min-w-fit w-fit h-fit flex justify-center overflow-visible right-[8px] top-0 bottom-0 m-auto">
            <DotsIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onPress={beginHandleEditFolder} key="edit">
            Renombrar
          </DropdownItem>
          <DropdownItem
            onPress={beginHandleDeleteFolder}
            key="delete"
            className="text-danger"
            color="danger"
          >
            Eliminar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <FolderModal
        editMode={modalMode === "edit"}
        deleteMode={modalMode === "delete"}
        folder={folder}
        disclosureHook={disclosureHook}
        onEditFolder={handleEditFolder}
        onDeleteFolder={handleDeleteFolder}
        value={folder.name}
      />
    </div>
  );
}
