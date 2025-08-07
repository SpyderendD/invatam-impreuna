'use client';

import React, { useMemo, useState, useEffect, ChangeEvent, useRef, Fragment } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { useAuth } from '@/context/AuthContext'; 
import { useTaskPlanner, Task, DailyPlan, Settings, AchievementStats, achievementsList, AchievementId } from '@/hooks/useTaskPlanner';
import { format, addDays, startOfWeek, isToday, isPast } from 'date-fns';
import { ro } from 'date-fns/locale';
import { useWindowSize } from 'react-use';
import { useInView } from 'react-intersection-observer';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// Componente UI & Iconițe
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // <-- CORECTAT
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from '@/components/ui/switch';
import { Check, X, Plus, Trash2, Edit, ChevronLeft, ChevronRight, Settings as SettingsIcon, History, Trophy, Download, Upload, Info, BarChart2, HelpCircle } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Variante de animație ---
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } } };

// ============================================================================
// == COMPONENTA PRINCIPALĂ DASHBOARD
// ============================================================================
export default function DashboardPage() {
  const { user, loading: isAuthLoading } = useAuth();
  const planner = useTaskPlanner();
  const [weekOffset, setWeekOffset] = useState(0); 
  const [showTutorial, setShowTutorial] = useState(false);
  const [askTutorial, setAskTutorial] = useState(false);

  useEffect(() => {
    const tutorialSeen = localStorage.getItem('planner_tutorial_seen_v5'); // Am schimbat versiunea tutorialului
    if (!tutorialSeen) {
      const timer = setTimeout(() => setAskTutorial(true), 1000); // Întreabă după 1 secundă
      return () => clearTimeout(timer);
    }
  }, []);

  const { weekDates, weekLabel } = useMemo((): { weekDates: string[]; weekLabel: string } => { // Adăugat tip explicit
    const start = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
    const end = addDays(start, 6);
    const dates = Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), 'yyyy-MM-dd'));
    const label = `${format(start, 'd MMM', { locale: ro })} - ${format(end, 'd MMM yyyy', { locale: ro })}`;
    return { weekDates: dates, weekLabel: label };
  }, [weekOffset]);
  
  if (isAuthLoading || planner.isLoading) return <DashboardSkeleton />;
  
  const handleStartTutorial = () => {
    setAskTutorial(false); // Ascunde dialogul "vrei tutorial?"
    setShowTutorial(true); // Afișează tutorialul efectiv
  };
  
  const handleSkipTutorial = () => {
    localStorage.setItem('planner_tutorial_seen_v5', 'true'); // Marchează tutorialul ca văzut
    setAskTutorial(false); // Ascunde dialogul "vrei tutorial?"
  };
  
  const handleFinishTutorial = () => {
    localStorage.setItem('planner_tutorial_seen_v5', 'true'); // Marchează tutorialul ca văzut
    setShowTutorial(false); // Ascunde tutorialul efectiv
  };

  return (
    <div className="min-h-screen bg-grid-pattern">
      <main className="container mx-auto px-4 py-12">
        <AnimatePresence>
            {askTutorial && <AskTutorialDialog onConfirm={handleStartTutorial} onDecline={handleSkipTutorial} />}
            {showTutorial && <TutorialOverlay onFinish={handleFinishTutorial} />}
        </AnimatePresence>
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <HelpTooltip content="Bun venit! Aici este panoul tău de control unde îți poți planifica săptămâna." dataStep="1">
                <div>
                    <h1 className="text-4xl font-bold font-lora">Planificatorul Săptămânal</h1>
                    <p className="text-muted-foreground mt-1">Organizează-ți obiectivele și devino mai productiv.</p>
                </div>
            </HelpTooltip>
            <div data-step="5" data-intro="Aici poți accesa setările (inclusiv noul program săptămânal!), istoricul și premiile. Butonul de ajutor va redeschide acest ghid." className="flex gap-2 self-end sm:self-center">
                <Button variant={showTutorial ? 'default' : 'outline'} size="icon" onClick={() => setShowTutorial(true)}><HelpCircle className="h-5 w-5" /></Button>
                <HistoryDialog planner={planner} />
                <AchievementsDialog achievements={planner.achievements} />
                <SettingsDialog taskPlanner={planner} />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <HelpTooltip content="Navighează între săptămâni. La începutul fiecărei săptămâni, planul tău recurent (dacă ai setat unul) va fi aplicat." dataStep="2">
                <motion.div variants={itemVariants} className="flex justify-between items-center bg-card/50 backdrop-blur-sm p-2 rounded-lg border">
                    <Button aria-label="Săptămâna precedentă" variant="outline" size="icon" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft/></Button>
                    <h2 className="font-semibold text-lg text-center">{weekLabel}</h2>
                    <Button aria-label="Săptămâna următoare" variant="outline" size="icon" onClick={() => setWeekOffset(w => w + 1)} disabled={weekOffset >= 0}><ChevronRight/></Button>
                </motion.div>
              </HelpTooltip>
              
              {/* --- NOU: GRID RESPONSIV PENTRU ZILE (7 coloane pe 2XL) --- */}
              <HelpTooltip content="Fiecare zi este o coloană. Adaugă sarcini planificate jos, bifează-le cu un click, și editează-le cu dublu-click." dataStep="3">
                <motion.div 
                    variants={itemVariants} 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4"
                >
                    {weekDates.map((dateStr: string) => <DayColumn key={dateStr} dateStr={dateStr} planner={planner} />)}
                </motion.div>
              </HelpTooltip>
            </div>
            
            <div className="space-y-8 lg:sticky lg:top-24">
              <HelpTooltip content="Aici vezi un sumar 3D al progresului tău total. Mișcă mouse-ul peste el!" dataStep="4">
                <motion.div variants={itemVariants}>
                    <StatsCard3D planner={planner} />
                </motion.div>
              </HelpTooltip>
              <HelpTooltip content="Ai făcut ceva neplanificat? Adaugă aici activitățile spontane." dataStep="6">
                <motion.div variants={itemVariants}>
                    <UnplannedTaskCard addTask={planner.addUnplannedTask} />
                </motion.div>
              </HelpTooltip>
            </div>
          </div>
        
        </motion.div>
      </main>
    </div>
  );
}

