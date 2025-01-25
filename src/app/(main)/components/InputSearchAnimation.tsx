"use client";

import React, { useEffect, useState } from "react";
import AnimatedIcon from "./AnimatedIcon";

const NUMBER_OF_CURVES = 20;
const OFFSET_WIDTH = 150;

function getAnimations(width: number, height: number = 250): React.ReactNode {
  const xPoints = Array.from({ length: NUMBER_OF_CURVES }, (_, i) => {
    const x1 =
      OFFSET_WIDTH / 2 +
      ((width - OFFSET_WIDTH) / (NUMBER_OF_CURVES + 1)) * (i + 1);
    const y1 = height;
    const x2 = (width / (NUMBER_OF_CURVES - 1)) * i;
    const y2 = height - Math.sin((Math.PI / width) * x1) * height;
    return { x1, x2, y1, y2 };
  });

  return xPoints.map((coords, position) => (
    <AnimatedIcon key={position} coords={coords} />
  ));
}

export default function InputSearchAnimation({
  inputSearch,
}: {
  inputSearch: React.RefObject<HTMLInputElement | null>;
}) {
  const [inputSearchWidth, setInputSearchWidth] = useState(0);

  useEffect(() => {
    if (!inputSearch.current) return;

    const observer = new ResizeObserver(([inputSearchEntry]) => {
      setInputSearchWidth(inputSearchEntry.contentRect.width + OFFSET_WIDTH);
    });

    observer.observe(inputSearch.current);

    return () => {
      observer.disconnect();
    };
  }, [inputSearch]);

  return (
    <div className="relative" style={{ width: inputSearchWidth }}>
      <div
        className="absolute z-20 h-[250px] bottom-0 text-gray-icon dark:text-blue-light-2"
        style={{ width: inputSearchWidth }}
      >
        {inputSearchWidth && getAnimations(inputSearchWidth)}
      </div>
    </div>
  );
}
