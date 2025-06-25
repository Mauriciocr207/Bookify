import { isClientSide } from "@utils";
import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (isClientSide()) {
      return (
        localStorage?.theme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches && "dark") ||
        "light"
      );
    }
    return "light";
  });

  const isDarkTheme = () => theme === "light";

  useEffect(() => {
    if (isClientSide()) {
      localStorage.theme = theme;
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return { theme, setTheme, isDarkTheme };
}
