import { UploadFileResponse, UploadMultipartFileResponse, UploadPart } from "@interfaces";
import { FileUploadConfig } from "@libs";

const { maxFileSize } = FileUploadConfig;

export default class FileUploaderApi {
  private static apiUrls = {
    upload: "api/files/upload",
    uploadMultipartInit: "api/files/upload/multipart/init",
    uploadMultipartComplete: "api/files/upload/multipart/complete",
  };

  static async uploadFile(file: File) {
    const { url, error } = await this.processFile<UploadFileResponse>(
      this.apiUrls.upload,
      file
    );

    if (error) throw new Error(error);
    if (!url || typeof url != "string")
      throw new Error("Ocurrió un error, inténtalo de nuevo más tarde");

    const arrayBuffer = await file.arrayBuffer();

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      body: arrayBuffer,
    });

    console.log(response);
  }

  static async uploadMultipartFile(
    file: File,
    callback: (progress: number) => void
  ) {
    const { urls, UploadId, Key, error } =
      await this.processFile<UploadMultipartFileResponse>(
        this.apiUrls.uploadMultipartInit,
        file
      );

    if (error) throw new Error(error);
    if (!urls || !Array.isArray(urls))
      throw new Error("Ocurrió un error, inténtalo de nuevo más tarde");

    const parts: UploadPart[] = [];

    for (let i = 0; i < urls.length; i++) {
      const chunk = file.slice(maxFileSize * i, maxFileSize * (i + 1));
      const arrayBuffer = await chunk.arrayBuffer();
      const request = fetch(urls[i], {
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        body: arrayBuffer,
      });

      const response = await request;

      if (response.status != 200) {
        throw new Error("Ocurrió un error al subir el archivo");
      }

      const ETag = response.headers.get("Etag") || "";
      
      if (!ETag) throw new Error("Ocurrió un error al subir el archivo");
      
      const part: UploadPart = { ETag, PartNumber: i + 1 };

      parts.push(part);
    }

    const response = await fetch(this.apiUrls.uploadMultipartComplete, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ UploadId, Key, parts }),
    });

    console.log(response);
  }

  private static async processFile<T>(url: string, file: File): Promise<T> {
    return (
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Upload-Length": file.size.toString(),
        },
      })
    ).json();
  }
}
