import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import slugify from "slugify";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const categoriesJson = path.join(__dirname, "categories.json");
  const raw = fs.readFileSync(categoriesJson, "utf-8");
  const categoryNames: string[] = JSON.parse(raw);

  const categories = categoryNames.map((name) => ({
    name,
    slug: slugify(name, { lower: true, strict: true }),
  }));

  await prisma.categories.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
