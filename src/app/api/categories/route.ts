import prisma from "@server/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = (await prisma.categories.findMany()).map((category) => ({
      name: category.name,
      slug: category.slug,
      id: category.id.toString(),
    }));

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
