export default interface FolderInterface {
  id: string;
  parentId: string | "root";
  name: string;
}