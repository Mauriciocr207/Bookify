import z from "zod";

const TagSchema = z.object({
  name: z.string().optional()
});

export default TagSchema;