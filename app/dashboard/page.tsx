'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTaskPlanner, achievementsList, AchievementId, Task, TaskStatus } from '@/hooks/useTaskPlanner'; 
import { format, addDays, startOfWeek, isToday, isPast } from 'date-fns';
import { ro } from 'date-fns/locale';
import { QuoteOfTheDay } from '@/components/dashboard/QuoteOfTheDay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Check, X, Plus, Trash2, ChevronLeft, ChevronRight, Settings as SettingsIcon, History, Trophy, Info, Sparkles, Zap, Flame, LayoutDashboard, Loader2, Lock, HelpCircle, Download, Upload, Trash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from "@/lib/utils";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Footer } from '@/components/layout/footer';

// --- FUNDAL ADAPTIV ---
const AmbientBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-background transition-colors duration-500">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-900/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 dark:bg-violet-900/20 rounded-full blur-[120px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay"></div>
  </div>
);

// --- CARD DE STICLĂ ADAPTIV ---
const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn(
    "relative overflow-hidden rounded-2xl border border-border/50 dark:border-white/5 bg-card/40 dark:bg-[#0f172a]/40 p-5 backdrop-blur-xl transition-all duration-300 hover:shadow-xl dark:hover:bg-[#0f172a]/80",
    className
  )}>
    {children}
  </div>
);

export default function DashboardPage() {
    const { user, loading: isAuthLoading } = useAuth();
    const planner = useTaskPlanner();
    const [weekOffset, setWeekOffset] = useState(0);
    const [stats, setStats] = useState({ xp: 0, level: 1 });
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        if (planner.isLoading || !user) return;
        const today = new Date();
        if (today.getDate() === 1) {
            const key = `reset-${today.getMonth()}-${today.getFullYear()}`;
            if (localStorage.getItem('last_reset') !== key) {
                planner.resetMonthlyPlan().then(() => {
                    localStorage.setItem('last_reset', key);
                    planner.applyScheduleToWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
                    toast({ title: "Lună nouă! Calendarul a fost curățat. 🚀" });
                });
            }
        }
    }, [planner.isLoading, user, planner]); 

    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, "progress", user.uid), (snap) => {
            if (snap.exists()) setStats({ xp: snap.data().xp || 0, level: snap.data().level || 1 });
        });
        return () => unsub();
    }, [user]);

    const { weekDates, weekLabel, weekStartDate } = useMemo(() => {
        const start = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
        const end = addDays(start, 6);
        return { 
            weekDates: Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), 'yyyy-MM-dd')),
            weekLabel: `${format(start, 'd MMM', { locale: ro })} — ${format(end, 'd MMM yyyy', { locale: ro })}`,
            weekStartDate: start
        };
    }, [weekOffset]);

    if (isAuthLoading || planner.isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-indigo-500 w-12 h-12" /></div>;

    const progressPercent = ((stats.xp % 1000) / 1000) * 100;

    return (
        <>
            <div className="min-h-screen relative text-foreground font-sans selection:bg-indigo-500/30 transition-colors duration-500 pb-20">
                <AmbientBackground />
                {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
                
                <main className="container mx-auto px-4 py-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <GlassCard className="lg:col-span-2 flex flex-col justify-center relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><LayoutDashboard className="w-32 h-32 text-indigo-500" /></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-indigo-600/10 dark:bg-indigo-600/20 p-3 rounded-xl border border-indigo-500/20"><Zap className="text-indigo-600 dark:text-indigo-400 w-8 h-8" /></div>
                                    <div>
                                        <h1 className="text-2xl font-bold">Salut, {user?.displayName?.split(' ')[0]}!</h1>
                                        <p className="text-xs text-indigo-600 dark:text-indigo-300 uppercase font-bold tracking-widest">Nivel {stats.level} — Student Dedicat</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-indigo-600 dark:text-indigo-300">Progres Nivel</span>
                                        <span className="text-muted-foreground">{stats.xp} / {stats.level * 1000} XP</span>
                                    </div>
                                    <div className="h-3 w-full bg-muted dark:bg-black/40 rounded-full overflow-hidden border border-border/50 dark:border-white/5 p-0.5">
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                                            initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <div className="grid grid-cols-2 gap-4">
                            <GlassCard className="flex flex-col items-center justify-center text-center bg-orange-500/[0.05] border-orange-500/20">
                                <Flame className="w-8 h-8 text-orange-500 mb-2 animate-pulse" />
                                <span className="text-3xl font-black">{planner.achievements.streakCurrent}</span>
                                <span className="text-[10px] text-orange-600 dark:text-orange-300 uppercase font-bold tracking-widest">Zile Streak</span>
                            </GlassCard>
                            <GlassCard className="flex flex-col items-center justify-center bg-yellow-500/[0.05] border-yellow-500/20">
                                <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                                <span className="text-3xl font-black">{planner.achievements.unlocked.size}</span>
                                <span className="text-[10px] text-yellow-600 dark:text-yellow-200 uppercase font-bold tracking-widest">Premii</span>
                            </GlassCard>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
                            <QuoteOfTheDay />
                            <GlassCard className="flex flex-wrap gap-3 items-center justify-between !p-3">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => setWeekOffset(w => w - 1)} className="hover:bg-muted"><ChevronLeft className="w-5 h-5" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => setWeekOffset(w => w + 1)} className="hover:bg-muted"><ChevronRight className="w-5 h-5" /></Button>
                                    <h2 className="font-bold text-sm ml-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> {weekLabel}</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => setWeekOffset(0)} className="text-xs bg-muted">Azi</Button>
                                    <Button size="sm" onClick={() => { planner.applyScheduleToWeek(weekStartDate); toast({ title: "Program aplicat!" }); }} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">Aplică Program</Button>
                                </div>
                            </GlassCard>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {weekDates.map((dateStr) => <DayColumn key={dateStr} dateStr={dateStr} planner={planner} />)}
                            </div>
                        </div>

                        <aside className="xl:col-span-4 2xl:col-span-3 space-y-6 xl:sticky xl:top-8">
                           <UnplannedTaskCard addTask={planner.addUnplannedTask} />
                           <GlassCard>
                              <h3 className="text-sm font-bold mb-4 uppercase tracking-widest flex items-center gap-2 border-b border-border/50 pb-2"><SettingsIcon className="w-4 h-4 text-indigo-500" /> Panou Unelte</h3>
                              <div className="grid grid-cols-2 gap-3">
                                 <HistoryDialog planner={planner} />
                                 <AchievementsDialog achievements={planner.achievements} />
                                 <div className="col-span-2"><SettingsDialog planner={planner} onShowTutorial={() => setShowTutorial(true)} /></div>
                              </div>
                           </GlassCard>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    );
}

