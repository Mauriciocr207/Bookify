import { BookSavedInterface } from "@interfaces";
import db, { DexieDBInteface } from "./DexieDB";

class BookModel {
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

const indexedDatabase = new BookModel(db);

export default indexedDatabase;
