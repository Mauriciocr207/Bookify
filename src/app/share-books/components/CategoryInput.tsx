import { Button, Chip, Input } from "@heroui/react";
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useController, useFormContext } from "react-hook-form";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FaCheck } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { FormValues } from "./Form";

type CategorySchema = {
  name: string;
  slug: string;
};

interface CategoryWithSelected extends CategorySchema {
    selected: boolean;
}

const categoryFilter = (category: CategorySchema, text: string) => {
  const lowerText = text.toLowerCase();
  const categoryName = category.name.toLowerCase();
  const categorySlug = category.slug.toLowerCase();
  return categoryName.includes(lowerText) || categorySlug.includes(lowerText);
};

const fetchCategories = async (): Promise<CategorySchema[]> => {
  const {
    data: { categories },
  } = await axios.get<{ categories: CategorySchema[] }>("./api/categories");
  return categories;
};

export default function CategoryInput() {
  const { control } = useFormContext<FormValues>();
  const {
    field,
    formState: { errors, isDirty, isSubmitted },
  } = useController<FormValues>({
    name: "categorySlug",
    control,
  });
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const [localCategories, setLocalCategories] = useState<
    CategoryWithSelected[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryWithSelected[]
  >([]);
  const [open, setOpen] = useState(false);
  const openBtn = useRef<HTMLButtonElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (categories) {
      setLocalCategories(
        categories.map((cat) => ({
          ...cat,
          selected: false,
        }))
      );
    }
  }, [categories]);

  useEffect(() => {
    setOpen(editing);
  }, [editing]);

  useEffect(() => {
    if (!isDirty && isSubmitted) {
      setSelectedCategories([]);
      selectCategoryBySlug(null, false);
    }
  }, [isDirty, isSubmitted]);

  const handleSelectCategory = (category: CategoryWithSelected) => {
    const selectCategory = !category.selected;
    setText("");
    setSelectedCategories(selectCategory ? [category] : []);
    selectCategoryBySlug(category.slug, !category.selected);
    field.onChange(selectCategory ? category.slug : null);
  };

  const selectCategoryBySlug = (slug: string | null, selected: boolean) => {
    setLocalCategories(
      categories?.map((category) =>
        category.slug === slug
          ? { ...category, selected }
          : { ...category, selected: false }
      ) || []
    );
  };

  const onInput: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: text },
  }) => {
    if (selectedCategories.length === 0) {
      const filteredText = text.replace(/[^\p{L} ]/gu, "");
      setText(filteredText);
      setLocalCategories(
        categories
          ?.filter((c) => categoryFilter(c, filteredText))
          .map((c) => ({ ...c, selected: false })) || []
      );
    }
  };

  const onDelete: KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (key == "Backspace" && text == "") {
      const [lastCategory] = selectedCategories;
      if (lastCategory) {
        setText(lastCategory.name);
        setSelectedCategories([]);
        field.onChange(null);
        selectCategoryBySlug(null, false);
      }
    }
  };

  return (
    <div className="relative">
      <Input
        id="categoryId"
        type="text"
        aria-label="categoryId"
        isInvalid={!!errors.categorySlug}
        errorMessage={errors.categorySlug?.message}
        onFocusChange={setEditing}
        onKeyDown={onDelete}
        onInput={onInput}
        value={text}
        placeholder={
          selectedCategories.length === 0 && text === ""
            ? "Selecciona una categoría"
            : ""
        }
        classNames={{
          inputWrapper: `${
            errors.categorySlug && "bg-danger-50 hover:!bg-danger-100"
          }`,
          innerWrapper:
            "flex w-[calc(100%-25px)] gap-1 overflow-auto [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300",
          helperWrapper: "absolute -bottom-6 right-0",
        }}
        startContent={
          <div className="min-w-fit flex gap-1 overflow-auto">
            {selectedCategories.map((category) => (
              <Chip
                key={category.slug}
                size="sm"
                className="px-3.5 font-medium text-[10px] bg-blue-transparent/25 text-blue"
              >
                {category.name}
              </Chip>
            ))}
          </div>
        }
        endContent={
          <Button
            isIconOnly
            className="rounded-full absolute right-[5px]"
            variant="light"
            size="sm"
            ref={openBtn}
            onPress={() => setOpen(!open)}
          >
            <MdOutlineKeyboardArrowDown
              className={`${
                open ? "rotate-180" : "rotate-0"
              } transition-transform w-5 h-5 text-gray-night`}
            />
          </Button>
        }
      />
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute rounded-lg bg-white border border-gray/50 w-full mt-2 p-2 z-10 flex flex-col gap-1 origin-top max-h-[400px] overflow-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isLoading && (
              <div className="flex items-center justify-center p-2">
                <LuLoaderCircle className="animate-spin text-blue-night min-h-[25px] w-[25px]" />
              </div>
            )}
            {!isLoading && localCategories.length === 0 && (
              <span className="p-2 text-center text-gray-2 font-semibold text-sm">
                No se encontraron elementos
              </span>
            )}
            {!isLoading &&
              localCategories.map((category) => (
                <Button
                  className="w-full min-h-[35px] flex justify-between"
                  variant="light"
                  key={category.slug}
                  size="md"
                  onPress={() => handleSelectCategory(category)}
                >
                  <span>{category.name}</span>
                  <AnimatePresence>
                    {category.selected && (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.13 }}
                      >
                        <FaCheck className="text-blue-night" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
