'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { ParticlesBackground } from '@/components/animations/ParticlesBackground';

// UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import { User, KeyRound, Palette, Trash2, Loader2, Bell, MailCheck, MailWarning, RefreshCw, Check } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 20 } } };

const SettingsCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={itemVariants}>
    <Card className="shadow-sm overflow-hidden">{children}</Card>
  </motion.div>
);

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [passwordForDelete, setPasswordForDelete] = useState('');

  const [isLoading, setIsLoading] = useState({
    profile: false, // combinat nume + poza
    passwordReset: false,
    delete: false,
    verification: false,
  });
  const [verificationCooldown, setVerificationCooldown] = useState(0);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      // Dacă nu are poză, setăm una default generată
      setPhotoURL(user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`);
    }
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, [user]);

  useEffect(() => {
    if (!verificationCooldown) return;
    const t = setInterval(() => setVerificationCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [verificationCooldown]);

  // Generare avatar nou (schimbă seed-ul)
  const regenerateAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    setPhotoURL(newAvatar);
  };

  const hasChanges = useMemo(
    () => (displayName.trim() !== '' && displayName !== (user?.displayName || '')) || (photoURL !== user?.photoURL),
    [displayName, photoURL, user]
  );

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Handlers

  const handleProfileUpdate = async () => {
    if (!hasChanges) return;
    setIsLoading((s) => ({ ...s, profile: true }));
    try {
      await updateProfile(user, { 
        displayName,
        photoURL 
      });
      setUser?.({ ...user, displayName, photoURL });
      toast({ title: 'Profil actualizat!', description: 'Modificările au fost salvate cu succes.' });
    } catch {
      toast({ title: 'Eroare', description: 'Nu am putut actualiza profilul.', variant: 'destructive' });
    } finally {
      setIsLoading((s) => ({ ...s, profile: false }));
    }
  };

  const handleNotificationsToggle = (checked: boolean) => {
    if (checked) {
      if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          const enabled = permission === 'granted';
          setNotificationsEnabled(enabled);
          if (enabled) {
            toast({ title: 'Notificări activate!' });
            new Notification('Mulțumim!', { body: 'Vei primi noutăți direct în browser.' });
          } else if (permission === 'denied') {
            toast({
              title: 'Permisiune blocată',
              description: 'Activează notificările din setările browserului.',
              variant: 'destructive',
            });
          }
        });
      } else {
        toast({ title: 'Browser incompatibil sau permisiune blocată.', variant: 'destructive' });
      }
    } else {
      setNotificationsEnabled(false);
      toast({ title: 'Notificări dezactivate.' });
    }
  };

  const handlePasswordReset = async () => {
    setIsLoading((s) => ({ ...s, passwordReset: true }));
    try {
      await sendPasswordResetEmail(auth, user.email!);
      toast({
        title: 'Verifică emailul!',
        description: 'Ți-am trimis un link pentru resetarea parolei. Dacă nu îl găsești, uită-te și în Spam/Promotions.',
      });
    } catch {
      toast({ title: 'Eroare', description: 'Nu am putut trimite emailul.', variant: 'destructive' });
    } finally {
      setIsLoading((s) => ({ ...s, passwordReset: false }));
    }
  };

  const handleSendVerification = async () => {
    setIsLoading((s) => ({ ...s, verification: true }));
    try {
      await sendEmailVerification(user);
      setVerificationCooldown(30);
      toast({
        title: 'Email de verificare trimis!',
        description: 'Verifică inboxul și folderele Spam/Promotions.',
      });
    } catch {
      toast({ title: 'Eroare', description: 'Nu am putut trimite emailul.', variant: 'destructive' });
    } finally {
      setIsLoading((s) => ({ ...s, verification: false }));
    }
  };

  const handleAccountDeletion = async () => {
    if (!passwordForDelete) {
      toast({ title: 'Parolă necesară', description: 'Introdu parola pentru confirmare.', variant: 'destructive' });
      return;
    }
    setIsLoading((s) => ({ ...s, delete: true }));
    try {
      const cred = EmailAuthProvider.credential(user.email!, passwordForDelete);
      await reauthenticateWithCredential(user, cred);
      await deleteUser(user);
      toast({ title: 'Cont șters', description: 'Contul tău a fost șters permanent.' });
      router.push('/');
    } catch (error: any) {
      let desc = 'A apărut o eroare.';
      if (error.code === 'auth/wrong-password') desc = 'Parola introdusă este incorectă.';
      else if (error.code === 'auth/requires-recent-login') desc = 'Sesiunea a expirat. Loghează-te din nou.';
      toast({ title: 'Eroare la ștergere', description: desc, variant: 'destructive' });
    } finally {
      setIsLoading((s) => ({ ...s, delete: false }));
      setPasswordForDelete('');
    }
  };

  const emailVerified = user.emailVerified;

  // Render
  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <main className="container max-w-4xl mx-auto px-4 py-12 md:py-16">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-10">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-2">
            <h1 className="text-4xl md:text-5xl font-bold font-lora tracking-tight">Setările Contului</h1>
            <p className="text-muted-foreground mt-2">Gestionează-ți profilul, preferințele și securitatea.</p>
          </motion.div>

          {/* Banner verificare email */}
          {!emailVerified && (
            <motion.div variants={itemVariants}>
              <Card className="border-amber-500/40 bg-amber-500/10">
                <CardContent className="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <MailWarning className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-semibold">Email neverificat</p>
                      <p className="text-sm text-muted-foreground">
                        Verifică-ți adresa. Dacă nu găsești mesajul, caută și în Spam/Promotions.
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleSendVerification} disabled={isLoading.verification || verificationCooldown > 0}>
                    {isLoading.verification && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Trimite verificarea {verificationCooldown > 0 ? `(${verificationCooldown}s)` : ''}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Profil – Nume + Avatar */}
          <SettingsCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User /> Profil Public
              </CardTitle>
              <CardDescription>Cum apari celorlalți utilizatori pe platformă.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Secțiunea Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-border shadow-md">
                    <AvatarImage src={photoURL} className="object-cover bg-muted" />
                    <AvatarFallback className="text-2xl font-bold">{displayName?.[0]}</AvatarFallback>
                  </Avatar>
                  {/* Buton Overlay pe Avatar (Opțional) */}
                  <button 
                    onClick={regenerateAvatar}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Generează alt avatar"
                  >
                    <RefreshCw className="h-6 w-6 text-white" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Avatar</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={regenerateAvatar}>
                      <RefreshCw className="mr-2 h-3.5 w-3.5" /> Generează Aleatoriu
                    </Button>
                    {/* Dacă vrei upload, aici ar veni un <Input type="file" /> */}
                  </div>
                  <p className="text-xs text-muted-foreground">Folosim avatare unice generate automat.</p>
                </div>
              </div>

              {/* Secțiunea Nume */}
              <div className="w-full space-y-2">
                <Label htmlFor="displayName">Nume de afișare</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isLoading.profile}
                  placeholder="Numele tău"
                />
              </div>

            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4 flex justify-between items-center">
              <Button onClick={handleProfileUpdate} disabled={isLoading.profile || !hasChanges}>
                {isLoading.profile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Salvează Modificările
              </Button>
              <p className="text-xs text-muted-foreground">
                {hasChanges ? 'Ai modificări nesalvate.' : 'Profilul este actualizat.'}
              </p>
            </CardFooter>
          </SettingsCard>

          {/* Preferințe + Securitate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <SettingsCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Bell /> Notificări
                </CardTitle>
                <CardDescription>Primește noutăți și alerte utile în browser.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Label htmlFor="notif-switch" className="flex-grow pr-4 cursor-pointer">
                  Notificări în browser
                </Label>
                <Switch id="notif-switch" checked={notificationsEnabled} onCheckedChange={handleNotificationsToggle} />
              </CardContent>
            </SettingsCard>

            <SettingsCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Palette /> Aspect
                </CardTitle>
                <CardDescription>Alege tema preferată pentru interfață.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="font-medium">Temă</p>
                <ThemeToggle />
              </CardContent>
            </SettingsCard>

            <SettingsCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <KeyRound /> Securitate
                </CardTitle>
                <CardDescription>Parolă și verificare email.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {emailVerified ? (
                      <MailCheck className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <MailWarning className="h-5 w-5 text-amber-600" />
                    )}
                    <div>
                      <p className="font-semibold">Status email</p>
                      <p className="text-xs text-muted-foreground">{emailVerified ? 'Verificat' : 'Neverificat'}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSendVerification}
                    disabled={emailVerified || isLoading.verification || verificationCooldown > 0}
                  >
                    {isLoading.verification && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {emailVerified ? 'OK' : `Verifică ${verificationCooldown ? `(${verificationCooldown}s)` : ''}`}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Resetează parola</p>
                    <p className="text-xs text-muted-foreground">Trimite un link de resetare la {user.email}</p>
                  </div>
                  <Button onClick={handlePasswordReset} disabled={isLoading.passwordReset}>
                    {isLoading.passwordReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Trimite link
                  </Button>
                </div>
              </CardContent>
            </SettingsCard>
          </div>

          {/* Zonă de pericol */}
          <motion.div variants={itemVariants}>
            <Card className="border-destructive bg-destructive/5 dark:bg-destructive/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-destructive">
                  <Trash2 /> Zonă de Pericol
                </CardTitle>
                <CardDescription>Acțiuni ireversibile. Procedează cu atenție.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Șterge contul permanent</p>
                  <p className="text-sm text-muted-foreground">Toate datele tale vor fi eliminate.</p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Șterge</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Această acțiune este ireversibilă. Pentru a continua, introdu parola contului.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-2 py-3">
                      <Label htmlFor="password-delete">Parola</Label>
                      <Input
                        id="password-delete"
                        type="password"
                        value={passwordForDelete}
                        onChange={(e) => setPasswordForDelete(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Anulează</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          variant="destructive"
                          onClick={handleAccountDeletion}
                          disabled={isLoading.delete || !passwordForDelete}
                        >
                          {isLoading.delete && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Șterge contul definitiv
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}