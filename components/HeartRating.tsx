'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trash2, Lock, X, AlertTriangle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilitar pentru a combina clasele de Tailwind CSS
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- CONFIGURAȚIA VIZUALĂ (Culori și Texte) ---
const MOODS = [
  { color: '#ef4444', label: 'Teribil 😭', shadow: 'rgba(239, 68, 68, 0.5)' },
  { color: '#f97316', label: 'Slab 😞', shadow: 'rgba(249, 115, 22, 0.5)' },
  { color: '#f59e0b', label: 'Nu prea... 😕', shadow: 'rgba(245, 158, 11, 0.5)' },
  { color: '#eab308', label: 'Merge 😐', shadow: 'rgba(234, 179, 8, 0.5)' },
  { color: '#84cc16', label: 'Ok 🙂', shadow: 'rgba(132, 204, 22, 0.5)' },
  { color: '#22c55e', label: 'Bunișor 😊', shadow: 'rgba(34, 197, 94, 0.5)' },
  { color: '#10b981', label: 'Bun 😄', shadow: 'rgba(16, 185, 129, 0.5)' },
  { color: '#06b6d4', label: 'Foarte Bun 🤩', shadow: 'rgba(6, 182, 212, 0.5)' },
  { color: '#3b82f6', label: 'Excelent! 🚀', shadow: 'rgba(59, 130, 246, 0.5)' },
  { color: '#8b5cf6', label: 'LEGENDARY! 👑', shadow: 'rgba(139, 92, 246, 0.8)' },
];

// Componentă pentru animarea numerelor
function AnimatedNumber({ value }: { value: number }) {
  let spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  let display = useTransform(spring, (current) => current.toFixed(1));
  useEffect(() => { spring.set(value); }, [spring, value]);
  return <motion.span>{display}</motion.span>;
}

