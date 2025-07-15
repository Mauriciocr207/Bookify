import { CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { UploadMultipartFileCompleteRequest } from "@interfaces";
import R2Client from "@server/cloudflare/R2Client";

import { NextRequest, NextResponse } from "next/server";

const { R2_BUCKET_NAME } = process.env;

export async function POST(req: NextRequest) {
  try {
    const {
      uploadId: UploadId,
      uuid,
      parts,
    }: UploadMultipartFileCompleteRequest = await req.json();

    if (typeof UploadId != "string") {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const Key = `tmp/${uuid}`;

    const completeMultipartCommand = new CompleteMultipartUploadCommand({
      Bucket: R2_BUCKET_NAME,
      UploadId,
      Key,
      MultipartUpload: {
        Parts: parts.map(({ ETag, PartNumber }) => ({
          ETag,
          PartNumber,
        })),
      },
    });

    const metadata = await R2Client.send(completeMultipartCommand);

    return NextResponse.json({ metadata });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