// ============================================================================
// == COMPONENTE SUPLIMENTARE (TOATE INCLUSE)
// ============================================================================

// --- HELP TOOLTIP (NOU ȘI ÎMBUNĂTĂȚIT) ---
function HelpTooltip({ children, content, dataStep }: { children: React.ReactNode, content: string, dataStep: string }) {
    return (
        // data-step este pe div-ul părinte pentru a evidenția întreaga zonă
        <div data-step={dataStep} className="relative inline-block"> 
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>{children}</TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-center">
                        <p>{content}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

// --- STATS CARD 3D (ÎMBUNĂTĂȚIT) ---
function StatsCard3D({ planner }: { planner: ReturnType<typeof useTaskPlanner> }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => { x.set(0); y.set(0); };

    const stats = useMemo(() => {
        const allTasks = Object.values(planner.plan).flatMap(day => day.tasks);
        return {
            completed: allTasks.filter(t => t.status === 'completed').length,
            failed: allTasks.filter(t => t.status === 'failed').length,
            pending: allTasks.filter(t => t.status === 'pending').length,
        };
    }, [planner.plan]);

    const chartData = [
        { name: 'Reușite', value: stats.completed, fill: 'hsl(var(--success))' },
        { name: 'Încercări', value: stats.failed, fill: 'hsl(var(--destructive))' },
        { name: 'În Așteptare', value: stats.pending, fill: 'hsl(var(--muted-foreground))' },
    ].filter(item => item.value > 0); // Filtrează categoriile cu valoare 0 pentru a nu apărea în grafic

    const isDataAvailable = stats.completed > 0 || stats.failed > 0 || stats.pending > 0;

    return (
        <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
            <Card className="shadow-lg border-border/60" style={{ transformStyle: "preserve-3d" }}>
                <div style={{ transform: "translateZ(40px)" }} className="p-6">
                    <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5 text-primary"/> Statistici Generale</CardTitle></CardHeader>
                    <CardContent className="p-0 flex flex-col md:flex-row items-center gap-4">
                        {isDataAvailable ? (
                            <div className="h-28 w-28 flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} innerRadius={35} paddingAngle={5} cornerRadius={5}>
                                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-28 w-28 flex items-center justify-center text-muted-foreground text-center text-sm">
                                Nicio activitate încă.
                            </div>
                        )}
                        <div className="grid grid-cols-3 md:grid-cols-1 gap-2 flex-grow">
                            <AnimatedStat value={stats.completed} label="Reușite" icon={<Check className="h-6 w-6 text-green-500 mb-1"/>} />
                            <AnimatedStat value={stats.failed} label="Încercări" icon={<X className="h-6 w-6 text-red-500 mb-1"/>} />
                            <AnimatedStat value={planner.achievements.unlocked.size} label="Premii" icon={<Trophy className="h-6 w-6 text-amber-500 mb-1"/>} />
                        </div>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
}

function AnimatedStat({ value, label, icon }: { value: number, label: string, icon: JSX.Element }) {
    const [displayValue, setDisplayValue] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

    useEffect(() => {
        if (inView) {
            const controls = animate(0, value, {
                duration: 1.5,
                ease: "easeOut",
                onUpdate(latest) { setDisplayValue(Math.round(latest)); }
            });
            return () => controls.stop();
        }
    }, [inView, value]);

    return (
        <div ref={ref} className="flex flex-col items-center">
            {icon}
            <p className="text-xl font-bold">{displayValue}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}

function DayColumn({ dateStr, planner }: { dateStr: string; planner: ReturnType<typeof useTaskPlanner> }) {
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const dayPlan = planner.plan[dateStr] || { tasks: [] };
    const date = new Date(dateStr + 'T12:00:00');
    const isCurrentDay = isToday(date);
    const dayIsPast = isPast(date) && !isCurrentDay;
    
    const handleAddTask = () => { if(newTaskDesc.trim()) { planner.addTask(dateStr, newTaskDesc); setNewTaskDesc(''); }};
    const completedCount = dayPlan.tasks.filter(t => t.status === 'completed').length;
    const totalCount = dayPlan.tasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <Card className={`flex flex-col h-full transition-all duration-300 ${isCurrentDay ? 'border-primary shadow-lg' : dayIsPast ? 'bg-muted/50 opacity-70' : ''}`}>
            <CardHeader className="text-center p-4">
                <CardTitle className="text-base font-bold capitalize">{format(date, 'EEEE', { locale: ro })}</CardTitle>
                <CardDescription className="text-sm">{format(date, 'd MMM', { locale: ro })}</CardDescription>
                <Progress value={progress} className="h-1 mt-2" />
            </CardHeader>
            <CardContent className="flex-grow space-y-2 overflow-y-auto p-2 min-h-[150px]">
              <AnimatePresence>
                {dayPlan.tasks.map(task => <TaskItem key={task.id} dateStr={dateStr} task={task} planner={planner} />)}
              </AnimatePresence>
            </CardContent>
            <div className="p-2 border-t mt-auto">
                <div className="flex gap-1">
                    <Input placeholder="Plan nou..." value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTask()} className="h-8 text-sm"/>
                    <Button size="icon" variant="ghost" onClick={handleAddTask} disabled={!newTaskDesc.trim()} className="h-8 w-8"><Plus className="h-4 w-4"/></Button>
                </div>
            </div>
        </Card>
    );
}

function TaskItem({ dateStr, task, planner }: { dateStr: string; task: Task; planner: ReturnType<typeof useTaskPlanner> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.description);
  const statusClasses = {
    pending: "border-muted hover:bg-muted/50",
    completed: "border-green-500 bg-green-500/10 text-muted-foreground line-through",
    failed: "border-red-500 bg-red-500/10 text-muted-foreground opacity-70"
  };
  
  const handleUpdate = () => { planner.updateTaskDescription(dateStr, task.id, editText); setIsEditing(false); };

  return (
    <motion.div layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className={`flex items-center gap-2 p-2 rounded-md border text-sm group ${statusClasses[task.status]}`}>
      <div onClick={() => planner.toggleTaskStatus(dateStr, task.id)} className="cursor-pointer p-1">
        {task.status === 'completed' && <Check className="h-4 w-4 text-green-500" />}
        {task.status === 'failed' && <X className="h-4 w-4 text-red-500" />}
        {task.status === 'pending' && <div className="h-4 w-4 border rounded-sm" />}
      </div>
      {isEditing ? (
        <Input value={editText} onChange={e => setEditText(e.target.value)} onBlur={handleUpdate} onKeyDown={e => e.key === 'Enter' && handleUpdate()} autoFocus className="h-6 text-sm flex-grow"/>
      ) : (
        <span className="flex-grow" onDoubleClick={() => setIsEditing(true)}>{task.description}</span>
      )}
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditing(!isEditing)}><Edit className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => planner.deleteTask(dateStr, task.id)}><Trash2 className="h-3 w-3" /></Button>
      </div>
    </motion.div>
  );
}

