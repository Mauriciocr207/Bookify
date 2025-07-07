import { NextRequest, NextResponse } from "next/server";

export default function ValidateUploadFileMiddleware(req: NextRequest) {
  const contentTypeHeader = req.headers.get("content-type");

  if (contentTypeHeader != "application/json") {
    console.log(contentTypeHeader);
    return NextResponse.json({ error: "Invalid Headers" }, { status: 400 });
  }

  console.log('ejecutando next');

  return NextResponse.next();
}
