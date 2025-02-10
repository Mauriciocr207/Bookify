"use client";

import { HeartIcon, BookmarkIcon, DownloadIcon } from "@components/icons";
import { BookInterface } from "@interfaces";
import { getImageProps } from "next/image";
import { getBackgroundImage } from "@utils";
import { Button, useDisclosure } from "@heroui/react";
import { useState } from "react";
import { useIconAnimate, useIconAnimateProps } from "@hooks";
import BookItemModal from "./BookItemModal";

const ANIMATE_CONFIG: useIconAnimateProps = {
  handlePressStartAnimation: {
    keyframes: { scale: 0.9 },
    options: { duration: 0.2 },
  },
  handlePressAnimation: {
    keyframes: { scale: [0.8, 1.1, 1] },
    options: { duration: 0.4, ease: "easeInOut" },
  },
};

interface Props {
  book: BookInterface;
  isSaved?: boolean;
}

export default function BookItem({ book, isSaved = false }: Props) {
  const disclosureHook = useDisclosure();
  const [bookSaved, setBookSaved] = useState(isSaved);
  const [isBookLiked, setIsBookLiked] = useState(false);

  const {
    scope: bookmarkScope,
    upAnimate: upAnimateBookmark,
    downAnimate: downAnimateBookmark,
  } = useIconAnimate(ANIMATE_CONFIG);
  const {
    scope: heartScope,
    // upAnimate: upAnimateHeart,
    downAnimate: downAnimateHeart,
  } = useIconAnimate(ANIMATE_CONFIG);
  const {
    props: { srcSet },
  } = getImageProps({
    src: book.imageUrl,
    width: 190,
    height: 290,
    alt: book.title,
  });
  const backgroundImage = getBackgroundImage(srcSet);

  function beginBookSave() {
    downAnimateBookmark();
    disclosureHook.onOpen();
  }

  function onSaveBook() {
    setBookSaved(true);
    upAnimateBookmark();
  }

  function onDeleteBook() {
    setBookSaved(false);
    upAnimateBookmark();
  }

  function handleBookLike() {
    downAnimateHeart();
    setIsBookLiked((prev) => !prev);
  }

  return (
    <div
      className="w-48 h-[290px] bg-cover bg-center rounded-xl overflow-hidden"
      style={{ backgroundImage }}
    >
      <div className="flex flex-col justify-end gap-2 w-full h-full px-3 pb-3 card-gradient">
        <h3 className="font-semibold text-white text-base text-center">
          {book.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              ref={bookmarkScope}
              variant="light"
              isIconOnly
              className="min-w-fit w-fit h-fit overflow-visible hover:bg-none"
              data-hover="false"
              disableAnimation
              onPressStart={beginBookSave}
            >
              <BookmarkIcon bold={bookSaved} />
            </Button>
            <Button
              variant="light"
              isIconOnly
              className="min-w-fit w-fit h-fit overflow-visible"
              data-hover="false"
            >
              <DownloadIcon />
            </Button>
          </div>
          <Button
            ref={heartScope}
            variant="light"
            className="min-w-fit w-fit h-fit hover:bg-none text-white font-semibold text-xs flex items-center gap-2 p-0 m-0"
            data-hover="false"
            disableAnimation
            onPressStart={downAnimateHeart}
            onPress={handleBookLike}
          >
            <HeartIcon bold={isBookLiked} />
            {book.likes}
          </Button>
        </div>
      </div>
      <BookItemModal
        book={book}
        isSavedBook={bookSaved}
        disclosureHook={disclosureHook}
        onSave={onSaveBook}
        onDelete={onDeleteBook}
      />
    </div>
  );
}
