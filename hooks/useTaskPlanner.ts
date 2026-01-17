'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { format, startOfWeek, addDays, isSameDay, getMonth } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

// --- TIPURI ---

export type TaskStatus = 'pending' | 'completed' | 'failed';

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
}

export interface DayPlan {
  date: string;
  tasks: Task[];
  goalReached: boolean;
}

export interface PlannerSettings {
  dailyGoal: number; // Nr de task-uri reușite pt "Goal"
  autoApplySchedule: boolean;
  autoDelete: boolean; // Reset lunar
}

export interface RecurringTask {
  id: string;
  dayIndex: number; // 0=Luni ... 6=Duminică
  description: string;
}

export type AchievementId = 'first_win' | 'streak_3' | 'streak_7' | 'master_planner';

export interface AchievementStats {
  unlocked: Set<AchievementId>;
  streakCurrent: number;
  streakMax: number;
}

// Structura salvată în Firestore
interface PlannerData {
  plan: Record<string, DayPlan>;
  schedule: Record<number, RecurringTask[]>; // 0-6
  settings: PlannerSettings;
  stats: {
    unlocked: string[]; // Set serializat ca Array
    streakCurrent: number;
    streakMax: number;
  };
}

// --- CONFIGURĂRI DEFAULT ---

const DEFAULT_SETTINGS: PlannerSettings = {
  dailyGoal: 3,
  autoApplySchedule: false,
  autoDelete: false,
};

export const achievementsList: Record<AchievementId, { title: string; description: string; icon: string }> = {
  first_win: { title: 'Primul Pas', description: 'Ai completat prima ta sarcină!', icon: '🌟' },
  streak_3: { title: 'Încălzirea', description: '3 zile la rând cu obiective atinse.', icon: '🔥' },
  streak_7: { title: 'De Neoprit', description: 'O săptămână perfectă!', icon: '🚀' },
  master_planner: { title: 'Maestru', description: 'Ai atins 100 de sarcini completate total.', icon: '👑' },
};

// --- HOOK PRINCIPAL ---

