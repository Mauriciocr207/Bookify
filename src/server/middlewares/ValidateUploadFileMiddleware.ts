import { NextRequest, NextResponse } from "next/server";

export default function ValidateUploadFileMiddleware(req: NextRequest) {
  const uploadLengthHeader = req.headers.get("x-upload-length");
  const contentTypeHeader = req.headers.get("Content-Type");

  if (!uploadLengthHeader || contentTypeHeader !== "application/json") {
    console.log(req.headers);
    console.log(uploadLengthHeader, contentTypeHeader);
    return NextResponse.json({ error: "Invalid Headers" }, { status: 400 });
  }

  const uploadLength = parseInt(uploadLengthHeader);

  if (isNaN(uploadLength)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  return NextResponse.next();
}
