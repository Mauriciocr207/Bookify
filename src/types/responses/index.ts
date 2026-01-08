import { BookCard } from "@app-types/models/BookCard";
import { Category } from "@app-types/models/Category";

export interface UploadFileResponse {
  error?: string;
  url: string | null;
  uuid: string | null;
}

export interface UploadMultipartFileResponse {
  error?: string;
  urls: string[] | null;
  uploadId: string | null;
  uuid: string | null;
}

export interface CreateBookFormValuesResponse {
  error: string | null;
}

export interface GetBookResponse extends GetBookByIdResponse {
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface GetBookByIdResponse {
  error?: string;
  books: BookCard[];
}

export interface GetCategoriesResponse {
    error?: string;
    categories: Category[];
}


