// hooks/useNotifications.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useNotifications = () => {
    const [permission, setPermission] = useState('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(() => {
        if (!('Notification' in window)) {
            toast({ title: "Browser incompatibil", description: "Acest browser nu suportă notificări.", variant: "destructive" });
            return;
        }
        Notification.requestPermission().then((result) => {
            setPermission(result);
            if (result === 'granted') {
                toast({ title: "Notificări activate!", description: "Vei primi noutăți direct în browser." });
                new Notification("Mulțumim!", { 
                    body: "Ai activat cu succes notificările.",
                    icon: "/favicon-32x32.png" // Poți folosi o iconiță
                });
            } else {
                toast({ title: "Permisiune blocată", description: "Te rugăm să permiți notificările din setările browserului.", variant: "destructive" });
            }
        });
    }, []);

    const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (permission === 'granted') {
            new Notification(title, { ...options, icon: options?.icon || "/favicon-32x32.png" });
        }
    }, [permission]);

    return { permission, requestPermission, sendNotification };
};

// Hook pentru a verifica și a trimite notificări despre lecții noi
export const useNewLessonNotifier = () => {
    const { sendNotification, permission } = useNotifications();

    useEffect(() => {
        if (permission !== 'granted') return;

        const checkAndNotify = () => {
            const lastCheck = localStorage.getItem('lastLessonCheck');
            const oneDay = 24 * 60 * 60 * 1000;

            // Verificăm doar o dată la 24 de ore
            if (lastCheck && (new Date().getTime() - new Date(lastCheck).getTime() < oneDay)) {
                return;
            }

            // --- Aici este simularea ---
            // Într-o aplicație reală, ai face un fetch la API pentru a vedea dacă există lecții noi.
            // Noi vom simula asta cu o șansă de 50% să apară o "lecție nouă".
            if (Math.random() > 0.5) {
                console.log("Simulare: Lecție nouă găsită! Se trimite notificarea.");
                sendNotification("Lecție Nouă Disponibilă!", {
                    body: "Am adăugat o nouă lecție la Matematică: 'Cercul'. Intră să o descoperi!",
                    tag: 'new-lesson-notification' // Tag-ul previne notificările duplicate
                });
            } else {
                console.log("Simulare: Nicio lecție nouă găsită.");
            }
            // --- Sfârșitul simulării ---

            localStorage.setItem('lastLessonCheck', new Date().toISOString());
        };

        // Verificăm la încărcarea aplicației, apoi la fiecare oră
        checkAndNotify();
        const intervalId = setInterval(checkAndNotify, 60 * 60 * 1000); // Verifică la fiecare oră

        return () => clearInterval(intervalId);

    }, [permission, sendNotification]);
};