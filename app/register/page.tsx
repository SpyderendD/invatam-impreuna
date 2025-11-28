// app/register/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Mail, Lock, Loader2, User as UserIcon } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- ADAUGĂ ACEASTĂ FUNCȚIE (Copiată din Login) ---
  async function createSessionCookie(user: any) {
    const idToken = await user.getIdToken(true);
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  }
  // --------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Creează contul în Firebase (Client)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. --- PAS CRITIC ADĂUGAT ---
      // Creează sesiunea pe server (Cookie)
      await createSessionCookie(userCredential.user);
      // -----------------------------

      toast({ title: "Cont creat cu succes!", description: "Vei fi redirecționat..." });
      
      // 3. Acum poți naviga, serverul va vedea cookie-ul
      router.push('/dashboard'); 
      router.refresh(); // Recomandat pentru a actualiza Server Components
      
    } catch (error: any) {
      // ... gestionarea erorilor rămâne la fel
      let description = 'A apărut o eroare.';
      if (error.code === 'auth/email-already-in-use') { description = 'Această adresă de email este deja folosită.'; }
      else if (error.code === 'auth/weak-password') { description = 'Parola trebuie să aibă cel puțin 6 caractere.'; }
      toast({ title: 'Eroare la înregistrare', description, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col auth-background">
      
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mx-auto w-fit"
              >
                <UserIcon className="h-6 w-6 text-primary" />
              </motion.div>
              <CardTitle className="mt-4 text-2xl font-bold">Creează un Cont Nou</CardTitle>
              <CardDescription className="mt-2">
                Completează detaliile pentru a începe călătoria ta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="nume@exemplu.ro" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required disabled={isLoading} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Parolă</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="Minim 6 caractere" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required disabled={isLoading} />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Creează Cont
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm"><span className="text-muted-foreground">Ai deja un cont?{' '}</span><Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Conectează-te</Link></div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}