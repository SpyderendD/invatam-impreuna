'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BookCopy, Trash2, Sparkles, BrainCircuit, Play, AlertCircle, Layers, Plus, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { CreateDeckDialog } from '@/components/study/CreateDeckDialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils';

interface Deck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
}

const MAX_DECKS = 5;

// --- FUNDAL AMBIENTAL (Neon Glow) ---
const AmbientBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#030712]">
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[150px] animate-pulse duration-1000" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[150px] animate-pulse duration-700" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
  </div>
);

// --- CARD PENTRU PACHET (SUPER WOW) ---
const DeckCard = ({ deck, onDelete }: { deck: Deck; onDelete: (deckId: string) => void; }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: -30 }}
    transition={{ type: 'spring', stiffness: 250, damping: 20 }}
    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-[#0f172a]/60 p-6 backdrop-blur-xl transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:-translate-y-2"
  >
    {/* Efect de rază de lumină la hover */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
    
    {/* Gradient subtil intern */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="relative z-10 flex justify-between items-start mb-4">
      <motion.div 
        whileHover={{ rotate: 15, scale: 1.1 }}
        className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl text-indigo-300 shadow-lg shadow-indigo-500/10"
      >
        <BrainCircuit className="w-6 h-6" />
      </motion.div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-rose-500/20 hover:text-rose-400 rounded-xl">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#0f172a] border-white/10 text-white rounded-3xl shadow-2xl shadow-rose-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl"><AlertCircle className="text-rose-500 w-6 h-6"/> Ești absolut sigur?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-base">
              {/* ESLint Fix: folosim &quot; în loc de ghilimele normale */}
              Vei șterge permanent pachetul <strong className="text-white">&quot;{deck.name}&quot;</strong> și toate cardurile din el. Această acțiune este ireversibilă.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl">Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(deck.id)} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-600/30">
              Da, șterge definitiv
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

    <div className="relative z-10 flex-grow">
      <Link href={`/studiu/${deck.id}`} className="block group/link">
        <h3 className="text-2xl font-black text-white mb-2 group-hover/link:text-indigo-400 transition-colors line-clamp-1 tracking-tight">{deck.name}</h3>
      </Link>
      <p className="text-sm text-slate-400 line-clamp-2 mb-6 min-h-[40px] font-medium leading-relaxed">
        {deck.description || 'Nicio descriere. Intră și adaugă carduri pentru a învăța.'}
      </p>
    </div>

    <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5 mt-auto">
      <div className="flex flex-col">
         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Layers className="w-3 h-3"/> Carduri</span>
         <span className="text-2xl font-black text-white leading-none">{deck.cardCount || 0}</span>
      </div>
      
      <div className="relative">
         {/* Glow effect in spatele butonului */}
         {deck.cardCount > 0 && (
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
         )}
         <Button 
            asChild 
            className="relative bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-full px-6 py-5 shadow-xl transition-all group-hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:grayscale" 
            disabled={!deck.cardCount || deck.cardCount === 0}
         >
            <Link href={`/studiu/${deck.id}/sesiune`}>
               <Play className="w-5 h-5 mr-2 fill-current" /> STUDIAZĂ
            </Link>
         </Button>
      </div>
    </div>
  </motion.div>
);

// --- COMPONENTA SKELETON ---
const DeckSkeleton = () => (
    <div className="flex flex-col rounded-3xl border border-white/5 bg-[#0f172a]/40 p-6 backdrop-blur-md h-[260px] animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-2xl bg-white/10" />
        </div>
        <div className="h-7 w-3/4 bg-white/10 rounded-lg mb-4" />
        <div className="h-4 w-full bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
        <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-auto">
            <div className="space-y-2"><div className="h-3 w-12 bg-white/5 rounded" /><div className="h-6 w-8 bg-white/10 rounded" /></div>
            <div className="h-10 w-32 rounded-full bg-white/10" />
        </div>
    </div>
);

// --- COMPONENTA PRINCIPALĂ ---
export default function StudyPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDeckCreated = (newDeck: Deck) => {
    setDecks(prevDecks => [newDeck, ...prevDecks]);
  };
  
  const handleDeleteDeck = async (deckId: string) => {
    if (!user) return;
    const originalDecks = [...decks];
    setDecks(currentDecks => currentDecks.filter(d => d.id !== deckId));

    try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/study/decks/${deckId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
        if (!response.ok) throw new Error("Eroare la ștergere.");
        toast({ title: "Pachet șters", description: "Pachetul a fost eliminat cu succes." });
    } catch (err: any) {
        toast({ title: "Eroare", description: err.message, variant: "destructive" });
        setDecks(originalDecks);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setIsLoading(false); return; }
    const fetchDecks = async () => {
      setIsLoading(true); setError(null);
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/study/decks', { headers: { 'Authorization': `Bearer ${token}` }});
        if (!response.ok) throw new Error('Eroare la încărcare.');
        setDecks(await response.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDecks();
  }, [user, authLoading]);

  // CALCUL LIMITĂ
  const decksCount = decks.length;
  const progressPercent = Math.min(100, (decksCount / MAX_DECKS) * 100);
  const reachedLimit = decksCount >= MAX_DECKS;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030712] relative overflow-hidden">
        <AmbientBackground />
        <div className="container py-12 relative z-10">
            <div className="h-16 w-80 mb-12 bg-white/5 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <DeckSkeleton key={i} />)}
            </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AmbientBackground />
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}
            className="bg-[#0f172a]/80 border border-white/10 p-10 rounded-[2rem] backdrop-blur-xl text-center max-w-md w-full relative z-10 shadow-2xl shadow-indigo-500/20"
        >
           <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Zap className="w-10 h-10 text-indigo-400" />
           </div>
           <h1 className="text-3xl font-black text-white mb-3">Atenție!</h1>
           <p className="text-slate-400 mb-8 leading-relaxed">Trebuie să fii conectat pentru a-ți crea și accesa pachetele de studiu personalizate.</p>
           <Button asChild size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl text-md font-bold shadow-lg shadow-indigo-500/30">
              <Link href="/login?next=/studiu">Autentifică-te acum</Link>
           </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white pb-24">
      <AmbientBackground />

      <main className="container max-w-7xl mx-auto px-4 py-10 md:py-16 relative z-10">
        
        {/* --- HERO HEADER WOW --- */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 bg-gradient-to-br from-[#0f172a]/80 to-[#020617]/90 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden shadow-2xl"
        >
          {/* Decorațiuni Fundal Header */}
          <div className="absolute right-[-10%] top-[-20%] w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute left-[-5%] bottom-[-20%] w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-inner">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Hub de Învățare
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400 tracking-tight mb-3 drop-shadow-sm">
              Pachetele Mele
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
              Creează flashcard-uri inteligente. Memorează mai rapid și excelează la teste.
            </p>
          </div>

          {/* ZONA BUTON + LIMITATOR */}
          <div className="relative z-10 flex flex-col items-start md:items-end w-full md:w-auto mt-6 md:mt-0">
             <div className="mb-5 w-full md:w-56 p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                   <span>Spațiu Utilizat</span>
                   <span className={cn("px-2 py-0.5 rounded text-black", reachedLimit ? "bg-rose-400" : "bg-indigo-300")}>{decksCount} / {MAX_DECKS}</span>
                </div>
                <div className="h-2.5 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                        className={cn("h-full rounded-full relative", reachedLimit ? "bg-rose-500 shadow-[0_0_15px_#f43f5e]" : "bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-[0_0_10px_#8b5cf6]")}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                    >
                        {/* Shimmer effect pe bară */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                    </motion.div>
                </div>
             </div>
             
             <CreateDeckDialog onDeckCreated={handleDeckCreated} reachedLimit={reachedLimit} />
          </div>
        </motion.div>

        {/* --- GRID PACHETE --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <DeckSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center text-rose-400 py-10 bg-rose-950/20 rounded-3xl border border-rose-500/20 font-bold backdrop-blur-md shadow-xl">{error}</div>
        ) : (
          <AnimatePresence mode="popLayout">
            {decks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center text-center py-28 px-4 border border-dashed border-indigo-500/30 rounded-[2.5rem] bg-[#0f172a]/20 backdrop-blur-sm shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <motion.div 
                    animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-24 h-24 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)] rotate-3"
                >
                    <BookCopy className="w-12 h-12 text-indigo-400" />
                </motion.div>
                
                <h3 className="text-3xl font-black text-white mb-3">Totul e pregătit.</h3>
                <p className="text-slate-400 text-lg max-w-md mx-auto mb-10 leading-relaxed">
                  Nu ai niciun pachet creat. Construiește-ți primul set de flashcard-uri și începe să înveți mai eficient ca niciodată.
                </p>
                <div className="animate-bounce p-3 bg-white/5 rounded-full border border-white/10 text-indigo-400 shadow-lg">
                   <Plus className="w-6 h-6" />
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {decks.map((deck) => (
                  <DeckCard key={deck.id} deck={deck} onDelete={handleDeleteDeck} />
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}