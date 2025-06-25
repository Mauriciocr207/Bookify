"use client";

import { Button } from "@heroui/button";
import { useTheme } from "@hooks";
import Link from "next/link";
import { ROUTES } from "@constants";
import { usePathname } from "next/navigation";
import { SunIcon, BookifyIcon } from "@components/icons";

export default function Header() {
  const pathname = usePathname();
  const isActiveLink = (url: string): boolean => pathname === url;
  const { setTheme } = useTheme();

  return (
    <header className="px-4">
      <nav className="container flex justify-between items-center py-11">
        <Link href={ROUTES.HOME}>
          <BookifyIcon />
        </Link>
        <div className="flex justify-between items-center gap-11 font-bold">
          <Link
            href={ROUTES.SAVED_BOOKS}
            className={`${
              isActiveLink(ROUTES.SAVED_BOOKS)
                ? "text-blue dark:text-blue-light-2"
                : "hover:text-blue-light text-gray dark:text-gray-light-3 dark:hover:text-blue-light-2"
            }`}
          >
            Guardados
          </Link>
          <Link
            href={ROUTES.SHARE_BOOKS}
            className={`${
              isActiveLink(ROUTES.SHARE_BOOKS)
                ? "text-blue dark:text-blue-light-2"
                : "hover:text-blue-light text-gray dark:text-gray-light-3 dark:hover:text-blue-light-2"
            }`}
          >
            Colabora
          </Link>
        </div>
        <Button
          isIconOnly
          variant="light"
          onPress={() =>
            setTheme((theme) => theme === "dark" ? "light" : "dark")
          }
        >
          <SunIcon />
        </Button>
      </nav>
    </header>
  );
}
