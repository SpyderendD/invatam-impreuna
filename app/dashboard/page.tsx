'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
    useTaskPlanner, 
    Task, 
    AchievementStats, 
    achievementsList, 
    AchievementId 
} from '@/hooks/useTaskPlanner'; // Asigură-te că acest import este corect
import { format, addDays, startOfWeek, isToday, isPast } from 'date-fns';
import { ro } from 'date-fns/locale';
import { useInView } from 'react-intersection-observer';
import { QuoteOfTheDay } from '@/components/dashboard/QuoteOfTheDay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger, 
    DialogFooter 
} from '@/components/ui/dialog';
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { 
    Check, X, Plus, Trash2, Edit, ChevronLeft, ChevronRight, Settings as SettingsIcon, 
    History, Trophy, Download, Upload, Info, HelpCircle, Sparkles, Zap, Flame
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/* ========== Animații & Utilitare ========== */
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } },
};

function useIsTouch() {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(pointer: coarse)') : null;
        const update = () => setIsTouch(!!mq?.matches || ('ontouchstart' in window));
        update();
        mq?.addEventListener?.('change', update);
        return () => mq?.removeEventListener?.('change', update);
    }, []);
    return isTouch;
}

function useAudio(src: string) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const audio = new Audio(src);
            audio.volume = 0.3;
            audioRef.current = audio;
        }
    }, [src]);
    const play = () => { audioRef.current?.play().catch(err => console.error("Audio play failed:", err)); };
    return play;
}

