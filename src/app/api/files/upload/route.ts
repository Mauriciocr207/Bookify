import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileUploadConfig } from "@config";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import R2Client from "@server/cloudflare/R2Client";
import { UploadFileResponse } from "@app-types/responses";

const { R2_BUCKET_NAME } = process.env;
const { maxFileSize } = FileUploadConfig;

export async function POST(
  req: NextRequest
): Promise<NextResponse<UploadFileResponse>> {
  try {
    const uploadLength = parseInt(req.headers.get("x-upload-length") || "");
    const type = req.headers.get("x-type") || "";

    if (uploadLength > maxFileSize) {
      return NextResponse.json(
        { error: "Bad request, file size exceeded", url: null, uuid: null },
        { status: 400 }
      );
    }

    const uuid = randomUUID();
    const Key = `tmp/${uuid}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key,
      ContentType: type,
    });

    const url = await getSignedUrl(R2Client, putObjectCommand, {
      expiresIn: 60,
    });

    return NextResponse.json({ url, uuid }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error", url: null, uuid: null },
      { status: 500 }
    );
  }
}
