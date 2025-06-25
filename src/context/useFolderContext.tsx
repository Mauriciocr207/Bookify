import { FolderInterface, FolderWithFilesInterface } from "@interfaces";
import { FolderModel } from "@models";
import { isClientSide } from "@utils";
import { createContext, useContext, useEffect, useState } from "react";

// Define el tipo del contexto
interface FolderContextType {
  isLoading: boolean;
  currentFolderId: string;
  currentFolder: FolderWithFilesInterface;
  breadcrumbs: FolderInterface[];
  setFolder: (folderId: string) => void;
}

// Crea el contexto con un valor inicial
const FolderContext = createContext<FolderContextType | null>(null);

export function FolderContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState(() => {
    if (isClientSide()) {
      return localStorage?.getItem("currentFolder") || "root";
    }
    return "root";
  });
  const [currentFolder, setCurrentFolder] = useState<FolderWithFilesInterface>({
    id: "",
    parentId: currentFolderId,
    name: "",
    folders: [],
    books: [],
  });
  const [breadcrumbs, setBreadcrumbs] = useState<FolderInterface[]>([]);

  async function setFolder(folderId: string) {
    const folder = await FolderModel.getFolderWithFiles(folderId);
    const breadcrumbs = await FolderModel.getBreadcrumbs(folderId);
    localStorage.setItem("currentFolder", folderId);
    setCurrentFolderId(folderId);
    setCurrentFolder(folder);
    setBreadcrumbs(breadcrumbs);
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await setFolder(currentFolderId);
      setIsLoading(false);
    })();
  }, []);

  return (
    <FolderContext.Provider
      value={{
        currentFolderId,
        currentFolder,
        breadcrumbs,
        setFolder,
        isLoading,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export const useFolderContext = () => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error(
      "useFolderContext debe usarse dentro de un FolderContextProvider"
    );
  }
  return context;
};