/* ========== Componenta Principală: Dashboard ========== */
export default function DashboardPage() {
    const { loading: isAuthLoading } = useAuth();
    const planner = useTaskPlanner();
    const [weekOffset, setWeekOffset] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);
    const [askTutorial, setAskTutorial] = useState(false);

    const playSuccessSound = useAudio('/sounds/success.mp3');

    useEffect(() => {
        const tutSeen = localStorage.getItem('planner_tutorial_seen_v12'); // Am incrementat versiunea tutorialului
        if (!tutSeen) {
            const t = setTimeout(() => setAskTutorial(true), 600);
            return () => clearTimeout(t);
        }
    }, []);

    const { weekDates, weekLabel, weekStartDate } = useMemo((): { weekDates: string[]; weekLabel: string; weekStartDate: Date } => {
        const start = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
        const end = addDays(start, 6);
        const dates = Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), 'yyyy-MM-dd'));
        const label = `${format(start, 'd MMM', { locale: ro })} — ${format(end, 'd MMM yyyy', { locale: ro })}`;
        return { weekDates: dates, weekLabel: label, weekStartDate: start };
    }, [weekOffset]);

    const { settings: { autoApplySchedule }, applyScheduleToWeek } = planner;

    useEffect(() => {
        if (!autoApplySchedule) return;
        applyScheduleToWeek(weekStartDate);
    }, [weekStartDate, autoApplySchedule, applyScheduleToWeek]);

    if (isAuthLoading || planner.isLoading) return <DashboardSkeleton />;

    const handleStartTutorial = () => { setAskTutorial(false); setShowTutorial(true); };
    const handleSkipTutorial = () => { localStorage.setItem('planner_tutorial_seen_v12', 'true'); setAskTutorial(false); };
    const handleFinishTutorial = () => { localStorage.setItem('planner_tutorial_seen_v12', 'true'); setShowTutorial(false); };

    return (
        <div className="min-h-screen relative bg-background text-foreground transition-colors duration-500">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
                <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-rose-500/15 to-amber-400/15 blur-[90px]" />
            </div>

            <main className="container mx-auto px-4 py-6 md:py-12">
                <AnimatePresence>
                    {askTutorial && <AskTutorialDialog onConfirm={handleStartTutorial} onDecline={handleSkipTutorial} />}
                    {showTutorial && <TutorialOverlay onFinish={handleFinishTutorial} />}
                </AnimatePresence>

                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <HelpBlock content="Planifică-ți săptămâna, urmărește progresul și bifează-ți obiectivele!" dataStep="1" disabled={showTutorial}>
                            <div className="relative">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-lora tracking-tight">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                        Planificatorul Săptămânal
                                    </span>
                                </h1>
                                <p className="text-muted-foreground mt-1">Fii consecvent. Deblochează realizări.</p>
                            </div>
                        </HelpBlock>

                        <div data-step="5" className="flex gap-2 self-end sm:self-center">
                            <Button aria-label="Deschide tutorial" variant={showTutorial ? 'default' : 'outline'} size="icon" onClick={() => setShowTutorial(true)}><HelpCircle className="h-5 w-5" /></Button>
                            <HistoryDialog planner={planner} />
                            <AchievementsDialog achievements={planner.achievements} />
                            <SettingsDialog taskPlanner={planner} />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-8"><QuoteOfTheDay /></motion.div>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
                            <HelpBlock content="Navighează între săptămâni, aplică programul recurent și vezi ținta zilnică." dataStep="2" disabled={showTutorial}>
                                <motion.div variants={itemVariants} className="flex flex-wrap gap-3 items-center bg-card/60 backdrop-blur-sm p-3 rounded-xl border">
                                    <div className="flex items-center gap-2">
                                        <Button aria-label="Săptămâna precedentă" variant="outline" size="icon" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft /></Button>
                                        <Button aria-label="Săptămâna următoare" variant="outline" size="icon" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight /></Button>
                                    </div>
                                    <h2 className="font-semibold text-lg text-center flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> {weekLabel}</h2>
                                    <div className="ml-auto flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>Azi</Button>
                                        <Button variant="outline" size="sm" onClick={() => { planner.applyScheduleToWeek(weekStartDate); toast({ title: 'Program aplicat pentru săptămâna vizualizată' }); }}><Sparkles className="h-4 w-4 mr-1" /> Aplică program</Button>
                                    </div>
                                </motion.div>
                            </HelpBlock>
                            
                            <HelpBlock content="Fiecare zi: adaugă planuri, bifează, editează sau șterge. Azi are highlight." dataStep="3" disabled={showTutorial}>
                                <div>
                                    <motion.div variants={itemVariants} className="xl:hidden -mx-2 sm:mx-0">
                                        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                                            {weekDates.map(dateStr => (
                                                <div key={dateStr} className="snap-start shrink-0 w-4/5 sm:w-1/2 md:w-1/3 max-w-sm">
                                                    <DayColumn dateStr={dateStr} planner={planner} disableConfetti={showTutorial} playSuccessSound={playSuccessSound} />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="hidden xl:grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
                                        {weekDates.map(dateStr => <DayColumn key={dateStr} dateStr={dateStr} planner={planner} disableConfetti={showTutorial} playSuccessSound={playSuccessSound}/>)}
                                    </motion.div>
                                </div>
                            </HelpBlock>
                        </div>
                        
                        <aside className="xl:col-span-4 2xl:col-span-3 space-y-8 xl:sticky xl:top-24">
                           <HelpBlock content="Sumar vizual al seriei de zile consecutive și al premiilor deblocate." dataStep="4" disabled={showTutorial}>
                                <motion.div variants={itemVariants}><HeroCard planner={planner} /></motion.div>
                            </HelpBlock>
                            <HelpBlock content="Loghează rapid activități neplanificate." dataStep="6" disabled={showTutorial}>
                                <motion.div variants={itemVariants}><UnplannedTaskCard addTask={planner.addUnplannedTask} /></motion.div>
                            </HelpBlock>
                            <HelpBlock content="Import/Export, reset și program recurent sunt în Setări." dataStep="7" disabled={showTutorial}>
                                <div className="text-xs text-muted-foreground bg-card/60 border rounded-xl p-3">
                                    Tips: click pe pătrat pentru status, dublu-click pentru editare.
                                </div>
                            </HelpBlock>
                        </aside>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

/* ========== Componente Noi și Adaptate ========== */
function HeroCard({ planner }: { planner: ReturnType<typeof useTaskPlanner> }) {
    const isTouch = useIsTouch();
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0), y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 300, damping: 20 }), sy = useSpring(y, { stiffness: 300, damping: 20 });
    const rotateX = useTransform(sy, [-0.5, 0.5], ['8deg', '-8deg']);
    const rotateY = useTransform(sx, [-0.5, 0.5], ['-8deg', '8deg']);
    const onMove = (e: React.MouseEvent<HTMLDivElement>) => { if (ref.current) { const rect = ref.current.getBoundingClientRect(); x.set((e.clientX - rect.left) / rect.width - 0.5); y.set((e.clientY - rect.top) / rect.height - 0.5); }};
    const onLeave = () => { x.set(0); y.set(0); };
    
    const { achievements, plan } = planner;
    const totalCompletedTasks = useMemo(() => {
        return Object.values(plan).flatMap(day => day.tasks).filter(t => t.status === 'completed').length;
    }, [plan]);

    return (
        <motion.div ref={ref} onMouseMove={isTouch ? undefined : onMove} onMouseLeave={isTouch ? undefined : onLeave} style={isTouch ? undefined : { rotateX, rotateY }} className="preserve-3d">
            <Card className="border-border/60 bg-gradient-to-br from-background to-background/60 backdrop-blur-sm shadow-lg preserve-3d overflow-hidden">
                <div className="p-6 translate-z-36">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="flex items-center gap-2 text-lg"><Zap className="h-5 w-5 text-primary" /> Progresul Tău</CardTitle>
                        <CardDescription>Consecvența este cheia.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-2">
                        <div className="grid grid-cols-3 gap-4 text-center">
                           <AnimatedStat value={achievements.unlocked.size} label="Premii" icon={<Trophy className="h-6 w-6 text-amber-500 mb-1" />} />
                           <AnimatedStat value={achievements.streakCurrent} label="Serie Curentă" icon={<Flame className="h-6 w-6 text-orange-500 mb-1" />} />
                           <AnimatedStat value={totalCompletedTasks} label="Total Reușite" icon={<Check className="h-6 w-6 text-green-500 mb-1" />} />
                        </div>
                    </CardContent>
                </div>
                <style jsx>{`.preserve-3d { transform-style: preserve-3d; } .translate-z-36 { transform: translateZ(36px); }`}</style>
            </Card>
        </motion.div>
    );
}

function AnimatedStat({ value, label, icon }: { value: number; label: string; icon: JSX.Element }) {
    const [display, setDisplay] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
    useEffect(() => { if (inView) { const c = animate(0, value, { duration: 1.2, ease: 'easeOut', onUpdate(v) { setDisplay(Math.round(v)); } }); return () => c.stop(); } }, [inView, value]);
    return (<div ref={ref} className="flex flex-col items-center">{icon}<p className="text-xl font-bold">{display}</p><p className="text-xs text-muted-foreground">{label}</p></div>);
}

function DayColumn({ dateStr, planner, disableConfetti = false, playSuccessSound }: { dateStr: string; planner: ReturnType<typeof useTaskPlanner>; disableConfetti?: boolean, playSuccessSound: () => void }) {
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [burst, setBurst] = useState(0);
    const dayPlan = planner.plan[dateStr] || { tasks: [], goalReached: false };
    const date = new Date(dateStr + 'T12:00:00');
    const isCurrentDay = isToday(date);
    const dayIsPast = isPast(date) && !isCurrentDay;
    const handleAddTask = () => { const t = newTaskDesc.trim(); if (!t) return; planner.addTask(dateStr, t); setNewTaskDesc(''); };
    const completedCount = dayPlan.tasks.filter(t => t.status === 'completed').length;
    const progress = dayPlan.tasks.length > 0 ? (completedCount / dayPlan.tasks.length) * 100 : 0;
    const prevReached = useRef(dayPlan.goalReached);
    useEffect(() => {
        if (!prevReached.current && dayPlan.goalReached) {
            setBurst(b => b + 1);
            toast({ title: 'Țintă zilnică atinsă! 🎉', description: `Continuă tot așa!` });
            playSuccessSound();
        }
        prevReached.current = dayPlan.goalReached;
    }, [dayPlan.goalReached, playSuccessSound]);

    return (
        <motion.div layout className="relative">
            {isCurrentDay && <div aria-hidden className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/25 to-secondary/25 blur-lg" />}
            <Card className={`relative flex flex-col h-full transition-all duration-300 rounded-2xl border ${isCurrentDay ? 'border-primary/40' : ''} ${dayIsPast ? 'bg-muted/50 opacity-80' : 'bg-background/80'}`}>
                <CardHeader className="text-center p-4">
                    <div className="flex items-center justify-center gap-2">
                        <CardTitle className="text-base font-bold capitalize">{format(date, 'EEEE', { locale: ro })}</CardTitle>
                        {dayPlan.goalReached && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"><Sparkles className="h-3 w-3" /> Goal</span>}
                    </div>
                    <CardDescription className="text-sm">{format(date, 'd MMM', { locale: ro })}</CardDescription>
                    <Progress value={progress} className="h-1 mt-2" />
                </CardHeader>
                <CardContent className="p-2 min-h-[160px] lg:max-h-[420px] lg:overflow-y-auto space-y-2">
                    <AnimatePresence initial={false}>
                        {dayPlan.tasks.length === 0 && <motion.div className="text-xs text-muted-foreground text-center py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Niciun plan încă.</motion.div>}
                        {dayPlan.tasks.map((task, idx) => <TaskItem key={task.id} index={idx} dateStr={dateStr} task={task} planner={planner} playSuccessSound={playSuccessSound} />)}
                    </AnimatePresence>
                </CardContent>
                <div className="p-2 border-t mt-auto">
                    <div className="flex gap-2">
                        <Input id={`new-${dateStr}`} placeholder="Plan nou..." value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTask()} className="h-9 text-sm rounded-full" />
                        <Button size="sm" onClick={handleAddTask} disabled={!newTaskDesc.trim()} className="rounded-full"><Plus className="h-4 w-4 mr-1" /> Adaugă</Button>
                    </div>
                </div>
                <ConfettiBurst trigger={burst} disabled={disableConfetti} />
            </Card>
        </motion.div>
    );
}

function TaskItem({ dateStr, task, planner, playSuccessSound }: { dateStr: string; task: Task; planner: ReturnType<typeof useTaskPlanner>; index: number; playSuccessSound: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.description);
    const style = { pending: 'border-muted hover:bg-muted/40', completed: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-100 line-through', failed: 'border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-100' }[task.status];
    
    const cycle = () => { 
        if (task.status === 'pending') playSuccessSound(); 
        planner.toggleTaskStatus(dateStr, task.id); 
    };

    const onUpdate = () => { 
        const t = editText.trim(); 
        if (!t) { 
            planner.deleteTask(dateStr, task.id); 
            setIsEditing(false); 
            return; 
        } 
        planner.updateTaskDescription(dateStr, task.id, t); 
        setIsEditing(false); 
    };

    return (
        <motion.div layout initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} className={`group flex items-center gap-2 p-2 rounded-md border text-sm ${style}`}>
            <button onClick={cycle} className="shrink-0 grid place-items-center h-6 w-6 rounded-md border hover:scale-105 transition" aria-label="Schimbă status">
                {task.status === 'completed' ? <Check className="h-4 w-4 text-emerald-500" /> : task.status === 'failed' ? <X className="h-4 w-4 text-rose-500" /> : <div className="h-3.5 w-3.5 rounded-sm border" />}
            </button>
            {isEditing ? <Input value={editText} onChange={e => setEditText(e.target.value)} onBlur={onUpdate} onKeyDown={e => e.key === 'Enter' && onUpdate()} autoFocus className="h-7 text-sm flex-grow" /> : <span className="flex-grow select-text" onDoubleClick={() => setIsEditing(true)}>{task.description}</span>}
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsEditing(!isEditing)} aria-label="Editează"><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => planner.deleteTask(dateStr, task.id)} aria-label="Șterge"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
        </motion.div>
    );
}

/* ========== Componente Integrate și Îmbunătățite ========== */
function HelpBlock({ children, content, dataStep, disabled = false }: { children: React.ReactNode; content: string; dataStep: string; disabled?: boolean; }) {
    const isTouch = useIsTouch();
    if (isTouch || disabled) return <div data-step={dataStep} className="relative block">{children}</div>;
    return (<div data-step={dataStep} className="relative block"><TooltipProvider delayDuration={80}><Tooltip><TooltipTrigger asChild><div className="w-full">{children}</div></TooltipTrigger><TooltipContent side="top" className="max-w-xs text-center"><p>{content}</p></TooltipContent></Tooltip></TooltipProvider></div>);
}

function ConfettiBurst({ trigger, disabled = false }: { trigger: number; disabled?: boolean }) {
    const [show, setShow] = useState(false);
    useEffect(() => { if (!disabled && trigger > 0) { setShow(true); const t = setTimeout(() => setShow(false), 1200); return () => clearTimeout(t); } }, [trigger, disabled]);
    if (!show) return null;
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => {
                const angle = (360 / 25) * i;
                const distance = 70 + Math.random() * 60;
                const x = Math.cos((angle * Math.PI) / 180) * distance;
                const y = Math.sin((angle * Math.PI) / 180) * distance;
                const duration = 0.8 + Math.random() * 0.4;
                const delay = Math.random() * 0.1;
                const shapeClass = Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm';
                const colorClass = ['bg-cf-1', 'bg-cf-2', 'bg-cf-3', 'bg-cf-4', 'bg-cf-5'][i % 5];
                return (
                    <motion.span key={i} initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.5 }} animate={{ opacity: [1, 0], x, y, rotate: 360 + Math.random() * 180, scale: [1, 0.5] }} transition={{ duration, ease: 'easeOut', delay }} className={`absolute left-1/2 top-1/2 h-2 w-2 ${shapeClass} ${colorClass}`} />
                );
            })}
            <style jsx>{`.bg-cf-1 { background-color: #A78BFA; } .bg-cf-2 { background-color: #22D3EE; } .bg-cf-3 { background-color: #34D399; } .bg-cf-4 { background-color: #F472B6; } .bg-cf-5 { background-color: #F59E0B; }`}</style>
        </div>
    );
}

