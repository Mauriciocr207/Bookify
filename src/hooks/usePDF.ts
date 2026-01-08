import { useEffect, useState } from "react";

export default function usePDF() {
  const [pdfjs, setPdfjs] = useState<typeof import("pdfjs-dist") | null>(null);

  useEffect(() => {
    (async () => {
      const pdfjsLib = await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        window.location.origin + "/pdf.worker.min.mjs";

      setPdfjs(pdfjsLib);
    })();
  });

  return pdfjs;
}
