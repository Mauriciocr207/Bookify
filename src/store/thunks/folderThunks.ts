import {
  BookInterface,
  FolderInterface,
  FolderWithFilesInterface,
} from "@interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { initialState } from "../slices";
import db from "@dexieDB";
import { a } from "framer-motion/client";

export const createFolder = createAsyncThunk(
  "folder/createFolder",
  async (folder: FolderInterface) => {
    await db.folders.add(folder);
    return folder;
  }
);

export const updateFolder = createAsyncThunk(
  "folder/updateFolder",
  async (folder: FolderInterface) => {
    await db.folders.put(folder, folder.id);
    return folder;
  }
);

export const deleteFolder = createAsyncThunk(
  "folder/deleteFolder",
  async (folderId: string) => {
    async function recursiveDelete(folderId: string) {
      return db.transaction("rw", db.folders, db.books, async () => {
        const subfolders = await db.folders
          .where("parentId")
          .equals(folderId)
          .primaryKeys();
        
        await db.folders.bulkDelete(subfolders);

        for(const subfolder of subfolders) {
            await recursiveDelete(subfolder);
        }

        await db.folders.delete(folderId);
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

    const folderData = await db.folders.where("id").equals(folderId).first();

    if (!folderData) {
      return await defaultData();
    }

    const books = await db.books
      .where("parentId")
      .equals(folderData.id)
      .toArray();

    const folders = await db.folders
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
      (await db.folders.where("parentId").equals("root").toArray()) || [],
    books: (await db.books.where("parentId").equals("root").toArray()) || [],
  };
}
