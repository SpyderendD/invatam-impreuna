'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { format, isToday, isYesterday, getDay, getHours, addDays, startOfWeek } from 'date-fns'; 
import { toast } from '@/components/ui/use-toast';

export type TaskStatus = 'pending' | 'completed' | 'failed';
export interface Task { id: string; description: string; status: TaskStatus; }
export interface DayPlan { date: string; tasks: Task[]; goalReached: boolean; }
export interface PlannerSettings { dailyGoal: number; autoApplySchedule: boolean; autoDelete: boolean; }
export interface RecurringTask { id: string; dayIndex: number; description: string; }

export type AchievementId = 
  | 'novice' | 'apprentice' | 'adept' | 'expert' | 'master' | 'grandmaster' | 'legend' 
  | 'streak_3' | 'streak_7' | 'streak_14' | 'streak_30' | 'streak_60' | 'streak_100' 
  | 'early_bird' | 'night_owl' | 'weekend_warrior' | 'perfectionist'
  | 'dedicated' | 'marathon' | 'strategist' | 'unbeatable';

export interface AchievementStats { unlocked: Set<AchievementId>; streakCurrent: number; streakMax: number; lastGoalDate?: string; }

interface PlannerData {
  plan: Record<string, DayPlan>;
  schedule: Record<number, RecurringTask[]>; 
  settings: PlannerSettings;
  stats: { unlocked: string[]; streakCurrent: number; streakMax: number; lastGoalDate?: string; };
}

const DEFAULT_SETTINGS: PlannerSettings = { dailyGoal: 3, autoApplySchedule: false, autoDelete: false };

export const achievementsList: Record<AchievementId, { title: string; description: string; icon: string; color: string }> = {
  novice: { title: 'Începutul', description: 'Prima sarcină completată.', icon: '🌱', color: 'text-green-400' },
  apprentice: { title: 'Ucenic', description: '10 sarcini completate.', icon: '🔨', color: 'text-blue-400' },
  adept: { title: 'Competent', description: '50 sarcini completate.', icon: '📘', color: 'text-indigo-400' },
  expert: { title: 'Expert', description: '100 sarcini completate.', icon: '🧠', color: 'text-violet-400' },
  master: { title: 'Maestru', description: '250 sarcini completate.', icon: '🔮', color: 'text-fuchsia-400' },
  grandmaster: { title: 'Grandmaster', description: '500 sarcini completate.', icon: '👑', color: 'text-amber-400' },
  legend: { title: 'LEGENDĂ', description: '1000 sarcini completate.', icon: '🗿', color: 'text-red-500' },
  streak_3: { title: 'Încălzirea', description: '3 zile de consecvență.', icon: '🔥', color: 'text-orange-300' },
  streak_7: { title: 'On Fire', description: 'O săptămână perfectă!', icon: '🧨', color: 'text-orange-400' },
  streak_14: { title: 'Disciplină', description: '14 zile fără greșeală.', icon: '🛡️', color: 'text-orange-500' },
  streak_30: { title: 'Titan', description: 'O lună întreagă de muncă.', icon: '🏰', color: 'text-amber-500' },
  streak_60: { title: 'Nemuritor', description: '2 luni de foc.', icon: '⚔️', color: 'text-red-600' },
  streak_100: { title: 'CENTURION', description: '100 de zile de glorie.', icon: '💯', color: 'text-rose-600' },
  early_bird: { title: 'Matinal', description: 'Task gata înainte de 07:00 AM.', icon: '🌅', color: 'text-yellow-300' },
  night_owl: { title: 'Nocturn', description: 'Task gata după 23:00 PM.', icon: '🦉', color: 'text-indigo-300' },
  weekend_warrior: { title: 'Weekend Warrior', description: 'Muncă în weekend.', icon: '🎉', color: 'text-pink-400' },
  perfectionist: { title: 'Perfecționist', description: 'Toate taskurile zilei gata.', icon: '✨', color: 'text-cyan-400' },
  dedicated: { title: 'Dedicat', description: 'Ai atins obiectivul zilnic de 5 ori.', icon: '💎', color: 'text-sky-400' },
  marathon: { title: 'Maratonist', description: 'Ai completat 20 de task-uri într-o singură zi.', icon: '🏃', color: 'text-lime-400' },
  strategist: { title: 'Strategist', description: 'Ai configurat un program complet pe 7 zile.', icon: '♟️', color: 'text-slate-300' },
  unbeatable: { title: 'Imbatabil', description: 'Ai terminat o lună cu peste 90% task-uri reușite.', icon: '🎖️', color: 'text-yellow-600' },
};

