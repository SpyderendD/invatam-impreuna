'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');

  // Setări de "spring" pentru animații fluide
  const springConfig = { stiffness: 400, damping: 30 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  const followerX = useSpring(0, { stiffness: 200, damping: 25, mass: 0.8 });
  const followerY = useSpring(0, { stiffness: 200, damping: 25, mass: 0.8 });

  useEffect(() => {
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      followerX.set(e.clientX);
      followerY.set(e.clientY);

      const target = e.target as HTMLElement;
      
      // Verificăm ce tip de element este sub cursor
      if (target.closest('a, button')) {
        setCursorVariant('link');
      } else if (target.closest('p, h1, h2, h3, h4, h5, h6, li, span')) {
        setCursorVariant('text');
      } else {
        setCursorVariant('default');
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY, followerX, followerY]);

  if (isTouchDevice) {
    return null;
  }

  // Variantele de animație pentru cursor
  const variants = {
    default: {
      height: 20,       // <<< Mai mic
      width: 20,
      scale: 1,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '50%', // Asigurăm că este un cerc
    },
    text: {
      height: 6,        // <<< Formă de "highlighter"
      width: 120,       // <<< Mai îngustă
      scale: 1,
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      border: '0px solid rgba(59, 130, 246, 0)', // Fără bordură vizibilă
      borderRadius: '4px', // Rotunjim colțurile
    },
    link: {
      height: 50,       // <<< Dimensiune rezonabilă pentru hover
      width: 50,
      scale: 1.2,
      backgroundColor: 'transparent',
      border: '2px solid rgba(59, 130, 246, 0.5)',
      borderRadius: '50%',
    },
  };

  return (
    <>
      {/* Elementul "follower" - mai lent, creează efectul "gooey" */}
      <motion.div
        variants={variants}
        animate={cursorVariant}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          translateX: followerX,
          translateY: followerY,
          x: '-50%', 
          y: '-50%',
        }}
      />
      {/* Elementul principal - mai rapid, direct pe cursor */}
      <motion.div
        variants={variants}
        animate={cursorVariant}
        transition={{ type: 'spring', ...springConfig }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: '-50%', 
          y: '-50%',
        }}
      />
    </>
  );
}

// Folosim default export
export default CustomCursor;