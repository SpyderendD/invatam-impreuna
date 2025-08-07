'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from './use-toast';
import { getIdToken, User } from 'firebase/auth';

export function useLessonProgress() {
    const { user } = useAuth();
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    // Funcția care preia progresul de la server
    const fetchProgress = useCallback(async (currentUser: User) => {
        setIsLoading(true);
        try {
            const token = await getIdToken(currentUser);
            const response = await fetch('/api/progress', { 
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Eroare la preluarea progresului lecțiilor');
            
            const data = await response.json();
            setCompletedLessons(new Set(data.completedLessons || []));
        } catch (error) {
            console.error("Eroare la preluarea progresului lecțiilor:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Preluăm progresul la încărcare sau când se schimbă utilizatorul
    useEffect(() => {
        if (user) {
            fetchProgress(user);
        } else {
            // Dacă nu există user, golim setul și oprim încărcarea
            setCompletedLessons(new Set());
            setIsLoading(false);
        }
    }, [user, fetchProgress]);

    // Funcția care marchează/demarchează o lecție ca fiind completată
    const toggleLesson = async (lessonId: string) => {
        if (!user) {
            toast({ title: "Acțiune necesară", description: "Trebuie să fii autentificat pentru a salva progresul." });
            return;
        }

        const isCompletedNow = !completedLessons.has(lessonId);
        
        // Actualizare optimistă a stării locale pentru o experiență fluidă
        const originalLessons = new Set(completedLessons);
        setCompletedLessons(prev => {
            const newSet = new Set(prev);
            if (isCompletedNow) newSet.add(lessonId);
            else newSet.delete(lessonId);
            return newSet;
        });

        // Sincronizare cu serverul în fundal
        try {
            const token = await getIdToken(user);
            const response = await fetch('/api/complete-lesson', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ lessonId, isCompleted: isCompletedNow }),
            });

            if (!response.ok) throw new Error('Eroare de la server');
            
        } catch (error) {
            // Dacă apare o eroare, revenim la starea originală
            setCompletedLessons(originalLessons);
            toast({ title: "Eroare de sincronizare", description: "Progresul lecției nu a putut fi salvat.", variant: "destructive" });
        }
    };

    return { completedLessons, toggleLesson, isLoading };
}