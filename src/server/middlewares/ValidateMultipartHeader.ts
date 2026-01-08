import { NextRequest, NextResponse } from "next/server";

export default function ValidateUploadFileMiddleware(req: NextRequest) {
  const contentTypeHeader = req.headers.get("content-type");

  if (contentTypeHeader != "application/json") {
    return NextResponse.json({ error: "Invalid Headers" }, { status: 400 });
  }

  return NextResponse.next();
}
