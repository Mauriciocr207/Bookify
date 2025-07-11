"use client";

import { useEffect } from "react";
import getPdfJS from "@libs/pdfjs";

const getImageFromPdf = async (file: File) => {
  const pdfjs = await getPdfJS();
  if (!pdfjs) return null;
  const blobUrl = URL.createObjectURL(file);
  console.log(blobUrl);
  return await pdfjs
    .getDocument(blobUrl)
    .promise.then((pdf) => pdf.getPage(1))
    .then((page) => console.log(page));
};

export default function usePDF(file: File | null) {
  useEffect(() => {
    if (file) {
      (async () => {
        await getImageFromPdf(file);
      })();
    }
  }, [file]);
}
