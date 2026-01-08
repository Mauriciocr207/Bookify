import { NextRequest, NextResponse } from "next/server";

const ValidFileTypes = ["application/pdf", "image/webp", "image/jpeg"];

export default function ValidateUploadFileMiddleware(req: NextRequest) {
  const uploadLengthHeader = req.headers.get("x-upload-length");
  const fileTypeHeader = req.headers.get("x-type");
  const contentTypeHeader = req.headers.get("Content-Type");

  if (
    !uploadLengthHeader ||
    contentTypeHeader !== "application/json" ||
    !fileTypeHeader ||
    !ValidFileTypes.includes(fileTypeHeader)
  ) {
    return NextResponse.json({ error: "Invalid Headers" }, { status: 400 });
  }

  const uploadLength = parseInt(uploadLengthHeader);

  if (isNaN(uploadLength)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  return NextResponse.next();
}
