import { FolderInterface, FolderWithFilesInterface } from "@interfaces";
import db, { DexieDBInteface } from "./DexieDB";

class FolderModel {
  db: DexieDBInteface;
  private rootFolderId = "root";
  private rootFolderSymbol = "~";
  private initialState: FolderWithFilesInterface = {
    name: this.rootFolderSymbol,
    id: this.rootFolderId,
    parentId: this.rootFolderId,
    books: [],
    folders: [],
  };

  constructor(db: DexieDBInteface) {
    this.db = db;
  }

  private async defaultFolder(): Promise<FolderWithFilesInterface> {
    return {
      ...this.initialState,
      folders:
        (await this.db.folders
          .where("parentId")
          .equals(this.rootFolderId)
          .toArray()) || [],
      books:
        (await this.db.books
          .where("parentId")
          .equals(this.rootFolderId)
          .toArray()) || [],
    };
  }

  async saveFolder(folder: FolderInterface): Promise<string> {
    return await this.db.folders.add(folder);
  }

  async editFolder(folder: FolderInterface): Promise<string> {
    return await this.db.folders.put(folder, folder.id);
  }

  async deleteFolder(folderId: string): Promise<string> {
    const recursiveDelete = async (folderId: string) => {
      return this.db.transaction(
        "rw",
        this.db.folders,
        this.db.books,
        async () => {
          const subfolders = await this.db.folders
            .where("parentId")
            .equals(folderId)
            .primaryKeys();

          await this.db.folders.bulkDelete(subfolders);

          for (const subfolder of subfolders) {
            await recursiveDelete(subfolder);
          }

          await this.db.folders.delete(folderId);
        }
      );
    }

    await recursiveDelete(folderId);

    return folderId;
  }

  async getFolderWithFiles(
    folderId: string
  ): Promise<FolderWithFilesInterface> {
    if (folderId === this.rootFolderId) {
      return await this.defaultFolder();
    }

    const folderData = await this.db.folders
      .where("id")
      .equals(folderId)
      .first();

    if (!folderData) {
      return await this.defaultFolder();
    }

    const books = await this.db.books
      .where("parentId")
      .equals(folderData.id)
      .toArray();

    const folders = await this.db.folders
      .where("parentId")
      .equals(folderData.id)
      .toArray();

    return {
      ...folderData,
      books,
      folders,
    };
  }

  async getFoldersByParentId(parentId: string): Promise<FolderInterface[]> {
    return await this.db.folders.where({ parentId }).toArray();
  }

  async getBreadcrumbs(id: string): Promise<FolderInterface[]> {
    if (id === this.rootFolderId) return [];

    const folder = await db.folders.get(id);

    if (!folder) return [];

    if (folder.parentId === this.rootFolderId) return [folder];

    const parentFolder = await db.folders.get(folder.parentId);

    if (!parentFolder) return [folder];

    return [...(await this.getBreadcrumbs(parentFolder.id)), folder];
  }
}

const folderModel = new FolderModel(db);

export default folderModel;
