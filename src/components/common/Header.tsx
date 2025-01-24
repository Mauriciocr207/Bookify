"use client";

import { Button } from "@heroui/button";
import { useTheme } from "@hooks";
import Link from "next/link";
import { ROUTES } from "@constants";
import { usePathname } from "next/navigation";
import BookifyIcon from "@components/icons/BookifyIcon";
import SunIcon from "@components/icons/SunIcon";

export default function Header() {
  const pathname = usePathname();
  const isActiveLink = (url: string): boolean => pathname === url;
  const { setTheme } = useTheme();

  return (
    <header className="bg-white px-4">
      <div className="container flex justify-between items-center py-11">
        <Link href={ROUTES.HOME}>
          <BookifyIcon />
        </Link>
        <nav className="flex justify-between items-center gap-11 font-bold text-gray">
          <Link
            href={ROUTES.SAVED_BOOKS}
            className={`${
              isActiveLink(ROUTES.SAVED_BOOKS) ? "text-blue" : "text-gray"
            }`}
          >
            Guardados
          </Link>
          <Link
            href={ROUTES.SHARE_BOOKS}
            className={`${
              isActiveLink(ROUTES.SHARE_BOOKS) ? "text-blue" : "text-gray"
            }`}
          >
            Colabora
          </Link>
        </nav>
        <Button
          isIconOnly
          variant="light"
          onPress={() =>
            setTheme((theme: string) => (theme === "light" ? "dark" : "light"))
          }
        >
            <SunIcon />
        </Button>
      </div>
    </header>
  );
}
