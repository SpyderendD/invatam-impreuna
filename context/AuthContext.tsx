// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

// Definim tipul pentru valorile pe care le va oferi contextul.
// Am adăugat 'setUser' aici.
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componenta Provider care va înveli întreaga aplicație.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged este "ascultătorul" magic de la Firebase.
    // Se declanșează automat la login, register, logout sau la încărcarea inițială a paginii.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Dacă Firebase ne dă un utilizator, îl setăm în starea noastră
        setUser(firebaseUser);
        
        // Sincronizăm starea cu serverul nostru (creăm cookie-ul de sesiune)
        // Acest pas este crucial pentru rutele protejate de pe server.
        const idToken = await firebaseUser.getIdToken();
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

      } else {
        // Dacă Firebase spune că nu există utilizator, setăm starea la null
        setUser(null);
        // Și ștergem cookie-ul de sesiune de pe server
        await fetch('/api/auth/logout', { method: 'POST' });
      }
      // Indiferent de rezultat, am terminat de verificat starea inițială
      setLoading(false);
    });

    // Funcția de curățare: se va apela când componenta se "demontează"
    // pentru a preveni memory leaks.
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut(); // Spunem lui Firebase să delogheze utilizatorul
      // onAuthStateChanged va fi declanșat automat de linia de mai sus,
      // va seta user-ul la null și va șterge cookie-ul. Nu mai e nevoie de cod duplicat aici.
      toast({ title: 'Deconectare reușită!' });
      router.push('/'); // Redirecționăm utilizatorul la pagina principală
    } catch (error) {
      console.error("Eroare la logout:", error);
      toast({ title: 'Eroare la deconectare', variant: 'destructive' });
    }
  };

  // Creăm obiectul 'value' care va fi trimis tuturor componentelor copil.
  // Acum include și funcția 'setUser'.
  const value = { user, loading, logout, setUser };

  return (
    <AuthContext.Provider value={value}>
      {/* Nu afișăm copiii (întreaga aplicație) până când nu știm dacă user-ul
          este logat sau nu. Asta previne "clipirea" interfeței. */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook-ul custom pentru a accesa ușor contextul din alte componente.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // O eroare de siguranță: dacă încercăm să folosim 'useAuth'
    // într-o componentă care nu este învelită de 'AuthProvider'.
    throw new Error('useAuth trebuie folosit în interiorul unui AuthProvider');
  }
  return context;
};