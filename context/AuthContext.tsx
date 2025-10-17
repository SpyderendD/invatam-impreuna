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
  const [loading, setLoading] = useState(true); // Începe mereu cu `true` pentru a verifica starea de autentificare
  const router = useRouter();

  // Acest efect rulează o singură dată la încărcarea aplicației.
  // `onAuthStateChanged` este un listener de la Firebase care ne anunță
  // automat de fiecare dată când starea de autentificare se schimbă.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // Am terminat verificarea, ascundem scheletul
    });

    // Curățăm listener-ul când componenta este "demontată" pentru a evita memory leaks.
    return () => unsubscribe();
  }, []);

  // Funcția de logout, centralizată aici pentru a fi reutilizabilă
  const logout = async () => {
    try {
      // Spunem serverului să șteargă cookie-ul de sesiune (dacă folosești așa ceva)
      await fetch('/api/auth/logout', { method: 'POST' });
      // Delogăm utilizatorul de pe client, folosind SDK-ul Firebase
      await auth.signOut();
      toast({ title: 'Deconectare reușită!' });
      // Redirectăm utilizatorul către pagina principală
      router.replace('/');
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
      {/* Cât timp se verifică starea de autentificare, afișăm un schelet.
          Altfel, afișăm conținutul normal al aplicației. */}
      {loading ? <AppSkeleton /> : children}
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