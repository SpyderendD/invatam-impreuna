'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ALL_SUBJECTS_OBJECT } from "@/lib/lessons";
import { achievementsList } from "@/hooks/useTaskPlanner"; 
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

// UI & Icons
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit, BookOpen, Trophy, Share2, Flame, ChevronRight, LayoutDashboard, Loader2,
  Zap, Target, ShieldCheck, GraduationCap, Award
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- BACKGROUND ---
const AmbientBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-900/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-500/10 dark:bg-violet-900/20 rounded-full blur-[120px]" />
  </div>
);

const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("relative overflow-hidden rounded-[2rem] border border-border/50 dark:border-white/5 bg-card/40 dark:bg-[#0f172a]/40 p-6 backdrop-blur-xl transition-all shadow-sm", className)}>
    {children}
  </div>
);

export default function ProfilePage() {
  const { user, loading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<any>(null);
  const [plannerStats, setPlannerStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthLoading || !user) return;
    const unsubP = onSnapshot(doc(db, "progress", user.uid), (s) => s.exists() && setProgress(s.data()));
    const unsubL = onSnapshot(doc(db, "planners", user.uid), (s) => {
        if (s.exists()) setPlannerStats(s.data().stats);
        setIsLoading(false);
    }, () => setIsLoading(false));
    return () => { unsubP(); unsubL(); };
  }, [user, isAuthLoading]);

  const stats = useMemo(() => {
    const cSet = new Set(progress?.completedLessons || []);
    let t = 0; let d = 0;
    const subjects = Object.values(ALL_SUBJECTS_OBJECT).map((s: any) => {
      const lessons = (s.chapters || []).flatMap((c: any) => c.lessons || []);
      const sT = lessons.length;
      const sD = lessons.filter((l: any) => cSet.has(l.id)).length;
      t += sT; d += sD;
      return { name: s.title, percentage: sT > 0 ? Math.round((sD / sT) * 100) : 0 };
    });
    const level = progress?.level || 1;
    const xp = progress?.xp || 0;
    return { subjects, totalLessons: t, doneLessons: d, level, xp, streak: plannerStats?.streakCurrent || 0, unlockedIds: new Set(plannerStats?.unlocked || []) };
  }, [progress, plannerStats]);

  // --- LOGICĂ SHARE (FIXATĂ) ---
  const handleShare = async () => {
    if (!shareRef.current) return;
    setIsSharing(true);
    toast({ title: "Generăm Cardul tău HD...", description: "Am mărit rezoluția pentru a nu mai fi tăiat." });

    try {
      // Așteptăm puțin să se încarce fonturile și imaginile
      await new Promise(r => setTimeout(r, 800));
      
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#030712',
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        width: 600,
        height: 1100, // Am mărit înălțimea pânzei
        onclone: (clonedDoc) => {
          // Forțăm elementul clonat să fie vizibil pentru randare
          const el = clonedDoc.getElementById('share-card-pass');
          if (el) el.style.display = 'flex';
        }
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = `StudentPass-${user?.displayName?.split(' ')[0]}.png`;
      link.click();
      toast({ title: "Succes! 🎉", description: "Cardul complet a fost salvat." });
    } catch (e) {
      toast({ title: "Eroare", variant: "destructive" });
    } finally { setIsSharing(false); }
  };

  if (isAuthLoading || isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-indigo-500" /></div>;

  return (
    <div className="min-h-screen text-foreground font-sans relative pb-24 transition-colors">
      <AmbientBackground />
      <main className="container max-w-6xl mx-auto px-4 py-12 relative z-10">
        
        {/* DESIGN PAGINĂ PROFIL (Interfață Site) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-4">
                <GlassCard className="flex flex-col items-center text-center h-full justify-center py-10 bg-indigo-500/[0.03]">
                    <div className="relative mb-6">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-2xl relative z-10">
                            <AvatarImage src={user?.photoURL || undefined} referrerPolicy="no-referrer" />
                            <AvatarFallback className="bg-indigo-600 text-white text-4xl font-black">{user?.displayName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-black px-4 py-1 rounded-full text-sm shadow-xl z-20">LVL {stats.level}</div>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">{user?.displayName}</h1>
                    <div className="flex gap-2 w-full mt-4 px-4">
                        <Button onClick={handleShare} disabled={isSharing} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-2xl">
                            {isSharing ? <Loader2 className="animate-spin w-4 h-4" /> : <Share2 className="w-4 h-4 mr-2" />} SHARE CARD
                        </Button>
                        <Button asChild variant="outline" className="h-12 w-12 rounded-2xl border-border"><Link href="/setari"><Edit className="w-4 h-4" /></Link></Button>
                    </div>
                </GlassCard>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="md:col-span-2 flex flex-col justify-center">
                    <p className="text-indigo-500 text-[10px] font-black uppercase mb-1">Experiență Acumulată</p>
                    <h2 className="text-5xl font-black">{stats.xp} <span className="text-lg text-muted-foreground">XP</span></h2>
                    <div className="h-3 w-full bg-muted dark:bg-black/40 rounded-full overflow-hidden mt-4 border border-border/50">
                        <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" initial={{ width: 0 }} animate={{ width: `${(stats.xp % 1000) / 10}%` }} />
                    </div>
                </GlassCard>
                <GlassCard className="flex flex-col items-center bg-orange-500/[0.05] border-orange-500/20">
                    <Flame className="w-10 h-10 text-orange-500 mb-2 animate-pulse" />
                    <span className="text-4xl font-black">{stats.streak}</span>
                    <p className="text-[10px] font-black uppercase text-orange-600">Zile Streak</p>
                </GlassCard>
                <GlassCard className="flex flex-col items-center bg-emerald-500/[0.05] border-emerald-500/20">
                    <Target className="w-10 h-10 text-emerald-500 mb-2" />
                    <span className="text-4xl font-black">{stats.doneLessons}</span>
                    <p className="text-[10px] font-black uppercase text-emerald-600">Lecții Gata</p>
                </GlassCard>
            </div>
        </div>

        {/* MATERII & TROFEE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3"><BookOpen className="text-indigo-500 w-5 h-5" /> Status Materii</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.subjects.map((s:any) => (
                        <GlassCard key={s.name} className="p-4 border-white/5">
                            <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-sm">{s.name}</h3><span className="text-xs text-muted-foreground">{s.percentage}%</span></div>
                            <div className="h-1.5 w-full bg-muted dark:bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${s.percentage}%` }} /></div>
                        </GlassCard>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-5">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-6"><Trophy className="text-yellow-500 w-5 h-5" /> Vitrina</h2>
                <GlassCard className="grid grid-cols-3 gap-3 bg-muted/10">
                    {Object.entries(achievementsList).slice(0, 6).map(([id, data]) => (
                        <div key={id} className={cn("aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border transition-all", stats.unlockedIds.has(id) ? "bg-indigo-500/10 border-indigo-500/30" : "opacity-20 grayscale")}>
                            <span className="text-2xl mb-1">{data.icon}</span>
                            <span className="text-[7px] font-black uppercase text-center leading-tight">{data.title}</span>
                        </div>
                    ))}
                </GlassCard>
            </div>
        </div>
      </main>

      {/* ========================================================== */}
      {/* === CARD SHARE REPARAT (FĂRĂ TĂIETURI & DESIGN ELITE) === */}
      {/* ========================================================== */}
      <div 
        id="share-card-pass"
        ref={shareRef} 
        className="fixed top-0 left-[-9999px] w-[600px] h-[1050px] bg-[#030712] flex flex-col overflow-hidden"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
            {/* Fundal Elite */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,_#1e1b4b_0%,_#030712_100%)]" />
            
            {/* Header */}
            <div className="relative z-10 p-10 flex justify-between items-center border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl">
                        <GraduationCap className="text-white w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-2xl tracking-tighter uppercase italic">ÎNVĂȚĂM ÎMPREUNĂ</h2>
                        <p className="text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase">Student Profile Pass</p>
                    </div>
                </div>
                <div className="text-white/30 font-mono text-sm">{format(new Date(), 'dd.MM.yyyy')}</div>
            </div>

            {/* Secțiune Profil */}
            <div className="relative z-10 flex flex-col items-center pt-12">
                <div className="relative">
                    <div className="absolute -inset-4 rounded-full border-4 border-indigo-500/20" />
                    <div className="w-48 h-48 rounded-full border-4 border-indigo-500 p-1 bg-[#030712] relative z-10 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName}`} 
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover" 
                            crossOrigin="anonymous"
                        />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-white text-black w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-2 border-indigo-600 z-20">
                        <span className="text-[10px] font-black leading-none">LVL</span>
                        <span className="text-2xl font-bold leading-none">{stats.level}</span>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase px-6 leading-tight">
                        {user?.displayName}
                    </h1>
                    <div className="inline-flex items-center gap-2 mt-4 bg-indigo-500/20 border border-indigo-500/40 px-8 py-3 rounded-full">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span className="text-white text-sm font-black uppercase tracking-widest">Utilizator Verificat</span>
                    </div>
                </div>
            </div>

            {/* STATS GRID - Reparat (fără tăieturi) */}
            <div className="relative z-10 grid grid-cols-2 gap-6 p-10 mt-10">
                <div className="bg-[#0f172a]/80 border border-white/10 p-10 rounded-[3rem] flex flex-col items-center shadow-2xl">
                    <Flame className="w-12 h-12 text-orange-500 mb-2" />
                    <p className="text-5xl font-black text-white">{stats.streak}</p>
                    <p className="text-xs font-bold text-orange-300 uppercase tracking-widest mt-2">Zile Streak</p>
                </div>

                <div className="bg-[#0f172a]/80 border border-white/10 p-10 rounded-[3rem] flex flex-col items-center shadow-2xl">
                    <Zap className="w-12 h-12 text-indigo-400 mb-2" />
                    <p className="text-5xl font-black text-white">{stats.xp}</p>
                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mt-2">Total XP</p>
                </div>

                <div className="bg-[#0f172a]/80 border border-white/10 p-10 rounded-[3rem] flex flex-col items-center shadow-2xl">
                    <Target className="w-12 h-12 text-emerald-500 mb-2" />
                    <p className="text-5xl font-black text-white">{stats.doneLessons}</p>
                    <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mt-2">Lecții Gata</p>
                </div>

                <div className="bg-[#0f172a]/80 border border-white/10 p-10 rounded-[3rem] flex flex-col items-center shadow-2xl">
                    <Trophy className="w-12 h-12 text-yellow-500 mb-2" />
                    <p className="text-5xl font-black text-white">{stats.unlockedIds.size}</p>
                    <p className="text-xs font-bold text-yellow-300 uppercase tracking-widest mt-2">Premii</p>
                </div>
            </div>

            {/* Footer Pass (Aici era problema, l-am asigurat) */}
            <div className="relative z-10 mt-auto w-full p-10 bg-indigo-600 flex items-center justify-between shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
                <div>
                    <p className="text-white font-black text-xl tracking-tighter uppercase italic">Construim viitorul României.</p>
                    <p className="text-indigo-100 text-xs font-bold opacity-80 uppercase tracking-widest">Alătură-te comunității noastre!</p>
                </div>
                <div className="bg-black/30 px-6 py-3 rounded-2xl border border-white/20">
                    <p className="text-white font-mono text-sm font-bold">invatam-impreuna.vercel.app</p>
                </div>
            </div>
      </div>
    </div>
  );
}