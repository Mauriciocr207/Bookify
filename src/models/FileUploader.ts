import { FileUploadConfig } from "@config";
import {
  UploadFileResponse,
  UploadMultipartFileResponse,
  UploadPart,
} from "@interfaces";

const { maxFileSize } = FileUploadConfig;

type UploadProgressHandler = (progress: number) => void;

export default class FileUploaderApi {
  private apiUrls = {
    upload: "api/files/upload",
    uploadMultipartInit: "api/files/upload/multipart/init",
    uploadMultipartComplete: "api/files/upload/multipart/complete",
    uploadMultipartAbort: "api/files/upload/multipart/abort",
    delete: "api/files/delete",
  };
  private abortController: AbortController | null;
  uuid: string | null;
  private uploadId: string | null;

  constructor() {
    this.abortController = null;
    this.uuid = null;
    this.uploadId = null;
  }

  async uploadFile(file: File, onUploadProgress: UploadProgressHandler) {
    this.createAbortController();
    onUploadProgress(0);
    const { url, error, uuid } = await this.processFile<UploadFileResponse>(
      this.apiUrls.upload,
      file
    );

    onUploadProgress(50);

    if (error) throw new Error(error);
    if (!url || typeof url != "string" || !uuid)
      throw new Error("Ocurrió un error, inténtalo de nuevo más tarde");

    const arrayBuffer = await file.arrayBuffer();

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      body: arrayBuffer,
      signal: this.abortController?.signal,
    });

    if (response.status !== 200)
      throw new Error("Ocurrió un error, inténtalo de nuevo más tarde");

    onUploadProgress(100);

    this.uuid = uuid;
  }

  async uploadMultipartFile(
    file: File,
    onUploadProgress: UploadProgressHandler
  ) {
    this.createAbortController();
    onUploadProgress(0);
    const { urls, uploadId, uuid, error } =
      await this.processFile<UploadMultipartFileResponse>(
        this.apiUrls.uploadMultipartInit,
        file
      );

    const numberOfParts = (urls?.length || 0) + 2;
    const calculateProgress = (part: number) => (part / numberOfParts) * 100;

    onUploadProgress(calculateProgress(1));

    if (error) throw new Error(error);
    if (!urls || !Array.isArray(urls) || !uploadId || !uuid)
      throw new Error("Ocurrió un error, inténtalo de nuevo más tarde");

    this.uuid = uuid;
    this.uploadId = uploadId;

    const parts: UploadPart[] = [];

    for (let i = 0; i < urls.length; i++) {
      const chunk = file.slice(maxFileSize * i, maxFileSize * (i + 1));
      const arrayBuffer = await chunk.arrayBuffer();
      const response = await fetch(urls[i], {
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        body: arrayBuffer,
        signal: this.abortController?.signal,
      });

      if (response.status != 200) {
        throw new Error("Ocurrió un error al subir el archivo");
      }

      const ETag = response.headers.get("Etag") || "";

      if (!ETag) throw new Error("Ocurrió un error al subir el archivo");

      const part: UploadPart = { ETag, PartNumber: i + 1 };

      parts.push(part);
      onUploadProgress(calculateProgress(i + 2));
    }

    const response = await fetch(this.apiUrls.uploadMultipartComplete, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uploadId, uuid, parts }),
      signal: this.abortController?.signal,
    });

    if (response.status !== 200) {
      throw new Error("Ocurrió un error, inténtalo de nuevo más tarde");
    }

    onUploadProgress(calculateProgress(numberOfParts));

    return uuid;
  }

  abortUploadFile() {
    this.abortController?.abort();
  }

  async deleteFile() {
    if (this.uuid) {
      await fetch(this.apiUrls.delete, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: this.uuid,
        }),
      });
    }
    this.uuid = null;
  }

  private async processFile<T>(url: string, file: File): Promise<T> {
    return (
      await fetch(url, {
        method: "POST",
        headers: {
          "X-Upload-Length": file.size.toString(),
          "Content-Type": "application/json",
        },
        signal: this.abortController?.signal,
      })
    ).json();
  }

  private async abortUpload() {
    await fetch(this.apiUrls.uploadMultipartAbort, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uploadId: this.uploadId,
        uuid: this.uuid,
      }),
    });
  }

  private createAbortController() {
    this.abortController = new AbortController();
    this.abortController.signal.addEventListener(
      "abort",
      () => this.abortUpload
    );
  }
}
