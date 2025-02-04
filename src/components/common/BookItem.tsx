"use client";

import { HeartIcon, BookmarkIcon, DownloadIcon } from "@components/icons";
import { BookInterface } from "@interfaces";
import { getImageProps } from "next/image";
import { getBackgroundImage } from "@utils";
import { Button } from "@heroui/react";
import { useState } from "react";
import { useIconAnimate, useIconAnimateProps } from "@hooks";

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

interface Props extends BookInterface {
    isSaved: boolean
}

export default function BookItem({ title, imageUrl, likes, isSaved  }: Props) {
  const [bookSaved, setBookSaved] = useState(isSaved);
  const [isBookLiked, setIsBookLiked] = useState(false);
  const {
    scope: bookmarkScope,
    handlePress: bookmarkHandlePress,
    handlePressStart: bookmarkHandlePressStart,
  } = useIconAnimate({ ...ANIMATE_CONFIG, handlePressEvent: handleBookSave });
  const {
    scope: heartScope,
    handlePress: heartHandlePress,
    handlePressStart: heartHandlePressStart,
  } = useIconAnimate({ ...ANIMATE_CONFIG, handlePressEvent: handleBookLike });
  const {
    props: { srcSet },
  } = getImageProps({
    src: imageUrl,
    width: 190,
    height: 290,
    alt: title,
  });
  const backgroundImage = getBackgroundImage(srcSet);

  function handleBookSave() {
    setBookSaved((prev) => !prev);
  }

  function handleBookLike() {
    setIsBookLiked((prev) => !prev);
  }

  return (
    <div
      className="w-48 h-[290px] bg-cover bg-center rounded-xl overflow-hidden"
      style={{ backgroundImage }}
    >
      <div className="flex flex-col justify-end gap-2 w-full h-full px-3 pb-3 card-gradient">
        <h3 className="font-semibold text-white text-base text-center">
          {title}
        </h3>
        <div className="flex gap-14 items-center">
          <div className="flex gap-3">
            <Button
              ref={bookmarkScope}
              variant="light"
              isIconOnly
              className="min-w-fit w-fit h-fit overflow-visible hover:bg-none"
              data-hover="false"
              disableAnimation
              onPressStart={bookmarkHandlePressStart}
              onPress={bookmarkHandlePress}
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
            onPressStart={heartHandlePressStart}
            onPress={heartHandlePress}
          >
            <HeartIcon bold={isBookLiked} />
            {likes}
          </Button>
        </div>
      </div>
    </div>
  );
}
