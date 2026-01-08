import CreateBookSchema from "@validation/CreateBookSchema";

export interface UploadPart {
  ETag: string;
  PartNumber: number;
}

export interface UploadMultipartFileCompleteRequest {
  uploadId: string;
  uuid: string | null;
  parts: UploadPart[];
}

export interface UploadMultipartFileCancelRequest {
  uploadId?: string;
  previewUUID: string;
}

export interface UploadFileDeleteRequest {
  previewUUID: string | null;
}

export type CreateBookFormValuesRequest = typeof CreateBookSchema._type;


