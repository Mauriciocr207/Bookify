import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "serif"],
    },
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      blue: "#0284C7",
      "blue-transparent": "#38bdf81a",
      "blue-light": "#0EA5E9",
      "blue-light-2": "#38BDF8",
      "blue-dark": "#1E2E53",
      gray: "#A9A9A9",
      "gray-2": "#BDBDBD",
      "gray-light": "#DFE3E8",
      "gray-light-2": "#F5F5F5",
      "gray-light-3": "#FAFAFA",
      "gray-transparent": "#616e7a30",
      "gray-dark": "#838383",
      "gray-dark-2": "#424242",
      yellow: "#EAB308",
      read: "#FF0000",
    },
    extend: {
      colors: {},
    },
  },
  plugins: [],
} satisfies Config;
