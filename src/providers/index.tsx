"use client";

import { FolderContextProvider } from "@context";
import HeroProvider from "./HeroUIProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroProvider>
      <FolderContextProvider>{children}</FolderContextProvider>
    </HeroProvider>
  );
}