export function useTaskPlanner() {
  const { user } = useAuth();
  
  // Stare locală (sincronizată cu DB)
  const [plan, setPlan] = useState<Record<string, DayPlan>>({});
  const [schedule, setSchedule] = useState<Record<number, RecurringTask[]>>({});
  const [settings, setSettings] = useState<PlannerSettings>(DEFAULT_SETTINGS);
  const [achievements, setAchievements] = useState<AchievementStats>({ unlocked: new Set(), streakCurrent: 0, streakMax: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // 1. ASCULTĂ MODIFICĂRI DIN FIREBASE
  useEffect(() => {
    if (!user) {
      setPlan({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const ref = doc(db, 'planners', user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as PlannerData;
        setPlan(data.plan || {});
        setSchedule(data.schedule || {});
        setSettings(data.settings || DEFAULT_SETTINGS);
        
        // Deserializăm Set-ul
        setAchievements({
            unlocked: new Set((data.stats?.unlocked || []) as AchievementId[]),
            streakCurrent: data.stats?.streakCurrent || 0,
            streakMax: data.stats?.streakMax || 0
        });
      } else {
        // Dacă nu există, îl creăm gol
        setDoc(ref, {
            plan: {},
            schedule: {},
            settings: DEFAULT_SETTINGS,
            stats: { unlocked: [], streakCurrent: 0, streakMax: 0 }
        });
      }
      setIsLoading(false);
    }, (err) => {
      console.error("Eroare la citire planner:", err);
      toast({ title: 'Eroare conexiune', description: 'Nu s-au putut încărca datele.', variant: 'destructive' });
      setIsLoading(false);
    });

    return () => unsub();
  }, [user]);

  // 2. FUNCȚIE HELPER PENTRU SALVARE
  // Salvăm doar câmpul modificat pentru eficiență
  const saveData = useCallback(async (field: keyof PlannerData, value: any) => {
    if (!user) return;
    try {
      const ref = doc(db, 'planners', user.uid);
      await updateDoc(ref, { [field]: value });
    } catch (e) {
      console.error("Eroare la salvare:", e);
    }
  }, [user]);

  // 3. LOGICA DE BUSINESS

  // Adaugă sarcină
  const addTask = (dateStr: string, description: string) => {
    const newPlan = { ...plan };
    if (!newPlan[dateStr]) newPlan[dateStr] = { date: dateStr, tasks: [], goalReached: false };

    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      description,
      status: 'pending'
    };

    newPlan[dateStr].tasks.push(newTask);
    setPlan(newPlan); // Update Optimistic
    saveData('plan', newPlan);
  };

  // Toggle status (Pending -> Completed -> Failed -> Pending)
  const toggleTaskStatus = (dateStr: string, taskId: string) => {
    const newPlan = { ...plan };
    const day = newPlan[dateStr];
    if (!day) return;

    const task = day.tasks.find(t => t.id === taskId);
    if (!task) return;

    const nextStatus: Record<TaskStatus, TaskStatus> = {
      'pending': 'completed',
      'completed': 'failed',
      'failed': 'pending'
    };
    task.status = nextStatus[task.status];

    // Recalculare Goal
    const completedCount = day.tasks.filter(t => t.status === 'completed').length;
    day.goalReached = completedCount >= settings.dailyGoal;

    setPlan(newPlan);
    saveData('plan', newPlan);
    
    // Verificăm Achievements
    checkAchievements(newPlan);
  };

  // Șterge sarcină
  const deleteTask = (dateStr: string, taskId: string) => {
    const newPlan = { ...plan };
    if (!newPlan[dateStr]) return;
    newPlan[dateStr].tasks = newPlan[dateStr].tasks.filter(t => t.id !== taskId);
    setPlan(newPlan);
    saveData('plan', newPlan);
  };

  // Update descriere
  const updateTaskDescription = (dateStr: string, taskId: string, newDesc: string) => {
    const newPlan = { ...plan };
    if (!newPlan[dateStr]) return;
    const task = newPlan[dateStr].tasks.find(t => t.id === taskId);
    if (task) {
        task.description = newDesc;
        setPlan(newPlan);
        saveData('plan', newPlan);
    }
  };

  // Adaugă sarcină neplanificată (direct cu status)
  const addUnplannedTask = (description: string, type: 'verde' | 'rosu') => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newPlan = { ...plan };
    if (!newPlan[today]) newPlan[today] = { date: today, tasks: [], goalReached: false };

    const newTask: Task = {
        id: Math.random().toString(36).substring(7),
        description,
        status: type === 'verde' ? 'completed' : 'failed'
    };
    newPlan[today].tasks.push(newTask);
    setPlan(newPlan);
    saveData('plan', newPlan);
  };

  // --- PROGRAM RECURENT ---

  const addRecurringTask = (dayIndex: number, description: string) => {
    const newSchedule = { ...schedule };
    if (!newSchedule[dayIndex]) newSchedule[dayIndex] = [];
    newSchedule[dayIndex].push({ id: Math.random().toString(36).substring(7), dayIndex, description });
    setSchedule(newSchedule);
    saveData('schedule', newSchedule);
  };

  const deleteRecurringTask = (dayIndex: number, taskId: string) => {
    const newSchedule = { ...schedule };
    if (newSchedule[dayIndex]) {
        newSchedule[dayIndex] = newSchedule[dayIndex].filter(t => t.id !== taskId);
        setSchedule(newSchedule);
        saveData('schedule', newSchedule);
    }
  };

  const applyScheduleToWeek = (startDate: Date) => {
    const newPlan = { ...plan };
    let changed = false;

    for (let i = 0; i < 7; i++) {
        const currentDate = addDays(startDate, i);
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const dayIdx = (currentDate.getDay() + 6) % 7; // 0=Luni pt noi

        const recurringTasks = schedule[dayIdx] || [];
        
        if (recurringTasks.length > 0) {
            if (!newPlan[dateStr]) {
                newPlan[dateStr] = { date: dateStr, tasks: [], goalReached: false };
            }
            
            // Adăugăm doar dacă nu există deja (evităm duplicate)
            const existingDescs = new Set(newPlan[dateStr].tasks.map(t => t.description));
            recurringTasks.forEach(rt => {
                if (!existingDescs.has(rt.description)) {
                    newPlan[dateStr].tasks.push({
                        id: Math.random().toString(36).substring(7),
                        description: rt.description,
                        status: 'pending'
                    });
                    changed = true;
                }
            });
        }
    }

    if (changed) {
        setPlan(newPlan);
        saveData('plan', newPlan);
    }
  };

  // --- SETĂRI & ADMIN ---

  const updateSettings = (newSettings: PlannerSettings) => {
    setSettings(newSettings);
    saveData('settings', newSettings);
  };

  const resetAllData = async () => {
    if (!user) return;
    await setDoc(doc(db, 'planners', user.uid), {
        plan: {},
        schedule: {},
        settings: DEFAULT_SETTINGS,
        stats: { unlocked: [], streakCurrent: 0, streakMax: 0 }
    });
    toast({ title: 'Date resetate', description: 'Totul a fost șters.' });
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target?.result as string);
            if (data.plan && data.settings) {
                // Salvăm direct în Firebase
                if (user) {
                   await updateDoc(doc(db, 'planners', user.uid), data);
                   toast({ title: 'Import reușit!' });
                }
            } else {
                throw new Error('Format invalid');
            }
        } catch {
            toast({ title: 'Eroare import', variant: 'destructive' });
        }
    };
    reader.readAsText(file);
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ plan, schedule, settings, stats: { ...achievements, unlocked: Array.from(achievements.unlocked) } }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner_backup_${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  // --- LOGICA DE ACHIEVEMENTS (Server-Side Logic simulat pe client) ---
  const checkAchievements = (currentPlan: Record<string, DayPlan>) => {
     // Aici poți pune logica de streak, etc.
     // Pentru simplificare, salvăm doar stats actuale dacă se schimbă ceva major
     // De exemplu, un "Master Planner" la 100 task-uri
     
     const totalCompleted = Object.values(currentPlan).flatMap(d => d.tasks).filter(t => t.status === 'completed').length;
     const newUnlocked = new Set(achievements.unlocked);
     let updated = false;

     if (totalCompleted >= 1 && !newUnlocked.has('first_win')) {
        newUnlocked.add('first_win');
        toast({ title: '🏆 Premiu Deblocat: Primul Pas!' });
        updated = true;
     }
     
     if (totalCompleted >= 100 && !newUnlocked.has('master_planner')) {
        newUnlocked.add('master_planner');
        toast({ title: '👑 Premiu Deblocat: Maestru!' });
        updated = true;
     }

     if (updated) {
         const newStats = { 
             ...achievements, 
             unlocked: Array.from(newUnlocked) 
         };
         // @ts-ignore - pentru a salva array-ul, nu Set-ul
         saveData('stats', newStats);
     }
  };

  return {
    plan,
    schedule,
    settings,
    achievements,
    isLoading,
    addTask,
    toggleTaskStatus,
    deleteTask,
    updateTaskDescription,
    addUnplannedTask,
    addRecurringTask,
    deleteRecurringTask,
    applyScheduleToWeek,
    updateSettings,
    resetAllData,
    importData,
    exportData
  };
}