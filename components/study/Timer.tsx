// components/study/Timer.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Timer({ initialMinutes, onComplete }: { initialMinutes: number, onComplete: () => void }) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => {
      setSeconds(s => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onComplete]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} className="font-mono text-5xl md:text-6xl font-bold text-center">
      <span>{minutes.toString().padStart(2, '0')}</span>
      <span>:</span>
      <span>{displaySeconds.toString().padStart(2, '0')}</span>
    </motion.div>
  );
}