'use client';

import React, { useRef, useState } from 'react';

interface CreepyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function CreepyButton({ children, onClick, className, ...props }: CreepyButtonProps) {
  const eyesRef = useRef<HTMLSpanElement>(null);
  const [eyeCoords, setEyeCoords] = useState({ x: 0, y: 0 });

  // Calculăm poziția pupilei
  const pupilStyle = {
    transform: `translate(calc(-50% + ${eyeCoords.x * 20}px), calc(-50% + ${eyeCoords.y * 10}px))`,
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    // Obținem coordonatele (mouse sau touch)
    // @ts-ignore
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    // @ts-ignore
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const eyesRect = eyesRef.current?.getBoundingClientRect();
    if (!eyesRect) return;

    // Centrul ochilor
    const eyesCenterX = eyesRect.left + eyesRect.width / 2;
    const eyesCenterY = eyesRect.top + eyesRect.height / 2;

    // Diferența dintre cursor și ochi
    const dx = clientX - eyesCenterX;
    const dy = clientY - eyesCenterY;

    // Calculăm unghiul
    const angle = Math.atan2(dy, dx);
    
    // Distanța maximă pe care se pot mișca pupilele (limitată la 1)
    const distance = Math.min(Math.hypot(dx, dy) / 100, 1);

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    setEyeCoords({ x, y });
  };

  return (
    <button
      className={`creepy-btn ${className || ''}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      {...props}
    >
      {/* Containerul pentru ochi (ascuns sub text) */}
      <span className="creepy-btn__eyes" ref={eyesRef}>
        <span className="creepy-btn__eye">
          <span className="creepy-btn__pupil" style={pupilStyle}></span>
        </span>
        <span className="creepy-btn__eye">
          <span className="creepy-btn__pupil" style={pupilStyle}></span>
        </span>
      </span>

      {/* Textul butonului (Cover-ul care se ridică) */}
      <span className="creepy-btn__cover">
        {children}
      </span>
    </button>
  );
}