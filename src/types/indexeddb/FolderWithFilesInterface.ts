import BookInterface from "./BookInterface";
import FolderInterface from "./FolderInterface";

export default interface FolderWithFilesInterface extends FolderInterface {
  folders: FolderInterface[];
  books: BookInterface[];
}