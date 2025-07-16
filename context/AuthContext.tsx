'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Tipul pentru valoarea pe care o va oferi contextul
// AICI ESTE CORECȚIA CRUCIALĂ: Adăugăm 'logout' la tip.
type AuthContextType = {
  user: FirebaseUser | null;
  isLoading: boolean;
  logout: () => Promise<void>; // <-- ADAUGAT
};

// Creăm contextul
// Adăugăm o funcție goală ca valoare default pentru logout.
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {}, // <-- ADAUGAT
});

// Provider-ul care va înveli aplicația
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Definim funcția de logout
  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    isLoading,
    logout, // <-- ADAUGAT: Trecem funcția în valoarea contextului
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
}