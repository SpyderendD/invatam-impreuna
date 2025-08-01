'use client';

import { useAuth } from '@/context/AuthContext';
import { useNewLessonNotifier } from '@/hooks/useNotifications';
import { CustomCursor } from '@/components/animations/CustomCursor';

// Componenta internă care va rula logica doar dacă există user
function NotificationLogic() {
  useNewLessonNotifier();
  return null; // Această componentă nu randează nimic vizibil
}

export function ClientLogicWrapper() {
  const { user, loading } = useAuth();

  return (
    <>
      <CustomCursor />
      {/* Randăm componenta cu logica DOAR dacă încărcarea s-a terminat ȘI avem un utilizator */}
      {!loading && user && <NotificationLogic />}
    </>
  );
}