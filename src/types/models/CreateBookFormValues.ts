import CreateBookSchema from "@validation/CreateBookSchema";

type CreateBookSchemaType = typeof CreateBookSchema._type;

export default interface CreateBookFormValues {
  title: string | null;
  author: string | null;
  categorySlug: string | null;
  file: CreateBookSchemaType["file"] | null;
  image: CreateBookSchemaType["image"] | null;
  tags: Array<{ name: string }> | null;
}
