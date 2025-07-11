import { FileUploadConfig } from "@config";
import { Button } from "@heroui/react";
import { FileUploader } from "@models";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { HiOutlineUpload } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import CircleProgressBar from "./CircleProgressBar";
import ImageFromPdf from "./ImageFromPdf";

interface FileCardProps {
  file: File;
  onDeleteFile: () => void;
  handleUpdateUUID: (uuid: string | null) => void;
}

const { maxFileSize } = FileUploadConfig;

export default function FileCard({
  file,
  onDeleteFile,
  handleUpdateUUID,
}: FileCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [loader, setLoader] = useState(0);
  const [hoverCancelUpload, setHoverCancelUpload] = useState(false);
  const fileUploader = useRef(new FileUploader());
  const [height, setHeight] = useState<0 | 223>(0);

  const handleProcessFile = async () => {
    try {
      setIsLoading(true);

      if (file.size <= maxFileSize) {
        await fileUploader.current.uploadFile(file, setLoader);
      }

      if (file.size > maxFileSize) {
        await fileUploader.current.uploadMultipartFile(file, setLoader);
      }

      setIsLoading(false);
      setIsUploaded(true);

      const uuid = fileUploader.current.uuid;
      if (uuid) handleUpdateUUID(uuid);
    } catch (error) {
      setIsLoading(false);
      setLoader(0);
      handleUpdateUUID(null);
      console.log(error);
    }
  };

  const handleDeleteFile = () => {
    fileUploader.current.deleteFile();
    handleUpdateUUID(null);
    onDeleteFile();
  };

  const handleCancelUpload = () => {
    handleUpdateUUID(null);
    fileUploader.current.abortUploadFile();
  };

  const formattedFileSize = useMemo((): string => {
    const fileSize = file.size;
    const mbSize = 1024 * 1024;
    if (fileSize > mbSize) {
      return `${(fileSize / mbSize).toFixed(2)} MB`;
    }
    const kbSize = 1024;
    if (fileSize > kbSize) {
      return `${(fileSize / kbSize).toFixed(2)} KB`;
    }
    return `${fileSize} Bytes`;
  }, [file]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.25 } }}
      className={`rounded-lg overflow-hidden w-[400px] relative transition-height border ${
        height === 0 ? "h-[73px]" : "h-[223px]"
      }`}
      style={{ transitionDuration: "300ms" }}
      key={`file-box`}
    >
      <ImageFromPdf
        file={file}
        height={height}
        onBeginConvertion={() => setHeight(0)}
        onFinishConvertion={() => setHeight(223)}
      />
      <motion.div className="flex justify-between p-4 h-[73px] bg-gray/90 absolute w-full bottom-0">
        <AnimatePresence initial={false}>
          {!isLoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, width: "0%", x: 0 }}
              animate={{ opacity: 1, width: "19%", x: 0 }}
              exit={{ opacity: 0, width: "0%", x: -10 }}
            >
              <Button
                key="close-button"
                isIconOnly
                onPress={handleDeleteFile}
                variant="ghost"
                className={`max-w-[10px] w-[10px] m-0 flex items-center ${
                  isLoading ? "pointer-events-none" : ""
                } border-white text-white rounded-full overflow-hidden`}
              >
                <IoClose className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="text-white font-semibold flex flex-col justify-center text-tiny w-full overflow-hidden text-nowrap mr-4">
          <p className="w-full truncate">{file.name}</p>
          <span
            className="text-[9px]"
            onClick={() => setHeight(height === 0 ? 223 : 0)}
          >
            {formattedFileSize}
          </span>
        </div>
        <div className="w-[45px] h-[41px]">
          <AnimatePresence initial={false}>
            {isLoading && (
              <Button
                isIconOnly
                variant="light"
                className="rounded-full"
                onMouseOver={() => setHoverCancelUpload(true)}
                onMouseLeave={() => setHoverCancelUpload(false)}
                onPress={handleCancelUpload}
              >
                <CircleProgressBar
                  progress={loader}
                  size={40}
                  render={(progress) => (
                    <AnimatePresence initial={false}>
                      {hoverCancelUpload ? (
                        <motion.div
                          className="w-full h-full flex items-center justify-center "
                          initial={{ y: +10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                        >
                          <IoClose className="w-6 h-6 text-white" />
                        </motion.div>
                      ) : (
                        <motion.p
                          className="text-[10px] font-semibold text-white"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: +10, opacity: 0 }}
                        >
                          {Math.round(progress)}%
                        </motion.p>
                      )}
                    </AnimatePresence>
                  )}
                />
              </Button>
            )}
            {!isLoading && !isUploaded && (
              <Button
                isIconOnly
                onPress={handleProcessFile}
                variant="ghost"
                className="border-white text-white rounded-full"
                as={motion.button}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <HiOutlineUpload className="w-5 h-5" />
              </Button>
            )}
            {!isLoading && isUploaded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  isIconOnly
                  variant="ghost"
                  className="border-white text-white rounded-full pointer-events-none"
                >
                  <FaCheck />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
