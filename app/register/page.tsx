// app/register/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Importuri UI
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Mail, Lock } from 'lucide-react';

// Importuri Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Creează utilizatorul cu Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Obține ID Token-ul noului utilizator
      const idToken = await userCredential.user.getIdToken();

      // 3. Trimite token-ul la API-ul nostru de LOGIN pentru a crea sesiunea
      // (Refolosim API-ul de login, e eficient!)
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      // 4. Înregistrare reușită, du utilizatorul la dashboard
      router.push('/dashboard');

    } catch (error: any) {
      setIsLoading(false);
      // Gestionează erori comune de la Firebase
      let description = 'A apărut o eroare. Te rugăm să încerci din nou.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'Această adresă de email este deja folosită.';
      } else if (error.code === 'auth/weak-password') {
        description = 'Parola este prea slabă. Trebuie să aibă cel puțin 6 caractere.';
      }
      
      toast({
        title: 'Eroare la înregistrare',
        description: description,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container max-w-md">
          <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">Creează un cont</h1>
              <p className="mt-2 text-muted-foreground">
                  Completează detaliile pentru a începe călătoria.
              </p>
          </div>
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nume@exemplu.ro"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Parolă</Label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Minim 6 caractere"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Se creează contul...' : 'Înregistrează-te'}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                Ai deja un cont?{' '}
                <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                  Conectează-te
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}