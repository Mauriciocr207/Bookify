import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadFileResponse } from "@interfaces";
import { FileUploadConfig } from "@config";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import R2Client from "@server/cloudflare/R2Client";

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

    const Key = randomUUID();

    const putObjectCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key,
    });

    const url = await getSignedUrl(R2Client, putObjectCommand, {
      expiresIn: 60,
    });

    return NextResponse.json({ url, uuid: Key }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
