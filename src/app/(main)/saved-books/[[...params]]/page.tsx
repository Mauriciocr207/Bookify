import { Metadata } from "next";
import { FilesPanel } from "./components";

export const metadata: Metadata = {
  title: "Tus libros guardados",
  description: "Organiza tus libros aquí",
};

export default async function Page() {
  return (
    <main>
      <FilesPanel />
    </main>
  );
}