export default function HeartRating({
  slug = 'contact-feedback',
  max = 10,
  className = '',
}: {
  slug?: string;
  max?: number;
  className?: string;
}) {
  const [stats, setStats] = useState({ count: 0, average: 0 });
  const [hover, setHover] = useState<number | null>(null);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State-uri pentru Fereastra Modală de Admin
  const [showResetModal, setShowResetModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [resetError, setResetError] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const storageKey = `user-vote:${slug}`;
  const currentVal = hover ?? userVote ?? 0;
  const currentMood = MOODS[currentVal - 1] || { color: '#64748b', label: 'Dă-ne o notă', shadow: 'rgba(0,0,0,0)' };

  useEffect(() => {
    // 1. Verificăm dacă utilizatorul a votat deja (din localStorage)
    const saved = localStorage.getItem(storageKey);
    if (saved) setUserVote(Number(saved));

    // 2. Luăm statisticile reale de la server
    fetch(`/api/rating?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => { if (data.count !== undefined) setStats(data); })
      .catch((e) => console.error("Eroare la preluarea rating-ului:", e));
  }, [slug, storageKey]);

  // Funcția pentru artificii
  const triggerConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#eab308'];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  // Logica pentru trimiterea votului
  const handleVote = async (val: number) => {
    setErrorMessage(null);
    if (isSubmitting) return;
    setIsSubmitting(true);

    const previousVote = userVote;
    setUserVote(val); // Update optimist (se mișcă instant)

    try {
      const res = await fetch('/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, value: val }),
      });
      const data = await res.json();

      if (!res.ok) {
        // EROARE: Probabil a votat deja (de pe alt browser/incognito)
        setUserVote(previousVote); // Anulăm update-ul optimist
        setErrorMessage(data.error || "Eroare necunoscută");
        
        // Efect de "tremurat" pentru feedback vizual
        const container = document.getElementById(`rating-container-${slug}`);
        container?.classList.add('animate-shake');
        setTimeout(() => container?.classList.remove('animate-shake'), 500);
      } else {
        // SUCCES
        setStats(data);
        localStorage.setItem(storageKey, String(val));
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
        if (val >= 8) triggerConfetti();
      }
    } catch {
      setUserVote(previousVote);
      setErrorMessage("Eroare de conexiune");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logica pentru resetarea de către Admin
  const confirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) return;
    setIsResetting(true);
    setResetError(false);

    try {
      const res = await fetch(`/api/rating?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminPassword }
      });
      
      if (res.ok) {
        setStats({ count: 0, average: 0 });
        setUserVote(null);
        setHover(null);
        setErrorMessage(null);
        localStorage.removeItem(storageKey);
        setShowResetModal(false);
        setAdminPassword('');
        alert("Resetare completă! 🗑️");
      } else {
        setResetError(true);
        const form = document.getElementById('reset-form');
        form?.classList.add('animate-shake');
        setTimeout(() => form?.classList.remove('animate-shake'), 500);
      }
    } catch {
      alert("Eroare server");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div 
      id={`rating-container-${slug}`} 
      className={cn("relative flex flex-col items-center gap-6 select-none py-4 group/container", className)}
    >
      
      {/* Glow de fundal (își schimbă culoarea dinamic) */}
      <motion.div 
        animate={{ background: currentVal > 0 ? currentMood.shadow : 'rgba(255,255,255,0)' }}
        className="absolute inset-0 blur-[60px] opacity-40 rounded-full transition-colors duration-500 pointer-events-none"
      />

      {/* Mesaj de eroare (ex: "Ai votat deja!") */}
      <AnimatePresence>
         {errorMessage && (
           <motion.div
             initial={{ opacity: 0, y: 10, scale: 0.9 }}
             animate={{ opacity: 1, y: -50, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9 }}
             className="absolute top-0 z-50 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2"
           >
             <AlertTriangle className="w-4 h-4" />
             {errorMessage}
           </motion.div>
         )}
      </AnimatePresence>

      {/* Cardul principal cu inimile */}
      <motion.div 
        className="relative z-10 p-5 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col items-center gap-4 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        animate={{ borderColor: currentVal > 0 ? currentMood.color + '44' : 'rgba(255,255,255,0.2)' }}
      >
        {/* Grup Inimi */}
        <div className="flex items-center gap-1 sm:gap-2" onMouseLeave={() => setHover(null)}>
          {Array.from({ length: max }).map((_, i) => {
            const val = i + 1;
            const isActive = val <= currentVal;
            const isCurrent = val === currentVal;
            return (
              <motion.button
                key={val}
                onClick={() => handleVote(val)}
                onMouseEnter={() => setHover(val)}
                whileHover={{ scale: 1.4, rotate: Math.random() * 10 - 5 }}
                whileTap={{ scale: 0.8 }}
                className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center focus:outline-none cursor-pointer"
                
                // --- REZOLVAREA PENTRU ACCESIBILITATE ---
                aria-label={`Acordă nota ${val} din ${max}`}
              >
                {/* Inima Gri (fundal) */}
                <svg viewBox="0 0 24 24" className="absolute w-full h-full text-white/20" aria-hidden="true">
                   <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {/* Inima Colorată */}
                <motion.div
                   initial={false}
                   animate={{ 
                     scale: isActive ? 1 : 0,
                     opacity: isActive ? 1 : 0,
                     color: isActive ? currentMood.color : '#fff'
                   }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   className="absolute inset-0"
                   aria-hidden="true"
                >
                   <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                      <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                   </svg>
                </motion.div>
                {/* Efectul de "bătaie a inimii" */}
                {isActive && isCurrent && userVote && !hover && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white/30 rounded-full blur-lg opacity-50 pointer-events-none"
                    aria-hidden="true"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Textul dinamic de sub inimi */}
        <div className="h-8 flex items-center justify-center overflow-visible">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMood.label}
                    initial={{ y: 20, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -20, opacity: 0, rotateX: 90 }}
                    style={{ color: currentVal > 0 ? currentMood.color : '#a1a1aa' }}
                    className="text-xl font-black tracking-wide drop-shadow-sm flex items-center gap-2"
                >
                    {currentMood.label}
                </motion.div>
            </AnimatePresence>
        </div>
      </motion.div>

      {/* Statisticile (scor mediu și număr de voturi) */}
      <div className="flex items-center gap-5 text-muted-foreground bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
         <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold opacity-60">Scor</span>
            <div className="text-2xl font-black text-foreground tabular-nums flex items-baseline">
                <AnimatedNumber value={stats.average} />
                <span className="text-sm font-medium opacity-50 ml-1">/10</span>
            </div>
         </div>
         <div className="w-px h-8 bg-white/20"></div>
         <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold opacity-60">Voturi</span>
            <span className="text-xl font-bold text-foreground tabular-nums">{stats.count}</span>
         </div>
      </div>

      {/* Butonul ascuns de Admin */}
      <button
        onClick={() => {
            setShowResetModal(true);
            setResetError(false);
            setAdminPassword("");
        }}
        className="absolute top-2 right-2 opacity-0 group-hover/container:opacity-40 hover:!opacity-100 transition-all p-2 rounded-full hover:bg-red-500/20 text-red-500 focus:opacity-100 focus:outline-none"
        title="Admin Reset"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Fereastra Modală de Admin */}
      <AnimatePresence>
        {showResetModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowResetModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    id="reset-form"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
                    <button onClick={() => setShowResetModal(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-red-500 mb-2">
                            <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
                            <h3 className="text-xl font-bold text-white">Admin Zone</h3>
                        </div>

                        <p className="text-sm text-gray-400">
                          Resetezi toate voturile și permiți revotarea? Acțiunea este ireversibilă.
                        </p>

                        <form onSubmit={confirmReset} className="flex flex-col gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Parola Secretă</label>
                                <div className={cn("flex items-center gap-2 bg-black/40 border rounded-xl px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-red-500/50", resetError ? "border-red-500 text-red-500" : "border-white/10 text-white")}>
                                    <Lock className="w-4 h-4 opacity-50" />
                                    <input 
                                        type="password"
                                        autoFocus
                                        value={adminPassword}
                                        onChange={(e) => { setAdminPassword(e.target.value); setResetError(false); }}
                                        placeholder="Introdu cheia..."
                                        className="bg-transparent border-none outline-none w-full placeholder:text-gray-600 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={() => setShowResetModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-white hover:bg-white/10">Anulează</button>
                                <button type="submit" disabled={!adminPassword || isResetting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                                    {isResetting ? '...' : 'Resetează'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}