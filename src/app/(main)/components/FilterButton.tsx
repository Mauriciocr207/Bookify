"use client";

import { Button } from "@heroui/button";
import { useState } from "react";

export default function FilterButton({ tagTitle }: { tagTitle: string }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <Button
      size="sm"
      className={`h-auto m-w-16 px-2.5 py-1.5 font-medium text-xs ${
        clicked ? "bg-blue text-white dark:text-gray-light-2" : "bg-blue-transparent text-blue"
      } rounded-full`}
      key={tagTitle}
      onPress={handleClick}
    >
      {tagTitle}
    </Button>
  );
}
