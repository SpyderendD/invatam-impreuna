'use client';

import { useState, Suspense } from 'react'; // <--- Am adăugat Suspense
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

// Aceasta este componenta internă care conține logica (și useSearchParams)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function createSessionCookie(user: User) {
    const idToken = await user.getIdToken(true);
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  }

  async function handleAuthSuccess(user: User) {
    toast({ title: 'Autentificare reușită!' });
    await createSessionCookie(user);
    const nextUrl = searchParams.get('next');
    router.replace(nextUrl || '/dashboard');
  }
  
  function handleAuthError(error: any, provider: string) {
    console.error(`Eroare la login cu ${provider}:`, error);
    toast({
      title: 'Eroare de autentificare',
      description: 'Datele introduse sunt incorecte. Verifică emailul și parola.',
      variant: 'destructive',
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(cred.user);
    } catch (error) {
      handleAuthError(error, 'Email/Password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      await handleAuthSuccess(cred.user);
    } catch (error) {
      handleAuthError(error, 'Google');
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
                <BookOpen className="h-6 w-6 text-primary" />
              </motion.div>
              <CardTitle className="mt-4 text-2xl font-bold">Conectare</CardTitle>
              <CardDescription className="mt-2">
                Bine ai revenit! Folosește datele tale pentru a continua.
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Parolă</Label>
                    <Link href="/auth/reset-password" className="text-xs text-primary underline-offset-4 hover:underline">Ai uitat parola?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required disabled={isLoading} />
                    <button type="button" aria-label="Arată/Ascunde parola" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Conectare</Button>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Sau continuă cu</span></div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={handleGoogleSignIn} disabled={isLoading}>
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-label="Google"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                  Google
                </Button>
              </div>
              <div className="mt-6 text-center text-sm"><span className="text-muted-foreground">Nu ai un cont? </span><Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">Înregistrare</Link></div>
              <a>După ce te conectezi, așteaptă 5-6 secunde, apoi dă refresh la pagina.</a>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

// Aceasta este componenta exportată care satisface cerințele Next.js de Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center auth-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}