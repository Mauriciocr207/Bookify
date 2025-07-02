interface BaseApi {
    error?: string
}

export interface UploadFileResponse extends BaseApi {
    url?: string
}

export interface UploadMultipartFileResponse extends BaseApi {
    urls?: string[]
    UploadId?: string
    Key?: string
}

export interface UploadPart {
    ETag: string,
    PartNumber: number
}

export interface UploadMultipartFileCompleteRequest {
  UploadId: string
  Key: string
  parts: UploadPart[];
}


