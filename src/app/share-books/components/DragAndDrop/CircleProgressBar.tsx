import { motion } from "framer-motion"; // Asegúrate de tener "framer-motion"
import React from "react";

interface CircleProgressBarProps {
  progress: number;
  size?: number;
  stroke?: number;
  render?: (progress: number) => React.ReactNode;
}

export default function CircleProgressBar({
  progress = 70,
  size = 50,
  stroke = 2,
  render,
}: CircleProgressBarProps) {
  const radius = (size - stroke) / 2;

  return (
    <div className={`w-[${size}px] h-[${size}px] relative`}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-default-300/50"
          strokeWidth={stroke}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white"
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100.0 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      <div className="absolute w-full h-full flex items-center justify-center top-0">
        {!render && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".35em"
            fill="#fff"
            className="text-[10px]"
          >
            {Math.round(progress)}%
          </text>
        )}
        {render && <>{render(progress)}</>}
      </div>
    </div>
  );
}
