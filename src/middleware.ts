import { NextRequest, NextResponse } from "next/server";
import {
  ValidateMultipartHeader,
  ValidateUploadFileMiddleware,
} from "./server/middlewares";

const ProcessUploadRoutes = [
  "/api/files/upload",
  "/api/files/upload/multipart/init",
];

const CompleteUploadRoutes = [
  "/api/files/upload/multipart/complete",
  "/api/files/upload/multipart/abort",
  "/api/files/delete",
];

export const config = {
  matcher: [
    "/api/files/:path*",
    "/api/files/upload/multipart/:path*",
    // "/api/categories",
  ],
};

export function middleware(req: NextRequest) {
  if (ProcessUploadRoutes.includes(req.nextUrl.pathname)) {
    return ValidateUploadFileMiddleware(req);
  }

  if (CompleteUploadRoutes.includes(req.nextUrl.pathname)) {
    return ValidateMultipartHeader(req);
  }

  return NextResponse.next();
}
