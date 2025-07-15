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
  private uploadId: string | null;
  uuid: string | null;
  previewUUID: string | null;
  progressUploader: ProgressUploader;

  constructor(onUploadProgress: UploadProgressHandler) {
    this.abortController = null;
    this.uuid = null;
    this.previewUUID = null;
    this.uploadId = null;
    this.progressUploader = new ProgressUploader(onUploadProgress);
  }

  async uploadFile(file: Blob, preview: Blob) {
    this.createAbortController();
    this.progressUploader.initSteps(4);

    await this.uploadSingleBlob(preview, (uuid) => {
      this.previewUUID = uuid;
    });
    await this.uploadSingleBlob(file, (uuid) => {
      this.uuid = uuid;
    });
  }

  private async uploadSingleBlob(
    blob: Blob,
    onProcessBlob: (uuid: string) => void
  ) {
    const { error, uuid, url } = await this.processFile<UploadFileResponse>(
      this.apiUrls.upload,
      blob
    );

    if (error) throw new Error(error);
    if (!uuid || !url)
      throw new Error("Ocurrió un error, inténtalo de nuevo más tarde");

    onProcessBlob(uuid);

    this.progressUploader.update();

    const arrayBuffer = await blob.arrayBuffer();

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": blob.type },
      body: arrayBuffer,
      signal: this.abortController?.signal,
    });

    if (response.status !== 200)
      throw new Error("Ocurrió un error, inténtalo de nuevo más tarde");

    this.progressUploader.update();

    return uuid;
  }

  private async processFile<T>(url: string, file: Blob): Promise<T> {
    return (
      await fetch(url, {
        method: "POST",
        headers: {
          "X-Upload-Length": file.size.toString(),
          "X-Type": file.type,
          "Content-Type": "application/json",
        },
        signal: this.abortController?.signal,
      })
    ).json();
  }

  async uploadMultipartFile(file: Blob, preview: Blob) {
    this.createAbortController();
    const numberOfParts = Math.ceil(file.size / maxFileSize) + 4;

    this.progressUploader.initSteps(numberOfParts);

    await this.uploadSingleBlob(preview, (previewUUID) => {
      this.previewUUID = previewUUID;
    });

    const { urls, uploadId, uuid, error } =
      await this.processFile<UploadMultipartFileResponse>(
        this.apiUrls.uploadMultipartInit,
        file
      );

    if (error) throw new Error(error);
    if (!urls || !Array.isArray(urls) || !uploadId || !uuid)
      throw new Error("Ocurrió un error, inténtalo de nuevo más tarde");

    this.uuid = uuid;
    this.uploadId = uploadId;

    this.progressUploader.update();

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
      this.progressUploader.update();
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

    this.progressUploader.update();
  }

  async deleteFile() {
    if(this.uuid && this.previewUUID) {
        await fetch(this.apiUrls.delete, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: this.uuid,
            previewUUID: this.previewUUID,
          }),
        });
    }
    this.uuid = null;
    this.previewUUID = null;
  }

  abortUploadFile() {
    this.abortController?.abort();
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
        previewUUID: this.previewUUID,
      }),
    });
  }

  private createAbortController() {
    this.abortController = new AbortController();
    this.abortController.signal.addEventListener(
      "abort",
      /**
       * Usamos () => this.abortUpload para
       * preservar el valor de this dentro
       * de la clase
       */
      () => this.abortUpload()
    );
  }
}

class ProgressUploader {
  percentages: Array<number>;
  index: number;
  onUploadProgress: UploadProgressHandler;

  constructor(onUploadProgress: UploadProgressHandler) {
    this.percentages = [];
    this.index = 0;
    this.onUploadProgress = onUploadProgress;
  }

  initSteps(numberOfSetps: number) {
    this.index = 0;
    const percentageParts = Array.from({ length: numberOfSetps })
      .map((_, part) => (part / numberOfSetps) * 100)
      .concat(100);
    this.percentages = percentageParts;
    this.update();
  }

  update() {
    this.onUploadProgress(this.percentages[this.index]);
    this.index = this.index + 1;

    if (this.index === this.percentages.length) {
      this.index = 0;
    }
  }
}
