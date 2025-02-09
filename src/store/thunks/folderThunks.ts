import { FolderInterface } from "@interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { initialState } from "../slices";
import { DexieDB } from "@models";

export const createFolder = createAsyncThunk(
  "folder/createFolder",
  async (folder: FolderInterface) => {
    await DexieDB.folders.add(folder);
    return folder;
  }
);

export const updateFolder = createAsyncThunk(
  "folder/updateFolder",
  async (folder: FolderInterface) => {
    await DexieDB.folders.put(folder, folder.id);
    return folder;
  }
);

export const deleteFolder = createAsyncThunk(
  "folder/deleteFolder",
  async (folderId: string) => {
    async function recursiveDelete(folderId: string) {
      return DexieDB.transaction("rw", DexieDB.folders, DexieDB.books, async () => {
        const subfolders = await DexieDB.folders
          .where("parentId")
          .equals(folderId)
          .primaryKeys();

        await DexieDB.folders.bulkDelete(subfolders);

        for (const subfolder of subfolders) {
          await recursiveDelete(subfolder);
        }

        await DexieDB.folders.delete(folderId);
      });
    }

    recursiveDelete(folderId);

    return folderId;
  }
);

export const setFolder = createAsyncThunk(
  "folder/setFolder",
  async (folderId: string) => {
    if (folderId === "root") {
      return await defaultData();
    }

    const folderData = await DexieDB.folders.where("id").equals(folderId).first();

    if (!folderData) {
      return await defaultData();
    }

    const books = await DexieDB.books
      .where("parentId")
      .equals(folderData.id)
      .toArray();

    const folders = await DexieDB.folders
      .where("parentId")
      .equals(folderData.id)
      .toArray();

    return {
      ...folderData,
      books,
      folders,
    };
  }
);

async function defaultData() {
  return {
    ...initialState,
    folders:
      (await DexieDB.folders.where("parentId").equals("root").toArray()) || [],
    books: (await DexieDB.books.where("parentId").equals("root").toArray()) || [],
  };
}
