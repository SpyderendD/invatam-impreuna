'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext'; // Importăm contextul din fișierul separat

// Hook-ul custom pentru a folosi contextul mai ușor în componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth trebuie folosit în interiorul unui AuthProvider');
  }
  return context;
}