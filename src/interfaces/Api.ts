interface BaseRequest {
  uuid: string;
}

interface BaseResponse {
  error?: string;
}

export interface UploadFileResponse extends BaseResponse {
  url?: string;
  uuid?: string;
}

export interface UploadMultipartFileResponse extends BaseResponse {
  urls?: string[];
  uploadId?: string;
  uuid?: string;
}

export interface UploadPart {
  ETag: string;
  PartNumber: number;
}

export interface UploadMultipartFileCompleteRequest extends BaseRequest {
  uploadId: string;
  parts: UploadPart[];
}

export interface UploadMultipartFileCancelRequest extends BaseRequest {
  uploadId: string;
}

export type UploadFileDeleteRequest = BaseRequest;
