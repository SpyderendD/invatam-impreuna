'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton'; // Opțional, dar recomandat

// 1. Definim tipul pentru context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// 2. Creăm contextul și ÎL EXPORTĂM
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Creăm Provider-ul care va înveli aplicația
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Începe cu true
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged se ocupă de sincronizarea stării user-ului
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    // Curățăm listener-ul la unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // Spunem serverului să șteargă cookie-ul de sesiune
      await fetch('/api/auth/logout', { method: 'POST' });
      // Delogăm utilizatorul de pe client
      await auth.signOut();
      toast({ title: 'Deconectare reușită!' });
      router.replace('/');
    } catch (error) {
      console.error("Eroare la logout:", error);
      toast({ title: 'Eroare la deconectare', variant: 'destructive' });
    }
  };

  const value = { user, loading, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <AppSkeleton /> : children}
    </AuthContext.Provider>
  );
};

// 4. Creăm și exportăm hook-ul custom din același fișier
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth trebuie folosit în interiorul unui AuthProvider');
  }
  return context;
};

// Un schelet simplu pentru a umple golul vizual cât se încarcă starea de autentificare
function AppSkeleton() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-1/4 mb-4" />
      <Skeleton className="h-6 w-1/2" />
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}