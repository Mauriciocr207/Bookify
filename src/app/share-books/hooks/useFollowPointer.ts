import type { RefObject } from "react";

import { frame, useSpring } from "framer-motion";
import { useEffect } from "react";

const spring = { damping: 30, stiffness: 200, restDelta: 0.001 };

export function useFollowPointer(ref: RefObject<HTMLDivElement | null>) {
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    if (!ref.current) return;

    const handlePointerMove = ({ clientX, clientY }: MouseEvent) => {
      const element = ref.current!;
      const rect = element.getBoundingClientRect();

      frame.read(() => {
        x.set(clientX - (rect.left + rect.width / 2));
        y.set(clientY - (rect.top + rect.height / 2));
      });
    };

    window.addEventListener("dragover", handlePointerMove);

    return () => window.removeEventListener("dragover", handlePointerMove);
  }, []);

  return { x, y };
}
