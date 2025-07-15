import { BookSavedInterface } from "@interfaces";
import db, { DexieDBInteface } from "./DexieDB";

class LocalBookModel {
  db: DexieDBInteface;

  constructor(db: DexieDBInteface) {
    this.db = db;
  }
  
  async saveBook(book: BookSavedInterface) {
    return await this.db.books.add(book);
  }

  async deleteBook(id: string) {
    return await this.db.books.delete(id);
  }
}

const localBookModel = new LocalBookModel(db);

export default localBookModel;
