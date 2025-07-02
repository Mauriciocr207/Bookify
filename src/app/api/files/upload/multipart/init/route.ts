import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadMultipartFileResponse } from "@interfaces";
import { FileUploadConfig, R2Client } from "@libs";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

const { R2_BUCKET_NAME } = process.env;
const { maxFileSize } = FileUploadConfig;

export async function POST(
  req: NextRequest
): Promise<NextResponse<UploadMultipartFileResponse>> {
  try {
    const uploadLength = parseInt(req.headers.get("x-upload-length") || "");

    if (uploadLength < maxFileSize) {
      return NextResponse.json(
        { error: "Bad request, the file size is too small" },
        { status: 400 }
      );
    }

    const Key = randomUUID();

    const { UploadId } = await R2Client.send(
      new CreateMultipartUploadCommand({
        Bucket: R2_BUCKET_NAME,
        Key,
      })
    );

    const uploadParts = Math.ceil(uploadLength / maxFileSize);

    const partNumbers = Array.from({ length: uploadParts }).map(
      (_, i) => i + 1
    );

    const getSignedUrlsRequests = partNumbers.map((PartNumber) => {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: R2_BUCKET_NAME,
        Key,
        UploadId,
        PartNumber,
      });
      return getSignedUrl(R2Client, uploadPartCommand, { expiresIn: 3600 });
    });

    const urls = await Promise.all(getSignedUrlsRequests);

    return NextResponse.json({ urls, UploadId, Key }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
