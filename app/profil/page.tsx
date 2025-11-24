'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  useSpring,
  useInView,
  useTransform,
} from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { ALL_SUBJECTS_OBJECT, Chapter, Lesson } from "@/lib/lessons";

// UI & Icons
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  BookCheck,
  Target,
  Award,
  Star,
  Shield,
  Crown,
  TrendingUp,
  Medal,
  BrainCircuit,
  Sparkles,
  Download,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Importăm noile componente pentru statistici ---
// Asigură-te că aceste componente sunt în `app/profil/components/`
import { StatCard } from "@/components/StatCard";
import { StatRing } from "@/components/StatRing";

// Lazy-load chart components to reduce initial bundle
const BarProgressChart = dynamic(() => import("@/components/ProgressCharts").then(m => m.BarProgressChart), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground text-center py-10">Se încarcă graficul...</p>,
});
const RadarProgressChart = dynamic(() => import("@/components/ProgressCharts").then(m => m.RadarProgressChart), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground text-center py-10">Se încarcă graficul...</p>,
});

// ============================================================================
// == COMPONENTE AJUTĂTOARE
// ============================================================================

// Tipuri Firestore
type TestResult = {
  testId: string;
  score: number;
  totalQuestions: number;
  completedAt: Timestamp;
};
type UserProgress = {
  completedLessons: string[];
  testResults: TestResult[];
};

type ChartBarData = { name: string; progres: number };
type RadarData = { subject: string; value: number };

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { mass: 0.8, stiffness: 80, damping: 16 });
  const display = useTransform(spring, (v) => Math.round(v));
  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

