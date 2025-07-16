"use client";

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!inView) return;
    
    countRef.current = 0;
    const step = Math.ceil(end / (duration / 16));
    
    const interval = setInterval(() => {
      countRef.current += step;
      
      if (countRef.current >= end) {
        countRef.current = end;
        clearInterval(interval);
      }
      
      setCount(countRef.current);
    }, 16);
    
    return () => clearInterval(interval);
  }, [end, duration, inView]);
  
  return (
    <span ref={ref} className={`font-bold ${className}`}>
      {prefix}{count}{suffix}
    </span>
  );
}
