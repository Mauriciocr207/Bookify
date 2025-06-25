import { Chip, InputProps, useInput } from "@heroui/react";
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";

const styles = {
  label: "text-black/50 dark:text-white/90",
  input: [
    "bg-transparent",
    "text-black/90 dark:text-white/90",
    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
  ],
  innerWrapper: "bg-transparent",
  inputWrapper: [
    "bg-default-200/50",
    "dark:bg-default/60",
    "backdrop-blur-xl",
    "backdrop-saturate-200",
    "hover:bg-default-200/70",
    "focus-within:!bg-default-200/50",
    "dark:hover:bg-default/70",
    "dark:focus-within:!bg-default/60",
    "!cursor-text",
  ],
};

interface InputTagProps extends InputProps {
    onChangeTags?: (tags: string[]) => void;
}

export default function InputTag(props: InputTagProps) {
    const maxTags = 3;
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState("");
  const {
    Component,
    label,
    domRef,
    description,
    isClearable,
    startContent,
    endContent,
    shouldLabelBeOutside,
    shouldLabelBeInside,
    errorMessage,
    getBaseProps,
    getLabelProps,
    getInputProps,
    getInnerWrapperProps,
    getInputWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
    getClearButtonProps,
  } = useInput({
    ...props,
    // custom styles
    classNames: {
      ...styles,
    },
  });

  const labelContent = <label {...getLabelProps()}>{label}</label>;

  const end = useMemo(() => {
    if (isClearable) {
      return <span {...getClearButtonProps()}>{endContent}</span>;
    }

    return endContent;
  }, [isClearable, getClearButtonProps, endContent]);

  const onInput: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: text },
  }) => {
    const filteredText = text.replace(/[^a-z ]/g, "");
    let lastInput = filteredText;
    if (text.endsWith(",")) {
      const newTags = text.split(",").map((text) => text.trim());
      const cleanTags = newTags.filter((text) => text != "");
      lastInput = "";
      if(tags.length < maxTags) {
        setTags([...tags, ...cleanTags]);
      }
    }
    setText(lastInput);
  };

  const onDelete: KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (key == "Backspace" && text == "") {
      const [lastTag, ...restTags] = tags.toReversed();
      if(lastTag) {
        setTags(restTags.toReversed());
      }
      if(restTags) {
        setText(lastTag);
      }
    }
  };

  useEffect(() => {
    props.onChangeTags?.(tags);
  }, [tags])

  const innerWrapper = useMemo(
    () => (
      <div {...getInnerWrapperProps()} className="flex gap-1">
        {startContent && startContent}
        <div className="inline-flex gap-1">
          {tags.map((text, idx) => (
            <Chip
              size="sm"
              className="px-3.5 py-1 font-medium text-[10px] bg-blue-transparent/25 text-blue"
              key={idx}
            >
              {text}
            </Chip>
          ))}
        </div>
        <input
          {...getInputProps()}
          {...(tags.length > 0 ? { placeholder: "" } : {})}
          onChange={onInput}
          onKeyDown={onDelete}
          value={text}
        />
        {end && end}
      </div>
    ),
    [startContent, end, getInputProps, getInnerWrapperProps, tags]
  );

  return (
    <Component {...getBaseProps()}>
      {shouldLabelBeOutside ? labelContent : null}
      <div
        tabIndex={0}
        {...getInputWrapperProps()}
        role="button"
        onClick={() => {
          domRef.current?.focus();
        }}
        onKeyDown={() => {
          domRef.current?.focus();
        }}
      >
        {shouldLabelBeInside ? labelContent : null}
        {innerWrapper}
      </div>
      {description && <div {...getDescriptionProps()}>{description}</div>}
      {errorMessage && <div {...getErrorMessageProps()}>{errorMessage}</div>}
    </Component>
  );
}
