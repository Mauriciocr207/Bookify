import { GetCategoriesResponse } from "@app-types/responses";
import prisma from "@server/prisma/prisma";

export default async function getCategories(): Promise<GetCategoriesResponse> {
  try {
    const categories = await prisma.category.findMany();
    return { categories };
  } catch {
    return {
      error: "Error fetching categories",
      categories: [],
    };
  }
}
