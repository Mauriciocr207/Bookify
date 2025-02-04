import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { KeyboardEvent } from "@react-types/shared";

interface Props {
  header: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputDefaultValue?: string;
  onSubmitForm: (inputValue: string) => void;
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmitBtnText: string;
  placement?:
    | "bottom"
    | "center"
    | "auto"
    | "top"
    | "top-center"
    | "bottom-center"
    | undefined;
}

export default function ModalFolderForm(props: Props) {
  const {
    header,
    inputLabel,
    inputPlaceholder,
    inputDefaultValue = "",
    onSubmitForm,
    isOpen,
    onOpenChange,
    onSubmitBtnText,
    placement,
  } = props;
  const [inputValue, setInputValue] = useState(inputDefaultValue);

  useEffect(() => {
    console.log(inputValue);
  }, [inputDefaultValue]);

  const handleSubmit = () => {
    onSubmitForm(inputValue);
  };

  return (
    <Modal
      isOpen={isOpen}
      placement={placement}
      onOpenChange={onOpenChange}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{header}</ModalHeader>
            <ModalBody>
              <Input
                label={inputLabel}
                placeholder={inputPlaceholder}
                type="text"
                variant="underlined"
                autoFocus
                defaultValue={inputDefaultValue}
                value={inputValue}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e: KeyboardEvent) =>
                  e.key === "Enter" && handleSubmit()
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cerrar
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                {onSubmitBtnText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
