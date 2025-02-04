"use client";

import { Pagination } from "@heroui/pagination";
import { useState } from "react";

export default function BookPagination() {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      showControls
      disableCursorAnimation
      initialPage={page}
      total={10}
      className="mt-16"
      onChange={(page) => setPage(page)}
      boundaries={2}
      siblings={0}
      classNames={{
        base: "mt-",
        prev: "rounded bg-transparent text-blue-light-2 border-blue-light-2 dark:bg-blue-transparent dark:text-blue dark:border-0 border-1 transition-colors data-[disabled=true]:text-gray data-[disabled=true]:border-gray-light data-[disabled=true]:bg-gray-light dark:hover:!bg-blue-night-3 dark:data-[disabled=true]:bg-blue-night",
        next: "rounded bg-transparent text-blue-light-2 border-blue-light-2 dark:bg-blue-transparent dark:text-blue dark:border-0 border-1 transition-colors data-[disabled=true]:text-gray data-[disabled=true]:border-gray-light data-[disabled=true]:bg-gray-light dark:hover:!bg-blue-night-3 dark:data-[disabled=true]:bg-blue-night",
        item: "rounded bg-transparent text-gray border-gray-light dark:bg-blue-transparent dark:text-blue dark:border-0 border-1 data-[active=true]:bg-blue-light-2 dark:data-[active=true]:!bg-blue dark:data-[active=true]:text-white data-[active=true]:text-white data-[active=true]:border-blue-light-2 dark:hover:!bg-blue-night-3",
      }}
    />
  );
}
