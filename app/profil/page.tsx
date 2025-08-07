// app/profil/page.tsx
'use client';

import { useState, useEffect, useMemo, FC, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useSpring, useInView, useTransform } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getUserProgress, UserProgress } from '@/lib/firebase';
import { ALL_SUBJECTS_OBJECT, Chapter, Lesson } from '@/lib/lessons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Componente UI & Iconițe
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, BookCheck, Target, Award, Star, Shield, Crown, TrendingUp, Medal, BrainCircuit, Sparkles } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';

// --- Componente Helper Animate ---

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const springValue = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(springValue, (current) => Math.round(current));

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, springValue, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const ProgressBadge: FC<{ level: 'Începător' | 'Avansat' | 'Expert' }> = ({ level }) => {
    const badgeConfig = {
        'Începător': { icon: <Star className="h-4 w-4" />, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
        'Avansat': { icon: <Shield className="h-4 w-4" />, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300" },
        'Expert': { icon: <Crown className="h-4 w-4" />, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300" }
    };
    const config = badgeConfig[level];
    return <Badge className={cn('border-transparent', config.color)}>{config.icon}<span className="ml-2">{level}</span></Badge>;
};

const CustomTooltip: FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold text-foreground">{`${label}`}</p>
        <p className="text-sm text-primary">{`Progres: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};


export default function ProfilePage() {
    const { user, loading: isAuthLoading } = useAuth();
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!isAuthLoading && user) {
            const fetchProgress = async () => {
                setIsLoading(true);
                const userProgress = await getUserProgress(user.uid);
                setProgress(userProgress);
                setIsLoading(false);
            };
            fetchProgress();
        } else if (!isAuthLoading && !user) {
            setIsLoading(false);
        }
    }, [user, isAuthLoading]);
    
    const stats = useMemo(() => {
        if (!progress) return { lessonsCompleted: 0, avgScore: 0, level: 'Începător' as const, perfectTests: 0, chartData: [] };
        
        const lessonsCompleted = progress.completedLessons?.length || 0;
        const totalScore = progress.testResults?.reduce((sum, test) => sum + (test.score / test.totalQuestions) * 100, 0) || 0;
        const avgScore = progress.testResults?.length > 0 ? Math.round(totalScore / progress.testResults.length) : 0;
        const perfectTests = progress.testResults?.filter(t => t.score === t.totalQuestions).length || 0;
        
        let level: 'Începător' | 'Avansat' | 'Expert' = 'Începător';
        if (avgScore >= 90 && lessonsCompleted >= 20) level = 'Expert';
        else if (avgScore >= 75 && lessonsCompleted >= 10) level = 'Avansat';
        
        const chartData = Object.values(ALL_SUBJECTS_OBJECT).map(subject => {
            const subjectLessons = subject.chapters.flatMap((c: Chapter) => c.lessons);
            const completed = subjectLessons.filter((l: Lesson) => progress.completedLessons?.includes(l.id)).length;
            return {
                name: subject.title.split(" ")[0],
                progres: subjectLessons.length > 0 ? Math.round((completed / subjectLessons.length) * 100) : 0,
            }
        });
        
        return { lessonsCompleted, avgScore, level, perfectTests, chartData };
    }, [progress]);

    if (isAuthLoading || isLoading) {
        return (
            <div className="container max-w-5xl mx-auto px-4 py-16">
                 <div className="flex items-center gap-6 mb-12"><Skeleton className="h-32 w-32 rounded-full" /><div className="space-y-2"><Skeleton className="h-8 w-64" /><Skeleton className="h-5 w-80" /></div></div>
                 <Skeleton className="h-10 w-full mb-8" />
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                 </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col min-h-[70vh] items-center justify-center text-center">
                <h2 className="text-2xl font-bold">Oops!</h2>
                <p className="text-muted-foreground mt-2">Te rugăm să te autentifici pentru a-ți vedea profilul.</p>
                <Button asChild className="mt-6"><Link href="/login">Autentificare</Link></Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container max-w-5xl mx-auto px-4 py-16">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, type: 'spring' }} className="relative mb-12 rounded-2xl border bg-card p-8 overflow-hidden">
                        <div className="absolute inset-0 -z-10 animate-aurora bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"/>
                        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                             <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                                    <AvatarFallback className="text-5xl">{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </motion.div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-4xl font-bold font-lora">{user.displayName || 'Utilizator'}</h1>
                                <p className="mt-1 text-muted-foreground">{user.email}</p>
                                <p className="text-xs text-muted-foreground mt-2">Membru din: {new Date(user.metadata.creationTime!).toLocaleDateString('ro-RO')}</p>
                            </div>
                            <Button asChild variant="outline" className="sm:ml-auto mt-4 sm:mt-0">
                                <Link href="/setari"><Edit className="mr-2 h-4 w-4" /> Editează Profilul</Link>
                            </Button>
                        </div>
                    </motion.div>
                    
                    <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                            <TabsTrigger value="overview">Prezentare Generală</TabsTrigger>
                            <TabsTrigger value="progress">Progres Detaliat</TabsTrigger>
                            <TabsTrigger value="rewards">Recompense</TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            <TabsContent value="overview" className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Card className="text-center"><CardHeader><CardTitle className="text-5xl font-bold text-primary"><AnimatedNumber value={stats.lessonsCompleted} /></CardTitle><CardDescription className="flex items-center justify-center gap-2"><BookCheck /> Lecții finalizate</CardDescription></CardHeader></Card>
                                <Card className="text-center"><CardHeader><CardTitle className="text-5xl font-bold text-primary"><AnimatedNumber value={stats.avgScore} />%</CardTitle><CardDescription className="flex items-center justify-center gap-2"><Target /> Scorul mediu</CardDescription></CardHeader></Card>
                                <Card className="text-center"><CardHeader><CardTitle className="text-2xl pt-3"><ProgressBadge level={stats.level} /></CardTitle><CardDescription className="flex items-center justify-center gap-2 pt-1"><Award /> Nivel Curent</CardDescription></CardHeader></Card>
                            </TabsContent>

                            <TabsContent value="progress" className="mt-8">
                                <Card><CardHeader><CardTitle>Progres pe Materii</CardTitle><CardDescription>Vezi procentul de lecții finalizate la fiecare materie.</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={stats.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><defs><linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} /><XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} /><Tooltip cursor={{fill: 'hsl(var(--accent))'}} content={<CustomTooltip />} /><Bar dataKey="progres" fill="url(#colorUv)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
                            </TabsContent>
                            
                            <TabsContent value="rewards" className="mt-8">
                                <Card><CardHeader><CardTitle>Recompense Deblocate</CardTitle><CardDescription>Continuă să înveți pentru a le debloca pe toate!</CardDescription></CardHeader><CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                    <motion.div whileHover={{ scale: 1.05 }} className={cn("p-4 rounded-lg transition-all group", stats.lessonsCompleted >= 1 ? "bg-accent shadow-lg" : "bg-muted opacity-60 grayscale")}>
                                        <div className="relative"><Sparkles className={cn("absolute inset-0 h-full w-full text-amber-400 opacity-0 transition-opacity duration-300", stats.lessonsCompleted >= 1 && "group-hover:opacity-100")}/><Star className="mx-auto h-10 w-10 text-amber-500 relative"/></div><p className="font-semibold mt-2 text-sm">Primii Pași</p><p className="text-xs text-muted-foreground">Ai finalizat prima lecție.</p>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className={cn("p-4 rounded-lg transition-all group", stats.perfectTests >= 1 ? "bg-accent shadow-lg" : "bg-muted opacity-60 grayscale")}>
                                        <div className="relative"><Sparkles className={cn("absolute inset-0 h-full w-full text-yellow-400 opacity-0 transition-opacity duration-300", stats.perfectTests >= 1 && "group-hover:opacity-100")}/><Medal className="mx-auto h-10 w-10 text-yellow-600 relative"/></div><p className="font-semibold mt-2 text-sm">Perfecționist</p><p className="text-xs text-muted-foreground">Primul test cu scor perfect.</p>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className={cn("p-4 rounded-lg transition-all group", stats.lessonsCompleted >= 10 ? "bg-accent shadow-lg" : "bg-muted opacity-60 grayscale")}>
                                        <div className="relative"><Sparkles className={cn("absolute inset-0 h-full w-full text-green-400 opacity-0 transition-opacity duration-300", stats.lessonsCompleted >= 10 && "group-hover:opacity-100")}/><TrendingUp className="mx-auto h-10 w-10 text-green-500 relative"/></div><p className="font-semibold mt-2 text-sm">Maratonist</p><p className="text-xs text-muted-foreground">Ai finalizat 10 lecții.</p>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} className={cn("p-4 rounded-lg transition-all group", stats.level === 'Expert' ? "bg-accent shadow-lg" : "bg-muted opacity-60 grayscale")}>
                                        <div className="relative"><Sparkles className={cn("absolute inset-0 h-full w-full text-purple-400 opacity-0 transition-opacity duration-300", stats.level === 'Expert' && "group-hover:opacity-100")}/><BrainCircuit className="mx-auto h-10 w-10 text-purple-500 relative"/></div><p className="font-semibold mt-2 text-sm">Expert</p><p className="text-xs text-muted-foreground">Ai atins nivelul maxim.</p>
                                    </motion.div>
                                </CardContent></Card>
                            </TabsContent>
                          </motion.div>
                        </AnimatePresence>
                    </Tabs>
                </motion.div>
            </main>
        </div>
    );
}