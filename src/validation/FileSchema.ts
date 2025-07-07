import z from "zod";

const FileSchema = z.object({
  filename: z.string(),
  size: z.bigint(),
  content_type: z.string(),
  metadata: z.object({
    tags: z.string(),
  }),
});

export default FileSchema;
