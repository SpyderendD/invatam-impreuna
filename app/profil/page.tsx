"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

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
import { StatCard } from "@/components/StatCard";
import { StatRing } from "@/components/StatRing";

// ============================================================================
// == COMPONENTE AJUTĂTOARE (rămân în același fișier)
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

// Număr animat
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

// Badge pentru nivel
function ProgressBadge({
  level,
}: {
  level: "Începător" | "Avansat" | "Expert";
}) {
  const cfg = {
    Începător: {
      icon: <Star className="h-4 w-4" />,
      cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    },
    Avansat: {
      icon: <Shield className="h-4 w-4" />,
      cls: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    },
    Expert: {
      icon: <Crown className="h-4 w-4" />,
      cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    },
  }[level] || {
    icon: <Star className="h-4 w-4" />,
    cls: "bg-muted text-foreground",
  };
  return (
    <Badge className={cn("border-transparent gap-2 px-3 py-1", cfg.cls)}>
      {cfg.icon}
      <span>{level}</span>
    </Badge>
  );
}

// Tooltip pentru grafice
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <p className="font-bold text-foreground">{label}</p>
      <p className="text-sm text-primary">Progres: {payload[0].value}%</p>
    </div>
  );
}

// ============================================================================
// == COMPONENTA PRINCIPALĂ A PAGINII
// ============================================================================
export default function ProfilePage() {
  const { user, loading: isAuthLoading } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Preluare progres în timp real din Firestore
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      setProgress(null);
      setIsLoading(false);
      return;
    }
    const ref = doc(db, "progress", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setProgress(
          (snap.data() as UserProgress) || {
            completedLessons: [],
            testResults: [],
          }
        );
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
    return () => unsub();
  }, [user, isAuthLoading]);

  // Calcularea statisticilor
  const stats = useMemo(() => {
    if (!progress) {
      return {
        lessonsCompleted: 0,
        avgScore: 0,
        level: "Începător" as const,
        perfectTests: 0,
        chartData: [],
        radarData: [],
        recentTests: [],
      };
    }
    const lessonsCompleted = progress.completedLessons?.length || 0;
    const tests = progress.testResults || [];
    const percents = tests.map((t) =>
      t.totalQuestions > 0 ? (t.score / t.totalQuestions) * 100 : 0
    );
    const avgScore = tests.length
      ? Math.round(percents.reduce((a, b) => a + b, 0) / tests.length)
      : 0;
    const perfectTests = tests.filter(
      (t) => t.totalQuestions > 0 && t.score === t.totalQuestions
    ).length;

    let level: "Începător" | "Avansat" | "Expert" = "Începător";
    if (avgScore >= 90 && lessonsCompleted >= 20) level = "Expert";
    else if (avgScore >= 75 && lessonsCompleted >= 10) level = "Avansat";

    const chartData = Object.values(ALL_SUBJECTS_OBJECT).map((subject) => {
      const subjectLessons = subject.chapters.flatMap(
        (c: Chapter) => c.lessons
      );
      const completed = subjectLessons.filter((l: Lesson) =>
        progress.completedLessons?.includes(l.id)
      ).length;
      const percent = subjectLessons.length
        ? Math.round((completed / subjectLessons.length) * 100)
        : 0;
      return { name: subject.title.split(" ")[0], progres: percent };
    });

    const recentTests = [...tests]
      .sort(
        (a, b) =>
          (b.completedAt?.toMillis?.() || 0) -
          (a.completedAt?.toMillis?.() || 0)
      )
      .slice(0, 5)
      .map((t) => ({
        id: t.testId,
        percent: Math.round(
          (t.totalQuestions ? t.score / t.totalQuestions : 0) * 100
        ),
        date: t.completedAt?.toDate?.().toLocaleString?.("ro-RO") || "",
      }));

    return {
      lessonsCompleted,
      avgScore,
      level,
      perfectTests,
      chartData,
      radarData: chartData.map((d) => ({ subject: d.name, value: d.progres })),
      recentTests,
    };
  }, [progress]);

  // Funcție export
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(
        progress || { completedLessons: [], testResults: [] },
        null,
        2
      );
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `progres_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {}
  };

  // Stare de încărcare
  if (isAuthLoading || isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-6 mb-12">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Utilizator neautentificat
  if (!user) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center text-center">
        <h2 className="text-2xl font-bold">Oops!</h2>
        <p className="text-muted-foreground mt-2">
          Te rugăm să te autentifici pentru a-ți vedea profilul.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Autentificare</Link>
        </Button>
      </div>
    );
  }

  const initial =
    (user.displayName || user.email || "?").charAt(0)?.toUpperCase() || "?";
  const rewards = [
    {
      id: "first_lesson",
      label: "Primii Pași",
      desc: "Ai finalizat prima lecție.",
      icon: <Star className="mx-auto h-10 w-10 text-amber-500" />,
      unlocked: stats.lessonsCompleted >= 1,
    },
    {
      id: "perfect_test",
      label: "Perfecționist",
      desc: "Primul test perfect.",
      icon: <Medal className="mx-auto h-10 w-10 text-yellow-600" />,
      unlocked: stats.perfectTests >= 1,
    },
    {
      id: "ten_lessons",
      label: "Maratonist",
      desc: "Ai finalizat 10 lecții.",
      icon: <TrendingUp className="mx-auto h-10 w-10 text-green-500" />,
      unlocked: stats.lessonsCompleted >= 10,
    },
    {
      id: "expert_level",
      label: "Expert",
      desc: "Ai atins nivelul maxim.",
      icon: <BrainCircuit className="mx-auto h-10 w-10 text-purple-500" />,
      unlocked: stats.level === "Expert",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-6xl mx-auto px-4 py-12 md:py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header Profil */}
          <motion.div
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="relative mb-12 rounded-2xl border bg-card p-8 overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-violet-500/15 to-cyan-500/15" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-rose-500/15 to-amber-400/15" />
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 260 }}
              >
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-primary/0 blur-2xl"
                    aria-hidden
                  />
                  <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-lg">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || "Avatar"}
                    />
                    <AvatarFallback className="text-5xl">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </motion.div>
              <div className="text-center sm:text-left">
                <h1 className="text-4xl font-bold font-lora tracking-tight">
                  {user.displayName || "Utilizator"}
                </h1>
                <p className="mt-1 text-muted-foreground">{user.email}</p>
                {user.metadata?.creationTime && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Membru din:{" "}
                    {new Date(user.metadata.creationTime).toLocaleDateString(
                      "ro-RO"
                    )}
                  </p>
                )}
              </div>
              <div className="flex gap-2 sm:ml-auto mt-4 sm:mt-0">
                <Button variant="outline" asChild>
                  <Link href="/setari">
                    <Edit className="mr-2 h-4 w-4" /> Editează Profilul
                  </Link>
                </Button>
                <Button variant="secondary" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" /> Export progres
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs
            defaultValue="overview"
            className="w-full"
            onValueChange={(v) => setActiveTab(v)}
          >
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="overview">Prezentare Generală</TabsTrigger>
              <TabsTrigger value="progress">Progres Detaliat</TabsTrigger>
              <TabsTrigger value="rewards">Recompense</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* ========================================================= */}
                {/* == TAB 1: PREZENTARE GENERALĂ (refăcut complet) == */}
                {/* ========================================================= */}
                <TabsContent value="overview" className="mt-8">
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {}, // Stare inițială goală pentru container
                      visible: { transition: { staggerChildren: 0.1 } },
                    }}
                  >
                    {/* Definim varianta de animație pentru FIECARE copil */}
                    {(() => {
                      const itemVariants = {
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { type: "spring", stiffness: 100 },
                        },
                      };
                      return (
                        <>
                          <motion.div variants={itemVariants}>
                            <StatCard
                              icon={<BookCheck className="h-5 w-5" />}
                              title="Lecții finalizate"
                              description="Tot ce ai marcat ca „complet”."
                            >
                              <StatRing
                                value={Math.min(
                                  100,
                                  (stats.lessonsCompleted / 50) * 100
                                )}
                              >
                                <AnimatedNumber
                                  value={stats.lessonsCompleted}
                                />
                              </StatRing>
                              <p className="text-xs text-muted-foreground mt-2">
                                dintr-un obiectiv de 50
                              </p>
                            </StatCard>
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <StatCard
                              icon={<Target className="h-5 w-5" />}
                              title="Scor mediu"
                              description="Media procentajelor la teste."
                            >
                              <StatRing value={stats.avgScore}>
                                <span>
                                  <AnimatedNumber value={stats.avgScore} />%
                                </span>
                              </StatRing>
                              <p className="text-xs text-muted-foreground mt-2">
                                procent
                              </p>
                            </StatCard>
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <StatCard
                              icon={<Award className="h-5 w-5" />}
                              title="Nivel curent"
                              description="Stabilit după scor și lecții."
                            >
                              <div className="flex flex-col items-center">
                                <div className="h-32 flex items-center justify-center">
                                  <ProgressBadge level={stats.level} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 opacity-0">
                                  placeholder
                                </p>
                              </div>
                            </StatCard>
                          </motion.div>
                        </>
                      );
                    })()}
                  </motion.div>
                </TabsContent>

                {/* ========================================================= */}
                {/* == TAB 2: PROGRES DETALIAT (cod complet) == */}
                {/* ========================================================= */}
                <TabsContent
                  value="progress"
                  className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Progres pe Materii</CardTitle>
                      <CardDescription>
                        Procentul de lecții finalizate la fiecare materie.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={stats.chartData}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="hsl(var(--primary))"
                                  stopOpacity={0.85}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="hsl(var(--primary))"
                                  stopOpacity={0.15}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              opacity={0.2}
                              vertical={false}
                            />
                            <XAxis
                              dataKey="name"
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <RechartsTooltip
                              cursor={{ fill: "hsl(var(--accent))" }}
                              content={<CustomTooltip />}
                            />
                            <Bar
                              dataKey="progres"
                              fill="url(#colorUv)"
                              radius={[6, 6, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-10">
                          Nu există date încă.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Puncte forte (Radar)</CardTitle>
                      <CardDescription>
                        Unde stai mai bine, ca procent de lecții finalizate.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats.radarData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart data={stats.radarData}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis
                              dataKey="subject"
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                            <Radar
                              name="Progres"
                              dataKey="value"
                              stroke="hsl(var(--primary))"
                              fill="hsl(var(--primary))"
                              fillOpacity={0.25}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-10">
                          Nu există date încă.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="xl:col-span-2">
                    <CardHeader>
                      <CardTitle>Teste recente</CardTitle>
                      <CardDescription>
                        Ultimele 5 teste finalizate.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2">
                      {stats.recentTests.length > 0 ? (
                        stats.recentTests.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{t.id}</span>
                              <span className="text-xs text-muted-foreground">
                                {t.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {t.percent === 100 && (
                                <Badge className="bg-green-600/15 text-green-600 dark:text-green-400 border-green-600/30">
                                  Perfect
                                </Badge>
                              )}
                              <span className="font-semibold">
                                {t.percent}%
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nu ai încă teste finalizate.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ========================================================= */}
                {/* == TAB 3: RECOMPENSE (cod complet) == */}
                {/* ========================================================= */}
                <TabsContent value="rewards" className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" /> Recompense Deblocate
                      </CardTitle>
                      <CardDescription>
                        Continuă să înveți pentru a le debloca pe toate!
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      {rewards.map((r) => (
                        <motion.div
                          key={r.id}
                          whileHover={{
                            y: r.unlocked ? -4 : 0,
                            scale: r.unlocked ? 1.02 : 1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 18,
                          }}
                          className={cn(
                            "p-4 rounded-lg border transition-all group",
                            r.unlocked
                              ? "bg-accent shadow-lg border-transparent"
                              : "bg-muted opacity-70 grayscale"
                          )}
                        >
                          <div className="relative">
                            <Sparkles
                              className={cn(
                                "absolute inset-0 h-full w-full text-amber-400 opacity-0 transition-opacity duration-300",
                                r.unlocked && "group-hover:opacity-100"
                              )}
                            />
                            {r.icon}
                          </div>
                          <p className="font-semibold mt-2 text-sm">
                            {r.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {r.desc}
                          </p>
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
