'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  format,
  startOfWeek,
  addDays,
  differenceInCalendarDays,
  isSameMonth,
  parseISO,
} from 'date-fns';
import { db } from '@/lib/firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Tipuri
export type TaskStatus = 'pending' | 'completed' | 'failed';
export type Task = { id: string; description: string; status: TaskStatus };
export type DailyPlan = { tasks: Task[]; goalReached?: boolean };
export type WeeklyPlan = { [date: string]: DailyPlan };
export type RecurringTask = { id: string; description: string };
export type WeeklySchedule = { [day: number]: RecurringTask[] };
export type Settings = {
  autoDelete: boolean;
  autoApplySchedule: boolean;
  dailyGoal: number;
  cloudSync: boolean; // NOU: sync cu Firestore
};
export type AchievementStats = {
  unlocked: Set<string>;
  currentStreak: number;
  longestStreak: number;
  lastGoalDate: string | null;
  totalGoalsMet: number;
  totalCompleted: number;
  createdCount: number;
  deletedCount: number;
  updatedCount: number;
  exportedCount: number;
  importedCount: number;
  resetCount: number;
};
export type ExportData = {
  version: number;
  plan: WeeklyPlan;
  settings: Settings;
  schedule: WeeklySchedule;
  achievements: Omit<AchievementStats, 'unlocked'> & { unlocked: string[] };
  lastUpdatedMs?: number;
};

export const achievementsList = {
  first_step: { title: 'Primul Pas!', description: 'Ai finalizat prima sarcină! Bravo!', icon: '👣' },
  daily_goal: { title: 'Obiectivul Zilnic', description: 'Ai atins obiectivul zilnic de activități!', icon: '🎯' },
  weekly_goal: { title: 'Obiectivul Săptămânal', description: 'Ai atins obiectivul săptămânal (5 zile cu obiectiv atins)!', icon: '📅' },
  month_goal: { title: 'Obiectivul Lunar', description: 'Ai atins obiectivul în 20 de zile din lună!', icon: '📆' },
  streak: { title: 'Streak!', description: 'Ai 7 zile consecutive cu obiectiv atins!', icon: '🔥' },
  planner_master: { title: 'Planificator Expert', description: 'Ai folosit planificatorul 30 de zile (obiectiv atins)!', icon: '🧠' },
  task_creator: { title: 'Creator de Sarcini', description: 'Ai creat 100 de sarcini!', icon: '📝' },
  task_completer: { title: 'Finalizator de Sarcini', description: 'Ai finalizat 100 de sarcini!', icon: '✅' },
  task_deleter: { title: 'Ștergător de Sarcini', description: 'Ai șters 50 de sarcini!', icon: '🗑️' },
  task_updater: { title: 'Actualizator de Sarcini', description: 'Ai actualizat 50 de sarcini!', icon: '✏️' },
  planner_importer: { title: 'Importator', description: 'Ai importat cu succes o planificare!', icon: '📥' },
  planner_exporter: { title: 'Exportator', description: 'Ai exportat cu succes o planificare!', icon: '📤' },
  planner_resetter: { title: 'Resetator', description: 'Ai resetat planificatorul!', icon: '🔄' },
  planner_sharer: { title: 'Planificator Partajat', description: 'Ai partajat planificatorul!', icon: '🤝' },
  planner_customizer: { title: 'Planificator Personalizat', description: 'Ai personalizat aspectul planificatorului!', icon: '🎨' },
};
export type AchievementId = keyof typeof achievementsList;

const APP_PREFIX = 'taskPlanner_';
const VERSION = 2;

