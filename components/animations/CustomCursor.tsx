'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Inițial în afara ecranului
  const [isPointer, setIsPointer] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detectează dacă e dispozitiv touch pentru a dezactiva cursorul
    const onTouchStart = () => {
        setIsTouchDevice(true);
        window.removeEventListener('touchstart', onTouchStart);
    }
    window.addEventListener('touchstart', onTouchStart, { once: true });

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      // Verificăm dacă elementul sau unul dintre părinții săi este un link sau buton
      if (
        window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  if (isTouchDevice) {
    return null; // Nu randa nimic pe mobil/tabletă
  }

  const cursorVariants = {
    default: {
      x: position.x - 8,
      y: position.y - 8,
      height: 16,
      width: 16,
      backgroundColor: 'hsl(var(--primary) / 0.2)', // Culoare semi-transparentă
      border: '1px solid hsl(var(--primary))',
      scale: 1,
    },
    pointer: {
      x: position.x - 24,
      y: position.y - 24,
      height: 48,
      width: 48,
      backgroundColor: 'hsl(var(--primary) / 0.1)', // Foarte transparent
      border: '1px solid hsl(var(--primary))',
      scale: 1.2,
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full z-[9999] pointer-events-none"
      variants={cursorVariants}
      animate={isPointer ? 'pointer' : 'default'}
      transition={{ 
        type: 'spring', 
        stiffness: 500, // Mai reactiv
        damping: 30       // Mai puțin "bouncy"
      }}
    />
  );
};

export default CustomCursor;