export function useTaskPlanner() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Record<string, DayPlan>>({});
  const [schedule, setSchedule] = useState<Record<number, RecurringTask[]>>({});
  const [settings, setSettings] = useState<PlannerSettings>(DEFAULT_SETTINGS);
  const [achievements, setAchievements] = useState<AchievementStats>({ unlocked: new Set(), streakCurrent: 0, streakMax: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Verificare Streak
  const checkStreak = (stats: any) => {
    if (!stats.lastGoalDate) return stats;
    const last = new Date(stats.lastGoalDate);
    if (!isToday(last) && !isYesterday(last)) return { ...stats, streakCurrent: 0 };
    return stats;
  };

  useEffect(() => {
    if (!user) { setPlan({}); setIsLoading(false); return; }
    setIsLoading(true);
    const ref = doc(db, 'planners', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as PlannerData;
        const s = checkStreak(data.stats || {});
        setPlan(data.plan || {});
        setSchedule(data.schedule || {});
        setSettings(data.settings || DEFAULT_SETTINGS);
        setAchievements({
            unlocked: new Set((data.stats?.unlocked || []) as AchievementId[]),
            streakCurrent: s.streakCurrent || 0,
            streakMax: s.streakMax || 0,
            lastGoalDate: s.lastGoalDate
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

  const updateGlobalXP = async (amount: number) => {
    if (!user) return;
    const progressRef = doc(db, "progress", user.uid);
    try {
        await updateDoc(progressRef, { xp: increment(amount) });
        const snap = await getDoc(progressRef);
        if (snap.exists()) {
            const data = snap.data();
            if (data.xp >= (data.level || 1) * 1000) await updateDoc(progressRef, { level: increment(1) });
        }
    } catch { }
  };

  const checkAchievements = (currentPlan: Record<string, DayPlan>, actionTime?: Date) => {
     const totalCompleted = Object.values(currentPlan).flatMap(d => d.tasks).filter(t => t.status === 'completed').length;
     const newUnlocked = new Set(achievements.unlocked);
     let updated = false;

     const milestones: {c: number, id: AchievementId}[] = [
         { c: 1, id: 'novice' }, { c: 10, id: 'apprentice' }, { c: 50, id: 'adept' }, { c: 100, id: 'expert' }
     ];
     milestones.forEach(m => { if (totalCompleted >= m.c && !newUnlocked.has(m.id)) { newUnlocked.add(m.id); updated = true; } });

     if (actionTime) {
         const h = getHours(actionTime);
         if (h < 7 && !newUnlocked.has('early_bird')) { newUnlocked.add('early_bird'); updated = true; }
         if (h >= 23 && !newUnlocked.has('night_owl')) { newUnlocked.add('night_owl'); updated = true; }
     }

     if (updated) saveData('stats', { ...achievements, unlocked: Array.from(newUnlocked) });
  };

  const toggleTaskStatus = async (dateStr: string, taskId: string) => {
    const newPlan = { ...plan };
    const day = newPlan[dateStr];
    if (!day) return;
    const task = day.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const oldStatus = task.status;
    const next: Record<TaskStatus, TaskStatus> = { 'pending': 'completed', 'completed': 'failed', 'failed': 'pending' };
    task.status = next[oldStatus];

    if (task.status === 'completed') {
        updateGlobalXP(50);
        checkAchievements(newPlan, new Date());
    } else if (oldStatus === 'completed') {
        updateGlobalXP(-50);
    }

    const completedCount = day.tasks.filter(t => t.status === 'completed').length;
    const wasReached = day.goalReached;
    day.goalReached = completedCount >= settings.dailyGoal;

    if (day.goalReached && !wasReached && dateStr === format(new Date(), 'yyyy-MM-dd')) {
        const nS = achievements.streakCurrent + 1;
        const nStats = { ...achievements, streakCurrent: nS, streakMax: Math.max(achievements.streakMax, nS), lastGoalDate: dateStr, unlocked: Array.from(achievements.unlocked) };
        if (nS === 3) nStats.unlocked.push('streak_3');
        if (nS === 7) nStats.unlocked.push('streak_7');
        saveData('stats', nStats);
        updateGlobalXP(200);
        toast({ title: "Obiectiv atins! 🔥" });
    }

    setPlan(newPlan);
    saveData('plan', newPlan);
  };

  const addTask = (dateStr: string, description: string) => {
    const newPlan = { ...plan };
    if (!newPlan[dateStr]) newPlan[dateStr] = { date: dateStr, tasks: [], goalReached: false };
    newPlan[dateStr].tasks.push({ id: Math.random().toString(36).substring(7), description, status: 'pending' });
    setPlan(newPlan); saveData('plan', newPlan);
  };

  const addUnplannedTask = (desc: string, type: 'verde' | 'rosu') => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const newPlan = { ...plan };
      if (!newPlan[today]) newPlan[today] = { date: today, tasks: [], goalReached: false };
      newPlan[today].tasks.push({ id: Math.random().toString(36).substring(7), description: desc, status: type === 'verde' ? 'completed' : 'failed' });
      if (type === 'verde') { updateGlobalXP(50); checkAchievements(newPlan, new Date()); }
      setPlan(newPlan); saveData('plan', newPlan);
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

  const applyScheduleToWeek = (start: Date) => {
    const newPlan = { ...plan };
    for (let i = 0; i < 7; i++) {
        const curr = addDays(start, i);
        const dStr = format(curr, 'yyyy-MM-dd');
        const idx = (curr.getDay() + 6) % 7;
        const recs = schedule[idx] || [];
        if (recs.length > 0) {
            if (!newPlan[dStr]) newPlan[dStr] = { date: dStr, tasks: [], goalReached: false };
            const ex = new Set(newPlan[dStr].tasks.map(t => t.description));
            recs.forEach(rt => { if (!ex.has(rt.description)) newPlan[dStr].tasks.push({ id: Math.random().toString(36).substring(7), description: rt.description, status: 'pending' }); });
        }
    }
    setPlan(newPlan); saveData('plan', newPlan);
  };

  const resetMonthlyPlan = useCallback(async () => {
    if (!user) return false;
    try { await updateDoc(doc(db, 'planners', user.uid), { plan: {} }); setPlan({}); return true; } catch { return false; }
  }, [user]);

  const updateSettings = (s: any) => { setSettings(s); saveData('settings', s); };
  const addRecurringTask = (idx: number, desc: string) => {
    const n = { ...schedule };
    if (!n[idx]) n[idx] = [];
    n[idx].push({ id: Math.random().toString(36).substring(7), dayIndex: idx, description: desc });
    setSchedule(n); saveData('schedule', n);
  };
  const deleteRecurringTask = (idx: number, id: string) => {
    const n = { ...schedule };
    if (n[idx]) n[idx] = n[idx].filter(t => t.id !== id);
    setSchedule(n); saveData('schedule', n);
  };

  const exportData = () => {
    const data = { plan, schedule, settings, stats: { unlocked: Array.from(achievements.unlocked), streakCurrent: achievements.streakCurrent, streakMax: achievements.streakMax, lastGoalDate: achievements.lastGoalDate } };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_planner_${format(new Date(), 'yyyy_MM_dd')}.json`;
    a.click();
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target?.result as string);
            if (user) {
                await updateDoc(doc(db, 'planners', user.uid), {
                    plan: data.plan || {},
                    schedule: data.schedule || {},
                    settings: data.settings || DEFAULT_SETTINGS,
                    stats: data.stats || { unlocked: [], streakCurrent: 0, streakMax: 0 }
                });
                toast({ title: "Date importate cu succes! 📥" });
            }
        } catch { toast({ title: "Eroare la import!", variant: "destructive" }); }
    };
    reader.readAsText(file);
  };

  return { plan, schedule, settings, achievements, isLoading, addTask, toggleTaskStatus, deleteTask, updateTaskDescription, addUnplannedTask, addRecurringTask, deleteRecurringTask, applyScheduleToWeek, resetMonthlyPlan, updateSettings, exportData, importData };
}