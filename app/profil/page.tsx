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

// UI & Icons
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit,
  BookOpen,
  Trophy,
  Star,
  Crown,
  Share2,
  Flame,
  ArrowRight,
  GraduationCap,
  LineChart,
  Check,
  Zap,
  Sparkles,
  ChevronRight,
  LayoutDashboard,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TIPURI ---
type UserProgress = {
  completedLessons: string[];
};

// --- TEME CULORI NEON ---
const SUBJECT_THEMES: Record<string, any> = {
  "Romana": { color: "text-blue-400", gradient: "from-blue-600 to-cyan-500", glow: "shadow-blue-500/20" },
  "Matematica": { color: "text-emerald-400", gradient: "from-emerald-600 to-teal-500", glow: "shadow-emerald-500/20" },
  "Informatica": { color: "text-violet-400", gradient: "from-violet-600 to-fuchsia-500", glow: "shadow-violet-500/20" },
  "Fizica": { color: "text-amber-400", gradient: "from-amber-600 to-orange-500", glow: "shadow-amber-500/20" },
  "Chimie": { color: "text-rose-400", gradient: "from-rose-600 to-pink-500", glow: "shadow-rose-500/20" },
};

// --- COMPONENTA BACKGROUND ANIMAT (Corectată) ---
const AmbientBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0a0a]">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_50%_200px,#1e1b4b,transparent)]" />
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1], 
        opacity: [0.2, 0.4, 0.2], 
      }} 
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/30 blur-[150px]" 
    />
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1], 
        opacity: [0.2, 0.4, 0.2], 
      }} 
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-600/30 blur-[150px]" 
    />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

