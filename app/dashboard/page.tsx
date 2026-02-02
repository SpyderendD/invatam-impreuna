'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTaskPlanner, Task, achievementsList, AchievementId } from '@/hooks/useTaskPlanner'; 
import { format, addDays, startOfWeek, isToday, isPast } from 'date-fns';
import { ro } from 'date-fns/locale';
import { QuoteOfTheDay } from '@/components/dashboard/QuoteOfTheDay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
    Check, X, Plus, Trash2, Edit, ChevronLeft, ChevronRight, Settings as SettingsIcon, 
    History, Trophy, Download, Upload, Info, Sparkles, Zap, Flame, LayoutDashboard, Loader2,
    HelpCircle, Lock
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from "@/lib/utils";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// --- BACKGROUND ---
const AmbientBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#030712]">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-900/20 rounded-full blur-[120px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
  </div>
);

// --- GLASS CARD ---
const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn(
    "relative overflow-hidden rounded-2xl border border-white/5 bg-[#0f172a]/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-[#0f172a]/80 hover:shadow-2xl",
    className
  )}>
    {children}
  </div>
);

type UserGamification = {
    xp?: number;
    level?: number;
    streak?: number;
    completedLessons?: string[];
};

// --- FUNCȚIE CALCUL RANG (TITLU) ---
const getRankTitle = (level: number) => {
    if (level >= 50) return { title: "ZEU AL PRODUCTIVITĂȚII", color: "text-amber-400" };
    if (level >= 30) return { title: "TITAN", color: "text-red-400" };
    if (level >= 20) return { title: "LEGENDĂ", color: "text-purple-400" };
    if (level >= 10) return { title: "MAESTRU", color: "text-indigo-400" };
    if (level >= 5) return { title: "EXPERT", color: "text-blue-400" };
    return { title: "ÎNVĂȚĂCEL", color: "text-slate-400" };
};

