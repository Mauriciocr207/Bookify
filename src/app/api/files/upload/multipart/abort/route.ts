import {
  AbortMultipartUploadCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { UploadMultipartFileCancelRequest } from "../../../../../../types";
import R2Client from "@server/cloudflare/R2Client";

import { NextRequest, NextResponse } from "next/server";

const { R2_BUCKET_NAME } = process.env;

export async function DELETE(req: NextRequest) {
  try {
    const {
      uploadId: UploadId,
      uuid,
      previewUUID,
    }: UploadMultipartFileCancelRequest = await req.json();

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `tmp/${previewUUID}`,
    });

    const metadataPreview = await R2Client.send(deleteObjectCommand);

    if (!UploadId) {
      return NextResponse.json({ metadataPreview });
    }

    const abortMultipartCommand = new AbortMultipartUploadCommand({
      Bucket: R2_BUCKET_NAME,
      UploadId,
      Key: `tmp/${uuid}`,
    });

    const metadata = await R2Client.send(abortMultipartCommand);

    return NextResponse.json({ metadataPreview, metadata });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
