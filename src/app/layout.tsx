import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles";
import Providers from "@providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bookify",
  description: "App para manejar tus libros académicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="transition-colors duration-200 ease-in-out">
      <body className={`${inter.variable} antialiased dark:bg-blue-dark`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
