'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { format, startOfWeek, addDays } from 'date-fns';

// ============================================================================
// == TIPURI DE DATE ȘI DEFINIȚII
// ============================================================================
export type TaskStatus = 'pending' | 'completed' | 'failed';
export type Task = { 
  id: string; 
  description: string; 
  status: TaskStatus; 
};
export type DailyPlan = { 
  tasks: Task[]; 
  goalReached?: boolean;
};
export type WeeklyPlan = { 
  [date: string]: DailyPlan; 
};
export type RecurringTask = { 
  id: string; 
  description: string; 
};
export type WeeklySchedule = { 
  [day: number]: RecurringTask[]; 
};
export type Settings = { 
  autoDelete: boolean; 
  autoApplySchedule: boolean; 
  dailyGoal: number; // <-- ACEASTA ESTE LINIA CRITICĂ
};
export type AchievementStats = {
  unlocked: Set<string>;
  currentStreak: number;
  longestStreak: number;
  lastGoalDate: string | null;
  totalGoalsMet: number;
  totalCompleted: number;
};
export type ExportData = { 
    version: number; 
    plan: WeeklyPlan; 
    settings: Settings; 
    schedule: WeeklySchedule;
    achievements: Omit<AchievementStats, 'unlocked'> & { unlocked: string[] };
};

export const achievementsList = {
  first_step: { title: 'Primul Pas!', description: 'Ai finalizat prima sarcină! Bravo!', icon: '👣' },
  daily_goal: { title: 'Obiectivul Zilnic', description: 'Ai atins obiectivul zilnic de activități!', icon: '🎯' },
  weekly_goal: { title: 'Obiectivul Săptămânal', description: 'Ai atins obiectivul săptămânal de activități!', icon: '📅' },
  month_goal: { title: 'Obiectivul Lunar', description: 'Ai atins obiectivul lunar de activități!', icon: '📆' },
  streak: { title: 'Streak!', description: 'Ai menținut o serie de zile consecutive cu activități!', icon: '🔥' },
  planner_master: { title: 'Planificator Expert', description: 'Ai folosit planificatorul timp de 30 de zile!', icon: '🧠' },
  task_creator: { title: 'Creator de Sarcini', description: 'Ai creat 100 de sarcini!', icon: '📝' },
  task_completer: { title: 'Finalizator de Sarcini', description: 'Ai finalizat 100 de sarcini!', icon: '✅' },
  task_deleter: { title: 'Ștergător de Sarcini', description: 'Ai șters 50 de sarcini!', icon: '🗑️' },
  task_updater: { title: 'Actualizator de Sarcini', description: 'Ai actualizat 50 de sarcini!', icon: '✏️' },
  planner_importer: { title: 'Importator de Planificări', description: 'Ai importat cu succes o planificare!', icon: '📥' },
  planner_exporter: { title: 'Exportator de Planificări', description: 'Ai exportat cu succes o planificare!', icon: '📤' },
  planner_resetter: { title: 'Resetare Planificator', description: 'Ai resetat planificatorul la setările implicite!', icon: '🔄' },
  planner_sharer: { title: 'Planificator Partajat', description: 'Ai partajat planificatorul cu un prieten!', icon: '🤝' },
  planner_customizer: { title: 'Planificator Personalizat', description: 'Ai personalizat aspectul planificatorului!', icon: '🎨' },
};
export type AchievementId = keyof typeof achievementsList;
const APP_PREFIX = 'taskPlanner_';