function UnplannedTaskCard({ addTask }: { addTask: (desc: string, type: 'verde' | 'rosu') => void }) {
    const [desc, setDesc] = useState('');
    const onAdd = (type: 'verde' | 'rosu') => { const t = desc.trim(); if (!t) return; addTask(t, type); setDesc(''); toast({ title: "Activitate adăugată!" }); };
    return (
        <Card className="p-4">
            <CardHeader className="p-0 mb-2">
                <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" /> Activitate Neplanificată</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Loghează acțiuni spontane.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
                <Input id="unplanned" placeholder="Descriere activitate..." value={desc} onChange={e => setDesc(e.target.value)} onKeyDown={e => e.key === 'Enter' && onAdd('verde')} className="h-9 text-sm rounded-full" />
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => onAdd('verde')} disabled={!desc.trim()} className="rounded-full flex-1"><Plus className="h-4 w-4 mr-1" /> Reușită</Button>
                    <Button size="sm" variant="outline" onClick={() => onAdd('rosu')} disabled={!desc.trim()} className="rounded-full flex-1">Încercare</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function SettingsDialog({ taskPlanner }: { taskPlanner: ReturnType<typeof useTaskPlanner> }) {
    const [settings, setSettings] = useState(taskPlanner.settings);
    const [currentScheduleDay, setCurrentScheduleDay] = useState(0);
    const [newScheduleTaskDesc, setNewScheduleTaskDesc] = useState('');
    useEffect(() => { setSettings(taskPlanner.settings); }, [taskPlanner.settings]);
    const handleSave = () => { taskPlanner.updateSettings(settings); toast({ title: 'Setările au fost salvate!' }); };
    const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    const handleAdd = () => { if (!newScheduleTaskDesc.trim()) return; taskPlanner.addRecurringTask(currentScheduleDay, newScheduleTaskDesc); setNewScheduleTaskDesc(''); };
    
    return (
        <Dialog>
            <DialogTrigger asChild><Button aria-label="Deschide setări" variant="outline" size="icon"><SettingsIcon className="h-5 w-5" /></Button></DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader><DialogTitle>Setări & Planificare</DialogTitle><DialogDescription>Personalizează experiența, programul și datele.</DialogDescription></DialogHeader>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="general">Generale</TabsTrigger><TabsTrigger value="schedule">Program</TabsTrigger><TabsTrigger value="data">Date</TabsTrigger></TabsList>
                    <TabsContent value="general" className="py-4 space-y-4">
                        <div className="space-y-2 p-4 rounded-lg border bg-card/50"><Label htmlFor="daily-goal" className="font-semibold">Țintă zilnică (reușite)</Label><Input id="daily-goal" type="number" min={1} max={1000} value={settings.dailyGoal} onChange={e => setSettings(s => ({ ...s, dailyGoal: Number(e.target.value) }))} /></div>
                        <div className="space-y-2 p-4 rounded-lg border bg-card/50"><div className="flex items-center justify-between"><Label className="font-semibold">Aplică Program Săptămânal Automat</Label><Switch checked={settings.autoApplySchedule} onCheckedChange={checked => setSettings(s => ({ ...s, autoApplySchedule: checked }))} /></div><p className="text-xs text-muted-foreground">Adaugă sarcini recurente în zilele goale la schimbarea săptămânii.</p></div>
                        <div className="space-y-2 p-4 rounded-lg border bg-card/50"><div className="flex items-center justify-between"><Label className="font-semibold">Resetare Progres Lunar</Label><Switch checked={settings.autoDelete} onCheckedChange={checked => setSettings(s => ({ ...s, autoDelete: checked }))} /></div><p className="text-xs text-muted-foreground">Șterge progresul pe 1 ale lunii (programul recurent rămâne).</p></div>
                    </TabsContent>
                    <TabsContent value="schedule" className="py-4 space-y-4">
                        <CardDescription>Configurează sarcini recurente pentru fiecare zi.</CardDescription>
                        <div className="flex flex-col md:flex-row gap-3 items-start"><select value={currentScheduleDay} onChange={e => setCurrentScheduleDay(Number(e.target.value))} className="w-full md:w-auto h-10 rounded-md border bg-background px-3 text-sm">{days.map((d, i) => <option key={i} value={i}>{d}</option>)}</select><div className="flex-1 w-full flex gap-2"><Input placeholder={`Adaugă plan pentru ${days[currentScheduleDay].toLowerCase()}...`} value={newScheduleTaskDesc} onChange={e => setNewScheduleTaskDesc(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} /><Button onClick={handleAdd} disabled={!newScheduleTaskDesc.trim()}><Plus className="h-4 w-4 mr-1" /> Adaugă</Button></div></div>
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">{taskPlanner.schedule[currentScheduleDay]?.length ? taskPlanner.schedule[currentScheduleDay].map(task => <div key={task.id} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-md"><span className="flex-grow">{task.description}</span><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => taskPlanner.deleteRecurringTask(currentScheduleDay, task.id)}><Trash2 className="h-4 w-4" /></Button></div>) : <p className="text-sm text-muted-foreground text-center py-4">Niciun plan recurent.</p>}</div>
                    </TabsContent>
                    <TabsContent value="data" className="py-4 space-y-4">
                        <div className="space-y-2 p-4 rounded-lg border bg-card/50"><Label className="font-semibold">Gestionare Date</Label><div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={taskPlanner.exportData}><Download className="mr-2 h-4 w-4" /> Exportă</Button><Button variant="secondary" onClick={() => (document.getElementById('planner-import') as HTMLInputElement)?.click()}><Upload className="mr-2 h-4 w-4" /> Importă</Button><input id="planner-import" type="file" accept=".json" onChange={e => e.target.files?.[0] && taskPlanner.importData(e.target.files[0])} hidden tabIndex={-1} /></div></div>
                        <div className="space-y-2 p-4 rounded-lg border border-destructive/50 bg-destructive/5"><Label className="font-semibold text-destructive">Zonă de Pericol</Label><Button variant="destructive" className="w-full" onClick={taskPlanner.resetAllData}><Trash2 className="mr-2 h-4 w-4" /> Resetează Toate Datele</Button></div>
                    </TabsContent>
                </Tabs>
                <DialogFooter><Button onClick={handleSave}>Salvează & Închide</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function HistoryDialog({ planner }: { planner: ReturnType<typeof useTaskPlanner> }) {
    const sortedDates = useMemo(() => Object.keys(planner.plan).sort((a, b) => b.localeCompare(a)), [planner.plan]);
    const totalCompleted = useMemo(() => sortedDates.reduce((acc, dateStr) => acc + planner.plan[dateStr].tasks.filter(t => t.status === 'completed').length, 0), [sortedDates, planner.plan]);
    return (
        <Dialog>
            <DialogTrigger asChild><Button aria-label="Deschide istoric" variant="outline" size="icon"><History className="h-5 w-5" /></Button></DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Istoric Detaliat</DialogTitle>
                    <DialogDescription>Ai finalizat un total de <span className="font-bold text-primary">{totalCompleted}</span> sarcini.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6 py-4">
                    {sortedDates.length ? sortedDates.map(dateStr => {
                        const day = planner.plan[dateStr]; const date = new Date(dateStr + 'T12:00:00'); const completedCount = day.tasks.filter(t => t.status === 'completed').length;
                        return (
                            <div key={dateStr}>
                                <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-lg">{format(date, 'EEEE, d MMMM yyyy', { locale: ro })}</h3><span className="font-bold text-sm text-green-600 dark:text-green-500">{completedCount} Reușite</span></div>
                                <div className="space-y-2 border p-3 rounded-md bg-muted/30">
                                    {day.tasks.length ? day.tasks.map(task => (<div key={task.id} className="flex items-start gap-3 text-sm">{task.status === 'completed' && <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />}{task.status === 'failed' && <X className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />}{task.status === 'pending' && <div className="h-4 w-4 border rounded-sm mt-0.5 shrink-0" />}<p className={`text-muted-foreground ${task.status !== 'pending' ? 'line-through' : ''}`}>{task.description}</p></div>)) : <p className="text-sm text-muted-foreground">Nicio activitate.</p>}
                                </div>
                            </div>
                        );
                    }) : <p className="text-center text-muted-foreground py-8">Niciun istoric de afișat.</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function AchievementsDialog({ achievements }: { achievements: AchievementStats }) {
    const unlockedCount = achievements.unlocked.size;
    const allAchievements = Object.entries(achievementsList);
    const totalCount = allAchievements.length;
    const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
    return (
        <Dialog>
            <DialogTrigger asChild><Button aria-label="Deschide premii" variant="outline" className="relative"><Trophy className="mr-2 h-5 w-5" /> Premii {unlockedCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-xs text-white flex items-center justify-center">{unlockedCount}</motion.span>}</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Premii și Realizări</DialogTitle>
                    <DialogDescription>Ai deblocat {unlockedCount} din {totalCount} premii disponibile.</DialogDescription>
                    <Progress value={progress} className="h-1 mt-2" />
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-3 py-4">
                    {allAchievements.map(([id, ach], idx) => {
                        const isUnlocked = achievements.unlocked.has(id as AchievementId);
                        return (
                            <motion.div key={id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * idx }} className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${isUnlocked ? 'border-amber-500/50 bg-amber-500/10' : 'bg-muted/50 opacity-60'}`}>
                                <div className={`text-4xl transition-all ${!isUnlocked && 'grayscale'}`}>{ach.icon}</div>
                                <div><p className={`font-bold ${isUnlocked ? 'text-amber-600 dark:text-amber-400' : ''}`}>{ach.title}</p><p className="text-sm text-muted-foreground">{ach.description}</p></div>
                            </motion.div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ========== Tutorial & Skeleton (Complet) ========== */
function TutorialOverlay({ onFinish }: { onFinish: () => void }) {
    const [step, setStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(7);
    const nextRef = useRef<HTMLButtonElement>(null);
    useEffect(() => { document.documentElement.classList.add('tour-active'); return () => document.documentElement.classList.remove('tour-active'); }, []);
    useEffect(() => { const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-step]')).map((el) => Number(el.getAttribute('data-step') || '0')).filter((n) => n > 0); setTotalSteps(nodes.length ? Math.max(...nodes) : 7); }, []);
    useEffect(() => {
        document.querySelectorAll('.highlighted-element').forEach((e) => e.classList.remove('highlighted-element'));
        const target = document.querySelector<HTMLElement>(`[data-step='${step}']`);
        if (target) { target.classList.add('highlighted-element'); smartScrollIntoView(target); }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && step < totalSteps) setStep((s) => s + 1);
            if (e.key === 'ArrowLeft' && step > 1) setStep((s) => s - 1);
            if (e.key === 'Escape') onFinish();
        };
        window.addEventListener('keydown', onKey);
        const t = setTimeout(() => nextRef.current?.focus(), 100);
        return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
    }, [step, totalSteps, onFinish]);

    const stepTexts: Record<number, string> = { 1: 'Bun venit! Aici îți planifici săptămâna și urmărești progresul.', 2: 'Navighează între săptămâni și aplică programul recurent.', 3: 'Fiecare zi: adaugă, bifează (prin click-uri succesive), editează sau șterge sarcini.', 4: 'Acesta este cardul tău de progres. Vezi premiile și seria de zile consecutive.', 5: 'Istoric, premii și setări sunt aici sus.', 6: 'Adaugă rapid activități neplanificate.', 7: 'Gata! Spor la organizare! 🎯' };
    const text = stepTexts[step] ?? '';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100]">
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[min(96vw,640px)] px-4 pointer-events-auto">
                <div className="rounded-xl border bg-background/95 shadow-xl p-4">
                    <div className="flex items-center justify-between mb-2"><span className="text-[11px] text-muted-foreground">Ghid interactiv</span><span className="text-[11px] text-muted-foreground">{Math.min(step, totalSteps)} / {totalSteps}</span></div>
                    <p className="text-sm mb-3">{text}</p>
                    <div className="flex justify-between items-center gap-2"><Button variant="ghost" size="sm" onClick={onFinish}>Sari</Button><div className="ml-auto flex gap-2"><Button size="sm" variant="outline" disabled={step <= 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>Înapoi</Button>{step < totalSteps ? <Button ref={nextRef} size="sm" onClick={() => setStep((s) => s + 1)}>Următorul</Button> : <Button ref={nextRef} size="sm" onClick={onFinish}>Am înțeles</Button>}</div></div>
                </div>
            </div>
            <style jsx global>{`.highlighted-element { position: relative; border-radius: 12px; outline: 2px solid hsl(var(--primary)); outline-offset: 4px; box-shadow: 0 0 0 9999px rgba(0,0,0,0.6); transition: box-shadow 0.3s ease, outline-color 0.3s ease; } .tour-active [data-radix-tooltip-content] { display: none !important; }`}</style>
        </motion.div>
    );
}

function smartScrollIntoView(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
}

function AskTutorialDialog({ onConfirm, onDecline }: { onConfirm: () => void; onDecline: () => void }) {
    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Bun venit la Planificator!</DialogTitle><DialogDescription>Vrei un tur rapid al funcționalităților?</DialogDescription></DialogHeader>
                <DialogFooter className="sm:justify-end"><Button type="button" variant="secondary" onClick={onDecline}>Nu, mulțumesc</Button><Button type="button" onClick={onConfirm}>Da, pornește turul!</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-6 md:py-12">
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-center"><div><Skeleton className="h-8 w-60 mb-2" /><Skeleton className="h-5 w-48" /></div><div className="flex gap-2"><Skeleton className="h-10 w-10 rounded-md" /><Skeleton className="h-10 w-10 rounded-md" /><Skeleton className="h-10 w-24 rounded-md" /><Skeleton className="h-10 w-10 rounded-md" /></div></div>
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
                            <Skeleton className="h-16 w-full rounded-xl" />
                            <div className="hidden xl:grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">{Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}</div>
                            <div className="flex xl:hidden gap-4 overflow-x-auto pb-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 w-4/5 shrink-0 rounded-2xl" />)}</div>
                        </div>
                        <aside className="xl:col-span-4 2xl:col-span-3 space-y-8"><Skeleton className="h-48 w-full rounded-xl" /><Skeleton className="h-32 w-full rounded-xl" /></aside>
                    </div>
                </div>
            </main>
        </div>
    );
}