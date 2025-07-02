import { Button } from "@heroui/react";
import { FileUploadConfig } from "@libs";
import { FileUploader } from "@models";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { HiOutlineUpload } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

interface FileCardProps {
  file: File;
  onDeleteFile: () => void;
}

const { maxFileSize } = FileUploadConfig;

export default function FileCard({ file, onDeleteFile }: FileCardProps) {
//   const [isLoading, setIsLoading] = useState(false);

  const handleProcessFileWithChunks = async () => {
    try {
      if (file.size <= maxFileSize) {
        await FileUploader.uploadFile(file);
      }

      if (file.size > maxFileSize) {
        await FileUploader.uploadMultipartFile(file, (progress) => {
            console.log("progress ", progress);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFile = () => {
    onDeleteFile();
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
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="bg-gray p-4 rounded-lg overflow-hidden w-[400px] asbolute"
      key={`file-box`}
    >
      <div className="flex justify-between gap-4">
        <Button
          isIconOnly
          onPress={handleDeleteFile}
          variant="ghost"
          className="border-white text-white rounded-full"
        >
          <IoClose className="w-5 h-5" />
        </Button>
        <div className="text-white font-semibold flex flex-col justify-center text-tiny w-full overflow-hidden text-nowrap">
          <p className="w-full truncate">{file.name}</p>
          <span className="text-[9px]">{formattedFileSize}</span>
        </div>
        <Button
          isIconOnly
          onPress={handleProcessFileWithChunks}
          variant="ghost"
          className="border-white text-white rounded-full"
        >
          <HiOutlineUpload className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
