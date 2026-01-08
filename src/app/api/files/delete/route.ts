import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { UploadFileDeleteRequest } from "../../../../types";
import R2Client from "@server/cloudflare/R2Client";

import { NextRequest, NextResponse } from "next/server";

const { R2_BUCKET_NAME } = process.env;

export async function DELETE(req: NextRequest) {
  try {
    const { uuid, previewUUID }: UploadFileDeleteRequest = await req.json();

    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: R2_BUCKET_NAME,
      Delete: {
        Objects: [{ Key: `tmp/${uuid}` }, { Key: `tmp/${previewUUID}` }],
        Quiet: false,
      },
    });

    const metadata = await R2Client.send(deleteObjectsCommand);

    return NextResponse.json({ metadata });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
