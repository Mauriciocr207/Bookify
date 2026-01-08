import { GetBookByIdResponse } from "@app-types/responses";
import getBooks from "@server/books/getBooks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetBookByIdResponse>> {
  try {
    const params = request.nextUrl.searchParams;
    const getIdsParam = params.get("ids");
    const ids = getIdsParam
      ? getIdsParam
          .split(",")
          .filter((id) => id.trim() !== "")
          .map(Number)
      : [];

    if(ids.length === 0) {
        return NextResponse.json({ books: [] }, { status: 200 });
    }

    const { error, books } = await getBooks({
      page: 1,
      filter: { ids },
    });

    return NextResponse.json({ error, books }, { status: 200 });
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
