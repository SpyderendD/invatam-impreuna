// components/layout/ClientLogicWrapper.tsx
'use client';

import { useNewLessonNotifier } from '@/hooks/useNotifications';
import { CustomCursor } from '@/components/animations/CustomCursor';

// Această componentă va conține toate hook-urile și logica de client
export function ClientLogicWrapper() {
  // Activează verificarea pentru lecții noi în fundal
  useNewLessonNotifier();

  return (
    // Putem plasa aici și alte componente globale de client, cum ar fi CustomCursor
    <CustomCursor />
  );
}