"use client";

import { useInView } from 'react-intersection-observer';
import ProgressBarComponent from '@ramonak/react-progress-bar';


interface ProgressBarProps {
  completed: number;
  label?: string;
  bgColor?: string;
  baseBgColor?: string;
  height?: string;
  borderRadius?: string;
  labelColor?: string;
  labelSize?: string;
  maxCompleted?: number;
  customLabel?: string;
  animateOnRender?: boolean;
  className?: string;
}

export function ProgressBar({
  completed,
  bgColor = '#4F46E5',
  baseBgColor = '#F3F4F6',
  height = '10px',
  borderRadius = '20px',
  labelColor = '#fff',
  labelSize = '12px',
  maxCompleted = 100,
  customLabel,
  className = '',
  ...props
}: ProgressBarProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className={className}>
      <ProgressBarComponent
        completed={inView ? completed : 0}
        bgColor={bgColor}
        baseBgColor={baseBgColor}
        height={height}
        borderRadius={borderRadius}
        labelColor={labelColor}
        labelSize={labelSize}
        maxCompleted={maxCompleted}
        customLabel={customLabel}
        animateOnRender
        transitionDuration="1.5s"
        transitionTimingFunction="ease-out"
        {...props}
      />
    </div>
  );
}