// --- SUB-COMPONENTE ---

function DayColumn({ dateStr, planner }: any) {
    const [val, setVal] = useState('');
    const day = planner.plan[dateStr] || { tasks: [], goalReached: false };
    const date = new Date(dateStr + 'T12:00:00');
    const isTodayCol = isToday(date);
    const dayIsPast = isPast(date) && !isTodayCol;
    const progress = day.tasks.length > 0 ? (day.tasks.filter((t:any) => t.status === 'completed').length / day.tasks.length) * 100 : 0;
    return (
        <GlassCard className={cn("flex flex-col h-full min-h-[350px] !p-0 border-border/50", isTodayCol && "border-indigo-500/50 bg-indigo-500/[0.05] dark:bg-indigo-500/10", dayIsPast && "opacity-60")}>
            <div className="p-4 bg-muted/30 border-b border-border/50">
                <div className="flex justify-between items-center mb-1"><span className="text-xs font-bold capitalize">{format(date, 'EEEE', { locale: ro })}</span>{day.goalReached && <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />}</div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono"><span>{format(date, 'd MMM')}</span><span>{Math.round(progress)}%</span></div>
                <div className="h-1.5 w-full bg-muted dark:bg-black/40 rounded-full mt-2 overflow-hidden"><motion.div className="h-full bg-indigo-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} /></div>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-muted min-h-[150px]">
                <AnimatePresence mode="popLayout">{day.tasks.map((task: any) => <TaskItem key={task.id} dateStr={dateStr} task={task} planner={planner} />)}</AnimatePresence>
            </div>
            <div className="p-3 border-t border-border/50 bg-muted/10 flex gap-2">
                <Input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && (planner.addTask(dateStr, val), setVal(''))} placeholder="Adaugă..." className="h-8 text-xs bg-background border-border" />
                <Button size="icon" className="h-8 w-8 bg-indigo-600 text-white" onClick={() => { if(val.trim()){planner.addTask(dateStr, val); setVal('');} }}><Plus className="w-4 h-4" /></Button>
            </div>
        </GlassCard>
    );
}

