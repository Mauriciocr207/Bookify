import { BookInterface } from "@app-types/indexeddb";
import db, { DexieDBInteface } from "./DexieDB";

class LocalBookModel {
  db: DexieDBInteface;

  constructor(db: DexieDBInteface) {
    this.db = db;
  }

  async saveBook({ id, parentId }: BookInterface) {
    return await this.db.books.add({
      id,
      parentId,
    });
  }

  async deleteBook({ id }: { id: string }) {
    return await this.db.books.delete(id);
  }

  async getBooksByFolder({ folderId }: { folderId: string }) {
    return await this.db.books.where("parentId").equals(folderId).toArray();
  }

  async isBookSaved({ id }: { id: string }): Promise<boolean> {
    const localBook = await this.db.books.get(id);
    return !!localBook;
  }
}

const localBookModel = new LocalBookModel(db);

export default localBookModel;
