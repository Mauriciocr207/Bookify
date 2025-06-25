import { Metadata } from "next";
import Form from "./components/Form";

export const metadata: Metadata = {
  title: "Comparte tus libros",
  description: "Sube y comparte tus libros con la comunidad",
};

export default function Page() {
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl text-blue-night font-bold text-center">
          Comparte tus nuevos libros con los demás
        </h2>
        <span className="text-base text-blue-night font-extralight w-[385px] text-center">
          Puedes subir nuevos libros para que otros puedan leerlos.{" "}
        </span>
      </div>
      <Form />
    </div>
  );
}