// ============================================================================
// == HOOK-UL PRINCIPAL ("CREIERUL")
// ============================================================================
export function useTaskPlanner() {
  const [plan, setPlan] = useState<WeeklyPlan>({});
  const [settings, setSettings] = useState<Settings>({ autoDelete: true, autoApplySchedule: true, dailyGoal: 3 }); // NOU: dailyGoal implicit
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [achievements, setAchievements] = useState<AchievementStats>({ unlocked: new Set(), currentStreak: 0, longestStreak: 0, lastGoalDate: null, totalGoalsMet: 0, totalCompleted: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedPlan = JSON.parse(localStorage.getItem(`${APP_PREFIX}plan`) || '{}');
      const savedSettings = JSON.parse(localStorage.getItem(`${APP_PREFIX}settings`) || '{"autoDelete":true, "autoApplySchedule":true, "dailyGoal":3}');
      const savedSchedule = JSON.parse(localStorage.getItem(`${APP_PREFIX}schedule`) || '{}');
      const savedAchievements = JSON.parse(localStorage.getItem(`${APP_PREFIX}achievements`) || '{}');

      let planWithSchedule = { ...savedPlan };
      if (savedSettings.autoApplySchedule) {
        const today = new Date();
        const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
        for (let i = 0; i < 7; i++) {
          const day = addDays(startOfThisWeek, i);
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayOfWeek = day.getDay() === 0 ? 6 : day.getDay() - 1;
          
          if (!planWithSchedule[dateStr] && savedSchedule[dayOfWeek]?.length > 0) {
            planWithSchedule[dateStr] = {
              tasks: savedSchedule[dayOfWeek].map((task: RecurringTask) => ({...task, status: 'pending'}))
            };
          }
        }
      }
      
      setPlan(planWithSchedule);
      setSettings(savedSettings);
      setSchedule(savedSchedule);
      if (savedAchievements.unlocked) {
        setAchievements({ ...savedAchievements, unlocked: new Set(savedAchievements.unlocked) });
      }
      
    } catch (error) { console.error("Eroare la încărcare:", error); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(`${APP_PREFIX}plan`, JSON.stringify(plan));
      localStorage.setItem(`${APP_PREFIX}settings`, JSON.stringify(settings));
      localStorage.setItem(`${APP_PREFIX}schedule`, JSON.stringify(schedule));
      const achievementsToSave = { ...achievements, unlocked: Array.from(achievements.unlocked) };
      localStorage.setItem(`${APP_PREFIX}achievements`, JSON.stringify(achievementsToSave));
    }
  }, [plan, settings, schedule, achievements, isLoading]);

  const addTask = useCallback((date: string, description: string) => {
    if (!description.trim()) return;
    const newTask: Task = { id: `task_${Date.now()}`, description, status: 'pending' };
    setPlan(prev => ({...prev, [date]: { tasks: [...(prev[date]?.tasks || []), newTask] }}));
  }, []);

  const addUnplannedTask = useCallback((description: string, type: 'verde' | 'rosu') => {
    if (!description.trim()) { toast({ title: "Text necesar", variant: "destructive"}); return; }
    const today = format(new Date(), 'yyyy-MM-dd');
    const status = type === 'verde' ? 'completed' : 'failed';
    const newTask: Task = { id: `task_${Date.now()}`, description, status };
    const newPlan = {...plan, [today]: { tasks: [...(plan[today]?.tasks || []), newTask] }};
    setPlan(newPlan);
    toast({ title: `Activitate adăugată!`});
  }, [plan, achievements]); // Added achievements to dependency array for checkAndUnlockAchievements

  const toggleTaskStatus = useCallback((date: string, taskId: string) => {
    setPlan(prev => {
        const dayTasks = prev[date]?.tasks || [];
        const newTasks = dayTasks.map(task => {
            if (task.id === taskId) {
                const nextStatus: TaskStatus = task.status === 'pending' ? 'completed' : task.status === 'completed' ? 'failed' : 'pending';
                return { ...task, status: nextStatus };
            }
            return task;
        });
        return { ...prev, [date]: { ...prev[date], tasks: newTasks } };
    });
  }, []);

  const deleteTask = useCallback((date: string, taskId: string) => {
    setPlan(prev => {
      const dayTasks = prev[date]?.tasks || [];
      const newTasks = dayTasks.filter(task => task.id !== taskId);
      if (newTasks.length === 0) { const { [date]: _, ...rest } = prev; return rest; }
      return { ...prev, [date]: { tasks: newTasks } };
    });
  }, []);
  
  const updateTaskDescription = useCallback((date: string, taskId: string, newDescription: string) => {
    if (!newDescription.trim()) { deleteTask(date, taskId); return; };
    setPlan(prev => {
        const dayTasks = prev[date]?.tasks || [];
        const newTasks = dayTasks.map(task => task.id === taskId ? { ...task, description: newDescription } : task);
        return { ...prev, [date]: { tasks: newTasks }};
    });
  }, [deleteTask]);
  
  const addRecurringTask = useCallback((day: number, description: string) => {
    if (!description.trim()) return;
    const newTask: RecurringTask = { id: `rec_${Date.now()}`, description };
    setSchedule(prev => ({ ...prev, [day]: [...(prev[day] || []), newTask] }));
  }, []);

  const deleteRecurringTask = useCallback((day: number, taskId: string) => {
    setSchedule(prev => ({ ...prev, [day]: (prev[day] || []).filter(t => t.id !== taskId) }));
  }, []);
  
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updateSchedule = useCallback((newSchedule: WeeklySchedule) => {
    setSchedule(newSchedule);
    toast({ title: 'Programul a fost salvat!' });
  }, []);
  
  const exportData = useCallback(() => {
    try {
      const achievementsToSave = { ...achievements, unlocked: Array.from(achievements.unlocked) };
      const dataToExport: ExportData = { version: 1, plan, settings, schedule, achievements: achievementsToSave };
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `planificator_backup_${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: 'Date exportate cu succes!' });
    } catch (error) { toast({ title: 'Exportul a eșuat', variant: 'destructive' }); }
  }, [plan, settings, schedule, achievements]);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const imported = JSON.parse(text) as ExportData;
        if (imported.version !== 1 || !imported.plan || !imported.settings || !imported.achievements || !imported.schedule) {
          throw new Error("Format de fișier invalid sau corupt.");
        }
        if (window.confirm("ATENȚIE: Sunteți pe cale să suprascrieți toate datele. Doriți să continuați?")) {
            setPlan(imported.plan);
            setSettings(imported.settings);
            setSchedule(imported.schedule);
            setAchievements({ ...imported.achievements, unlocked: new Set(imported.achievements.unlocked) });
            toast({ title: 'Date importate cu succes!' });
        }
      } catch (error) { toast({ title: 'Importul a eșuat', description: (error as Error).message, variant: 'destructive' }); }
    };
    reader.readAsText(file);
  }, []);
  
  const resetAllData = useCallback(() => {
      if (window.confirm("ULTIMA ȘANSĂ: Sunteți sigur că vreți să ștergeți PERMANENT toate datele?")) {
          setPlan({});
          setSettings({ autoDelete: true, autoApplySchedule: true, dailyGoal: 3 });
          setSchedule({});
          setAchievements({ unlocked: new Set(), currentStreak: 0, longestStreak: 0, lastGoalDate: null, totalGoalsMet: 0, totalCompleted: 0 });
          localStorage.removeItem(`${APP_PREFIX}plan`);
          localStorage.removeItem(`${APP_PREFIX}settings`);
          localStorage.removeItem(`${APP_PREFIX}schedule`);
          localStorage.removeItem(`${APP_PREFIX}achievements`);
          localStorage.removeItem(`${APP_PREFIX}lastReset`);
          toast({ title: 'Toate datele au fost resetate!', variant: 'destructive' });
      }
  }, []);

  return { 
    plan, settings, schedule, achievements, isLoading, 
    addTask, addUnplannedTask, toggleTaskStatus, deleteTask, updateTaskDescription,
    addRecurringTask, deleteRecurringTask, updateSchedule,
    updateSettings, exportData, importData, resetAllData,
  };
}