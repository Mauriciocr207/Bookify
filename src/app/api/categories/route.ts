import prisma from "@server/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = (await prisma.category.findMany()).map((category) => ({
      name: category.name,
      slug: category.slug,
    }));

    return NextResponse.json({ categories }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
