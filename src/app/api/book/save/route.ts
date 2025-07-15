import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import R2Client from "@server/cloudflare/R2Client";
import prisma from "@server/prisma/prisma";
import CreateBookSchema from "@validation/CreateBookSchema";
import { NextRequest, NextResponse } from "next/server";

const { R2_BUCKET_NAME } = process.env;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validation = CreateBookSchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const { data: book } = validation;

    const category = await prisma.category.findUnique({
      where: {
        slug: book.categorySlug,
      },
    });

    if (!category) throw new Error("La categoría es inválida");

    await moveFileAndImage(book.file.uuid, book.image.uuid);

    await prisma.$transaction(async (tx) => {
      const { file, image } = book;
      const createdFile = await tx.file.create({
        data: {
          uuid: file.uuid,
          filename: file.filename,
          size: file.size,
          content_type: file.content_type,
          path: `books/${file.uuid}`,
        },
      });
      const createdImage = await tx.file.create({
        data: {
          uuid: image.uuid,
          filename: image.filename,
          size: image.size,
          content_type: image.content_type,
          path: `books/${image.uuid}`,
        },
      });
      const createdBook = await tx.book.create({
        data: {
          title: book.title,
          author: book.author,
          fileid: createdFile.id,
          imageId: createdImage.id,
          categoryid: category?.id,
        },
      });

      return createdBook;
    });

    return NextResponse.json(null, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}

async function moveFileAndImage(fileUUID: string, previewUUID: string) {
  await R2Client.send(
    new CopyObjectCommand({
      Bucket: R2_BUCKET_NAME,
      CopySource: `${R2_BUCKET_NAME}/tmp/${fileUUID}`,
      Key: `books/${fileUUID}`,
    })
  );

  await R2Client.send(
    new CopyObjectCommand({
      Bucket: R2_BUCKET_NAME,
      CopySource: `${R2_BUCKET_NAME}/tmp/${previewUUID}`,
      Key: `images/${previewUUID}`,
    })
  );

  await R2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `tmp/${fileUUID}`,
    })
  );

  await R2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `tmp/${previewUUID}`,
    })
  );
}
