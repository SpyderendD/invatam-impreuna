'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Varianta pentru despărțirea ecranului în două
const slideUp = {
    initial: { top: 0 },
    exit: { top: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }
};

export default function Preloader({ onFinish }: { onFinish?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Pasul 1: Mesaj Text (0 - 800ms)
    const t1 = setTimeout(() => setStep(1), 800);
    
    // Pasul 2: Creionul apare (800ms - 2000ms)
    const t2 = setTimeout(() => {
      setIsVisible(false);
      // După ce se termină cortina (800ms + 200ms delay), declanșăm finish
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 1000); 
    }, 2000); // Timp total mai lung pentru a savura animația

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <>
          {/* Partea de sus a cortinei */}
          <motion.div
            variants={slideUp}
            initial="initial"
            exit="exit"
            className="fixed inset-0 z-[9999] bg-[#030712] flex items-center justify-center overflow-hidden"
          >
            {/* Glow de fundal intens */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                
                {/* PASUL 0: Text de Bun Venit */}
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.h1 
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest font-lora absolute"
                        >
                            Învățăm Împreună
                        </motion.h1>
                    )}
                </AnimatePresence>

                {/* PASUL 1: Creionul Magic */}
                <AnimatePresence>
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                            transition={{ 
                                duration: 0.6, 
                                type: "spring", 
                                bounce: 0.4,
                                exit: { duration: 0.4, ease: "easeIn" }
                            }}
                            className="absolute flex flex-col items-center"
                        >
                            {/* SVG CREION - Stilizat High-End */}
                            <style jsx>{`
                            .pencil { display: block; width: 12em; height: 12em; filter: drop-shadow(0 20px 30px rgba(99,102,241,0.4)); }
                            .pencil__body1, .pencil__body2, .pencil__body3, .pencil__eraser, .pencil__eraser-skew, .pencil__point, .pencil__rotate, .pencil__stroke {
                                animation-duration: 2s; /* Mai rapid! */
                                animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                                animation-iteration-count: infinite;
                            }
                            .pencil__body1, .pencil__body2, .pencil__body3 { transform: rotate(-90deg); }
                            .pencil__body1 { animation-name: pencilBody1; }
                            .pencil__body2 { animation-name: pencilBody2; }
                            .pencil__body3 { animation-name: pencilBody3; }
                            .pencil__eraser { animation-name: pencilEraser; transform: rotate(-90deg) translate(49px,0); }
                            .pencil__eraser-skew { animation-name: pencilEraserSkew; animation-timing-function: ease-in-out; }
                            .pencil__point { animation-name: pencilPoint; transform: rotate(-90deg) translate(49px,-30px); }
                            .pencil__rotate { animation-name: pencilRotate; }
                            .pencil__stroke { animation-name: pencilStroke; transform: translate(100px,100px) rotate(-113deg); }
                            
                            @keyframes pencilBody1 { from, to { stroke-dashoffset: 351.86; transform: rotate(-90deg); } 50% { stroke-dashoffset: 150.8; transform: rotate(-225deg); } }
                            @keyframes pencilBody2 { from, to { stroke-dashoffset: 406.84; transform: rotate(-90deg); } 50% { stroke-dashoffset: 174.36; transform: rotate(-225deg); } }
                            @keyframes pencilBody3 { from, to { stroke-dashoffset: 296.88; transform: rotate(-90deg); } 50% { stroke-dashoffset: 127.23; transform: rotate(-225deg); } }
                            @keyframes pencilEraser { from, to { transform: rotate(-45deg) translate(49px,0); } 50% { transform: rotate(0deg) translate(49px,0); } }
                            @keyframes pencilEraserSkew { from, 32.5%, 67.5%, to { transform: skewX(0); } 35%, 65% { transform: skewX(-4deg); } 37.5%, 62.5% { transform: skewX(8deg); } 40%, 45%, 50%, 55%, 60% { transform: skewX(-15deg); } 42.5%, 47.5%, 52.5%, 57.5% { transform: skewX(15deg); } }
                            @keyframes pencilPoint { from, to { transform: rotate(-90deg) translate(49px,-30px); } 50% { transform: rotate(-225deg) translate(49px,-30px); } }
                            @keyframes pencilRotate { from { transform: translate(100px,100px) rotate(0); } to { transform: translate(100px,100px) rotate(720deg); } }
                            @keyframes pencilStroke { from { stroke-dashoffset: 439.82; transform: translate(100px,100px) rotate(-113deg); } 50% { stroke-dashoffset: 164.93; transform: translate(100px,100px) rotate(-113deg); } 75%, to { stroke-dashoffset: 439.82; transform: translate(100px,100px) rotate(112deg); } }
                            `}</style>

                            <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" className="pencil">
                                <defs><clipPath id="pencil-eraser"><rect height="30" width="30" ry="5" rx="5"></rect></clipPath></defs>
                                <circle transform="rotate(-113,100,100)" strokeLinecap="round" strokeDashoffset="439.82" strokeDasharray="439.82 439.82" strokeWidth="3" stroke="#6366f1" fill="none" r="70" className="pencil__stroke"></circle>
                                <g transform="translate(100,100)" className="pencil__rotate">
                                <g fill="none">
                                    <circle transform="rotate(-90)" strokeDashoffset="402" strokeDasharray="402.12 402.12" strokeWidth="30" stroke="#4f46e5" r="64" className="pencil__body1"></circle>
                                    <circle transform="rotate(-90)" strokeDashoffset="465" strokeDasharray="464.96 464.96" strokeWidth="10" stroke="#8b5cf6" r="74" className="pencil__body2"></circle>
                                    <circle transform="rotate(-90)" strokeDashoffset="339" strokeDasharray="339.29 339.29" strokeWidth="10" stroke="#312e81" r="54" className="pencil__body3"></circle>
                                </g>
                                <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
                                    <g className="pencil__eraser-skew">
                                    <rect height="30" width="30" ry="5" rx="5" fill="#f43f5e"></rect>
                                    <rect clipPath="url(#pencil-eraser)" height="30" width="5" fill="#e11d48"></rect>
                                    <rect height="20" width="30" fill="#f8fafc"></rect>
                                    <rect height="20" width="15" fill="#94a3b8"></rect>
                                    <rect height="20" width="5" fill="#cbd5e1"></rect>
                                    </g>
                                </g>
                                <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
                                    <polygon points="15 0,30 30,0 30" fill="#fcd34d"></polygon>
                                    <polygon points="15 0,6 30,0 30" fill="#d97706"></polygon>
                                    <polygon points="15 0,20 10,10 10" fill="#0f172a"></polygon>
                                </g>
                                </g>
                            </svg>

                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400"
                            >
                                Se încarcă platforma...
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* O linie subțire animată la baza ecranului */}
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500 shadow-[0_0_20px_#8b5cf6]"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}