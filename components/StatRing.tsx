// app/profil/components/StatRing.tsx
'use client';

import { motion } from "framer-motion";

interface StatRingProps {
  value: number; // 0 to 100
  children: React.ReactNode;
}

export function StatRing({ value, children }: StatRingProps) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 8;

  return (
    <div className="relative h-32 w-32">
      <svg className="h-full w-full" viewBox="0 0 132 132">
        <circle
          cx="66" cy="66" r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted/30"
          fill="none"
        />
        <motion.circle
          cx="66" cy="66" r={radius}
          strokeWidth={strokeWidth}
          className="stroke-primary"
          fill="none"
          strokeLinecap="round"
          transform="rotate(-90 66 66)"
          style={{ strokeDasharray: circumference }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (value / 100) * circumference }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
        {children}
      </div>
    </div>
  );
}