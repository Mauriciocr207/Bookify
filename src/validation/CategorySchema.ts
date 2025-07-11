import z from "zod";

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export default CategorySchema;
