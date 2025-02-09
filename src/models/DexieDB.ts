import { BookInterface, FolderInterface } from "@interfaces";
import Dexie from "dexie";

export type DexieDBInteface = Dexie & {
    folders: Dexie.Table<FolderInterface, string>;
    books: Dexie.Table<BookInterface, string>;
};

const DexieDB = new Dexie("book-store") as DexieDBInteface;

DexieDB.version(1).stores({
  folders: "id,parentId",
  books: "id,parentId",
});

export default DexieDB;