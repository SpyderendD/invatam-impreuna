// app/dashboard/page.tsx
'use client';

import { useState, useEffect, useMemo, JSX } from 'react';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PenTool, School, Beaker, Code } from 'lucide-react';
import ProgressBar from '@ramonak/react-progress-bar';
import { ScrollAnimation } from '@/components/scroll-animation';
import { useAuth } from '@/context/AuthContext';

// --- Tipuri de date ---
type Subject = {
  id: string;
  title: string;
  icon: JSX.Element;
  color: string;
  isActive: boolean;
};

type SubjectProgressData = {
  [key: string]: {
    progress: number;
    lastLesson: string;
  };
};

// --- Lista de materii ---
const allSubjects: Subject[] = [
  { id: 'romana', title: 'Limba Română', icon: <PenTool className="h-5 w-5" />, color: '#3B82F6', isActive: true },
  { id: 'matematica', title: 'Matematică', icon: <School className="h-5 w-5" />, color: '#10B981', isActive: true },
  { id: 'chimie', title: 'Chimie', icon: <Beaker className="h-5 w-5" />, color: '#F59E0B', isActive: false },
  { id: 'informatica', title: 'Informatică', icon: <Code className="h-5 w-5" />, color: '#6366F1', isActive: false },
];

export default function DashboardPage() {
  const { user, loading: isAuthLoading } = useAuth();
  const [progressData, setProgressData] = useState<SubjectProgressData>({});
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      setIsDataLoading(false);
      // Middleware-ul ar trebui să se ocupe de redirect, dar setăm loading false oricum
      return;
    }
    
    const fetchProgress = async () => {
      setIsDataLoading(true);
      try {
        // Simulare a unui apel API. Înlocuiește cu apelul tău real.
        // const response = await fetch('/api/progress');
        // if (response.ok) {
        //   const data = await response.json();
        //   setProgressData(data);
        // }
        
        // Date simulate pentru testare
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulare întârziere rețea
        setProgressData({
            romana: { progress: 75, lastLesson: 'Genul Liric' },
            matematica: { progress: 40, lastLesson: 'Teorema lui Pitagora' },
        });

      } catch (error) {
        console.error("Nu s-a putut prelua progresul:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchProgress();
  }, [user, isAuthLoading]);

  const handleCompleteLesson = async (subjectId: string) => {
    const currentProgress = progressData[subjectId]?.progress || 0;
    if (currentProgress >= 100) return;

    const newProgress = Math.min(currentProgress + 10, 100);
    const updatedProgressState = {
      ...progressData,
      [subjectId]: { progress: newProgress, lastLesson: 'O nouă lecție simulată' },
    };
    setProgressData(updatedProgressState);

    // Poți adăuga logica de salvare pe server aici, în fundal
  };

  const objectives = useMemo(() => {
    const activeSubjects = allSubjects.filter(s => s.isActive);
    const lessonsStarted = Object.keys(progressData).length;
    const totalProgress = Object.values(progressData).reduce((sum, subject) => sum + subject.progress, 0);
    const averageProgress = activeSubjects.length > 0 ? Math.round(totalProgress / activeSubjects.length) : 0;
    
    return {
      lessonsStarted: { current: lessonsStarted, target: activeSubjects.length },
      averageProgress: { current: averageProgress, target: 100 },
    };
  }, [progressData]);

  // --- Starea de Încărcare ---
  if (isAuthLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-8">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-48" />
                </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4"><Skeleton className="h-[400px] w-full" /></div>
                    <div className="space-y-4"><Skeleton className="h-[200px] w-full" /></div>
                </div>
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8">
        <div className="container">
          <ScrollAnimation>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Tabloul tău de bord</h1>
                <p className="text-muted-foreground mt-1">Bine ai revenit, {user?.displayName || user?.email || 'campionule'}!</p>
              </div>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ScrollAnimation>
                <Card>
                  <CardHeader>
                    <CardTitle>Progresul tău</CardTitle>
                    <CardDescription>Urmărește-ți evoluția și continuă de unde ai rămas.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {allSubjects.map((subject) => {
                        if (subject.isActive) {
                          const userProgress = progressData[subject.id] || { progress: 0, lastLesson: 'Nu ai început încă' };
                          return (
                            <div key={subject.id}>
                              <div className="flex items-center gap-3 mb-2">
                                <div style={{ color: subject.color }}>{subject.icon}</div>
                                <h3 className="font-semibold text-lg">{subject.title}</h3>
                              </div>
                              <ProgressBar 
                                completed={userProgress.progress} 
                                bgColor={subject.color} 
                                height="12px" 
                                borderRadius="999px" 
                                labelAlignment="right" 
                                labelColor="#333" 
                                labelSize="11px" 
                                animateOnRender 
                                transitionDuration="1.5s" 
                                transitionTimingFunction="ease-out" 
                              />
                              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                <span>{userProgress.lastLesson}</span>
                                <Button size="sm" variant="ghost" onClick={() => handleCompleteLesson(subject.id)}>Simulează Lecție</Button>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div key={subject.id} className="opacity-60">
                              <div className="flex items-center gap-3 mb-2">
                                <div style={{ color: subject.color }}>{subject.icon}</div>
                                <h3 className="font-semibold text-lg">{subject.title}</h3>
                              </div>
                              <div className="h-[12px] bg-muted rounded-full relative overflow-hidden">
                                <div className="absolute inset-0 w-full h-full bg-repeat bg-[length:20px_20px]" style={{backgroundImage: 'linear-gradient(45deg, hsla(var(--muted-foreground)/0.1) 25%, transparent 25%, transparent 50%, hsla(var(--muted-foreground)/0.1) 50%, hsla(var(--muted-foreground)/0.1) 75%, transparent 75%, transparent)'}}></div>
                              </div>
                              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                <span>În curând...</span>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            </div>
            
            <div className="space-y-8">
              <ScrollAnimation>
                <Card>
                  <CardHeader>
                    <CardTitle>Obiective</CardTitle>
                    <CardDescription>Progresul tău general.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between"><span className="text-sm font-medium">Materii începute</span><span className="text-sm text-muted-foreground">{objectives.lessonsStarted.current} / {objectives.lessonsStarted.target}</span></div>
                        <ProgressBar completed={objectives.lessonsStarted.target > 0 ? (objectives.lessonsStarted.current / objectives.lessonsStarted.target) * 100 : 0} height="8px" isLabelVisible={false} bgColor="hsl(var(--primary))" baseBgColor="hsl(var(--muted))" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between"><span className="text-sm font-medium">Progres mediu</span><span className="text-sm text-muted-foreground">{objectives.averageProgress.current}%</span></div>
                        <ProgressBar completed={objectives.averageProgress.current} height="8px" isLabelVisible={false} bgColor="hsl(var(--primary))" baseBgColor="hsl(var(--muted))" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}