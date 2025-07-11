"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RenderTask } from "pdfjs-dist";
import { usePDF } from "@hooks";

interface ImageFromPdfProps {
  file: File | null;
  onBeginConvertion: () => void;
  onFinishConvertion: () => void;
  height: number;
}

export default function ImageFromPdf({
  file,
  onBeginConvertion,
  onFinishConvertion,
  height,
}: ImageFromPdfProps) {
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
      onBeginConvertion();
      if (!pdfjs) return;

      const blobUrl = URL.createObjectURL(file);
      const pdf = await pdfjs.getDocument(blobUrl).promise;
      const page = await pdf.getPage(1);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      renderTask = page.render({
        canvasContext: context,
        viewport,
      });

      await renderTask.promise;
      onFinishConvertion();
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
      style={{ height, transitionDuration: "300ms" }}
    >
      <canvas ref={canvasRef} className={`w-full absolute top-0`} />
    </motion.div>
  );
}
