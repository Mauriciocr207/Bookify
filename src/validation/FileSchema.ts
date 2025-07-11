import z from "zod";

const FileSchema = z.object({
  filename: z.string().nonempty("El nombre del archivo es requerido"),
  uuid: z.string().uuid("Archivo inválido"),
  size: z.number().positive("Archivos sin peso no permitidos"),
  content_type: z.literal("application/pdf", { message: "Archivo inválido, se acepta .pdf" }),
}, { message: "El archivo es obligatorio" });

export default FileSchema;
