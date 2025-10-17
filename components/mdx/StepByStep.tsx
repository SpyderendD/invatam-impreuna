// components/mdx/StepByStep.tsx
import React from 'react';

interface StepByStepProps {
  children: React.ReactNode;
}

export function StepByStep({ children }: StepByStepProps) {
  return (
    <div className="my-6 space-y-4">
      {React.Children.map(children, (child, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0 mt-1">
            {index + 1}
          </div>
          <div className="flex-1 prose-p:my-0">{child}</div>
        </div>
      ))}
    </div>
  );
}