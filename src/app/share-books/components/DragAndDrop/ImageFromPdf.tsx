import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RenderTask } from "pdfjs-dist";
import { usePDF } from "@hooks";

interface ImageFromPdfProps {
  file: File | null;
  onImageReady: (image: Blob | null) => void;
}

export default function ImageFromPdf({
  file,
  onImageReady = () => {},
}: ImageFromPdfProps) {
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfjs = usePDF();

  useEffect(() => {
    if (!file || !canvasRef.current || !pdfjs) return;

    const canvas = canvasRef.current;
    canvas.width = 0;
    canvas.height = 0;
    const context = canvas.getContext("2d");
    if (!context) return;

    let renderTask: RenderTask;

    (async () => {
      if (!pdfjs) return;

      const blobUrl = URL.createObjectURL(file);
      const pdf = await pdfjs.getDocument(blobUrl).promise;
      const page = await pdf.getPage(1);

      const scale = 1;
      
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      renderTask = page.render({
        canvasContext: context,
        viewport,
      });

      await renderTask.promise;

      canvas.toBlob(
        (blob) => {
          setLoading(false);
          onImageReady(blob);
        },
        "image/webp",
        0.5
      );
    })();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [file, pdfjs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-h-[223px] overflow-hidden absolute bottom-0 transition-height"
      style={{ height: loading ? "0px" : "223px", transitionDuration: "300ms" }}
    >
      <canvas ref={canvasRef} className={`w-full absolute top-0`} />
    </motion.div>
  );
}
