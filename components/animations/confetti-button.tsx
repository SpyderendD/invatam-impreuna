// components/animations/confetti-button.tsx
"use client";

import { useRef, useEffect } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';

import Confetti from 'confetti-js'; // Importăm corect, acum că e instalat

// Extindem proprietățile butonului standard
interface ConfettiButtonProps extends ButtonProps {
  confettiDuration?: number;
}


export function ConfettiButton({ 
  children, 
  onClick, 
  confettiDuration = 2000, // 2 secunde default
  ...props 
}: ConfettiButtonProps) {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstance = useRef<any>(null);

  // Ne asigurăm că instanța de confetti este creată doar o dată
  useEffect(() => {
    if (canvasRef.current && !confettiInstance.current) {
      const confettiSettings = {
        target: canvasRef.current,
        // Poți adăuga alte setări aici (culori, forme etc.)
      };
      confettiInstance.current = new Confetti(confettiSettings);
    }
    
    // Curățăm la demontarea componentei
    return () => {
        confettiInstance.current?.clear();
    }
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Pornim animația de confetti
    confettiInstance.current?.render();
    
    // Oprim confetti după o durată specificată
    setTimeout(() => {
      confettiInstance.current?.clear();
    }, confettiDuration);

    // Apelăm și funcția onClick originală, dacă a fost trimisă
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Canvas-ul este elementul pe care se desenează confetti.
          Îl facem invizibil și să nu poată fi click-uit. */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10
        }}
      />
      
      {/* Butonul propriu-zis */}
      <Button onClick={handleClick} {...props}>
        {children}
      </Button>
    </div>
  );
}