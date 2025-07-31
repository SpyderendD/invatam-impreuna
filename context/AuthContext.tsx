// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged este "ascultătorul" care reacționează la orice schimbare
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Utilizatorul este logat
        setUser(user);
        
        // Sincronizăm starea cu serverul nostru (creăm cookie-ul de sesiune)
        const idToken = await user.getIdToken();
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

      } else {
        // Utilizatorul este delogat
        setUser(null);
        // Ștergem cookie-ul de sesiune
        await fetch('/api/auth/logout', { method: 'POST' });
      }
      setLoading(false);
    });

    // Curățăm "ascultătorul" la demontarea componentei
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      toast({ title: 'Deconectare reușită!' });
      // Nu mai e nevoie de router.push, onAuthStateChanged va reacționa
      // și va redirecționa unde e nevoie (dacă ai logică de protecție a rutelor)
      // sau pur și simplu va actualiza UI-ul.
    } catch (error) {
      console.error("Eroare la logout:", error);
      toast({ title: 'Eroare la deconectare', variant: 'destructive' });
    }
  };

  const value = { user, loading, logout };

  return (
    <AuthContext.Provider value={value}>
      {/* Nu afișăm nimic până nu știm starea de autentificare, pentru a evita "flickering-ul" */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook custom pentru a folosi contextul
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};