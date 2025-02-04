import { BookInterface, FolderInterface } from "@interfaces";
import Dexie from "dexie";

const db = new Dexie("book-store") as Dexie & {
    folders: Dexie.Table<FolderInterface, string>;
    books: Dexie.Table<BookInterface, string>;
};

db.version(1).stores({
    folders: "id,parentId",
    books: "id,parentId",
});

export default db;