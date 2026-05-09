// components/study/Flashcard.tsx
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="h-full w-full [perspective:1200px]"
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <motion.div
        className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Fața cardului (vizibilă la început) */}
        <div
          className="absolute grid h-full w-full place-items-center rounded-xl border bg-card p-6 text-center shadow-lg [backface-visibility:hidden]"
        >
          <span className="text-xl font-semibold md:text-2xl">{front}</span>
        </div>

        {/* Spatele cardului (vizibil după rotire) */}
        <div
          className="absolute grid h-full w-full place-items-center rounded-xl border bg-primary p-6 text-center text-primary-foreground shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <span className="text-xl font-bold md:text-2xl">{back}</span>
        </div>
      </motion.div>
    </div>
  );
}