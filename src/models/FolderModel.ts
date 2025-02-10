import { FolderInterface } from "@interfaces";
import db, { DexieDBInteface } from "./DexieDB";

class FolderModel {
  db: DexieDBInteface;

  constructor(db: DexieDBInteface) {
    this.db = db;
  }

  async saveFolder(folder: FolderInterface) {
    return await this.db.folders.add(folder);
  }

  async getFoldersByParentId(parentId: string): Promise<FolderInterface[]> {
    return await this.db.folders.where({ parentId }).toArray();
  }

  async getBreadcrumbs(id: string): Promise<FolderInterface[]> {
    if (id === "root") return [];

    const folder = await db.folders.get(id);

    if (!folder) return [];

    if (folder.parentId === "root") return [folder];

    const parentFolder = await db.folders.get(folder.parentId);

    if (!parentFolder) return [folder];

    return [...(await this.getBreadcrumbs(parentFolder.id)), folder];
  }
}

const folderModel = new FolderModel(db);

export default folderModel;
