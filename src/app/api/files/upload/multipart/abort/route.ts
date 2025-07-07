import { AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import { UploadMultipartFileCancelRequest } from "@interfaces";
import R2Client from "@server/cloudflare/R2Client";

import { NextRequest, NextResponse } from "next/server";

const { R2_BUCKET_NAME } = process.env;

export async function DELETE(req: NextRequest) {
  try {
    const { uploadId: UploadId, uuid: Key }: UploadMultipartFileCancelRequest =
      await req.json();

    if (typeof UploadId != "string") {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const abortMultipartCommand = new AbortMultipartUploadCommand({
      Bucket: R2_BUCKET_NAME,
      UploadId,
      Key,
    });

    const metadata = await R2Client.send(abortMultipartCommand);

    return NextResponse.json({ metadata });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
