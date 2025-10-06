// components/animations/InteractiveHeroIllustration.tsx
'use client'; // Această componentă este interactivă, deci are nevoie de 'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Code, PenTool, Calculator, Lightbulb, FlaskConical } from 'lucide-react';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// Am adăugat "export default" pentru a o putea importa în alte fișiere
export default function InteractiveHeroIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const parallax = (value: any, distance: number) => useTransform(value, [0, 1], [-distance, distance]);

  const icons = [
    { id: 1, icon: <PenTool size={24} />, color: 'text-amber-500', pos: 'top-[15%] left-[20%]', dist: 30, duration: 10 },
    { id: 2, icon: <Code size={24} />, color: 'text-sky-500', pos: 'top-[40%] left-[5%]', dist: 40, duration: 12 },
    { id: 3, icon: <Lightbulb size={24} />, color: 'text-yellow-500', pos: 'bottom-[15%] left-[25%]', dist: 25, duration: 11 },
    { id: 4, icon: <Calculator size={24} />, color: 'text-emerald-500', pos: 'top-[10%] right-[20%]', dist: 35, duration: 9 },
    { id: 5, icon: <FlaskConical size={24} />, color: 'text-red-500', pos: 'bottom-[10%] right-[25%]', dist: 20, duration: 13 }
  ];

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-96 w-full"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="absolute inset-10" style={{ x: parallax(mouseX, 5), y: parallax(mouseY, 5) }}>
        <div className="w-full h-full bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ x: parallax(mouseX, 15), y: parallax(mouseY, 15) }}
        animate={{ translateY: ["0%", "-10%", "0%"] }}
        transition={{ translateY: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
      >
        <BookOpen className="h-36 w-36 text-primary" />
      </motion.div>
      {icons.map((item, i) => (
        <motion.div
          key={item.id}
          className={`absolute p-4 rounded-full shadow-lg ${item.pos} ${item.color} bg-card/70 backdrop-blur-sm`}
          style={{ x: parallax(mouseX, item.dist), y: parallax(mouseY, item.dist) }}
          variants={{
            hidden: { opacity: 0, scale: 0 },
            visible: { opacity: 1, scale: 1, transition: { delay: 0.5 + i * 0.15 } },
          }}
          animate={{ translateY: ["0%", "15%", "0%"] }}
          transition={{ translateY: { duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 } }}
        >
          {item.icon}
        </motion.div>
      ))}
    </motion.div>
  );
}