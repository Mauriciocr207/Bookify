"use client";

import { Category } from "@app-types/models/Category";
import { useFilterBookContext } from "@context";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

export default function FilterButton({ name, slug }: Category) {
  const [clicked, setClicked] = useState(false);
  const { setTags } = useFilterBookContext();

  useEffect(() => {
    if(clicked) {
      setTags((prevTags) => [...prevTags, slug]);
    } else {
      setTags((prevTags) => prevTags.filter(tag => tag !== slug));
    }
  }, [clicked, setTags, slug])

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <Button
      size="sm"
      className={`px-2.5 py-1.5 font-medium text-xs ${
        clicked ? "bg-blue text-white dark:text-gray-light-2" : "bg-blue-transparent text-blue"
      } rounded-full`}
      key={slug}
      onPress={handleClick}
    >
      {name}
    </Button>
  );
}
