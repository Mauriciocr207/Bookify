import { Metadata } from "next";
import { FilesPanel } from "./components";

export const metadata: Metadata = {
  title: "Tus libros guardados",
  description: "Organiza tus libros aquí",
};

export default async function Page({
  params,
}: {
  params: Promise<{ params: string[] } | undefined>;
}) {
  const parentId = (await params)?.params?.[0] || "root";
  return (
    <main>
      <FilesPanel parentId={parentId} />
    </main>
  );
}
