import { GetBookResponse } from "@app-types/responses";
import getBooks from "@server/books/getBooks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetBookResponse>> {
  try {
    const params = request.nextUrl.searchParams;
    const page = parseInt(params.get("page") || "1", 10);
    const search = params.get("search") || "";
    const getTagParam = params.get("tags");
    const tags = getTagParam
      ? getTagParam.split(",").filter((tag) => tag.trim() !== "")
      : [];
    const { books, pagination, error } = await getBooks({
      page,
      filter: { search, tags },
    });

    return NextResponse.json(
      {
        error,
        books,
        pagination,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        books: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        },
      },
      { status: 500 }
    );
  }
}