export default function DashboardPage() {
    const { user, loading: isAuthLoading } = useAuth();
    const planner = useTaskPlanner();
    const [weekOffset, setWeekOffset] = useState(0);
    const [gameStats, setGameStats] = useState<UserGamification>({ xp: 0, level: 1, streak: 0 });
    const [showTutorial, setShowTutorial] = useState(false);

    // --- ASCULTĂ XP-UL ÎN TIMP REAL ---
    useEffect(() => {
        if (!user) return;
        const ref = doc(db, "progress", user.uid);
        const unsub = onSnapshot(ref, (snap) => {
            const data = snap.data() as UserGamification;
            if (data) {
                const calculatedXP = (data.completedLessons?.length || 0) * 100;
                setGameStats({
                    xp: data.xp ?? calculatedXP,
                    level: data.level ?? (Math.floor(calculatedXP / 1000) + 1),
                    streak: data.streak ?? 0
                });
            }
        });
        return () => unsub();
    }, [user]);

    // --- CALCUL DATĂ ---
    const { weekDates, weekLabel, weekStartDate } = useMemo((): { 
        weekDates: string[]; 
        weekLabel: string; 
        weekStartDate: Date; 
    } => {
        const start = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
        const end = addDays(start, 6);
        
        // Am redenumit variabila internă din `dates` în `dateStrings`
        const dateStrings = Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), 'yyyy-MM-dd'));
        const label = `${format(start, 'd MMM', { locale: ro })} — ${format(end, 'd MMM yyyy', { locale: ro })}`;
        
        // Acum returnăm variabilele cu nume diferite, deci nu mai e conflict
        return { weekDates: dateStrings, weekLabel: label, weekStartDate: start };
    }, [weekOffset]);

    // --- CALCUL XP BAR ---
    const currentLevel = gameStats.level || 1;
    const currentXP = gameStats.xp || 0;
    const nextLevelXP = currentLevel * 1000;
    const prevLevelXP = (currentLevel - 1) * 1000;
    const progressPercent = Math.min(100, Math.max(0, ((currentXP - prevLevelXP) / 1000) * 100));
    const rank = getRankTitle(currentLevel);

    if (isAuthLoading || planner.isLoading) return <DashboardSkeleton />;

    return (
        <div className="min-h-screen relative text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white pb-20">
            <AmbientBackground />
            {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

            <main className="container mx-auto px-4 py-8 relative z-10">
                
                {/* --- HEADER GAMIFICAT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <GlassCard className="h-full flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><LayoutDashboard className="w-32 h-32 text-indigo-500" /></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-indigo-600/20 p-3 rounded-xl border border-indigo-500/30"><Zap className="w-6 h-6 text-indigo-400" /></div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white">Salut, {user?.displayName?.split(' ')[0]}!</h1>
                                        <p className={cn("text-sm font-bold tracking-widest uppercase", rank.color)}>{rank.title}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold tracking-widest uppercase">
                                        <span className="text-indigo-300">Level {currentLevel}</span>
                                        <span className="text-slate-500">{currentXP} / {nextLevelXP} XP</span>
                                    </div>
                                    <div className="h-3 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5">
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 shadow-[0_0_15px_#8b5cf6]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <GlassCard className="flex flex-col items-center justify-center text-center bg-orange-900/10 border-orange-500/20">
                            <Flame className="w-8 h-8 text-orange-500 mb-2 animate-pulse" />
                            <span className="text-3xl font-black text-white">{gameStats.streak}</span>
                            <span className="text-[10px] text-orange-300/60 uppercase font-bold tracking-widest">Zile Streak</span>
                         </GlassCard>
                         <GlassCard className="flex flex-col items-center justify-center text-center">
                            <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                            <span className="text-3xl font-black text-white">{planner.achievements.unlocked.size}</span>
                            <span className="text-[10px] text-yellow-200/60 uppercase font-bold tracking-widest">Premii</span>
                         </GlassCard>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
                        <QuoteOfTheDay />
                        
                        <GlassCard className="flex flex-wrap gap-3 items-center justify-between !p-3">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setWeekOffset(w => w - 1)} className="hover:bg-white/5"><ChevronLeft className="w-5 h-5" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => setWeekOffset(w => w + 1)} className="hover:bg-white/5"><ChevronRight className="w-5 h-5" /></Button>
                                <h2 className="font-bold text-white ml-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400" /> {weekLabel}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="secondary" size="sm" onClick={() => setWeekOffset(0)} className="bg-white/5 hover:bg-white/10 text-xs">Azi</Button>
                                <Button size="sm" onClick={() => { planner.applyScheduleToWeek(weekStartDate); toast({ title: 'Program aplicat!' }); }} className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                                    Aplică Program
                                </Button>
                            </div>
                        </GlassCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {weekDates.map((dateStr) => (
                                <DayColumn key={dateStr} dateStr={dateStr} planner={planner} />
                            ))}
                        </div>
                    </div>
                    
                    <aside className="xl:col-span-4 2xl:col-span-3 space-y-6 xl:sticky xl:top-8">
                       
                       <UnplannedTaskCard addTask={planner.addUnplannedTask} />

                       <GlassCard>
                          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                             <SettingsIcon className="w-4 h-4" /> Unelte
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                             <HistoryDialog planner={planner} />
                             <AchievementsDialog achievements={planner.achievements} />
                             <div className="col-span-2">
                                <SettingsDialog taskPlanner={planner} onShowTutorial={() => setShowTutorial(true)} />
                             </div>
                          </div>
                       </GlassCard>

                       <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-xs text-indigo-300 leading-relaxed">
                          <p className="font-bold mb-1">💡 Sfat:</p> Fii atent la trofeele &quot;Time-based&quot;! Încearcă să termini un task sâmbăta sau foarte devreme dimineața.
                       </div>

                    </aside>
                </div>
            </main>
        </div>
    );
}

// --- SUB-COMPONENTE ---

function DayColumn({ dateStr, planner }: { dateStr: string; planner: ReturnType<typeof useTaskPlanner> }) {
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const dayPlan = planner.plan[dateStr] || { tasks: [], goalReached: false };
    const date = new Date(dateStr + 'T12:00:00');
    const isCurrentDay = isToday(date);
    const dayIsPast = isPast(date) && !isCurrentDay;
    const handleAddTask = () => { if (newTaskDesc.trim()) { planner.addTask(dateStr, newTaskDesc.trim()); setNewTaskDesc(''); } };
    const completedCount = dayPlan.tasks.filter(t => t.status === 'completed').length;
    const progress = dayPlan.tasks.length > 0 ? (completedCount / dayPlan.tasks.length) * 100 : 0;
    return (
        <GlassCard className={cn("flex flex-col h-full min-h-[300px] transition-all !p-0 border-white/5", isCurrentDay ? "border-indigo-500/50 bg-indigo-500/5 ring-1 ring-indigo-500/30" : "bg-[#0f172a]/40", dayIsPast && "opacity-60 grayscale-[0.5]")}>
            <div className="p-4 border-b border-white/5 bg-white/5">
                <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold text-white capitalize">{format(date, 'EEEE', { locale: ro })}</span>{dayPlan.goalReached && <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />}</div>
                <div className="flex justify-between items-end text-xs text-slate-400"><span>{format(date, 'd MMM', { locale: ro })}</span><span>{Math.round(progress)}%</span></div>
                <div className="h-1 w-full bg-[#020617] rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-2 max-h-[300px] scrollbar-thin scrollbar-thumb-white/10"><AnimatePresence>{dayPlan.tasks.map((task) => <TaskItem key={task.id} dateStr={dateStr} task={task} planner={planner} />)}{dayPlan.tasks.length === 0 && <div className="text-center py-8 text-xs text-slate-600 italic">Niciun plan.</div>}</AnimatePresence></div>
            <div className="p-3 border-t border-white/5 bg-white/[0.02]"><div className="flex gap-2"><Input placeholder="Task..." value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTask()} className="h-8 text-xs bg-[#020617] border-white/10 focus:border-indigo-500"/><Button size="icon" className="h-8 w-8 bg-indigo-600 hover:bg-indigo-700" onClick={handleAddTask}><Plus className="w-4 h-4" /></Button></div></div>
        </GlassCard>
    );
}

function TaskItem({ dateStr, task, planner }: { dateStr: string; task: Task; planner: ReturnType<typeof useTaskPlanner> }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.description);
    const style = { pending: 'border-white/5 hover:bg-white/5 text-slate-300', completed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 line-through opacity-70', failed: 'border-rose-500/30 bg-rose-500/10 text-rose-300' }[task.status];
    const cycle = () => planner.toggleTaskStatus(dateStr, task.id);
    const onUpdate = () => { if (!editText.trim()) return planner.deleteTask(dateStr, task.id); planner.updateTaskDescription(dateStr, task.id, editText); setIsEditing(false); };
    return (
        <motion.div layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`group flex items-center gap-2 p-2 rounded-lg border text-xs transition-all cursor-pointer ${style}`}><button onClick={cycle} className="shrink-0">{task.status === 'completed' ? <div className="bg-emerald-500 rounded p-0.5"><Check className="w-3 h-3 text-black" /></div> : task.status === 'failed' ? <div className="bg-rose-500 rounded p-0.5"><X className="w-3 h-3 text-black" /></div> : <div className="w-4 h-4 rounded border border-slate-500 hover:border-indigo-400" />}</button>{isEditing ? <Input value={editText} onChange={e => setEditText(e.target.value)} onBlur={onUpdate} autoFocus className="h-6 text-xs bg-black/50" /> : <span className="flex-grow truncate" onDoubleClick={() => setIsEditing(true)}>{task.description}</span>}<button onClick={() => planner.deleteTask(dateStr, task.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-500 transition-opacity"><Trash2 className="w-3 h-3" /></button></motion.div>
    );
}

function UnplannedTaskCard({ addTask }: { addTask: (desc: string, type: 'verde' | 'rosu') => void }) {
    const [desc, setDesc] = useState('');
    const onAdd = (type: 'verde' | 'rosu') => { if (!desc.trim()) return; addTask(desc.trim(), type); setDesc(''); toast({ title: "Adăugat!" }); };
    return (
        <GlassCard><div className="flex items-center gap-2 mb-3 text-white font-bold text-sm"><Info className="w-4 h-4 text-indigo-400" /> Activitate Rapidă</div><div className="space-y-2"><Input placeholder="Ce ai făcut spontan?" value={desc} onChange={e => setDesc(e.target.value)} className="bg-[#020617] border-white/10 text-sm" /><div className="grid grid-cols-2 gap-2"><Button size="sm" onClick={() => onAdd('verde')} className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs">Reușită</Button><Button size="sm" onClick={() => onAdd('rosu')} variant="outline" className="border-rose-500/50 text-rose-400 hover:bg-rose-500/10 h-8 text-xs">Eșec</Button></div></div></GlassCard>
    );
}

function SettingsDialog({ taskPlanner, onShowTutorial }: { taskPlanner: ReturnType<typeof useTaskPlanner>, onShowTutorial: () => void }) {
    const [settings, setSettings] = useState(taskPlanner.settings);
    const [currentScheduleDay, setCurrentScheduleDay] = useState(0);
    const [newScheduleTaskDesc, setNewScheduleTaskDesc] = useState('');
    const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    useEffect(() => { setSettings(taskPlanner.settings); }, [taskPlanner.settings]);
    const handleAdd = () => { if (!newScheduleTaskDesc.trim()) return; taskPlanner.addRecurringTask(currentScheduleDay, newScheduleTaskDesc); setNewScheduleTaskDesc(''); };
    const handleSave = () => { taskPlanner.updateSettings(settings); toast({ title: "Setări Salvate!" }); };
    return (
        <Dialog><DialogTrigger asChild><Button variant="secondary" className="w-full justify-start bg-white/5 hover:bg-white/10 text-slate-300"><SettingsIcon className="mr-2 h-4 w-4" /> Setări</Button></DialogTrigger><DialogContent className="bg-[#0f172a] border-white/10 text-slate-200 sm:max-w-xl"><DialogHeader><DialogTitle>Setări Planner</DialogTitle></DialogHeader><Tabs defaultValue="general" className="w-full"><TabsList className="grid w-full grid-cols-3 bg-black/40"><TabsTrigger value="general">Generale</TabsTrigger><TabsTrigger value="schedule">Program</TabsTrigger><TabsTrigger value="data">Date</TabsTrigger></TabsList><TabsContent value="general" className="py-4 space-y-4"><div className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5"><Label>Țintă zilnică (Task-uri)</Label><Input type="number" className="w-20 bg-black/50" value={settings.dailyGoal} onChange={e => setSettings(s => ({...s, dailyGoal: Number(e.target.value)}))} /></div><div className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5"><Label>Aplică Program Automat</Label><Switch checked={settings.autoApplySchedule} onCheckedChange={c => setSettings(s => ({...s, autoApplySchedule: c}))} /></div><div className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5"><Label>Resetare Lunară</Label><Switch checked={settings.autoDelete} onCheckedChange={c => setSettings(s => ({...s, autoDelete: c}))} /></div><Button variant="outline" className="w-full" onClick={onShowTutorial}><HelpCircle className="mr-2 h-4 w-4" /> Vezi Tutorialul</Button></TabsContent><TabsContent value="schedule" className="py-4 space-y-4"><div className="flex gap-2"><select value={currentScheduleDay} onChange={e => setCurrentScheduleDay(Number(e.target.value))} className="h-9 rounded bg-black border border-white/10 px-2 text-sm text-white">{days.map((d, i) => <option key={i} value={i}>{d}</option>)}</select><Input placeholder="Task recurent..." value={newScheduleTaskDesc} onChange={e => setNewScheduleTaskDesc(e.target.value)} className="h-9 bg-black/50" /><Button size="sm" onClick={handleAdd}><Plus className="h-4 w-4" /></Button></div><div className="space-y-1 max-h-48 overflow-y-auto">{taskPlanner.schedule[currentScheduleDay]?.map(t => <div key={t.id} className="flex justify-between items-center p-2 bg-white/5 rounded text-xs"><span>{t.description}</span><Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => taskPlanner.deleteRecurringTask(currentScheduleDay, t.id)}><Trash2 className="h-3 w-3 text-rose-500" /></Button></div>)}</div></TabsContent><TabsContent value="data" className="py-4 space-y-3"><div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={taskPlanner.exportData}><Download className="mr-2 h-4 w-4" /> Export</Button><div className="relative"><Button variant="secondary" className="w-full pointer-events-none"><Upload className="mr-2 h-4 w-4" /> Import</Button><input type="file" accept=".json" className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto" onChange={e => e.target.files?.[0] && taskPlanner.importData(e.target.files[0])} /></div></div><Button variant="destructive" className="w-full" onClick={taskPlanner.resetAllData}><Trash2 className="mr-2 h-4 w-4" /> Reset Complet</Button></TabsContent></Tabs><DialogFooter><Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">Salvează</Button></DialogFooter></DialogContent></Dialog>
    );
}

function HistoryDialog({ planner }: { planner: ReturnType<typeof useTaskPlanner> }) {
    return (
        <Dialog><DialogTrigger asChild><Button variant="secondary" className="w-full justify-start bg-white/5 hover:bg-white/10 text-slate-300"><History className="mr-2 h-4 w-4" /> Istoric</Button></DialogTrigger><DialogContent className="bg-[#0f172a] border-white/10 text-slate-200 max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle>Istoric Activități</DialogTitle></DialogHeader><div className="space-y-2">{Object.keys(planner.plan).sort().reverse().map(date => <div key={date} className="p-2 border border-white/5 rounded bg-white/5"><div className="font-bold text-xs mb-1">{date}</div>{planner.plan[date].tasks.map((t: Task) => <div key={t.id} className="text-xs text-slate-400 flex gap-2"><span>{t.status === 'completed' ? '✅' : '❌'}</span> {t.description}</div>)}</div>)}</div></DialogContent></Dialog>
    );
}

function AchievementsDialog({ achievements }: { achievements: any }) {
    const allItems = Object.entries(achievementsList).map(([id, data]) => ({ id, ...data, unlocked: achievements.unlocked.has(id as AchievementId) }));
    return (
        <Dialog><DialogTrigger asChild><Button variant="secondary" className="w-full justify-start bg-white/5 hover:bg-white/10 text-slate-300"><Trophy className="mr-2 h-4 w-4" /> Realizări</Button></DialogTrigger><DialogContent className="bg-[#0f172a] border-white/10 text-slate-200 sm:max-w-2xl"><DialogHeader><DialogTitle>Sala Trofeelor</DialogTitle></DialogHeader><div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-2 py-4">{allItems.map((ach: any) => <div key={ach.id} className={cn("flex flex-col items-center text-center p-3 rounded-xl border transition-all", ach.unlocked ? `bg-white/5 ${ach.color} border-white/10` : "bg-white/5 border-white/5 opacity-50 grayscale")}><div className="text-3xl mb-2">{ach.icon}</div><p className={cn("text-xs font-bold mb-1", ach.unlocked ? ach.color : "text-slate-400")}>{ach.title}</p><p className="text-[10px] text-slate-500 leading-tight">{ach.description}</p>{!ach.unlocked && <Lock className="w-3 h-3 mt-2 text-slate-600" />}</div>)}</div></DialogContent></Dialog>
    );
}

function TutorialOverlay({ onClose }: { onClose: () => void }) {
    return <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}><div className="bg-[#0f172a] border border-white/10 p-6 rounded-2xl max-w-md text-center space-y-4" onClick={e => e.stopPropagation()}><h2 className="text-xl font-bold text-white">Bun venit la Planner! 🚀</h2><div className="text-sm text-slate-300 space-y-2 text-left"><p>1. 📅 <b>Planifică:</b> Adaugă task-uri.</p><p>2. ✅ <b>Completează:</b> Bifează pentru XP.</p><p>3. 🔥 <b>Streak:</b> Fii constant!</p></div><Button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700">Gata!</Button></div></div>;
}

function DashboardSkeleton() { return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white"><Loader2 className="animate-spin w-10 h-10" /></div>; }