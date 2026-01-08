import { BookCard } from "@app-types/models/BookCard";
import { GetBookResponse } from "@app-types/responses";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Book, File } from "@prisma/client";
import R2Client from "@server/cloudflare/R2Client";
import prisma from "@server/prisma/prisma";
import { randomInt } from "crypto";

const { R2_BUCKET_NAME } = process.env;

type BookInfo = {
  book: Book;
  file: File;
  image: File;
};

type FilterBook = {
    search?: string;
    tags?: string[];
    ids?: number[];
};

export default async function getBooks({
  page,
  filter,
  pageSize = 5,
}: {
  page: number;
  pageSize?: number;
  filter: FilterBook
}): Promise<GetBookResponse> {
  try {
    const skip = (page - 1) * (pageSize || 0);
    const where = buildBookWhere(filter);

    const findManyOptions = {
      where,
      skip,
      include: {
        Category: true,
      },
      ...(pageSize ? { take: pageSize } : {}),
    };

    const [savedBooks, totalItems] = await prisma.$transaction([
      prisma.book.findMany(findManyOptions),
      prisma.book.count({ where }),
    ]);

    const infoBooks: BookInfo[] = [];

    for (const savedBook of savedBooks) {
      if (savedBook.fileid && savedBook.imageId) {
        const [file, image] = await Promise.all([
          prisma.file.findUnique({ where: { id: savedBook.fileid } }),
          prisma.file.findUnique({ where: { id: savedBook.imageId } }),
        ]);

        if (file && image) {
          infoBooks.push({
            book: savedBook,
            file,
            image,
          });
        }
      }
    }

    const books = await buildBookCard(infoBooks);

    return {
      books,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      books: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }
}

async function buildBookCard(booksInfoArray: BookInfo[]): Promise<BookCard[]> {
  const books: BookCard[] = [];
  for (const newBookCard of booksInfoArray) {
    if (
      newBookCard.file.path &&
      newBookCard.image.path &&
      newBookCard.book.title &&
      newBookCard.book.author
    ) {
      const getFileCommand = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: newBookCard.file.path,
      });
      const getImageCommand = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: newBookCard.image.path,
      });

      const fileUrl = await getSignedUrl(R2Client, getFileCommand, {
        expiresIn: 60 * 10,
      });
      const imageUrl = await getSignedUrl(R2Client, getImageCommand, {
        expiresIn: 60 * 10,
      });

      books.push({
        id: newBookCard.book.id,
        title: newBookCard.book.title,
        author: newBookCard.book.author,
        likes: randomInt(100),
        imageUrl,
        downloadUrl: fileUrl,
      });
    }
  }
  return books;
}

import { Prisma } from "@prisma/client";

function buildBookWhere(filter: FilterBook): Prisma.BookWhereInput {
  if (!filter || (!filter.search && !filter.tags && !filter.ids)) {
    return {};
  }

  const where: Prisma.BookWhereInput = {};

  if (filter?.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { author: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  if (filter?.tags && filter.tags.length > 0) {
    where.Category = {
      slug: { in: filter.tags },
    };
  }

  if(filter?.ids && filter.ids.length > 0) {
    where.id = { in: filter.ids };
  }

  return where;
}
