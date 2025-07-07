import z from "zod";
// import FileSchema from "./FileSchema";
import TagSchema from "./TagSchema";

const CreateBookSchema = z.object({
    title: z.string().nonempty("El título es requerido"),
    author: z.string().nonempty("El autor es requerido"),
    // categoryId: z.number().int().min(1, "Categoría inválida"),
    // file: FileSchema,
    tags: z.array(TagSchema).optional()
});

export default CreateBookSchema;