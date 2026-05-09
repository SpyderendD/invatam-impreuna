'use client';

import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  ReactNode 
} from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// PASUL 1: Definirea Formei (Tipului) Contextului
// Aici îi spunem lui TypeScript ce date și funcții vor fi disponibile
// oricui folosește acest context.
// ============================================================================
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  /**
   * Permite actualizarea manuală a obiectului `user` în starea globală a aplicației.
   * Util pentru "actualizări optimiste", de ex., după ce un utilizator își schimbă numele.
   */
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// ============================================================================
// PASUL 2: Crearea Contextului cu o Valoare Inițială
// Această valoare este folosită doar dacă o componentă încearcă să acceseze
// contextul fără a fi în interiorul unui Provider.
// ============================================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PASUL 3: Crearea Componentei Provider
// Aceasta este componenta care va "ține" starea (user, loading) și va
// înveli întreaga aplicație (sau o parte din ea) în `layout.tsx`.
// ============================================================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Adaugă un console.log să vedem dacă pornește Firebase
    console.log("AuthProvider: Initializing Firebase listener...");
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("AuthProvider: Auth State Changed!", firebaseUser?.email);
      setUser(firebaseUser);
      setLoading(false);
    }, (error) => {
      // Prinde erorile de inițializare
      console.error("AuthProvider Error:", error);
      setLoading(false); // Oprim loading-ul chiar și la eroare ca să nu rămână gri
    });

    return () => unsubscribe();
  }, []);

  // Funcția de logout, centralizată aici pentru a fi reutilizabilă
 const logout = async () => {
    try {
      // 1. Șterge cookie server
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // 2. Delogare client
      await auth.signOut();
      
      toast({ title: 'Deconectare reușită!' });
      
      // 3. MODIFICARE: Forțează reîncărcarea completă a paginii
      // Aceasta curăță orice cache de client Next.js și resetează starea complet.
      window.location.href = '/'; 
      
    } catch (error) {
      console.error("Eroare la logout:", error);
      toast({ title: 'Eroare la deconectare', variant: 'destructive' });
    }
  };

  // Obiectul `value` care va fi pasat tuturor componentelor copil.
  // Acesta trebuie să corespundă tipului `AuthContextType` definit mai sus.
  const value = { 
    user, 
    loading, 
    logout, 
    setUser // Am adăugat `setUser` aici pentru a-l face accesibil global
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// PASUL 4: Crearea Hook-ului Custom
// Acesta este un "shortcut" pentru a accesa contextul mai ușor și mai sigur
// din orice componentă client.
// ============================================================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Verificare de siguranță: aruncăm o eroare dacă hook-ul este folosit
  // în afara unui `AuthProvider`.
  if (context === undefined) {
    throw new Error('useAuth trebuie folosit în interiorul unui AuthProvider');
  }
  return context;
};

// ============================================================================
// (Componentă ajutătoare) Un schelet vizual pentru starea de încărcare
// ============================================================================
function AppSkeleton() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-1/4 mb-4" />
      <Skeleton className="h-6 w-1/2" />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}