function UnplannedTaskCard({ addTask }: { addTask: (desc: string, type: 'verde' | 'rosu') => void }) {
    const [description, setDescription] = useState('');
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ai făcut ceva neplanificat?</CardTitle>
                <CardDescription>Adaugă aici activitățile spontane pentru a-ți urmări progresul complet.</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea placeholder="Ex: Am ajutat un coleg..." value={description} onChange={e => setDescription(e.target.value)} className="mb-4" />
                <div className="flex gap-4">
                    <Button className="w-full" onClick={() => { addTask(description, 'verde'); setDescription(''); }}>Adaugă ca Reușită</Button>
                    <Button variant="outline" className="w-full" onClick={() => { addTask(description, 'rosu'); setDescription(''); }}>Adaugă ca Încercare</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function SettingsDialog({ taskPlanner }: { taskPlanner: ReturnType<typeof useTaskPlanner> }) {
    const [settings, setSettings] = useState(taskPlanner.settings);
    const [currentScheduleDay, setCurrentScheduleDay] = useState(0); // Luni (0-6)
    const [newScheduleTaskDesc, setNewScheduleTaskDesc] = useState(''); // Corrected name

    const importFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSettings(taskPlanner.settings);
    }, [taskPlanner.settings]);

    const handleSave = () => { 
        taskPlanner.updateSettings(settings);
        toast({ title: 'Setările au fost salvate!' });
    };

    const daysOfWeekNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];

    const handleAddScheduleTask = () => {
        if(newScheduleTaskDesc.trim()) {
            taskPlanner.addRecurringTask(currentScheduleDay, newScheduleTaskDesc);
            setNewScheduleTaskDesc('');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="icon"><SettingsIcon className="h-5 w-5" /></Button></DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Setări & Planificare</DialogTitle><DialogDescription>Personalizează-ți experiența și gestionează-ți datele.</DialogDescription></DialogHeader>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">Generale</TabsTrigger>
                        <TabsTrigger value="schedule">Program</TabsTrigger>
                        <TabsTrigger value="data">Date</TabsTrigger>
                    </TabsList>
                    
                    {/* Tab Generale */}
                    <TabsContent value="general" className="py-4 space-y-4">
                        <div className="space-y-4 p-4 rounded-lg border">
                            <Label htmlFor="daily-goal" className="font-semibold">Țintă zilnică de sarcini reușite</Label>
                            <Input id="daily-goal" type="number" min="1" max="1000" value={settings.dailyGoal} onChange={(e) => setSettings(s => ({ ...s, dailyGoal: Number(e.target.value) }))} />
                        </div>
                        <div className="space-y-4 p-4 rounded-lg border">
                            <Label className="font-semibold flex items-center gap-2">
                                Aplică Program Săptămânal Automat
                                <TooltipProvider><Tooltip><TooltipTrigger type="button"><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Dacă este activ, sarcinile din programul săptămânal vor fi adăugate automat în zilele goale, la începutul fiecărei săptămâni.</p></TooltipContent></Tooltip></TooltipProvider>
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Switch id="auto-apply-schedule" checked={settings.autoApplySchedule} onCheckedChange={(checked) => setSettings(s => ({ ...s, autoApplySchedule: checked }))} />
                                <Label htmlFor="auto-apply-schedule" className="cursor-pointer">{settings.autoApplySchedule ? "Activat" : "Dezactivat"}</Label>
                            </div>
                        </div>
                        <div className="space-y-4 p-4 rounded-lg border">
                            <Label className="font-semibold flex items-center gap-2">
                                Resetare Progres Lunar
                                <TooltipProvider><Tooltip><TooltipTrigger type="button"><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Dacă este activ, tot istoricul de progres va fi șters automat pe data de 1 a fiecărei luni, la ora 00:00.</p></TooltipContent></Tooltip></TooltipProvider>
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Switch id="auto-delete" checked={settings.autoDelete} onCheckedChange={(checked) => setSettings(s => ({ ...s, autoDelete: checked }))} />
                                <Label htmlFor="auto-delete" className="cursor-pointer">{settings.autoDelete ? "Activat" : "Dezactivat"}</Label>
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Tab Program Săptămânal */}
                    <TabsContent value="schedule" className="py-4">
                        <CardDescription className="mb-4">Configurează-ți sarcinile recurente pentru fiecare zi a săptămânii. Acestea vor fi adăugate automat în planul tău.</CardDescription>
                        
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <select 
                                value={currentScheduleDay} 
                                onChange={e => setCurrentScheduleDay(Number(e.target.value))}
                                className="flex-shrink-0 w-full md:w-auto p-2 border rounded-md bg-background text-foreground"
                            >
                                {daysOfWeekNames.map((dayName, index) => (
                                    <option key={index} value={index}>{dayName}</option>
                                ))}
                            </select>
                            <Input 
                                placeholder={`Adaugă plan pentru ${daysOfWeekNames[currentScheduleDay].toLowerCase()}...`} 
                                value={newScheduleTaskDesc} 
                                onChange={e => setNewScheduleTaskDesc(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleAddScheduleTask()}
                            />
                            <Button onClick={handleAddScheduleTask} disabled={!newScheduleTaskDesc.trim()}>Adaugă</Button>
                        </div>

                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                            {taskPlanner.schedule[currentScheduleDay]?.length > 0 ? 
                                taskPlanner.schedule[currentScheduleDay]?.map(task => (
                                    <div key={task.id} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-md">
                                        <span className="flex-grow">{task.description}</span>
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => taskPlanner.deleteRecurringTask(currentScheduleDay, task.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                )) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">Niciun plan recurent pentru {daysOfWeekNames[currentScheduleDay].toLowerCase()}.</p>
                                )
                            }
                        </div>
                    </TabsContent>

                    {/* Tab Date */}
                    <TabsContent value="data" className="py-4 space-y-4">
                        <div className="space-y-2 p-4 rounded-lg border">
                             <Label className="font-semibold">Gestionare Date</Label>
                             <div className="grid grid-cols-2 gap-2">
                                <Button variant="secondary" onClick={taskPlanner.exportData}><Download className="mr-2 h-4 w-4"/> Exportă</Button>
                                <Button variant="secondary" onClick={() => importFileRef.current?.click()}><Upload className="mr-2 h-4 w-4"/> Importă</Button>
                                <input type="file" ref={importFileRef} onChange={(e) => e.target.files?.[0] && taskPlanner.importData(e.target.files[0])} className="hidden" accept=".json" />
                             </div>
                        </div>
                         <div className="space-y-2 p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                            <Label className="font-semibold text-destructive">Zonă de Pericol</Label>
                            <Button variant="destructive" className="w-full" onClick={taskPlanner.resetAllData}><Trash2 className="mr-2 h-4 w-4"/> Resetează Toate Datele</Button>
                         </div>
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button onClick={handleSave}>Salvează & Închide</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function HistoryDialog({ planner }: { planner: ReturnType<typeof useTaskPlanner> }) {
    const sortedDates = useMemo(() => {
        return Object.keys(planner.plan).sort((a, b) => b.localeCompare(a));
    }, [planner.plan]);

    return (
        <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="icon"><History className="h-5 w-5" /></Button></DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader><DialogTitle>Istoric Detaliat</DialogTitle><DialogDescription>Vezi activitățile din zilele anterioare.</DialogDescription></DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6 py-4">
                    {sortedDates.length > 0 ? sortedDates.map(dateStr => {
                        const day = planner.plan[dateStr];
                        const date = new Date(dateStr + 'T12:00:00');
                        const completedCount = day.tasks.filter(t => t.status === 'completed').length;
                        return (
                            <div key={dateStr}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-lg">{format(date, 'EEEE, d MMMM yyyy', { locale: ro })}</h3>
                                    <span className="font-bold text-sm text-green-500">{completedCount} Reușite</span>
                                </div>
                                <div className="space-y-2 border p-3 rounded-md bg-muted/30">
                                    {day.tasks.length > 0 ? day.tasks.map(task => (
                                        <div key={task.id} className="flex items-start gap-3 text-sm">
                                            {task.status === 'completed' && <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
                                            {task.status === 'failed' && <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />}
                                            {task.status === 'pending' && <div className="h-4 w-4 border rounded-sm mt-0.5 flex-shrink-0" />}
                                            <p className={`text-muted-foreground ${task.status !== 'pending' ? 'line-through' : ''}`}>{task.description}</p>
                                        </div>
                                    )) : <p className="text-sm text-muted-foreground">Nicio activitate înregistrată.</p>}
                                </div>
                            </div>
                        )
                    }) : <p className="text-center text-muted-foreground py-8">Niciun istoric de afișat.</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function AchievementsDialog({ achievements }: { achievements: AchievementStats }) {
    const unlockedCount = achievements.unlocked.size;
    const totalCount = Object.keys(achievementsList).length;
    return (
        <Dialog><DialogTrigger asChild><Button variant="outline" className="relative"><Trophy className="mr-2 h-5 w-5" /> Premii <AnimatePresence>{unlockedCount > 0 && <motion.span initial={{scale:0}} animate={{scale:1}} className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-xs text-white flex items-center justify-center">{unlockedCount}</motion.span>}</AnimatePresence></Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Premii și Realizări</DialogTitle><DialogDescription>Ai deblocat {unlockedCount} din {totalCount} premii disponibile.</DialogDescription></DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-3 py-4">
                    {Object.entries(achievementsList).map(([id, ach], index) => {
                        const isUnlocked = achievements.unlocked.has(id as AchievementId);
                        return (
                            <motion.div key={id} initial={{opacity:0, x:-20}} animate={{opacity:1, y:0}} transition={{delay: 0.05 * index}} className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${isUnlocked ? 'border-amber-500/50 bg-amber-500/10' : 'bg-muted/50 opacity-60'}`}>
                                <div className={`text-4xl transition-transform duration-500 ${isUnlocked ? 'scale-110' : ''}`}>{ach.icon}</div>
                                <div><p className={`font-bold ${isUnlocked ? 'text-amber-600 dark:text-amber-400' : ''}`}>{ach.title}</p><p className="text-sm text-muted-foreground">{ach.description}</p></div>
                            </motion.div>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- Componenta TUTORIAL ÎMBUNĂTĂȚITĂ ---
function TutorialOverlay({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(1);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const totalSteps = 6;
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = document.querySelector(`[data-step='${step}']`);
    document.querySelectorAll('.highlighted-element').forEach(e => e.classList.remove('highlighted-element'));
    if (el) {
      el.classList.add('highlighted-element');
      const rect = el.getBoundingClientRect();
      const newStyle: React.CSSProperties = {
        opacity: 1,
      };

      // Calculează poziția X
      let leftPx = rect.left + rect.width / 2;
      let transformX = '-50%';

      // Asigură că dialogul nu iese din ecran pe orizontală
      const dialogWidth = 320; // max-w-xs este ~320px
      if (leftPx - dialogWidth / 2 < 10) { // Prea aproape de marginea stângă
        newStyle.left = `10px`;
        newStyle.transform = `translateX(0)`;
        newStyle.textAlign = 'left';
      } else if (leftPx + dialogWidth / 2 > window.innerWidth - 10) { // Prea aproape de marginea dreaptă
        newStyle.left = `${window.innerWidth - 10}px`;
        newStyle.transform = `translateX(-100%)`;
        newStyle.textAlign = 'right';
      } else {
        newStyle.left = `${leftPx}px`;
        newStyle.transform = `translateX(-50%)`;
        newStyle.textAlign = 'center';
      }

      // Calculează poziția Y
      const dialogHeight = 150; // O estimare a înălțimii dialogului tutorialului
      if (rect.top > window.innerHeight / 2 && rect.top - dialogHeight - 15 > 0) { // Elementul e în jumătatea de jos, pune tutorialul deasupra
        newStyle.top = 'auto';
        newStyle.bottom = `${window.innerHeight - rect.top + 15}px`;
      } else { // Elementul e în jumătatea de sus, pune tutorialul dedesubt
        newStyle.top = `${rect.bottom + 15}px`;
        newStyle.bottom = 'auto';
      }
      
      setStyle(newStyle);
      setTimeout(() => nextButtonRef.current?.focus(), 100); 
    }
     
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && step < totalSteps) setStep(s => s + 1);
      else if (e.key === 'ArrowLeft' && step > 1) setStep(s => s - 1);
      else if (e.key === 'Escape') onFinish();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        document.querySelectorAll('.highlighted-element').forEach(e => e.classList.remove('highlighted-element'));
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, onFinish, totalSteps]);
  
  const introText = document.querySelector(`[data-step='${step}']`)?.getAttribute('data-intro') || '';

  return (
      <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            key={step} 
            initial={{opacity:0, y:10}} 
            animate={{opacity:1, y:0}} 
            className="absolute p-4 bg-background rounded-lg shadow-xl max-w-xs z-[102]" 
            style={style}
          >
              <p className="text-sm text-muted-foreground mb-4">{introText}</p>
              <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{step} / {totalSteps}</span>
                  {step < totalSteps ? 
                    ( <Button ref={nextButtonRef} size="sm" onClick={() => setStep(s => s + 1)}>Următorul</Button> ) : 
                    ( <Button ref={nextButtonRef} size="sm" onClick={onFinish}>Am înțeles!</Button> )
                  }
              </div>
          </motion.div>
          <style jsx global>{`
            .highlighted-element { z-index: 101; position: relative; background: hsl(var(--background)); border-radius: 8px; box-shadow: 0 0 0 4px hsl(var(--primary)), 0 0 20px 10px hsl(var(--primary) / 0.5); transition: all 0.3s ease-in-out; }
          `}</style>
      </motion.div>
  )
}

function AskTutorialDialog({ onConfirm, onDecline }: { onConfirm: () => void, onDecline: () => void }) {
    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Bun venit la Planificator!</DialogTitle>
                    <DialogDescription>
                        Se pare că e prima dată când vizitezi această secțiune. Vrei un tur rapid al funcționalităților?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                    <Button type="button" variant="secondary" onClick={onDecline}>Nu, mulțumesc</Button>
                    <Button type="button" onClick={onConfirm}>Da, pornește turul!</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div><Skeleton className="h-10 w-80 mb-2" /><Skeleton className="h-5 w-64" /></div>
            <div className="flex gap-2"><Skeleton className="h-10 w-10 rounded-md" /></div>
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {Array.from({length: 7}).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    </div>
  );
}