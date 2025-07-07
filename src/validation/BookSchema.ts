import z from "zod";

const BookSchema = z.object({
  title: z.string().nonempty("El título es requerido"),
  author: z.string().nonempty("El autor es requerido"),
});

export default BookSchema;