// Hook principal
export function useTaskPlanner(uid?: string) {
  const [plan, setPlan] = useState<WeeklyPlan>({});
  const [settings, setSettings] = useState<Settings>({
    autoDelete: true,
    autoApplySchedule: true,
    dailyGoal: 3,
    cloudSync: false, // default: off, ca să nu spargem locațiile fără Firebase
  });
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [achievements, setAchievements] = useState<AchievementStats>({
    unlocked: new Set(),
    currentStreak: 0,
    longestStreak: 0,
    lastGoalDate: null,
    totalGoalsMet: 0,
    totalCompleted: 0,
    createdCount: 0,
    deletedCount: 0,
    updatedCount: 0,
    exportedCount: 0,
    importedCount: 0,
    resetCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // lastUpdated pentru sync (local vs cloud)
  const localUpdatedRef = useRef<number>(0);
  const applyingCloudRef = useRef(false);
  const debouncerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load din localStorage + aplicare program pentru săptămâna curentă
  useEffect(() => {
    try {
      const savedPlan = JSON.parse(localStorage.getItem(`${APP_PREFIX}plan`) || '{}');
      const savedSettings = JSON.parse(localStorage.getItem(`${APP_PREFIX}settings`) || '{"autoDelete":true,"autoApplySchedule":true,"dailyGoal":3,"cloudSync":false}');
      const savedSchedule = JSON.parse(localStorage.getItem(`${APP_PREFIX}schedule`) || '{}');
      const savedAchievements = JSON.parse(localStorage.getItem(`${APP_PREFIX}achievements`) || '{}');
      const updatedMs = Number(localStorage.getItem(`${APP_PREFIX}lastUpdatedMs`) || '0');

      let planWithSchedule: WeeklyPlan = { ...savedPlan };
      if (savedSettings.autoApplySchedule) {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        for (let i = 0; i < 7; i++) {
          const d = addDays(start, i);
          const dateStr = format(d, 'yyyy-MM-dd');
          const dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
          const exists = planWithSchedule[dateStr]?.tasks?.length > 0;
          if (!exists && (savedSchedule[dow]?.length ?? 0) > 0) {
            planWithSchedule[dateStr] = {
              tasks: savedSchedule[dow].map((t: RecurringTask) => ({ id: t.id, description: t.description, status: 'pending' as const })),
              goalReached: false,
            };
          }
        }
      }

      setPlan(planWithSchedule);
      setSettings(savedSettings);
      setSchedule(savedSchedule);
      if (savedAchievements.unlocked) {
        setAchievements({
          ...savedAchievements,
          unlocked: new Set(savedAchievements.unlocked),
        });
      }
      localUpdatedRef.current = updatedMs || Date.now();
    } catch (e) {
      console.error('Eroare la încărcare:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist local
  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(`${APP_PREFIX}plan`, JSON.stringify(plan));
    localStorage.setItem(`${APP_PREFIX}settings`, JSON.stringify(settings));
    localStorage.setItem(`${APP_PREFIX}schedule`, JSON.stringify(schedule));
    const achievementsToSave = { ...achievements, unlocked: Array.from(achievements.unlocked) };
    localStorage.setItem(`${APP_PREFIX}achievements`, JSON.stringify(achievementsToSave));
    localUpdatedRef.current = Date.now();
    localStorage.setItem(`${APP_PREFIX}lastUpdatedMs`, String(localUpdatedRef.current));
  }, [plan, settings, schedule, achievements, isLoading]);

  // Reset lunar opțional
  useEffect(() => {
    if (isLoading || !settings.autoDelete) return;
    const now = new Date();
    const currentKey = format(now, 'yyyy-MM');
    const lastReset = localStorage.getItem(`${APP_PREFIX}lastReset`);
    if (now.getDate() === 1 && lastReset !== currentKey) {
      setPlan({});
      setAchievements((a) => ({
        ...a,
        unlocked: new Set(),
        currentStreak: 0,
        longestStreak: 0,
        lastGoalDate: null,
        totalGoalsMet: 0,
        totalCompleted: 0,
      }));
      localStorage.setItem(`${APP_PREFIX}lastReset`, currentKey);
      toast({ title: 'Progresul a fost resetat pentru luna curentă.' });
    }
  }, [isLoading, settings.autoDelete]);

  // Utilitare Plan
  const ensureDay = (prev: WeeklyPlan, date: string): DailyPlan =>
    prev[date] ?? { tasks: [], goalReached: false };

  const recalcGoalReached = (tasks: Task[], prevGoal: boolean, dailyGoal: number) =>
    prevGoal || tasks.filter((t) => t.status === 'completed').length >= dailyGoal;

  // Achievements: unlock helper
  const unlock = useCallback((id: AchievementId) => {
    setAchievements((prev) => {
      if (prev.unlocked.has(id)) return prev;
      const next = new Set(prev.unlocked);
      next.add(id);
      toast({ title: `Realizare deblocată: ${achievementsList[id].title} ${achievementsList[id].icon}` });
      return { ...prev, unlocked: next };
    });
  }, []);

  // Achievements: când ziua atinge goal, actualizează streak + weekly/monthly
  const onDailyGoalReached = useCallback((dateStr: string) => {
    setAchievements((a) => {
      const todayISO = dateStr;
      let currentStreak = a.currentStreak;
      let longestStreak = a.longestStreak;
      let lastGoalDate = a.lastGoalDate;

      // streak calc
      if (lastGoalDate) {
        const diff = differenceInCalendarDays(parseISO(todayISO), parseISO(lastGoalDate));
        if (diff === 1) currentStreak += 1;
        else if (diff > 1) currentStreak = 1;
      } else {
        currentStreak = 1;
      }
      if (currentStreak >= 7) unlock('streak');
      longestStreak = Math.max(longestStreak, currentStreak);

      const totalGoalsMet = a.totalGoalsMet + 1;

      return { ...a, currentStreak, longestStreak, lastGoalDate: todayISO, totalGoalsMet };
    });
    unlock('daily_goal');

    // weekly goal (5+ zile cu goal în săptămâna curentă)
    const start = startOfWeek(parseISO(dateStr), { weekStartsOn: 1 });
    let hitDays = 0;
    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i);
      const ds = format(d, 'yyyy-MM-dd');
      if (plan[ds]?.goalReached) hitDays++;
    }
    if (hitDays >= 5) unlock('weekly_goal');

    // month goal (20+ zile cu goal în luna curentă)
    const monthKey = format(parseISO(dateStr), 'yyyy-MM');
    const monthDays = Object.keys(plan).filter((ds) => plan[ds]?.goalReached && ds.startsWith(monthKey)).length;
    if (monthDays >= 20) unlock('month_goal');

    // planner_master (30 zile cu goal)
    const totalGoalDays = Object.keys(plan).filter((ds) => plan[ds]?.goalReached).length;
    if (totalGoalDays >= 30) unlock('planner_master');
  }, [plan, unlock]);

  // CRUD
  const addTask = useCallback((date: string, description: string) => {
    if (!description.trim()) return;
    const newTask: Task = { id: `task_${Date.now()}`, description, status: 'pending' };
    setPlan((prev) => {
      const day = ensureDay(prev, date);
      const tasks = [...day.tasks, newTask];
      const goalReached = recalcGoalReached(tasks, !!day.goalReached, settings.dailyGoal);
      const next = { ...prev, [date]: { ...day, tasks, goalReached } };
      return next;
    });
    setAchievements((a) => {
      const createdCount = a.createdCount + 1;
      if (createdCount >= 100) unlock('task_creator');
      return { ...a, createdCount };
    });
  }, [settings.dailyGoal, unlock]);

  const addUnplannedTask = useCallback((description: string, type: 'verde' | 'rosu') => {
    if (!description.trim()) {
      toast({ title: 'Text necesar', variant: 'destructive' });
      return;
    }
    const today = format(new Date(), 'yyyy-MM-dd');
    const status: TaskStatus = type === 'verde' ? 'completed' : 'failed';
    const newTask: Task = { id: `task_${Date.now()}`, description, status };
    setPlan((prev) => {
      const day = ensureDay(prev, today);
      const tasks = [...day.tasks, newTask];
      const goalReached = recalcGoalReached(tasks, !!day.goalReached, settings.dailyGoal);
      const next = { ...prev, [today]: { ...day, tasks, goalReached } };
      return next;
    });
    if (status === 'completed') {
      setAchievements((a) => {
        const totalCompleted = a.totalCompleted + 1;
        if (totalCompleted >= 1) unlock('first_step');
        if (totalCompleted >= 100) unlock('task_completer');
        return { ...a, totalCompleted };
      });
    }
    toast({ title: 'Activitate adăugată!' });
  }, [settings.dailyGoal, unlock]);

  const toggleTaskStatus = useCallback((date: string, taskId: string) => {
    setPlan((prev) => {
      const day = ensureDay(prev, date);
      const tasks = day.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const next: TaskStatus = t.status === 'pending' ? 'completed' : t.status === 'completed' ? 'failed' : 'pending';
        return { ...t, status: next };
      });
      const goalReached = recalcGoalReached(tasks, !!day.goalReached, settings.dailyGoal);
      const nextPlan = { ...prev, [date]: { ...day, tasks, goalReached } };

      // achievements counters
      const beforeCompleted = day.tasks.filter((t) => t.status === 'completed').length;
      const afterCompleted = tasks.filter((t) => t.status === 'completed').length;
      if (afterCompleted > beforeCompleted) {
        setAchievements((a) => {
          const totalCompleted = a.totalCompleted + (afterCompleted - beforeCompleted);
          if (totalCompleted >= 1) unlock('first_step');
          if (totalCompleted >= 100) unlock('task_completer');
          return { ...a, totalCompleted };
        });
      }
      if (!day.goalReached && goalReached) {
        onDailyGoalReached(date);
      }
      return nextPlan;
    });
  }, [settings.dailyGoal, onDailyGoalReached, unlock]);

  const deleteTask = useCallback((date: string, taskId: string) => {
    setPlan((prev) => {
      const day = ensureDay(prev, date);
      const tasks = day.tasks.filter((t) => t.id !== taskId);
      if (tasks.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      const goalReached = recalcGoalReached(tasks, false, settings.dailyGoal);
      return { ...prev, [date]: { ...day, tasks, goalReached } };
    });
    setAchievements((a) => {
      const deletedCount = a.deletedCount + 1;
      if (deletedCount >= 50) unlock('task_deleter');
      return { ...a, deletedCount };
    });
  }, [settings.dailyGoal, unlock]);

  const updateTaskDescription = useCallback((date: string, taskId: string, newDescription: string) => {
    const text = newDescription.trim();
    if (!text) {
      // dacă e gol, ștergem
      deleteTask(date, taskId);
      return;
    }
    setPlan((prev) => {
      const day = ensureDay(prev, date);
      const tasks = day.tasks.map((t) => (t.id === taskId ? { ...t, description: text } : t));
      return { ...prev, [date]: { ...day, tasks } };
    });
    setAchievements((a) => {
      const updatedCount = a.updatedCount + 1;
      if (updatedCount >= 50) unlock('task_updater');
      return { ...a, updatedCount };
    });
  }, [deleteTask, unlock]);

  // Recurring
  const addRecurringTask = useCallback((day: number, description: string) => {
    if (!description.trim()) return;
    const newTask: RecurringTask = { id: `rec_${Date.now()}`, description };
    setSchedule((prev) => ({ ...prev, [day]: [...(prev[day] || []), newTask] }));
  }, []);

  const deleteRecurringTask = useCallback((day: number, taskId: string) => {
    setSchedule((prev) => ({ ...prev, [day]: (prev[day] || []).filter((t) => t.id !== taskId) }));
  }, []);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<Settings> | Settings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Apply weekly schedule
  const applyScheduleToWeek = useCallback((weekStart: Date) => {
    setPlan((prev) => {
      const newPlan = { ...prev };
      for (let i = 0; i < 7; i++) {
        const d = addDays(weekStart, i);
        const dateStr = format(d, 'yyyy-MM-dd');
        const dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
        const exists = newPlan[dateStr]?.tasks?.length > 0;
        if (!exists) {
          const tasks = (schedule[dow] || []).map((t) => ({ id: t.id, description: t.description, status: 'pending' as const }));
          if (tasks.length > 0) newPlan[dateStr] = { tasks, goalReached: false };
          else if (!newPlan[dateStr]) newPlan[dateStr] = { tasks: [], goalReached: false };
        }
      }
      return newPlan;
    });
  }, [schedule]);

  // Data I/O
  const exportData = useCallback(() => {
    try {
      const achievementsToSave = { ...achievements, unlocked: Array.from(achievements.unlocked) };
      const dataToExport: ExportData = {
        version: VERSION,
        plan,
        settings,
        schedule,
        achievements: achievementsToSave,
        lastUpdatedMs: Date.now(),
      };
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
      setAchievements((a) => {
        const exportedCount = a.exportedCount + 1;
        if (exportedCount >= 1) unlock('planner_exporter');
        return { ...a, exportedCount };
      });
      toast({ title: 'Date exportate cu succes!' });
    } catch {
      toast({ title: 'Exportul a eșuat', variant: 'destructive' });
    }
  }, [plan, settings, schedule, achievements, unlock]);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const imported = JSON.parse(text) as ExportData;
        if (!imported.plan || !imported.settings || !imported.achievements || !imported.schedule) {
          throw new Error('Format de fișier invalid sau corupt.');
        }
        if (window.confirm('ATENȚIE: Vei suprascrie toate datele. Continui?')) {
          setPlan(imported.plan);
          setSettings(imported.settings);
          setSchedule(imported.schedule);
          setAchievements({ ...imported.achievements, unlocked: new Set(imported.achievements.unlocked) });
          localUpdatedRef.current = Date.now();
          localStorage.setItem(`${APP_PREFIX}lastUpdatedMs`, String(localUpdatedRef.current));
          setAchievements((a) => {
            const importedCount = a.importedCount + 1;
            if (importedCount >= 1) unlock('planner_importer');
            return { ...a, importedCount };
          });
          toast({ title: 'Date importate cu succes!' });
        }
      } catch (error) {
        toast({ title: 'Importul a eșuat', description: (error as Error).message, variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  }, [unlock]);

  const resetAllData = useCallback(() => {
    if (window.confirm('ULTIMA ȘANSĂ: Ștergi PERMANENT toate datele?')) {
      setPlan({});
      setSettings({ autoDelete: true, autoApplySchedule: true, dailyGoal: 3, cloudSync: false });
      setSchedule({});
      setAchievements({
        unlocked: new Set(),
        currentStreak: 0,
        longestStreak: 0,
        lastGoalDate: null,
        totalGoalsMet: 0,
        totalCompleted: 0,
        createdCount: 0,
        deletedCount: 0,
        updatedCount: 0,
        exportedCount: 0,
        importedCount: 0,
        resetCount: 1,
      });
      localStorage.removeItem(`${APP_PREFIX}plan`);
      localStorage.removeItem(`${APP_PREFIX}settings`);
      localStorage.removeItem(`${APP_PREFIX}schedule`);
      localStorage.removeItem(`${APP_PREFIX}achievements`);
      localStorage.removeItem(`${APP_PREFIX}lastReset`);
      localStorage.removeItem(`${APP_PREFIX}lastUpdatedMs`);
      unlock('planner_resetter');
      toast({ title: 'Toate datele au fost resetate!', variant: 'destructive' });
    }
  }, [unlock]);

  // Firestore sync (opțional)
  const cloudActive = !!uid && settings.cloudSync;

  // subscribe la Cloud -> aduce datele dacă remote e mai nou
  useEffect(() => {
    if (!cloudActive || !uid) return;

    const ref = doc(db, 'users', uid, 'planner', 'main');
    let unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as ExportData & { lastUpdated?: any };
      const remoteMs = data.lastUpdatedMs || (data as any).lastUpdated?.toMillis?.() || 0;
      const localMs = localUpdatedRef.current || 0;
      if (remoteMs > localMs) {
        applyingCloudRef.current = true;
        setPlan(data.plan || {});
        setSettings(data.settings || settings);
        setSchedule(data.schedule || {});
        const ach = data.achievements;
        setAchievements({
          ...ach,
          unlocked: new Set(ach.unlocked || []),
        });
        localUpdatedRef.current = remoteMs;
        localStorage.setItem(`${APP_PREFIX}lastUpdatedMs`, String(remoteMs));
        applyingCloudRef.current = false;
      }
    });

    return () => {
      if (unsub) unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudActive, uid]);

  // push la Cloud debounced
  const pushToCloud = useCallback(async () => {
    if (!cloudActive || !uid || applyingCloudRef.current) return;
    try {
      const ref = doc(db, 'users', uid, 'planner', 'main');
      const achievementsToSave = { ...achievements, unlocked: Array.from(achievements.unlocked) };
      const payload: ExportData = {
        version: VERSION,
        plan,
        settings,
        schedule,
        achievements: achievementsToSave,
        lastUpdatedMs: Date.now(),
      };
      // dacă doc nu există -> setDoc; altfel updateDoc
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { ...payload, lastUpdated: serverTimestamp() });
      } else {
        await updateDoc(ref, { ...payload, lastUpdated: serverTimestamp() });
      }
    } catch (e) {
      console.warn('Sync cloud eșuat (fallback local):', e);
    }
  }, [cloudActive, uid, plan, settings, schedule, achievements]);

  useEffect(() => {
    if (!cloudActive) return;
    if (debouncerRef.current) clearTimeout(debouncerRef.current);
    debouncerRef.current = setTimeout(() => {
      pushToCloud();
    }, 800);
    return () => {
      if (debouncerRef.current) clearTimeout(debouncerRef.current);
    };
  }, [cloudActive, plan, settings, schedule, achievements, pushToCloud]);

  return {
    plan,
    settings,
    schedule,
    achievements,
    isLoading,
    addTask,
    addUnplannedTask,
    toggleTaskStatus,
    deleteTask,
    updateTaskDescription,
    addRecurringTask,
    deleteRecurringTask,
    updateSettings,
    exportData,
    importData,
    resetAllData,
    applyScheduleToWeek,
  };
}