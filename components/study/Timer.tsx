// components/study/Timer.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function Timer({ initialMinutes, onComplete }: { initialMinutes: number; onComplete: () => void }) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  
  // Creăm o referință la obiectul Audio pentru a-l putea controla
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inițializăm obiectul Audio doar pe client
    if (typeof window !== 'undefined') {
      // Asigură-te că ai un fișier de sunet la această cale în folderul `public`
      audioRef.current = new Audio('/sounds/notification.mp3'); 
    }
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      // --- AICI ESTE LOGICA NOUĂ ---
      // Redă sunetul dacă obiectul audio există
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Eroare la redarea sunetului:", error);
          // Browserele moderne pot bloca autoplay-ul, dar ar trebui să meargă după o interacțiune a user-ului
        });
      }
      onComplete(); // Apelează funcția onComplete
      return;
    }

    const interval = setInterval(() => {
      setSeconds(s => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onComplete]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} className="font-mono text-5xl md:text-6xl font-bold text-center">
      <span>{minutes.toString().padStart(2, '0')}</span>
      <span>:</span>
      <span>{displaySeconds.toString().padStart(2, '0')}</span>
    </motion.div>
  );
}