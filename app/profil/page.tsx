'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ALL_SUBJECTS_OBJECT, Chapter, Lesson } from "@/lib/lessons";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';
import { ParticlesBackground } from '@/components/animations/ParticlesBackground';

// UI & Icons
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  BookOpen,
  Trophy,
  Star,
  Crown,
  Share2,
  Flame,
  LineChart,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  Zap,
  Sparkles,
  GraduationCap,
  Target,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TIPURI DE DATE ---
type UserProgress = {
  completedLessons: string[];
  xp?: number;
  level?: number;
  streak?: number;
};

// --- CONSTANTE CULORI MATERII ---
const SUBJECT_THEMES: Record<string, any> = {
  "Romana": { color: "text-blue-400", gradient: "from-blue-600 to-cyan-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  "Matematica": { color: "text-emerald-400", gradient: "from-emerald-600 to-teal-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  "Informatica": { color: "text-violet-400", gradient: "from-violet-600 to-fuchsia-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  "Fizica": { color: "text-amber-400", gradient: "from-amber-600 to-orange-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  "Chimie": { color: "text-rose-400", gradient: "from-rose-600 to-pink-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

// --- BACKGROUND ANIMAT ---
const AmbientBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#030712]">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-900/20 rounded-full blur-[120px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
  </div>
);

// --- COMPONENTA CARD STICLĂ ---
const GlassCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={cn(
    "relative overflow-hidden rounded-2xl border border-white/5 bg-[#0f172a]/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-[#0f172a]/60 hover:shadow-2xl group",
    className
  )}>
    {children}
  </div>
);

export default function ProfilePage() {
  const { user, loading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      setProgress(null);
      setIsLoading(false);
      return;
    }
    const ref = doc(db, "progress", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as UserProgress;
      setProgress(data || { completedLessons: [] });
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsub();
  }, [user, isAuthLoading]);

  // --- GENERARE IMAGINE ---
  const handleShareImage = async () => {
    if (!shareRef.current) return;
    setIsSharing(true);

    try {
      await document.fonts.ready;
      
      // Folosim o configurație specifică pentru a evita problemele CORS
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#030712',
        scale: 3, 
        useCORS: true, 
        allowTaint: true,
        logging: false,
        width: 600,
        height: 900,
        windowWidth: 1920,
        // Important: ignorăm imaginile care ar putea cauza erori dacă nu se încarcă
        ignoreElements: (element) => {
            return element.tagName === 'IMG' && !element.hasAttribute('crossorigin');
        }
      });

      const imageBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!imageBlob) throw new Error("Generare eșuată");

      if (navigator.share) {
        const file = new File([imageBlob], 'progres-invatam-impreuna.png', { type: 'image/png' });
        await navigator.share({
          title: `Nivelul meu pe Învățăm Împreună`,
          files: [file]
        });
      } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'progres-invatam-impreuna.png';
        link.click();
        toast({ title: "Card salvat!", description: "Imaginea a fost descărcată." });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Eroare", description: "Nu am putut genera cardul.", variant: "destructive" });
    } finally {
      setIsSharing(false);
    }
  };

  const stats = useMemo(() => {
    const completedSet = new Set(progress?.completedLessons || []);
    let totalLessonsCount = 0;
    let completedCount = 0;

    const subjectsProgress = Object.values(ALL_SUBJECTS_OBJECT).map((subject: any) => {
      const chapters = (subject.chapters || []) as Chapter[];
      const lessons = chapters.flatMap(c => c.lessons as Lesson[]);
      const subjectTotal = lessons.length;
      const subjectCompleted = lessons.filter(l => completedSet.has(l.id)).length;
      totalLessonsCount += subjectTotal;
      completedCount += subjectCompleted;
      const theme = SUBJECT_THEMES[subject.title.split(" ")[0]] || SUBJECT_THEMES["Matematica"];
      return {
        id: subject.id,
        name: subject.title,
        total: subjectTotal,
        completed: subjectCompleted,
        percentage: subjectTotal > 0 ? Math.round((subjectCompleted / subjectTotal) * 100) : 0,
        ...theme
      };
    });

    const calculatedXP = completedCount * 100;
    const calculatedLevel = Math.floor(calculatedXP / 1000) + 1;

    const currentXP = progress?.xp ?? calculatedXP;
    const level = progress?.level ?? calculatedLevel;
    const streak = progress?.streak ?? 0;

    const nextLevelXP = level * 1000;
    const prevLevelXP = (level - 1) * 1000;
    const xpInCurrentLevel = currentXP - prevLevelXP;
    const xpRequiredForNext = nextLevelXP - prevLevelXP;
    const progressToNextLevel = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNext) * 100));

    return { 
      totalLessons: totalLessonsCount, 
      completedLessons: completedCount, 
      globalPercentage: totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0, 
      subjects: subjectsProgress, 
      level, currentXP, nextLevelXP, progressToNextLevel, streak 
    };
  }, [progress]);

  const rewards = [
    { id: "starter", title: "Începutul", desc: "1 lecție", icon: <Star className="h-5 w-5" />, unlocked: stats.completedLessons >= 1, color: "text-yellow-400" },
    { id: "pro", title: "Învățăcel", desc: "10 lecții", icon: <Zap className="h-5 w-5" />, unlocked: stats.completedLessons >= 10, color: "text-blue-400" },
    { id: "premium", title: "Premium", desc: "20 lecții", icon: <Crown className="h-5 w-5" />, unlocked: stats.completedLessons >= 20, color: "text-purple-400" },
    { id: "master", title: "Maestru", desc: "50 lecții", icon: <GraduationCap className="h-5 w-5" />, unlocked: stats.completedLessons >= 50, color: "text-green-400" },
    { id: "legend", title: "Legendă", desc: "100 lecții", icon: <Trophy className="h-5 w-5" />, unlocked: stats.completedLessons >= 100, color: "text-orange-400" },
  ];

  const unlockedRewardsCount = rewards.filter(r => r.unlocked).length;

  if (isAuthLoading || isLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  if (!user) return <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white"><h1 className="text-2xl font-bold mb-4">Acces Restricționat</h1><Button asChild><Link href="/login">Autentificare</Link></Button></div>;

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white relative pb-20">
      <AmbientBackground />
      <ParticlesBackground />
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 origin-left z-50 shadow-[0_0_15px_#a855f7]" />

      <main className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* === HEADER PROFIL (Live) === */}
        <div className="mb-12">
          {/* Top Bar */}
          <div className="flex justify-between items-start mb-8">
             <div className="flex items-center gap-6">
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                   <Avatar className="h-24 w-24 border-2 border-[#030712] relative z-10">
                      {/* AICI FOLOSIM IMAGINEA DE LA GOOGLE */}
                      <AvatarImage src={user.photoURL || undefined} referrerPolicy="no-referrer" />
                      <AvatarFallback className="bg-[#0f172a] text-2xl font-bold">{user.displayName?.[0]}</AvatarFallback>
                   </Avatar>
                   <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-400 z-20">
                      LVL {stats.level}
                   </div>
                </div>
                <div>
                   <h1 className="text-3xl font-bold text-white tracking-tight">{user.displayName}</h1>
                   <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Cont Elev
                   </p>
                </div>
             </div>
             
             <div className="flex gap-3">
               <Button size="sm" variant="secondary" onClick={handleShareImage} disabled={isSharing} className="bg-white/10 hover:bg-white/20 text-white border border-white/5">
                  {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
                  {isSharing ? "..." : "Share"}
               </Button>
               <Button size="sm" variant="outline" asChild className="bg-transparent border-white/20 text-white hover:bg-white/5">
                  <Link href="/setari"><Edit className="w-4 h-4" /></Link>
               </Button>
             </div>
          </div>

          {/* Stats Bar Mare */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* XP Card */}
             <div className="md:col-span-2 bg-[#0f172a]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles className="w-24 h-24 text-indigo-500" /></div>
                <div className="relative z-10">
                   <div className="flex justify-between items-end mb-2">
                      <div>
                         <p className="text-xs text-indigo-300 font-bold tracking-widest uppercase mb-1">Nivel Curent</p>
                         <p className="text-4xl font-black text-white">{stats.level}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm text-slate-400 font-medium">{stats.currentXP} <span className="text-slate-600">/ {stats.nextLevelXP} XP</span></p>
                      </div>
                   </div>
                   {/* Progress Bar */}
                   <div className="h-3 w-full bg-[#020617] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 rounded-full shadow-[0_0_15px_#8b5cf6]"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.progressToNextLevel}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                      />
                   </div>
                   <p className="text-xs text-slate-500 mt-2 text-right">Mai ai {stats.nextLevelXP - stats.currentXP} XP până la nivelul {stats.level + 1}</p>
                </div>
             </div>

             {/* Streak Card */}
             <div className="bg-[#0f172a]/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
                <Flame className="w-10 h-10 text-orange-500 mb-3 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse" />
                <span className="text-4xl font-black text-white">{stats.streak}</span>
                <span className="text-xs text-orange-300 font-bold uppercase tracking-widest mt-1">Zile Streak</span>
             </div>
          </div>
        </div>

        {/* === CONTENT GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
           
           {/* Sidebar Stânga */}
           <div className="md:col-span-4 space-y-6">
              <Link href="/dashboard" className="block group">
                 <GlassCard className="h-full border-indigo-500/20 bg-gradient-to-br from-[#1e1b4b]/40 to-[#020617]/80 hover:border-indigo-500/40">
                    <div className="flex items-center justify-between mb-6">
                       <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                          <LayoutDashboard className="w-6 h-6" />
                       </div>
                       <ChevronRight className="w-5 h-5 text-indigo-500/50 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Panou de Control</h3>
                    <p className="text-sm text-slate-400">Vezi grafice detaliate și gestionează programul de învățare.</p>
                 </GlassCard>
              </Link>

              <GlassCard className="flex items-center gap-4">
                 <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Target className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-2xl font-bold text-white">{stats.completedLessons}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Lecții Finalizate</p>
                 </div>
              </GlassCard>
           </div>

           {/* Dreapta - Materii */}
           <div className="md:col-span-8">
              <div className="flex items-center gap-2 mb-4">
                 <BookOpen className="w-5 h-5 text-slate-400" />
                 <h2 className="text-lg font-bold text-white">Progres pe Materii</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {stats.subjects.map((subject) => (
                    <Link key={subject.id} href={`/materii/${subject.id}`} className="block group"> 
                       <div className={cn("p-5 rounded-xl border bg-[#0f172a]/40 backdrop-blur-sm transition-all hover:-translate-y-1", subject.border)}>Evaluarea Națională
                          <div className="flex justify-between items-start mb-4">
                             <h3 className={cn("font-bold text-lg", subject.color)}>{subject.name}</h3> 
                             <span className="text-2xl font-black text-slate-500/50 group-hover:text-white transition-colors">{subject.percentage}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#020617] rounded-full overflow-hidden">
                             <motion.div 
                                className={cn("h-full bg-gradient-to-r", subject.gradient)}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${subject.percentage}%` }}
                                transition={{ duration: 1 }}
                             />
                          </div>
                       </div>
                    </Link>
                 ))}
              </div>
           </div>

           {/* Footer - Trofee */}
           <div className="md:col-span-12 mt-6">
              <GlassCard className="bg-[#020617]/40">
                 <div className="flex items-center gap-2 mb-6">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-bold text-white">Sala Trofeelor</h3>
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {rewards.map((r) => (
                       <div key={r.id} className={cn(
                          "flex flex-col items-center text-center p-4 rounded-xl border transition-all",
                          r.unlocked 
                             ? "bg-white/5 border-white/10" 
                             : "bg-transparent border-white/5 opacity-40 grayscale"
                       )}>
                          <div className={cn("mb-3 p-3 rounded-full bg-[#020617]", r.color)}>{r.icon}</div>
                          <p className="font-bold text-sm text-white mb-1">{r.title}</p>
                          <p className="text-[10px] text-slate-400">{r.desc}</p>
                       </div>
                    ))}
                 </div>
              </GlassCard>
           </div>
        </div>
      </main>

      {/* === CARD SHARE (GENERAT PENTRU INSTAGRAM) === */}
      {/* Folosim DICEBEAR aici pentru a evita problemele CORS */}
      <div 
        ref={shareRef}
        className="fixed top-0 left-[-9999px] w-[600px] h-[900px] z-[-50] pointer-events-none opacity-100 bg-[#09090b]"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
         {/* Layout Design "Player Card" */}
         <div className="w-full h-full relative flex flex-col p-10 overflow-hidden">
            
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#09090b] to-[#09090b]" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-violet-900/20 to-transparent" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

            {/* Top Badge */}
            <div className="relative z-10 flex justify-between items-center mb-10">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                  <span className="text-sm font-bold text-slate-300 tracking-widest">INVATAM-IMPREUNA</span>
               </div>
               <div className="text-white/30 font-mono text-sm">{new Date().toLocaleDateString()}</div>
            </div>

            {/* Main Profile Section */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="relative w-48 h-48 mb-6">
                  {/* Glowing Ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 blur-sm" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-fuchsia-500 border-b-indigo-500 border-l-transparent rotate-45" />
                  
                  <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-[#09090b] bg-[#0f172a]">
                     {/* AVATAR GENERAT SAFE-CORS */}
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || "User"}&backgroundColor=1e1b4b&textColor=fff&fontSize=40`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                     />
                  </div>
                  
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-black font-black px-5 py-1.5 rounded-full shadow-lg text-xl uppercase tracking-wider">
                     LVL {stats.level}
                  </div>
               </div>

               <h1 className="text-5xl font-black text-white text-center mt-4 mb-2 drop-shadow-xl tracking-tight">
                  {user?.displayName || "Student"}
               </h1>
               <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-widest text-sm bg-indigo-500/10 px-4 py-1 rounded border border-indigo-500/20">
                  <GraduationCap className="w-4 h-4" /> Future Expert
               </div>
            </div>

            {/* Stats Grid 2x2 */}
            <div className="relative z-10 grid grid-cols-2 gap-5 mt-auto mb-10">
               {/* XP */}
               <div className="bg-[#1e1b4b]/40 border border-indigo-500/30 p-6 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-indigo-400 mb-2" />
                  <span className="text-4xl font-black text-white">{stats.currentXP}</span>
                  <span className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest mt-1">Total XP</span>
               </div>

               {/* Streak */}
               <div className="bg-orange-900/20 border border-orange-500/30 p-6 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-500 mb-2" />
                  <span className="text-4xl font-black text-white">{stats.streak}</span>
                  <span className="text-[10px] text-orange-200 uppercase font-bold tracking-widest mt-1">Zile Streak</span>
               </div>

               {/* Lessons */}
               <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center">
                  <Target className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="text-4xl font-black text-white">{stats.completedLessons}</span>
                  <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-widest mt-1">Reușite</span>
               </div>

               {/* Trophies */}
               <div className="bg-yellow-900/20 border border-yellow-500/30 p-6 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                  <span className="text-4xl font-black text-white">{unlockedRewardsCount}</span>
                  <span className="text-[10px] text-yellow-200 uppercase font-bold tracking-widest mt-1">Premii</span>
               </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-center gap-2 opacity-50 border-t border-white/10 pt-6">
                <span className="text-sm font-medium tracking-wide">Generează cardul tău pe invatam-impreuna.vercel.app</span>
            </div>
         </div>
      </div>
    </div>
  );
}