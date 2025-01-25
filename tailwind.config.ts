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
        night: "#1E2E53",
        "night-2": "#1e293b",
        "night-3": "#334155",
        dark: "#0f172a",
      },
      gray: {
        DEFAULT: "#A9A9A9",
        "2": "#BDBDBD",
        icon: "#616E7A",
        light: "#DFE3E8",
        "light-2": "#F5F5F5",
        "light-3": "#FAFAFA",
        transparent: "#616e7a30",
        night: "#838383",
        "night-2": "#424242",
        "bookify-logo": "#5E5E5E"
      },
      yellow: "#EAB308",
      red: "#FF0000",
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
