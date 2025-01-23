'use client';

import HeroProvider from "./HeroUIProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroProvider>
        { children }
    </HeroProvider>
  )
}