import BookInterface from "./BookInterface";

export default interface BookSavedInterface extends BookInterface {
  parentId: string;
}