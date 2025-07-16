import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from './use-toast';
import { getIdToken } from 'firebase/auth';

export const useTaskTracker = () => {
    const { user } = useAuth();
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    const fetchProgress = useCallback(async () => {
        if (!user) {
            setCompletedTasks(new Set());
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            // AICI ESTE SCHIMBAREA: Obținem token-ul
            const token = await getIdToken(user);
            const response = await fetch('/api/progress', {
                headers: {
                    'Authorization': `Bearer ${token}` // Trimitem token-ul în header
                }
            });
            if (!response.ok) throw new Error('Eroare la preluarea progresului');
            
            const data = await response.json();
            setCompletedTasks(new Set(data.completedLessons || []));
        } catch (error) {
            console.error("Eroare la preluarea progresului:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchProgress(); }, [fetchProgress]);

    const toggleTask = async (lessonId: string) => {
        if (!user) {
            toast({ title: "Acțiune necesară", description: "Trebuie să fii autentificat pentru a salva progresul." });
            return;
        }

        const originalTasks = new Set(completedTasks);
        const newTasks = new Set(originalTasks);
        const isCompleted = !originalTasks.has(lessonId);

        if (isCompleted) { newTasks.add(lessonId); } else { newTasks.delete(lessonId); }
        setCompletedTasks(newTasks);

        try {
            // AICI ESTE SCHIMBAREA: Obținem token-ul și pentru această cerere
            const token = await getIdToken(user);
            const response = await fetch('/api/complete-lesson', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Trimitem token-ul
                },
                body: JSON.stringify({ lessonId, isCompleted }),
            });

            if (!response.ok) throw new Error('Eroare de la server');
            
        } catch (error) {
            setCompletedTasks(originalTasks);
            toast({ title: "Eroare", description: "Progresul nu a putut fi salvat.", variant: "destructive" });
        }
    };

    return { completedTasks, toggleTask, isLoading };
};