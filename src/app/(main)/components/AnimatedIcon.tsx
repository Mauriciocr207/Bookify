import { useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import { randomNumber } from "@utils";
import { BookIcon, PapersIcon, BookUpIcon } from "@components/icons";

// Constants
const ICONS = [BookIcon, PapersIcon, BookUpIcon];
const ANIMATION_CONFIG = {
  delayRange: { min: 1, max: 4 },
  durationRange: { min: 3, max: 5 },
  sizeRange: { min: 20, max: 40 },
};
const DEFAULT_PATH_OPACITY = [0, 1, 0];
const DEFAULT_PATH_TIMES = [0, 0.2, 1];
const EASE_TYPE = "linear";

const getIcon = (position: number) => {
  const IconComponent = ICONS[position] || BookIcon;
  return <IconComponent />;
};

export default function AnimatedIcon({
  coords,
}: {
  coords: { x1: number; x2: number; y1: number; y2: number };
}) {
  const { delayRange, durationRange, sizeRange } = ANIMATION_CONFIG;
  const [scope, animate] = useAnimate();
  const [delay, setDelay] = useState(
    randomNumber(delayRange.min, delayRange.max)
  );
  const [duration, setDuration] = useState(
    randomNumber(durationRange.min, durationRange.max)
  );
  const [iconPosition, setIconPosition] = useState(
    Math.floor(randomNumber(0, ICONS.length - 1))
  );
  const [size, setSize] = useState(
    randomNumber(ANIMATION_CONFIG.sizeRange.min, ANIMATION_CONFIG.sizeRange.max)
  );
  const { x1, x2, y1, y2 } = coords;
  const path = `M ${x1} ${y1} L ${x2} ${y2}`;

  useEffect(() => {
    (async () => {
      await animate(
        scope.current,
        {
          offsetDistance: ["0%", "100%"],
          opacity: DEFAULT_PATH_OPACITY,
        },
        {
          duration,
          delay,
          ease: EASE_TYPE,
          times: DEFAULT_PATH_TIMES,
        }
      );

      setDelay(randomNumber(delayRange.min, delayRange.max));
      setDuration(randomNumber(durationRange.min, durationRange.max));
      setIconPosition(Math.floor(randomNumber(0, ICONS.length - 1)));
      setSize(randomNumber(sizeRange.min, sizeRange.max));
    })();
  }, [
    animate,
    scope,
    delay,
    duration,
    delayRange.min,
    delayRange.max,
    durationRange.min,
    durationRange.max,
    sizeRange.min,
    sizeRange.max,
  ]);

  return (
    <div
      ref={scope}
      className="rounded-full absolute opacity-0"
      style={{
        offsetPath: `path("${path}")`,
        offsetRotate: "0deg",
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {getIcon(iconPosition)}
    </div>
  );
}
