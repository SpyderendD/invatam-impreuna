// components/ui/countdown-timer.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Funcție ajutătoare pentru a calcula timpul rămas
function calculateTimeLeft(targetDate: Date) {
  const difference = +targetDate - +new Date();
  let timeLeft = {
    zile: 0,
    ore: 0,
    minute: 0,
    secunde: 0,
  };

  if (difference > 0) {
    timeLeft = {
      zile: Math.floor(difference / (1000 * 60 * 60 * 24)),
      ore: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minute: Math.floor((difference / 1000 / 60) % 60),
      secunde: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

// Componenta pentru o singură unitate de timp (ex: Zile)
const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center">
      <div className="absolute inset-0 rounded-lg bg-primary/10"></div>
      <span className="relative text-3xl md:text-4xl font-bold font-mono text-primary">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
  </div>
);

// Componenta principală a cronometrului
export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    // Actualizăm cronometrul la fiecare secundă
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Curățăm intervalul la demontarea componentei
    return () => clearInterval(timer);
  }, [targetDate]);

  const hasEnded = !Object.values(timeLeft).some(val => val > 0);

  if (hasEnded) {
    return (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center font-bold text-2xl text-primary">
        Mult succes tuturor!
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="flex items-center justify-center gap-4 md:gap-8"
    >
      <motion.div variants={{hidden: {opacity:0, scale:0.8}, visible: {opacity:1, scale:1}}}>
        <TimeUnit value={timeLeft.zile} label="Zile" />
      </motion.div>
      <motion.div variants={{hidden: {opacity:0, scale:0.8}, visible: {opacity:1, scale:1}}}>
        <TimeUnit value={timeLeft.ore} label="Ore" />
      </motion.div>
      <motion.div variants={{hidden: {opacity:0, scale:0.8}, visible: {opacity:1, scale:1}}}>
        <TimeUnit value={timeLeft.minute} label="Minute" />
      </motion.div>
      <motion.div variants={{hidden: {opacity:0, scale:0.8}, visible: {opacity:1, scale:1}}}>
        <TimeUnit value={timeLeft.secunde} label="Secunde" />
      </motion.div>
    </motion.div>
  );
}