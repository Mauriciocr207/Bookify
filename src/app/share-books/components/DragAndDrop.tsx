import { DragEventHandler, useCallback, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { useFollowPointer } from "../hooks/useFollowPointer";
import ArrowDownIcon from "@components/icons/ArrowDownIcon";
import { CloudIcon, GoogleDriveIcon } from "@components/icons";
import { Button } from "@heroui/react";
import { IoClose } from "react-icons/io5";
import { HiOutlineUpload } from "react-icons/hi";

type onDropEvent = (
  acceptedFiles: File[],
  fileRejections: FileRejection[]
) => void;

export default function DragAndDrop() {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const { x, y } = useFollowPointer(dropAreaRef);
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDropEvent: onDropEvent = (acceptedFiles) => {
    setIsDragActive(false);
    if (acceptedFiles) {
      setFile(acceptedFiles[0]);
    }
  };

  const isUserOver: DragEventHandler<HTMLDivElement> = (e) => {
    if (dropAreaRef.current) {
      const {
        left: x1,
        width,
        top: y1,
        height,
      } = dropAreaRef.current.getBoundingClientRect();

      setIsDragActive(
        x1 < e.clientX &&
          e.clientX < x1 + width &&
          y1 < e.clientY &&
          e.clientY < y1 + height
      );
    }
  };

  const onDrop = useCallback(onDropEvent, []);

  const { getInputProps, getRootProps, open } = useDropzone({
    noClick: true,
    accept: { "application/pdf": [".pdf"] },
    preventDropOnDocument: true,
    onDragEnter: isUserOver,
    onDragLeave: isUserOver,
    onDrop,
  });

  const onDeleteFile = () => {
    setFile(null);
  };

  return (
    <div
      {...getRootProps()}
      ref={dropAreaRef}
      className={`
        relative h-[300px] border-[2px] border-dashed rounded-lg mt-3 flex items-center justify-center bg-transparent overflow-hidden
        ${isDragActive ? "border-blue-light-2" : "border-gray-2 "}
      `}
      onMouseOver={(e) => e.stopPropagation()}
    >
      <input {...getInputProps()} key="input" />
      <AnimatePresence>
        <motion.div
          drag
          className={`absolute w-28 h-28 bg-blue-light-2/20 rounded-full pointer-events-none ${
            !isDragActive ? "hidden" : ""
          }`}
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          key={`circle-${isDragActive}`}
        />
      </AnimatePresence>
      <div
        className="flex flex-col items-center justify-center w-fit h-fit top-0 bottom-0 left-0 right-0 m-auto"
        key="content-box"
      >
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="animate-bounce pointer-events-none text-blue-light-2 absolute"
              key={`drop-arrow-${isDragActive}`}
            >
              <ArrowDownIcon />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {!file && !isDragActive && (
            <motion.div
              initial={{ opacity: 0, transform: "translateY(+70px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-70px)" }}
              className={`${
                isDragActive ? "pointer-events-none" : ""
              } flex flex-col items-center justify-center absolute`}
              key={`content-${isDragActive}`}
            >
              <CloudIcon />
              <p className="text-sm">
                Arrastra y suelta aquí o{" "}
                <span
                  className="filepond--label-action cursor-pointer underline "
                  onClick={open}
                >
                  Selecciona
                </span>
              </p>
              <Button
                id="google-drive-button"
                className="border border-gray-light w-12 h-10 rounded-md flex items-center justify-center mt-2 cursor-pointer"
                onPress={() => console.log("buscando con google")}
                variant="light"
                isIconOnly
              >
                <GoogleDriveIcon />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {file && !isDragActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="bg-gray p-4 rounded-lg overflow-hidden w-[400px] asbolute"
              key={`file-box-${isDragActive}`}
            >
              <div className="flex justify-between gap-4">
                <Button
                  isIconOnly
                  onPress={onDeleteFile}
                  variant="ghost"
                  className="border-white text-white rounded-full"
                >
                  <IoClose className="w-5 h-5" />
                </Button>
                <div className="text-white font-semibold flex flex-col justify-center text-tiny w-full overflow-hidden text-nowrap">
                  <p className="w-full truncate">{file.name}</p>
                  <span className="text-[9px]">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
                <Button
                  isIconOnly
                  onPress={() => console.log("subiendo")}
                  variant="ghost"
                  className="border-white text-white rounded-full"
                >
                  <HiOutlineUpload className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
