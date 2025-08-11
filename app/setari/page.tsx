// app/setari/page.tsx
'use client';

import { useState, useEffect, useMemo, ChangeEvent } from 'react';
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
import { auth, storage } from '@/lib/firebase';
import { getApp } from 'firebase/app';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { toast } from '@/hooks/use-toast';

// UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

// Icons
import { User, KeyRound, Palette, Trash2, Loader2, Camera, Bell, MailCheck, MailWarning } from 'lucide-react';

// Animații
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } } };

const SettingsCard = ({ children }: { children: React.ReactNode }) => (
    <motion.div variants={itemVariants}>
        <Card className="shadow-sm overflow-hidden">{children}</Card>
    </motion.div>
);

export default function SettingsPage() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [passwordForDelete, setPasswordForDelete] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const [isLoading, setIsLoading] = useState({
        name: false,
        avatar: false,
        passwordReset: false,
        delete: false,
        verification: false,
    });
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [verificationCooldown, setVerificationCooldown] = useState<number>(0);

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;
        try {
            const app = getApp();
            const bucketFromApp = (app as any)?.options?.storageBucket;
            const bucketFromStorage = (storage as any)?.app?.options?.storageBucket;
            console.log('Firebase storageBucket runtime:', bucketFromApp);
            console.log('getStorage(app) bucket:', bucketFromStorage);
        } catch (e) {
            console.log('Firebase debug bucket read error:', e);
        }
    }, []);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setAvatarPreview(user.photoURL || null);
        }
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setNotificationsEnabled(Notification.permission === 'granted');
        }
    }, [user]);

    // cooldown verificare email
    useEffect(() => {
        if (!verificationCooldown) return;
        const t = setInterval(() => setVerificationCooldown((c) => Math.max(0, c - 1)), 1000);
        return () => clearInterval(t);
    }, [verificationCooldown]);

    const isNameChanged = useMemo(
        () => displayName.trim() !== '' && displayName !== (user?.displayName || ''),
        [displayName, user]
    );

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast({ title: 'Format invalid', description: 'Acceptăm JPEG/PNG/WebP.', variant: 'destructive' });
            return;
        }
        if (file.size > 6 * 1024 * 1024) {
            toast({ title: 'Fișier prea mare', description: 'Limita este 6MB.', variant: 'destructive' });
            return;
        }

        setIsLoading((s) => ({ ...s, avatar: true }));
        setUploadProgress(0);

        const previousPreview = avatarPreview;
        try {
            // preview rapid
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);

            // compresie
            const options = { maxSizeMB: 1, maxWidthOrHeight: 800, useWebWorker: true };
            const compressed = await imageCompression(file, options);

            const storageRef = ref(storage, `avatars/${user.uid}`);
            const task = uploadBytesResumable(storageRef, compressed);

            await new Promise<void>((resolve, reject) => {
                const unsub = task.on(
                    'state_changed',
                    (snap) => {
                        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        setUploadProgress(pct);
                    },
                    (err) => {
                        unsub();
                        reject(err);
                    },
                    () => {
                        unsub();
                        resolve();
                    }
                );

                // timeout 90s ca să nu rămânem în spinner dacă e CORS/config greșit
                const to = setTimeout(() => {
                    try { task.cancel(); } catch { }
                    unsub();
                    reject(new Error('Upload timeout. Verifică conexiunea sau regulile de Storage.'));
                }, 90_000);

                // clear timeout dacă se rezolvă
                task.then?.(() => clearTimeout(to)).catch?.(() => clearTimeout(to));
            });

            const photoURL = await getDownloadURL(storageRef);
            await updateProfile(user, { photoURL });
            setUser?.({ ...user, photoURL });

            toast({ title: 'Avatar actualizat!', description: 'Noua imagine de profil a fost salvată.' });
        } catch (err: any) {
            console.error('Avatar upload error:', err);
            setAvatarPreview(previousPreview || null);
            toast({
                title: 'Eroare upload',
                description: err?.message || 'Nu am putut încărca avatarul. Verifică storageBucket și regulile.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading((s) => ({ ...s, avatar: false }));
            setUploadProgress(0);
        }
    };

    const handleAvatarRemove = async () => {
        setIsLoading((s) => ({ ...s, avatar: true }));
        try {
            await updateProfile(user, { photoURL: '' });
            setUser?.({ ...user, photoURL: '' as any });
            setAvatarPreview(null);
            toast({ title: 'Avatar eliminat.' });
        } catch {
            toast({ title: 'Eroare', description: 'Nu am putut elimina avatarul.', variant: 'destructive' });
        } finally {
            setIsLoading((s) => ({ ...s, avatar: false }));
        }
    };

    const handleNameUpdate = async () => {
        if (!isNameChanged) return;
        setIsLoading((s) => ({ ...s, name: true }));
        try {
            await updateProfile(user, { displayName });
            setUser?.({ ...user, displayName });
            toast({ title: 'Nume salvat!', description: 'Numele tău de afișare a fost actualizat.' });
        } catch {
            toast({ title: 'Eroare', description: 'Nu am putut salva numele.', variant: 'destructive' });
        } finally {
            setIsLoading((s) => ({ ...s, name: false }));
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
    const initial = (displayName || user.email || '?').charAt(0)?.toUpperCase() || '?';

    return (
        <div className="min-h-screen bg-background">
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
                    {emailVerified && (
                        <motion.div variants={itemVariants}>
                            <Card className="border-emerald-500/40 bg-emerald-500/10">
                                <CardContent className="py-3 flex items-center gap-3">
                                    <MailCheck className="h-5 w-5 text-emerald-600" />
                                    <p className="text-sm font-medium">Email verificat</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Profil */}
                    <SettingsCard>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <User /> Profil
                            </CardTitle>
                            <CardDescription>Aceste informații vor fi afișate în întreaga aplicație.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative">
                                    <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/30 to-primary/0 blur-xl" aria-hidden />
                                    <Avatar className="h-24 w-24 ring-4 ring-primary/20 text-4xl">
                                        <AvatarImage src={avatarPreview || undefined} alt={displayName || 'Avatar'} />
                                        <AvatarFallback>{initial}</AvatarFallback>
                                    </Avatar>

                                    <Label
                                        htmlFor="avatar-upload"
                                        className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-transform hover:scale-110 shadow"
                                    >
                                        {isLoading.avatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                                        <Input
                                            id="avatar-upload"
                                            type="file"
                                            className="sr-only"
                                            accept="image/png, image/jpeg, image/webp"
                                            onChange={handleAvatarChange}
                                            disabled={isLoading.avatar}
                                        />
                                    </Label>

                                    {avatarPreview && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="absolute -top-2 -right-2 rounded-full h-7 w-7 p-0"
                                            onClick={handleAvatarRemove}
                                            disabled={isLoading.avatar}
                                        >
                                            {isLoading.avatar ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                        </Button>
                                    )}

                                    {isLoading.avatar && uploadProgress > 0 && (
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                                            Upload: {uploadProgress}%
                                        </div>
                                    )}
                                </div>

                                <div className="w-full space-y-2">
                                    <Label htmlFor="displayName">Nume de afișare</Label>
                                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isLoading.name} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/50 px-6 py-4 flex justify-between items-center">
                            <Button onClick={handleNameUpdate} disabled={isLoading.name || !isNameChanged}>
                                {isLoading.name && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvează Numele
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                {isNameChanged ? 'Ai modificări nesalvate.' : 'Numele este actualizat.'}
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
                                        {user.emailVerified ? (
                                            <MailCheck className="h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <MailWarning className="h-5 w-5 text-amber-600" />
                                        )}
                                        <div>
                                            <p className="font-semibold">Status email</p>
                                            <p className="text-xs text-muted-foreground">{user.emailVerified ? 'Verificat' : 'Neverificat'}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleSendVerification}
                                        disabled={user.emailVerified || isLoading.verification || verificationCooldown > 0}
                                    >
                                        {isLoading.verification && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {user.emailVerified ? 'OK' : `Verifică ${verificationCooldown ? `(${verificationCooldown}s)` : ''}`}
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