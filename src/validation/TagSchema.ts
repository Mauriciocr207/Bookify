import z from "zod";

const TagSchema = z.object({
  name: z.string()
})

export default TagSchema;