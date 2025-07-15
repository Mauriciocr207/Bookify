import z from "zod";

const ImageSchema = z.object({
  filename: z.string().nonempty("El nombre del archivo es requerido"),
  uuid: z.string().uuid("Archivo inválido"),
  size: z.number().positive("Archivos sin peso no permitidos"),
  content_type: z.literal("image/webp", { message: "Archivo inválido, se acepta .pdf" }),
})

export default ImageSchema;
