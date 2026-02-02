'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { format, subDays, isSameDay, getDay, getHours, isPast, addDays } from 'date-fns'; 
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
  dailyGoal: number; 
  autoApplySchedule: boolean;
  autoDelete: boolean; 
}

export interface RecurringTask {
  id: string;
  dayIndex: number; 
  description: string;
}

// DEFINIȚIA TUTUROR PREMIILOR POSIBILE
export type AchievementId = 
  | 'novice' | 'apprentice' | 'adept' | 'expert' | 'master' | 'grandmaster' | 'legend' // Volum
  | 'streak_3' | 'streak_7' | 'streak_14' | 'streak_30' | 'streak_60' | 'streak_100' // Streak
  | 'early_bird' | 'night_owl' | 'weekend_warrior' | 'perfectionist'; // Speciale

export interface AchievementStats {
  unlocked: Set<AchievementId>;
  streakCurrent: number;
  streakMax: number;
}

interface PlannerData {
  plan: Record<string, DayPlan>;
  schedule: Record<number, RecurringTask[]>; 
  settings: PlannerSettings;
  stats: {
    unlocked: string[]; 
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

// --- LISTA MASIVĂ DE PREMII ---
export const achievementsList: Record<AchievementId, { title: string; description: string; icon: string; color: string }> = {
  // VOLUM (Task-uri totale)
  novice: { title: 'Începutul', description: 'Ai completat prima ta sarcină.', icon: '🌱', color: 'text-green-400' },
  apprentice: { title: 'Ucenic', description: '10 sarcini completate.', icon: '🔨', color: 'text-blue-400' },
  adept: { title: 'Competent', description: '50 sarcini completate.', icon: '📘', color: 'text-indigo-400' },
  expert: { title: 'Expert', description: '100 sarcini completate.', icon: '🧠', color: 'text-violet-400' },
  master: { title: 'Maestru', description: '250 sarcini completate.', icon: '🔮', color: 'text-fuchsia-400' },
  grandmaster: { title: 'Grandmaster', description: '500 sarcini completate.', icon: '👑', color: 'text-amber-400' },
  legend: { title: 'LEGENDĂ', description: '1000 sarcini completate. Ești un zeu.', icon: '🗿', color: 'text-red-500' },

  // STREAK (Consecvență)
  streak_3: { title: 'Încălzirea', description: '3 zile la rând cu obiective atinse.', icon: '🔥', color: 'text-orange-300' },
  streak_7: { title: 'On Fire', description: 'O săptămână perfectă!', icon: '🧨', color: 'text-orange-400' },
  streak_14: { title: 'Disciplină', description: '2 săptămâni consecutive.', icon: '🛡️', color: 'text-orange-500' },
  streak_30: { title: 'Titan', description: 'O lună întreagă fără greșeală.', icon: '🏰', color: 'text-amber-500' },
  streak_60: { title: 'Nemuritor', description: '2 luni consecutive.', icon: '⚔️', color: 'text-red-600' },
  streak_100: { title: 'CENTURION', description: '100 de zile consecutive.', icon: '💯', color: 'text-rose-600' },

  // SPECIALE (Context)
  early_bird: { title: 'Matinal', description: 'Task completat înainte de ora 07:00.', icon: '🌅', color: 'text-yellow-300' },
  night_owl: { title: 'Nocturn', description: 'Task completat după ora 23:00.', icon: '🦉', color: 'text-indigo-300' },
  weekend_warrior: { title: 'Weekend Warrior', description: 'Productivitate în weekend.', icon: '🎉', color: 'text-pink-400' },
  perfectionist: { title: 'Perfecționist', description: 'Toate task-urile dintr-o zi completate.', icon: '✨', color: 'text-cyan-400' },
};

// --- HOOK PRINCIPAL ---
export function useTaskPlanner() {
  const { user } = useAuth();
  
  const [plan, setPlan] = useState<Record<string, DayPlan>>({});
  const [schedule, setSchedule] = useState<Record<number, RecurringTask[]>>({});
  const [settings, setSettings] = useState<PlannerSettings>(DEFAULT_SETTINGS);
  const [achievements, setAchievements] = useState<AchievementStats>({ unlocked: new Set(), streakCurrent: 0, streakMax: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // 1. UPDATE XP GLOBAL
  const updateGlobalXP = async (amount: number) => {
    if (!user) return;
    const progressRef = doc(db, "progress", user.uid);
    try {
        await updateDoc(progressRef, { xp: increment(amount) });
        // Verificăm Level Up rapid
        const snap = await getDoc(progressRef);
        if (snap.exists()) {
            const data = snap.data();
            const xp = data.xp || 0;
            const lvl = data.level || 1;
            if (xp >= lvl * 1000) {
                await updateDoc(progressRef, { level: increment(1) });
                toast({ title: "LEVEL UP! 🎉", description: `Ai atins nivelul ${lvl + 1}!`, className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0" });
            }
        }
    } catch { /* ignore init errors */ }
  };

  // 2. LISTENERS
  useEffect(() => {
    if (!user) { setPlan({}); setIsLoading(false); return; }
    setIsLoading(true);
    const ref = doc(db, 'planners', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as PlannerData;
        setPlan(data.plan || {});
        setSchedule(data.schedule || {});
        setSettings(data.settings || DEFAULT_SETTINGS);
        setAchievements({
            unlocked: new Set((data.stats?.unlocked || []) as AchievementId[]),
            streakCurrent: data.stats?.streakCurrent || 0,
            streakMax: data.stats?.streakMax || 0
        });
      } else {
        setDoc(ref, { plan: {}, schedule: {}, settings: DEFAULT_SETTINGS, stats: { unlocked: [], streakCurrent: 0, streakMax: 0 } });
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, [user]);

  const saveData = useCallback(async (field: keyof PlannerData, value: any) => {
    if (!user) return;
    try { await updateDoc(doc(db, 'planners', user.uid), { [field]: value }); } catch (e) { console.error(e); }
  }, [user]);

  // 3. LOGICA PREMII AVANSATĂ
  const checkAchievements = (currentPlan: Record<string, DayPlan>, actionTime?: Date) => {
     const totalCompleted = Object.values(currentPlan).flatMap(d => d.tasks).filter(t => t.status === 'completed').length;
     const newUnlocked = new Set(achievements.unlocked);
     let updated = false;

     // Milestone-uri de Volum
     const volumeMilestones: {c: number, id: AchievementId}[] = [
         { c: 1, id: 'novice' }, { c: 10, id: 'apprentice' }, { c: 50, id: 'adept' },
         { c: 100, id: 'expert' }, { c: 250, id: 'master' }, { c: 500, id: 'grandmaster' }, { c: 1000, id: 'legend' }
     ];

     volumeMilestones.forEach(m => {
         if (totalCompleted >= m.c && !newUnlocked.has(m.id)) {
             newUnlocked.add(m.id);
             toast({ title: `🏆 ${achievementsList[m.id].title}`, description: achievementsList[m.id].description });
             updated = true;
         }
     });

     // Milestone-uri Speciale (Time-based)
     if (actionTime) {
         const hour = getHours(actionTime);
         const day = getDay(actionTime); // 0 = Duminica, 6 = Sambata

         // Early Bird (< 7 AM)
         if (hour < 7 && !newUnlocked.has('early_bird')) {
             newUnlocked.add('early_bird');
             toast({ title: `🌅 ${achievementsList['early_bird'].title}`, description: "Te-ai trezit devreme!" });
             updated = true;
         }

         // Night Owl (> 23 PM)
         if (hour >= 23 && !newUnlocked.has('night_owl')) {
             newUnlocked.add('night_owl');
             toast({ title: `🦉 ${achievementsList['night_owl'].title}`, description: "Productivitate nocturnă." });
             updated = true;
         }

         // Weekend Warrior
         if ((day === 0 || day === 6) && !newUnlocked.has('weekend_warrior')) {
             newUnlocked.add('weekend_warrior');
             toast({ title: `🎉 ${achievementsList['weekend_warrior'].title}`, description: "Nu iei pauză nici în weekend!" });
             updated = true;
         }
     }

     if (updated) {
         const newStats = { ...achievements, unlocked: Array.from(newUnlocked) };
         // @ts-ignore
         saveData('stats', newStats);
     }
  };

  // 4. ACTIUNI TASK
  const toggleTaskStatus = async (dateStr: string, taskId: string) => {
    const newPlan = { ...plan };
    const day = newPlan[dateStr];
    if (!day) return;

    const task = day.tasks.find(t => t.id === taskId);
    if (!task) return;

    const oldStatus = task.status;
    const nextStatus: Record<TaskStatus, TaskStatus> = { 'pending': 'completed', 'completed': 'failed', 'failed': 'pending' };
    task.status = nextStatus[oldStatus];

    // XP Logic
    if (task.status === 'completed') {
        updateGlobalXP(50);
        // Verificăm realizări speciale la momentul completării
        checkAchievements(newPlan, new Date());
    } else if (oldStatus === 'completed') {
        updateGlobalXP(-50);
    } else {
        // Check normal
        checkAchievements(newPlan);
    }

    // Goal Logic
    const completedCount = day.tasks.filter(t => t.status === 'completed').length;
    day.goalReached = completedCount >= settings.dailyGoal;
    
    // Perfectionist Check
    if (day.tasks.length >= 3 && completedCount === day.tasks.length) {
        // Deblocare "Perfecționist" (logică simplificată)
        // checkAchievements ar prinde asta dacă adăugăm ID-ul în funcție
    }

    setPlan(newPlan);
    saveData('plan', newPlan);
  };

  // Restul funcțiilor (add, delete, settings) rămân standard, dar esențiale
  const addTask = (dateStr: string, description: string) => {
    const newPlan = { ...plan };
    if (!newPlan[dateStr]) newPlan[dateStr] = { date: dateStr, tasks: [], goalReached: false };
    newPlan[dateStr].tasks.push({ id: Math.random().toString(36).substring(7), description, status: 'pending' });
    setPlan(newPlan); 
    saveData('plan', newPlan);
  };

  const addUnplannedTask = (description: string, type: 'verde' | 'rosu') => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const newPlan = { ...plan };
      if (!newPlan[today]) newPlan[today] = { date: today, tasks: [], goalReached: false };
      newPlan[today].tasks.push({ id: Math.random().toString(36).substring(7), description, status: type === 'verde' ? 'completed' : 'failed' });
      if (type === 'verde') {
          updateGlobalXP(50);
          checkAchievements(newPlan, new Date());
      }
      setPlan(newPlan);
      saveData('plan', newPlan);
  };

  const updateTaskDescription = (dateStr: string, taskId: string, newDesc: string) => {
    const newPlan = { ...plan };
    const task = newPlan[dateStr]?.tasks.find(t => t.id === taskId);
    if (task) { task.description = newDesc; setPlan(newPlan); saveData('plan', newPlan); }
  };
  
  const deleteTask = (dateStr: string, taskId: string) => {
    const newPlan = { ...plan };
    if (newPlan[dateStr]) { newPlan[dateStr].tasks = newPlan[dateStr].tasks.filter(t => t.id !== taskId); setPlan(newPlan); saveData('plan', newPlan); }
  };

  const addRecurringTask = (dayIndex: number, description: string) => {
    const newSchedule = { ...schedule };
    if (!newSchedule[dayIndex]) newSchedule[dayIndex] = [];
    newSchedule[dayIndex].push({ id: Math.random().toString(36).substring(7), dayIndex, description });
    setSchedule(newSchedule); saveData('schedule', newSchedule);
  };

  const deleteRecurringTask = (dayIndex: number, taskId: string) => {
    const newSchedule = { ...schedule };
    if (newSchedule[dayIndex]) { newSchedule[dayIndex] = newSchedule[dayIndex].filter(t => t.id !== taskId); setSchedule(newSchedule); saveData('schedule', newSchedule); }
  };

  const applyScheduleToWeek = (startDate: Date) => {
    const newPlan = { ...plan };
    let changed = false;
    for (let i = 0; i < 7; i++) {
        const currentDate = addDays(startDate, i);
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const dayIdx = (currentDate.getDay() + 6) % 7; 
        const recurringTasks = schedule[dayIdx] || [];
        if (recurringTasks.length > 0) {
            if (!newPlan[dateStr]) newPlan[dateStr] = { date: dateStr, tasks: [], goalReached: false };
            const existingDescs = new Set(newPlan[dateStr].tasks.map(t => t.description));
            recurringTasks.forEach(rt => { if (!existingDescs.has(rt.description)) { newPlan[dateStr].tasks.push({ id: Math.random().toString(36).substring(7), description: rt.description, status: 'pending' }); changed = true; }});
        }
    }
    if (changed) { setPlan(newPlan); saveData('plan', newPlan); }
  };

  const updateSettings = (s: PlannerSettings) => { setSettings(s); saveData('settings', s); };
  const resetAllData = async () => { if (user) { await setDoc(doc(db, 'planners', user.uid), { plan: {}, schedule: {}, settings: DEFAULT_SETTINGS, stats: { unlocked: [], streakCurrent: 0, streakMax: 0 } }); toast({ title: 'Date resetate' }); }};
  
  const exportData = () => {
    const dataStr = JSON.stringify({ plan, schedule, settings }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `backup.json`; a.click();
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target?.result as string);
            if (data.plan && data.settings) { if (user) { await updateDoc(doc(db, 'planners', user.uid), data); toast({ title: 'Import reușit!' }); } }
        } catch { toast({ title: 'Eroare import', variant: 'destructive' }); }
    };
    reader.readAsText(file);
  };

  return { plan, schedule, settings, achievements, isLoading, addTask, toggleTaskStatus, deleteTask, updateTaskDescription, addUnplannedTask, addRecurringTask, deleteRecurringTask, applyScheduleToWeek, updateSettings, resetAllData, importData, exportData };
}