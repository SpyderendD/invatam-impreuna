'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trash2, Lock, X, AlertTriangle, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOODS = [
  { color: '#f43f5e', label: 'Teribil 😭' },
  { color: '#fb923c', label: 'Slab 😞' },
  { color: '#fbbf24', label: 'Nu prea... 😕' },
  { color: '#facc15', label: 'Merge 😐' },
  { color: '#a3e635', label: 'Ok 🙂' },
  { color: '#4ade80', label: 'Bunișor 😊' },
  { color: '#2dd4bf', label: 'Bun 😄' },
  { color: '#22d3ee', label: 'Foarte Bun 🤩' },
  { color: '#3b82f6', label: 'Excelent! 🚀' },
  { color: '#a855f7', label: 'LEGENDARY! 👑' },
];

function AnimatedNumber({ value }: { value: number }) {
  let spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  let display = useTransform(spring, (current) => current.toFixed(1));
  useEffect(() => { spring.set(value); }, [spring, value]);
  return <motion.span>{display}</motion.span>;
}

export default function HeartRating({ slug = 'contact-feedback', max = 10, className = '' }) {
  const [stats, setStats] = useState({ count: 0, average: 0 });
  const [hover, setHover] = useState<number | null>(null);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const storageKey = `user-vote:${slug}`;
  const currentVal = hover ?? userVote ?? 0;
  const currentMood = MOODS[currentVal - 1] || { color: '#94a3b8', label: 'Dă-ne o notă' };

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setUserVote(Number(saved));

    fetch(`/api/rating?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => { if (data.count !== undefined) setStats(data); })
      .catch((e) => console.error("Eroare rating:", e));
  }, [slug, storageKey]);

  const handleVote = async (val: number) => {
    if (userVote || isSubmitting) return;
    setIsSubmitting(true);
    const prev = userVote;
    setUserVote(val);

    try {
      const res = await fetch('/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, value: val }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUserVote(prev);
        setErrorMessage(data.error);
      } else {
        setStats(data);
        localStorage.setItem(storageKey, String(val));
        if (val >= 8) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch { setUserVote(prev); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className={cn("relative flex flex-col items-center gap-8 w-full max-w-2xl mx-auto", className)}>
      
      {/* CARD PRINCIPAL */}
      <GlassCard className="w-full p-8 flex flex-col items-center gap-6 group/main transition-all duration-500 border-indigo-500/20">
        
        {/* Label Dinamic */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMood.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ color: currentMood.color }}
            className="text-xl font-black uppercase tracking-widest italic"
          >
            {currentMood.label}
          </motion.p>
        </AnimatePresence>

        {/* Container Inimi */}
        <div 
          className="flex flex-wrap justify-center gap-1 sm:gap-3"
          onMouseLeave={() => setHover(null)}
        >
          {Array.from({ length: max }).map((_, i) => {
            const val = i + 1;
            const isFull = val <= currentVal;
            const isUserSelection = userVote && val <= userVote;

            return (
              <motion.button
                key={val}
                onClick={() => handleVote(val)}
                onMouseEnter={() => setHover(val)}
                whileHover={{ scale: 1.3, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "relative w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center transition-colors",
                    userVote ? "cursor-default" : "cursor-pointer"
                )}
              >
                <Heart 
                  className={cn(
                    "w-full h-full transition-all duration-300",
                    isFull ? "fill-current" : "fill-transparent stroke-[1.5px]",
                    isFull ? "" : "text-muted-foreground/30"
                  )}
                  style={{ color: isFull ? currentMood.color : undefined }}
                />
                
                {/* Glow efect pentru inimile selectate */}
                {isFull && (
                    <motion.div 
                        layoutId="glow"
                        className="absolute inset-0 blur-lg opacity-40 rounded-full"
                        style={{ backgroundColor: currentMood.color }}
                    />
                )}
              </motion.button>
            );
          })}
        </div>

        {userVote && (
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                Mulțumim pentru feedback! ❤️
            </p>
        )}
      </GlassCard>

      {/* STATISTICI JOS (Design tip Dashboard) */}
      <div className="flex gap-4 w-full max-w-sm">
        <div className="flex-1 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Scor Mediu</p>
            <div className="text-3xl font-black text-foreground">
                <AnimatedNumber value={stats.average} />
                <span className="text-sm text-muted-foreground ml-1">/10</span>
            </div>
        </div>
        <div className="flex-1 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Voturi Totale</p>
            <p className="text-3xl font-black text-foreground">{stats.count}</p>
        </div>
      </div>

      {/* Error Toast */}
      <AnimatePresence>
        {errorMessage && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-12 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg"
            >
                {errorMessage}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-componentă pentru design unitar
function GlassCard({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-2xl shadow-2xl",
            className
        )}>
            {children}
        </div>
    );
}