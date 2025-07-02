import { NextRequest, NextResponse } from "next/server";
import ValidateUploadFileMiddleware from "./middlewares/ValidateUploadFileMiddleware";

export const config = {
  matcher: ["/api/files/upload", "/api/files/upload/multipart/init"],
};

const ProcessUploadRoutes = [
  "/api/files/upload",
  "/api/files/upload/multipart/init",
];

export function middleware(req: NextRequest) {
    if (ProcessUploadRoutes.includes(req.nextUrl.pathname)) {
        ValidateUploadFileMiddleware(req);
    }


    return NextResponse.next();
}