function ProgressBadge({ level }: { level: "Începător" | "Avansat" | "Expert" }) {
  const cfg = {
    "Începător": { icon: <Star className="h-4 w-4" />, cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
    "Avansat": { icon: <Shield className="h-4 w-4" />, cls: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300" },
    "Expert": { icon: <Crown className="h-4 w-4" />, cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300" },
  }[level] || { icon: <Star className="h-4 w-4" />, cls: "bg-muted text-foreground" };
  return <Badge className={cn("border-transparent gap-2 px-3 py-1", cfg.cls)}>{cfg.icon}<span>{level}</span></Badge>;
}

// ============================================================================
// == COMPONENTA PRINCIPALĂ A PAGINII
// ============================================================================
export default function ProfilePage() {
  const { user, loading: isAuthLoading } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      setProgress(null);
      setIsLoading(false);
      return;
    }
    const ref = doc(db, "progress", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setProgress((snap.data() as UserProgress) || { completedLessons: [], testResults: [] });
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsub();
  }, [user, isAuthLoading]);

  const stats = useMemo(() => {
    if (!progress) {
      const totalLessonsSafe = Object.values(ALL_SUBJECTS_OBJECT || {}).reduce((acc, subject: any) => {
        const chapters = Array.isArray(subject?.chapters) ? subject.chapters : [];
        return acc + chapters.reduce((a: number, c: any) => a + (Array.isArray(c?.lessons) ? c.lessons.length : 0), 0);
      }, 0);
      return { lessonsCompleted: 0, avgScore: 0, level: "Începător" as const, perfectTests: 0, chartData: [] as ChartBarData[], radarData: [] as RadarData[], recentTests: [], totalLessons: totalLessonsSafe };
    }
    const lessonsCompleted = progress.completedLessons?.length || 0;
    const tests = progress.testResults || [];
    const percents = tests.map((t) => t.totalQuestions > 0 ? (t.score / t.totalQuestions) * 100 : 0);
    const avgScore = tests.length ? Math.round(percents.reduce((a, b) => a + b, 0) / tests.length) : 0;
    const perfectTests = tests.filter((t) => t.totalQuestions > 0 && t.score === t.totalQuestions).length;

    let level: "Începător" | "Avansat" | "Expert" = "Începător";
    if (avgScore >= 90 && lessonsCompleted >= 20) level = "Expert";
    else if (avgScore >= 75 && lessonsCompleted >= 10) level = "Avansat";

    const chartData: ChartBarData[] = Object.values(ALL_SUBJECTS_OBJECT || {}).map((subject: any) => {
      const chapters = Array.isArray(subject?.chapters) ? subject.chapters as Chapter[] : [];
      const subjectLessons = chapters.flatMap((c: Chapter) => Array.isArray(c?.lessons) ? c.lessons : [] as Lesson[]);
      const completed = subjectLessons.filter((l: Lesson) => progress.completedLessons?.includes(l.id)).length;
      const percent = subjectLessons.length ? Math.round((completed / subjectLessons.length) * 100) : 0;
      return { name: subject.title.split(" ")[0], progres: percent };
    });

    const recentTests = [...tests]
      .sort((a, b) => {
        const diff = (b.completedAt?.toMillis?.() || 0) - (a.completedAt?.toMillis?.() || 0);
        if (diff !== 0) return diff;
        return (a.testId || "").localeCompare(b.testId || "");
      })
      .slice(0, 5)
      .map((t) => ({ id: t.testId, percent: Math.round((t.totalQuestions ? t.score / t.totalQuestions : 0) * 100), date: t.completedAt?.toDate?.().toLocaleString?.("ro-RO") || "" }));

    const totalLessons = Object.values(ALL_SUBJECTS_OBJECT || {}).reduce((acc, subject: any) => {
      const chapters = Array.isArray(subject?.chapters) ? subject.chapters : [];
      return acc + chapters.reduce((a: number, c: any) => a + (Array.isArray(c?.lessons) ? c.lessons.length : 0), 0);
    }, 0);

    return { lessonsCompleted, avgScore, level, perfectTests, chartData, radarData: chartData.map((d) => ({ subject: d.name, value: d.progres })), recentTests, totalLessons };
  }, [progress]);

  const rewards = useMemo(() => {
    return [
      { id: "first_lesson", label: "Primii Pași", desc: "Ai finalizat prima lecție.", icon: <Star className="mx-auto h-10 w-10 text-amber-500" />, unlocked: stats.lessonsCompleted >= 1 },
      { id: "perfect_test", label: "Perfecționist", desc: "Primul test perfect.", icon: <Medal className="mx-auto h-10 w-10 text-yellow-600" />, unlocked: stats.perfectTests >= 1 },
      { id: "ten_lessons", label: "Maratonist", desc: "Ai finalizat 10 lecții.", icon: <TrendingUp className="mx-auto h-10 w-10 text-green-500" />, unlocked: stats.lessonsCompleted >= 10 },
      { id: "expert_level", label: "Expert", desc: "Ai atins nivelul maxim.", icon: <BrainCircuit className="mx-auto h-10 w-10 text-purple-500" />, unlocked: stats.level === "Expert" },
    ];
  }, [stats]);

  const handleExport = useCallback(() => {
    try {
      const payload = {
        user: {
          uid: user?.uid || null,
          displayName: user?.displayName || null,
          email: user?.email || null,
        },
        progress: progress || { completedLessons: [], testResults: [] },
        stats,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const namePart = user?.displayName || user?.email || "utilizator";
      a.download = `progres_${namePart.replace(/[^a-zA-Z0-9_-]+/g, "_")}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {}
  }, [progress, stats, user]);

  if (isAuthLoading || isLoading) {
    return <div className="container max-w-6xl mx-auto px-4 py-16"><div className="flex items-center gap-6 mb-12"><Skeleton className="h-32 w-32 rounded-full" /><div className="space-y-2"><Skeleton className="h-8 w-64" /><Skeleton className="h-5 w-80" /></div></div><Skeleton className="h-10 w-full mb-8" /><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /></div></div>;
  }

  if (!user) {
    return <div className="flex flex-col min-h-[70vh] items-center justify-center text-center"><h2 className="text-2xl font-bold">Oops!</h2><p className="text-muted-foreground mt-2">Te rugăm să te autentifici pentru a-ți vedea profilul.</p><Button asChild className="mt-6"><Link href="/login">Autentificare</Link></Button></div>;
  }

  const initial = (user.displayName || user.email || "?").charAt(0)?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-6xl mx-auto px-4 py-12 md:py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 22 }} className="relative mb-12 rounded-2xl border bg-card p-8 overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-violet-500/15 to-cyan-500/15" /><div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-rose-500/15 to-amber-400/15" />
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 260 }}><div className="relative"><div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-primary/0 blur-2xl" aria-hidden /><Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-lg"><AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Avatar"} /><AvatarFallback className="text-5xl">{initial}</AvatarFallback></Avatar></div></motion.div>
              <div className="text-center sm:text-left"><h1 className="text-4xl font-bold font-lora tracking-tight">{user.displayName || "Utilizator"}</h1><p className="mt-1 text-muted-foreground">{user.email}</p>{user.metadata?.creationTime && (<p className="text-xs text-muted-foreground mt-2">Membru din: {new Date(user.metadata.creationTime).toLocaleDateString("ro-RO")}</p>)}</div>
              <div className="flex gap-2 sm:ml-auto mt-4 sm:mt-0"><Button variant="outline" asChild><Link href="/setari"><Edit className="mr-2 h-4 w-4" /> Editează Profilul</Link></Button><Button variant="secondary" aria-label="Exportă progresul ca JSON" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export progres</Button></div>
            </div>
          </motion.div>

          <Tabs defaultValue="overview" className="w-full" onValueChange={(v) => setActiveTab(v)}>
            <TabsList className="grid w-full grid-cols-3 bg-muted/50"><TabsTrigger value="overview">Prezentare Generală</TabsTrigger><TabsTrigger value="progress">Progres Detaliat</TabsTrigger><TabsTrigger value="rewards">Recompense</TabsTrigger></TabsList>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                
                {/* ========================================================= */}
                {/* == TAB 1: PREZENTARE GENERALĂ (VERSIUNEA UNICĂ ȘI CORECTĂ) == */}
                {/* ========================================================= */}
                <TabsContent value="overview" className="mt-8">
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                  >
                    {(() => {
                      const itemVariants = {
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                      };
                      return [
                        <motion.div key="stat-lessons" variants={itemVariants}>
                          <StatCard icon={<BookCheck className="h-5 w-5" />} title="Lecții finalizate" description="Tot ce ai marcat ca „complet”.">
                            <StatRing value={stats.totalLessons ? Math.min(100, (stats.lessonsCompleted / stats.totalLessons) * 100) : 0}>
                              <AnimatedNumber value={stats.lessonsCompleted} />
                            </StatRing>
                            <p className="text-xs text-muted-foreground mt-2">din {stats.totalLessons}</p>
                          </StatCard>
                        </motion.div>,
                        <motion.div key="stat-score" variants={itemVariants}>
                          <StatCard icon={<Target className="h-5 w-5" />} title="Scor mediu" description="Media procentajelor la teste.">
                            <StatRing value={stats.avgScore}><span><AnimatedNumber value={stats.avgScore} />%</span></StatRing>
                            <p className="text-xs text-muted-foreground mt-2">procent</p>
                          </StatCard>
                        </motion.div>,
                        <motion.div key="stat-level" variants={itemVariants}>
                          <StatCard icon={<Award className="h-5 w-5" />} title="Nivel curent" description="Stabilit după scor și lecții.">
                            <ProgressBadge level={stats.level} />
                          </StatCard>
                        </motion.div>
                      ];
                    })()}
                  </motion.div>
                </TabsContent>

                {/* ========================================================= */}
                {/* == TAB 2: PROGRES DETALIAT == */}
                {/* ========================================================= */}
                <TabsContent value="progress" className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Progres pe Materii</CardTitle>
                      <CardDescription>Procentul de lecții finalizate la fiecare materie.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BarProgressChart data={stats.chartData as any} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Puncte forte (Radar)</CardTitle>
                      <CardDescription>Unde stai mai bine, ca procent de lecții finalizate.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadarProgressChart data={stats.radarData as any} />
                    </CardContent>
                  </Card>
                  <Card className="xl:col-span-2"><CardHeader><CardTitle>Teste recente</CardTitle><CardDescription>Ultimele 5 teste finalizate.</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{stats.recentTests.length > 0 ? (stats.recentTests.map((t) => (<div key={t.id} className="flex items-center justify-between rounded-md border p-3"><div className="flex flex-col"><span className="font-medium">{t.id}</span><span className="text-xs text-muted-foreground">{t.date}</span></div><div className="flex items-center gap-2">{t.percent === 100 && <Badge className="bg-green-600/15 text-green-600 dark:text-green-400 border-green-600/30">Perfect</Badge>}<span className="font-semibold">{t.percent}%</span></div></div>))) : (<p className="text-sm text-muted-foreground text-center py-4">Nu ai încă teste finalizate.</p>)}</CardContent></Card>
                </TabsContent>

                {/* ========================================================= */}
                {/* == TAB 3: RECOMPENSE == */}
                {/* ========================================================= */}
                <TabsContent value="rewards" className="mt-8">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5" /> Recompense Deblocate</CardTitle><CardDescription>Continuă să înveți pentru a le debloca pe toate!</CardDescription></CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      {rewards.map((r) => (
                        <motion.div key={r.id} whileHover={{ y: r.unlocked ? -4 : 0, scale: r.unlocked ? 1.02 : 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} className={cn("p-4 rounded-lg border transition-all group", r.unlocked ? "bg-accent shadow-lg border-transparent" : "bg-muted opacity-70 grayscale")}>
                          <div className="relative"><Sparkles className={cn("absolute inset-0 h-full w-full text-amber-400 opacity-0 transition-opacity duration-300", r.unlocked && "group-hover:opacity-100")} />{r.icon}</div>
                          <p className="font-semibold mt-2 text-sm">{r.label}</p><p className="text-xs text-muted-foreground">{r.desc}</p>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}