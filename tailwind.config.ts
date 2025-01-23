import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      blue: {
        DEFAULT: "#0284C7",
        transparent: "#38bdf81a",
        light: "#0EA5E9",
        "light-2": "#38BDF8",
        dark: "#1E2E53",
      },
      gray: {
        DEFAULT: "#A9A9A9",
        "2": "#BDBDBD",
        light: "#DFE3E8",
        "light-2": "#F5F5F5",
        "light-3": "#FAFAFA",
        transparent: "#616e7a30",
        dark: "#838383",
        "dark-2": "#424242",
      },
      yellow: "#EAB308",
      red: "#FF0000",
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
