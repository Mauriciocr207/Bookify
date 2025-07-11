import z from "zod";
import FileSchema from "./FileSchema";
import TagSchema from "./TagSchema";

const CreateBookSchema = z.object({
  title: z
    .string({ message: "El título es requerido" })
    .nonempty("El título es requerido"),
  author: z
    .string({ message: "El autor es requerido" })
    .nonempty("El autor es requerido"),
  categoryId: z
    .string({ message: "Se requiere una categoría" })
    .nonempty("Categoría inválida"),
  file: FileSchema,
  tags: z.array(TagSchema).optional(),
});

export default CreateBookSchema;
