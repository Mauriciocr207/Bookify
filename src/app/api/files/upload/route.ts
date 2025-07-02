import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadFileResponse } from "@interfaces";
import { FileUploadConfig, R2Client } from "@libs";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

const { R2_BUCKET_NAME } = process.env;
const { maxFileSize } = FileUploadConfig;

export async function POST(
  req: NextRequest
): Promise<NextResponse<UploadFileResponse>> {
  try {
    const uploadLength = parseInt(req.headers.get("x-upload-length") || "");

    if (uploadLength > maxFileSize) {
      return NextResponse.json(
        { error: "Bad request, file size exceeded" },
        { status: 400 }
      );
    }

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: randomUUID(),
    });

    const url = await getSignedUrl(R2Client, command, { expiresIn: 60 });

    return NextResponse.json({ url }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