// --- CARD STICLĂ (Reflectiv) ---
const GlassCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={cn(
    "relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-2xl transition-all duration-500 hover:border-white/10 hover:bg-white/10 hover:shadow-2xl group",
    className
  )}>
    {/* Shine Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    {children}
  </div>
);

// --- COMPONENTA CERC PROGRES ---
const NeonRing = ({ value, color = "text-primary" }: { value: number, color?: string }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-48 h-48 group">
      <div className={cn("absolute inset-0 blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 bg-current scale-75", color)} />
      <svg className="transform -rotate-90 w-full h-full relative z-10">
        <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
        <motion.circle
          cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          strokeLinecap="round"
          className={cn("drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]", color)}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black tracking-tighter text-white">{value}%</span>
        <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] mt-1">Global</span>
      </div>
    </div>
  );
};

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

  const handleShareImage = async () => {
    if (!shareRef.current) return;
    setIsSharing(true);

    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#09090b',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imageBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!imageBlob) throw new Error("Generare imagine eșuată");

      if (navigator.share) {
        const file = new File([imageBlob], 'progres-invatam-impreuna.png', { type: 'image/png' });
        await navigator.share({
          title: 'Progresul meu',
          text: `Am ajuns la nivelul ${stats.level}!`,
          files: [file]
        });
      } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'progres-invatam-impreuna.png';
        link.click();
        toast({ title: "Imagine salvată!", description: "Poți posta imaginea oriunde dorești." });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Eroare", description: "Nu am putut genera imaginea.", variant: "destructive" });
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

    const currentXP = completedCount * 100;
    const nextLevelXP = Math.floor(currentXP / 1000 + 1) * 1000;
    const level = Math.floor(currentXP / 1000) + 1;
    const progressToNextLevel = ((currentXP % 1000) / 1000) * 100;

    return { totalLessons: totalLessonsCount, completedLessons: completedCount, globalPercentage: totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0, subjects: subjectsProgress, level, currentXP, nextLevelXP, progressToNextLevel };
  }, [progress]);

  const rewards = [
    { id: "starter", title: "Începutul", desc: "1 lecție", icon: <Star className="h-6 w-6" />, unlocked: stats.completedLessons >= 1, color: "text-yellow-400" },
    { id: "pro", title: "Învățăcel", desc: "10 lecții", icon: <Zap className="h-6 w-6" />, unlocked: stats.completedLessons >= 10, color: "text-blue-400" },
    { id: "master", title: "Maestru", desc: "20 lecții", icon: <Crown className="h-6 w-6" />, unlocked: stats.completedLessons >= 20, color: "text-purple-400" },
  ];

  if (isAuthLoading || isLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-primary"></div></div>;
  if (!user) return <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white"><h1 className="text-2xl font-bold mb-4">Acces Restricționat</h1><Button asChild><Link href="/login">Autentificare</Link></Button></div>;

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white relative">
      <AmbientBackground />
      
      {/* Top Loading Bar */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 origin-left z-50 shadow-[0_0_15px_#a855f7]" />

      <main className="container max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-10">
        
        {/* --- HEADER SECȚIUNE --- */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-16">
          <div className="flex items-center gap-8">
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15 }} className="relative group">
              {/* Avatar Glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-indigo-500 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition duration-500"></div>
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-2 border-white/20 relative z-10 shadow-2xl">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback className="text-5xl font-black bg-[#0f172a] text-white">{user.displayName?.[0]}</AvatarFallback>
              </Avatar>
              
              {/* Level Badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-lg z-20 flex items-center gap-1">
                 <Crown className="w-3 h-3 fill-yellow-400 text-yellow-400" /> LVL {stats.level}
              </div>
            </motion.div>
            
            <div className="space-y-2">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-2 drop-shadow-lg">
                  Salut, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300">{user.displayName?.split(" ")[0]}</span>
                </h1>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                      Online
                   </div>
                   <span className="text-slate-500 text-sm">{user.email}</span>
                </div>
              </motion.div>
              
              <div className="flex gap-3 pt-4">
                <Button size="sm" variant="outline" asChild className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white backdrop-blur-md">
                  <Link href="/setari"><Edit className="w-3.5 h-3.5 mr-2"/> Setări</Link>
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={handleShareImage}
                  disabled={isSharing}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 border-0 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  {isSharing ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Share2 className="w-3.5 h-3.5 mr-2" />}
                  {isSharing ? "Generez..." : "Share Card"}
                </Button>
              </div>
            </div>
          </div>

          {/* XP Card - Mini Dashboard */}
          <GlassCard className="w-full lg:w-96 bg-white/5 border-white/10 !p-5">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300 font-bold mb-1">Experiență Totală</p>
                <p className="text-3xl font-black text-white tracking-tight">{stats.currentXP} <span className="text-lg text-slate-500 font-medium">/ {stats.nextLevelXP}</span></p>
              </div>
              <Sparkles className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full box-shadow-[0_0_10px_#8b5cf6]" 
                initial={{ width: 0 }} 
                animate={{ width: `${stats.progressToNextLevel}%` }} 
                transition={{ duration: 1.5, ease: "circOut" }}
              />
            </div>
            <p className="text-right text-[10px] text-slate-400 font-medium">{Math.round(stats.progressToNextLevel)}% până la nivelul următor</p>
          </GlassCard>
        </div>

        {/* --- BENTO GRID SYSTEM --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* 1. MAIN PROGRESS CARD */}
          <GlassCard className="md:col-span-6 lg:col-span-8 !p-0 flex flex-col sm:flex-row items-center justify-between group overflow-hidden bg-gradient-to-br from-[#1e1b4b]/50 to-[#0f172a]/50 border-white/10">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="p-10 flex-1 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20 w-fit">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" /> STREAK ACTIV
              </div>
              <div>
                 <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-xl">
                  {stats.completedLessons}
                </h2>
                <p className="text-slate-400 font-medium text-lg flex items-center gap-2">
                   Lecții Finalizate <span className="text-slate-600">/ {stats.totalLessons}</span>
                </p>
              </div>
            </div>
            
            <div className="p-10 relative z-10">
               <NeonRing value={stats.globalPercentage} color="text-violet-400" />
            </div>
          </GlassCard>

          {/* 2. CARD DASHBOARD (MONITORIZARE) */}
          <GlassCard 
            className="md:col-span-3 lg:col-span-4 group cursor-pointer border-indigo-500/20 bg-gradient-to-br from-indigo-900/30 to-[#020617] hover:border-indigo-400/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden"
          >
            <Link href="/dashboard" className="absolute inset-0 z-30" />
            <div className="absolute right-[-30px] bottom-[-30px] opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                <LayoutDashboard className="w-48 h-48 text-indigo-400" />
            </div>
            
            <div className="relative z-20 h-full flex flex-col justify-between min-h-[220px]">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl backdrop-blur-md border border-indigo-500/30 text-indigo-300 shadow-lg shadow-indigo-500/10">
                    <LineChart className="w-7 h-7" />
                  </div>
                  <div className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse shadow-[0_0_10px_#6366f1]">
                    LIVE
                  </div>
               </div>
               
               <div className="mt-4">
                 <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">Monitorizare</h3>
                 <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                   Analizează performanța și istoricul tău detaliat.
                 </p>
                 <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold group-hover:translate-x-2 transition-transform duration-300 uppercase tracking-wider">
                    Deschide <ChevronRight className="w-4 h-4" />
                 </div>
               </div>
            </div>
          </GlassCard>

          {/* 3. CARD CTA (CONTINUĂ STUDIUL) */}
          <GlassCard className="md:col-span-3 lg:col-span-4 flex flex-col justify-between group cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-900/10 transition-colors relative overflow-hidden">
             <Link href="/#materii" className="absolute inset-0 z-20" />
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             
             <div className="flex justify-between items-start relative z-10">
               <div>
                  <h3 className="font-bold text-xl text-emerald-400 drop-shadow-md">Continuă Studiul</h3>
                  <p className="text-sm text-slate-400 mt-1 font-medium">Învață ceva nou azi.</p>
               </div>
               <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                 <GraduationCap className="w-6 h-6" />
               </div>
             </div>
             
             <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-bold text-emerald-300 group-hover:translate-x-2 transition-transform relative z-10 uppercase tracking-wider">
               Mergi la Lecții <ArrowRight className="w-4 h-4" />
             </div>
          </GlassCard>

          {/* 4. MATERII */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.subjects.map((subject, index) => (
               <motion.div key={subject.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                 <Link href={`/materii/${subject.id}`} className="block h-full">
                    <GlassCard className="h-full group hover:bg-white/10 flex flex-col justify-between border-white/5 hover:border-white/10">
                       {/* Top Line Gradient */}
                       <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity", subject.gradient)} />
                       
                       <div className="flex justify-between items-start mb-6 pl-2">
                          <div className={cn("p-3 rounded-2xl bg-opacity-10 border border-opacity-20", subject.bg || "bg-slate-800")}>
                             <BookOpen className={cn("w-6 h-6", subject.color)} />
                          </div>
                          <span className={cn("text-3xl font-black opacity-30 group-hover:opacity-100 transition-opacity", subject.color)}>{subject.percentage}%</span>
                       </div>

                       <div className="pl-2">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">{subject.name}</h3>
                          
                          {/* Progress Bar Custom */}
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-3 relative">
                             <motion.div 
                               className={cn("h-full bg-gradient-to-r absolute top-0 left-0 shadow-[0_0_10px_currentColor]", subject.gradient)} 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${subject.percentage}%` }}
                               transition={{ duration: 1, delay: 0.2 }}
                             />
                          </div>
                       </div>
                    </GlassCard>
                 </Link>
               </motion.div>
            ))}
          </div>

          {/* 5. REALIZĂRI */}
          <div className="md:col-span-12">
            <GlassCard className="bg-[#020617]/50 border-white/5">
               <div className="flex items-center gap-3 mb-8">
                  <Trophy className="w-7 h-7 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  <h3 className="text-2xl font-bold text-white">Sala Trofeelor</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {rewards.map((r) => (
                     <div key={r.id} className={cn(
                        "relative p-5 rounded-2xl border transition-all duration-300 flex items-center gap-5 group overflow-hidden",
                        r.unlocked 
                          ? "bg-gradient-to-r from-white/5 to-white/10 border-white/10 hover:border-white/20" 
                          : "bg-white/0 border-white/5 opacity-40 grayscale"
                     )}>
                        <div className={cn("p-4 rounded-xl bg-black/40 shadow-inner ring-1 ring-white/10", r.unlocked ? r.color : "text-white")}>
                           {r.icon}
                        </div>
                        <div>
                           <h4 className="font-bold text-white text-base group-hover:text-primary transition-colors">{r.title}</h4>
                           <p className="text-xs text-slate-400 mt-1 font-medium">{r.desc}</p>
                        </div>
                        {r.unlocked && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />}
                     </div>
                  ))}
               </div>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* --- ELEMENTUL ASCUNS PENTRU SHARE (FIXAT PENTRU TEXT CLAR) --- */}
      <div 
        ref={shareRef}
        className="fixed top-0 left-[-9999px] w-[800px] h-[450px] bg-[#09090b] text-white flex flex-col overflow-hidden font-['Arial']"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#09090b] to-[#0f172a]" />
        <div className="absolute inset-0 opacity-10 bg-[size:40px_40px] bg-[image:linear-gradient(#6366f1_1px,transparent_1px),linear-gradient(90deg,#6366f1_1px,transparent_1px)]" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-violet-600 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-40"></div>

        <div className="relative z-10 w-full h-full p-10 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
             <div className="flex items-center gap-6">
                <div className="relative">
                   <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 to-indigo-500 rounded-2xl blur-md opacity-60"></div>
                   <div className="relative w-20 h-20 bg-[#1e1b4b] rounded-2xl border-2 border-white/20 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">{user.displayName?.[0]?.toUpperCase() || "U"}</span>
                   </div>
                </div>
                <div>
                   <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">{user.displayName || "Student"}</h1>
                   <div className="flex items-center gap-3 mt-1">
                      <div className="px-3 py-1 rounded bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-bold uppercase tracking-wider">Nivel {stats.level}</div>
                      <div className="text-sm text-slate-400 font-medium">{stats.currentXP} XP</div>
                   </div>
                </div>
             </div>
             <div className="text-right opacity-50"><p className="text-xs font-bold uppercase tracking-[0.2em]">Raport Progres</p><p className="text-xs">{new Date().toLocaleDateString('ro-RO')}</p></div>
          </div>

          <div className="flex-1 flex items-center justify-around py-4">
             <div className="text-center">
                <div className="text-[100px] leading-none font-black text-white drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">{stats.completedLessons}</div>
                <div className="text-indigo-200 text-lg font-bold uppercase tracking-widest mt-2 flex items-center justify-center gap-2"><BookOpen className="w-5 h-5" /> Lecții Finalizate</div>
             </div>
             <div className="w-[2px] h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
             <div className="flex flex-col items-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent" />
                      <circle cx="72" cy="72" r="60" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 * (1 - stats.globalPercentage / 100)} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                   </svg>
                   <div className="absolute text-center"><span className="text-3xl font-bold text-white">{stats.globalPercentage}%</span></div>
                </div>
                <span className="text-indigo-200 text-sm font-bold uppercase tracking-widest mt-3">Progres Total</span>
             </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]"></div><span className="text-sm text-slate-300 font-medium">Cont Activ</span></div>
             <div className="text-lg font-bold text-white tracking-tight">invatam-impreuna.vercel.app 🚀</div>
          </div>
        </div>
      </div>

    </div>
  );
}