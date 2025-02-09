"use client";

import { DotsIcon, FolderIcon } from "@components/icons";
import { ROUTES } from "@constants";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useAppDispatch } from "@hooks";
import { FolderInterface } from "@interfaces";
import { deleteFolder, setActiveFolder } from "@store";
import { useRouter } from "next/navigation";
// import { setFolder } from "@store";

const MAX_LENGTH_NAME = 14;

interface Props {
  folder: FolderInterface;
  onOpenModal: () => void;
}

export default function FolderItem({ folder, onOpenModal }: Props) {
    const dispatch = useAppDispatch();
  const router = useRouter();
  const formattedName =
    folder.name.length > MAX_LENGTH_NAME
      ? `${folder.name.substring(0, MAX_LENGTH_NAME)}...`
      : folder.name;

  const handleClick = () => {
    router.push(`${ROUTES.SAVED_BOOKS}/${folder.id}`);
  };

  const handleEditFolder = () => {
    onOpenModal();
  };

  const handleDeleteFolder = () => {
    dispatch(deleteFolder(folder.id));
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
        <DropdownMenu
          onAction={() => dispatch(setActiveFolder(folder))}
          aria-label="Action event example"
        >
          <DropdownItem onPress={handleEditFolder} key="edit">
            Renombrar
          </DropdownItem>
          <DropdownItem
            onPress={handleDeleteFolder}
            key="delete"
            className="text-danger"
            color="danger"
          >
            Eliminar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
