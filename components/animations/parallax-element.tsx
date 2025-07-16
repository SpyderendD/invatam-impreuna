"use client";

import { useEffect, useRef } from 'react';

interface ParallaxElementProps {
  children: React.ReactNode;
  speed?: number; // -1 to 1, negative values move element up, positive values move down
  className?: string;
}

export function ParallaxElement({ children, speed = 0.2, className = '' }: ParallaxElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const scrollY = window.scrollY;
      const rect = ref.current.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementVisible = elementTop - window.innerHeight;
      
      if (scrollY > elementVisible) {
        const distance = scrollY - elementVisible;
        const translation = distance * speed;
        ref.current.style.transform = `translateY(${translation}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return (
    <div ref={ref} className={`transition-transform ${className}`}>
      {children}
    </div>
  );
}
