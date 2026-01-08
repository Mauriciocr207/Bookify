"use client";

import { FolderContextProvider } from "@context";
import HeroProvider from "./HeroUIProvider";
import TanstackQueryProvider from "./TanstackQueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroProvider>
      <FolderContextProvider>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </FolderContextProvider>
    </HeroProvider>
  );
}
