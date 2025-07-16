// components/animations/scroll-animation.tsx
'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation, Variants } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const ScrollAnimation = ({ children, delay = 0, duration = 0.5 }: ScrollAnimationProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, // Animația rulează o singură dată
    threshold: 0.1,    // Se declanșează când 10% din element e vizibil
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Aici definim variantele de animație
  const variants: Variants = {
    hidden: { opacity: 0, y: 50 }, // Starea inițială: invizibil și puțin mai jos
    visible: {
      opacity: 1,
      y: 0, // Starea finală: vizibil și la poziția normală
      transition: {
        delay,
        duration,
        // === AICI ESTE CORECȚIA ===
        ease: "easeInOut", // Folosim o curbă de animație standard și validă
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};