function TaskItem({ dateStr, task, planner }: { dateStr: string, task: Task, planner: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.description);
    const styles: Record<TaskStatus, string> = {
        pending: 'border-border bg-muted/20 text-foreground',
        completed: 'border-emerald-500/30 bg-emerald-500/[0.08] dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 line-through opacity-70',
        failed: 'border-rose-500/30 bg-rose-500/[0.08] dark:bg-rose-500/10 text-rose-600 dark:text-rose-300'
    };
    const onUpdate = () => { if (!editText.trim()) return planner.deleteTask(dateStr, task.id); planner.updateTaskDescription(dateStr, task.id, editText); setIsEditing(false); };
    return (
        <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className={cn("group flex items-center gap-2 p-2 rounded-xl border text-[11px] cursor-pointer hover:scale-[1.02] transition-all", styles[task.status])}>
            <button onClick={() => planner.toggleTaskStatus(dateStr, task.id)} className="shrink-0">{task.status === 'completed' ? <Check className="w-3 h-3 text-emerald-500" /> : task.status === 'failed' ? <X className="w-3 h-3 text-rose-500" /> : <div className="w-3.5 h-3.5 border border-muted-foreground/30 rounded-sm" />}</button>
            {isEditing ? <Input value={editText} onChange={e => setEditText(e.target.value)} onBlur={onUpdate} autoFocus className="h-6 text-[10px] bg-background border-none p-1" /> : <span className="flex-grow truncate" onDoubleClick={() => setIsEditing(true)}>{task.description}</span>}
            <button onClick={() => planner.deleteTask(dateStr, task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3 text-rose-500/70 hover:text-rose-500" /></button>
        </motion.div>
    );
}

function UnplannedTaskCard({ addTask }: any) {
    const [desc, setDesc] = useState('');
    return (
        <GlassCard className="space-y-4 shadow-lg">
            <h3 className="text-xs font-bold flex items-center gap-2"><Info className="w-4 h-4 text-indigo-500" /> Activitate Rapidă</h3>
            <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ce ai făcut spontan?" className="text-xs bg-background border-border h-9" />
            <div className="grid grid-cols-2 gap-3">
                <Button size="sm" onClick={() => { if(desc.trim()){addTask(desc, 'verde'); setDesc('');} }} className="bg-emerald-600 text-white h-9 text-[10px] font-bold">REUȘITĂ</Button>
                <Button size="sm" onClick={() => { if(desc.trim()){addTask(desc, 'rosu'); setDesc('');} }} variant="outline" className="h-9 text-[10px] border-rose-500/30 font-bold">EȘEC</Button>
            </div>
        </GlassCard>
    );
}

function SettingsDialog({ planner, onShowTutorial }: any) {
    const [settings, setSettings] = useState(planner.settings);
    const [currDay, setCurrDay] = useState(0);
    const [newDesc, setNewDesc] = useState('');
    const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    useEffect(() => { setSettings(planner.settings); }, [planner.settings]);
    return (
        <Dialog>
            <DialogTrigger asChild><Button variant="secondary" className="w-full text-[10px] justify-start bg-muted font-bold border-border/50"><SettingsIcon className="mr-2 h-4 w-4 text-indigo-500" /> SETĂRI COMPLETE</Button></DialogTrigger>
            <DialogContent className="bg-background sm:max-w-xl border-border backdrop-blur-3xl shadow-2xl">
                <DialogHeader><DialogTitle className="flex items-center gap-2 font-lora"><SettingsIcon className="w-5 h-5 text-indigo-500" /> Configurare</DialogTitle></DialogHeader>
                <Tabs defaultValue="general" className="mt-4">
                    <TabsList className="grid grid-cols-3 bg-muted p-1 rounded-xl h-11 border border-border">
                        <TabsTrigger value="general" className="text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white">General</TabsTrigger>
                        <TabsTrigger value="schedule" className="text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Program</TabsTrigger>
                        <TabsTrigger value="data" className="text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Cloud</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="py-6 space-y-5">
                        <div className="flex justify-between items-center p-4 bg-muted/30 rounded-2xl border border-border">
                            <div><Label className="text-sm font-bold">Țintă Zilnică</Label><p className="text-[10px] text-muted-foreground">Câte task-uri pe zi?</p></div>
                            <Input type="number" className="w-20 bg-background" value={settings.dailyGoal} onChange={e => setSettings({...settings, dailyGoal: Number(e.target.value)})} />
                        </div>
                        <div className="flex justify-between items-center p-4 bg-muted/30 rounded-2xl border border-border">
                            <div><Label className="text-sm font-bold">Auto-aplicare Program</Label><p className="text-[10px] text-muted-foreground">Pune automat task-urile recurente.</p></div>
                            <Switch checked={settings.autoApplySchedule} onCheckedChange={v => setSettings({...settings, autoApplySchedule: v})} />
                        </div>
                        <Button variant="outline" className="w-full border-indigo-500/30 text-indigo-600 h-11" onClick={onShowTutorial}><HelpCircle className="mr-2 h-4 w-4" /> REVEZI TUTORIAL</Button>
                    </TabsContent>
                    <TabsContent value="schedule" className="py-6 space-y-4">
                        <div className="flex gap-2 p-1 bg-muted/40 rounded-xl border border-border">
                            <select value={currDay} onChange={e => setCurrDay(Number(e.target.value))} className="bg-transparent border-none text-xs font-bold px-3 outline-none">{days.map((d, i) => <option key={i} value={i} className="bg-background">{d}</option>)}</select>
                            <Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Nume task..." className="bg-transparent border-none text-xs h-10 shadow-none focus-visible:ring-0" />
                            <Button size="icon" className="h-9 w-9 bg-indigo-600 text-white" onClick={() => { if(newDesc.trim()){planner.addRecurringTask(currDay, newDesc); setNewDesc('');} }}><Plus className="w-4 h-4"/></Button>
                        </div>
                        <div className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin">
                            {planner.schedule[currDay]?.map((t:any) => <div key={t.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-xl border border-border">
                                <span className="text-xs font-medium">{t.description}</span>
                                <button onClick={() => planner.deleteRecurringTask(currDay, t.id)} className="p-1 hover:bg-rose-500/10 rounded-md transition-colors"><Trash2 className="w-4 h-4 text-rose-500"/></button>
                            </div>)}
                        </div>
                    </TabsContent>
                    <TabsContent value="data" className="py-6 space-y-4 text-center">
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="border-emerald-500/20 text-emerald-600 h-11" onClick={() => { planner.exportData(); toast({ title: "Backup generat!" }); }}><Download className="w-4 h-4 mr-2"/> EXPORTĂ</Button>
                            <label className="flex items-center justify-center px-4 py-2 border border-blue-500/20 text-blue-600 rounded-md cursor-pointer text-xs font-bold h-11"><Upload className="w-4 h-4 mr-2"/> IMPORTĂ<input type="file" className="hidden" accept=".json" onChange={e => e.target.files?.[0] && planner.importData(e.target.files[0])} /></label>
                        </div>
                        <div className="bg-rose-500/[0.03] border border-rose-500/20 p-4 rounded-2xl mt-4">
                            <p className="text-[10px] text-rose-500 font-bold mb-3 uppercase tracking-tighter">⚠️ Zonă periculoasă: Resetare doar pentru calendar.</p>
                            <Button variant="destructive" className="w-full h-11 font-bold" onClick={() => { planner.resetMonthlyPlan(); toast({ title: "Calendar curățat!" }); }}><Trash className="w-4 h-4 mr-2"/> ȘTERGE CALENDARUL</Button>
                        </div>
                    </TabsContent>
                </Tabs>
                <DialogFooter className="mt-4"><Button onClick={() => { planner.updateSettings(settings); toast({ title: "Salvat!" }); }} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full h-11 font-bold">SALVEAZĂ TOT</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function HistoryDialog({ planner }: any) {
    return (
        <Dialog><DialogTrigger asChild><Button variant="secondary" className="w-full text-[10px] justify-start bg-muted font-bold border-border/50"><History className="mr-2 h-4 w-4 text-muted-foreground" /> ISTORIC</Button></DialogTrigger><DialogContent className="bg-background border-border max-h-[80vh] overflow-y-auto backdrop-blur-2xl">
            <DialogHeader><DialogTitle className="font-lora">Istoric Activități</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4">
                {Object.keys(planner.plan).sort().reverse().map(date => (<div key={date} className="p-3 border border-border rounded-2xl bg-muted/20 shadow-sm"><p className="font-bold text-xs text-indigo-600 mb-2">{format(new Date(date + 'T12:00:00'), 'd MMMM yyyy', { locale: ro })}</p><div className="space-y-1">{planner.plan[date].tasks.map((t:any) => <p key={t.id} className="text-[10px] text-muted-foreground flex items-center gap-2">{t.status === 'completed' ? <Check className="w-3 h-3 text-emerald-500"/> : <X className="w-3 h-3 text-rose-500"/>} {t.description}</p>)}</div></div>))}
            </div>
        </DialogContent></Dialog>
    );
}

function AchievementsDialog({ achievements }: any) {
    const list = Object.entries(achievementsList).map(([id, data]) => ({ id, ...data, unlocked: achievements.unlocked.has(id) }));
    return (
        <Dialog><DialogTrigger asChild><Button variant="secondary" className="w-full text-[10px] justify-start bg-muted font-bold border-border/50"><Trophy className="mr-2 h-4 w-4 text-yellow-500" /> PREMII</Button></DialogTrigger><DialogContent className="bg-background border-border sm:max-w-3xl backdrop-blur-2xl shadow-3xl">
            <DialogHeader><DialogTitle className="font-lora text-xl">Sala Trofeelor</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto p-4 scrollbar-thin">
                {list.map((ach: any) => (<div key={ach.id} className={cn("p-4 rounded-2xl border flex flex-col items-center text-center transition-all group", ach.unlocked ? "bg-muted/30 border-indigo-500/20 shadow-lg scale-100" : "opacity-30 grayscale scale-95 border-border")}><span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{ach.icon}</span><p className={cn("text-[10px] font-bold uppercase tracking-tight", ach.unlocked ? ach.color : "text-muted-foreground")}>{ach.title}</p><p className="text-[9px] text-muted-foreground leading-tight mt-1 px-1">{ach.description}</p></div>))}
            </div>
        </DialogContent></Dialog>
    );
}

function TutorialOverlay({ onClose }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-background p-8 rounded-[2.5rem] border border-border max-w-lg w-full text-center space-y-6 shadow-3xl" onClick={e => e.stopPropagation()}>
                <div className="bg-indigo-600/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-2"><Sparkles className="w-8 h-8 text-indigo-600" /></div>
                <h2 className="text-2xl font-bold font-lora">Planner Pro! 🚀</h2>
                <div className="space-y-4 text-left">
                    <div className="flex gap-4 p-4 bg-muted/40 rounded-2xl border border-border">
                        <div className="text-indigo-600 font-black text-xl">01</div>
                        <div><p className="text-sm font-bold">Planifică</p><p className="text-[11px] text-muted-foreground leading-relaxed">Adaugă obiective în calendar.</p></div>
                    </div>
                    <div className="flex gap-4 p-4 bg-muted/40 rounded-2xl border border-border">
                        <div className="text-emerald-600 font-black text-xl">02</div>
                        <div><p className="text-sm font-bold">Crește</p><p className="text-[11px] text-muted-foreground leading-relaxed">Câștigă XP și menține Streak-ul.</p></div>
                    </div>
                </div>
                <Button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-sm font-bold rounded-2xl">SĂ ÎNCEPEM!</Button>
            </motion.div>
        </motion.div>
    );
}