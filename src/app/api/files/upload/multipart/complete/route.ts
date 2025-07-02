import { CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { UploadMultipartFileCompleteRequest } from "@interfaces";
import { R2Client } from "@libs";
import { NextRequest, NextResponse } from "next/server";

const { R2_BUCKET_NAME } = process.env;

export async function POST(req: NextRequest) {
  try {
    const contentTypeHeader = req.headers.get("content-type");

    if (contentTypeHeader != "application/json") {
      return NextResponse.json({ error: "Invalid Headers" }, { status: 400 });
    }

    const { UploadId, Key, parts }: UploadMultipartFileCompleteRequest =
      await req.json();

    if (typeof UploadId != "string") {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

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

    const data = await R2Client.send(completeMultipartCommand);

    return NextResponse.json({ fileData: data });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
