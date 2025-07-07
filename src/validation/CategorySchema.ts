import z from "zod";

const CategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export default CategorySchema;
