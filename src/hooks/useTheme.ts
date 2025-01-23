import { useEffect, useState } from "react";

export default function useTheme() {
  const isClientSide =
    typeof window !== "undefined" && typeof localStorage !== "undefined";

  const [theme, setTheme] = useState(() => {
    if (isClientSide) {
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
    if (isClientSide) {
      localStorage.theme = theme;
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme, isClientSide]);

  return { theme, setTheme, isDarkTheme };
}
