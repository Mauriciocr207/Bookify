"use client";

import HeroProvider from "./HeroUIProvider";
import StoreProvider from "./StoreProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroProvider>
      <StoreProvider>{children}</StoreProvider>
    </HeroProvider>
  );
}
