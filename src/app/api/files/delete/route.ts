import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { UploadFileDeleteRequest } from "@interfaces";
import R2Client from "@server/cloudflare/R2Client";

import { NextRequest, NextResponse } from "next/server";

const { R2_BUCKET_NAME } = process.env;

export async function DELETE(req: NextRequest) {
  try {
    const { uuid: Key }: UploadFileDeleteRequest = await req.json();

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key,
    });

    const metadata = await R2Client.send(deleteObjectCommand);

    return NextResponse.json({ metadata });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
