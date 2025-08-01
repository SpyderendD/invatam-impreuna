// app/setari/page.tsx
'use client';

import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, sendPasswordResetEmail, deleteUser, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification } from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import { toast } from '@/hooks/use-toast';

// Componente UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";

// Iconițe
import { User, KeyRound, Palette, Trash2, Loader2, Upload, ShieldCheck, ShieldAlert, Bell } from 'lucide-react';

// Variante pentru animații
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } };

const SettingsCard = ({ children }: { children: React.ReactNode }) => (
    <motion.div variants={itemVariants}><Card className="shadow-sm overflow-hidden">{children}</Card></motion.div>
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
        verification: false
    });

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setAvatarPreview(user.photoURL || null);
        }
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setNotificationsEnabled(Notification.permission === 'granted');
        }
    }, [user]);

    const isNameChanged = useMemo(() => displayName.trim() !== '' && displayName !== (user?.displayName || ''), [displayName, user]);

    if (!user) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(prev => ({ ...prev, avatar: true }));

        try {
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);

            const options = { maxSizeMB: 1, maxWidthOrHeight: 800, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);

            const storageRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(storageRef, compressedFile);
            const photoURL = await getDownloadURL(storageRef);

            await updateProfile(user, { photoURL });

            if (setUser) setUser({ ...user, photoURL });

            toast({ title: "Avatar actualizat!", description: "Noua imagine de profil a fost salvată." });

        } catch (error) {
            toast({ title: "Eroare", description: "Nu am putut actualiza avatarul.", variant: "destructive" });
            setAvatarPreview(user.photoURL || null);
        } finally {
            setIsLoading(prev => ({ ...prev, avatar: false }));
        }
    };

    const handleNameUpdate = async () => {
        if (!isNameChanged) return;
        setIsLoading(prev => ({ ...prev, name: true }));
        try {
            await updateProfile(user, { displayName });
            if (setUser) setUser({ ...user, displayName });
            toast({ title: "Nume salvat!", description: "Numele tău de afișare a fost actualizat." });
        } catch (error) {
            toast({ title: "Eroare", description: "Nu am putut salva numele.", variant: "destructive" });
        } finally {
            setIsLoading(prev => ({ ...prev, name: false }));
        }
    };

    const handleNotificationsToggle = (checked: boolean) => {
        if (checked) {
            if ('Notification' in window && Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    setNotificationsEnabled(permission === 'granted');
                    if (permission === 'granted') {
                        toast({ title: "Notificări activate!" });
                        new Notification("Mulțumim!", { body: "Vei primi noutăți direct în browser." });
                    } else if (permission === 'denied') {
                        toast({ title: "Permisiune blocată", description: "Trebuie să permiți notificările din setările browserului.", variant: "destructive" });
                    }
                });
            } else {
                toast({ title: "Browser incompatibil sau permisiune blocată.", variant: "destructive" });
            }
        } else {
            setNotificationsEnabled(false);
            toast({ title: "Notificări dezactivate." });
        }
    };

    const handlePasswordReset = async () => {
        setIsLoading(prev => ({ ...prev, passwordReset: true }));
        try {
            await sendPasswordResetEmail(auth, user.email!);
            toast({ title: "Verifică emailul!", description: "Ți-am trimis un link pentru a-ți reseta parola." });
        } catch (error) {
            toast({ title: "Eroare", description: "Nu am putut trimite emailul.", variant: "destructive" });
        } finally {
            setIsLoading(prev => ({ ...prev, passwordReset: false }));
        }
    };

    const handleAccountDeletion = async () => {
        if (!passwordForDelete) {
            toast({ title: "Parolă necesară", description: "Te rugăm să introduci parola.", variant: "destructive" });
            return;
        }
        setIsLoading(prev => ({ ...prev, delete: true }));
        try {
            const credential = EmailAuthProvider.credential(user.email!, passwordForDelete);
            await reauthenticateWithCredential(user, credential);
            await deleteUser(user);
            toast({ title: "Cont șters", description: "Contul tău a fost șters permanent." });
            router.push('/');
        } catch (error: any) {
            let desc = "A apărut o eroare.";
            if (error.code === 'auth/wrong-password') {
                desc = "Parola introdusă este incorectă.";
            } else if (error.code === 'auth/requires-recent-login') {
                desc = "Sesiunea a expirat. Te rugăm să te deloghezi și să te loghezi din nou.";
            }
            toast({ title: "Eroare la ștergere", description: desc, variant: "destructive" });
        } finally {
            setIsLoading(prev => ({ ...prev, delete: false }));
            setPasswordForDelete('');
        }
    };

    const handleSendVerification = async () => { /* ... logica ta ... */ };

    return (
        <div className="min-h-screen bg-background">
            <main className="container max-w-3xl mx-auto px-4 py-16">
                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-10">
                    <motion.div variants={itemVariants} className="mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold font-lora">Setările Contului</h1>
                        <p className="text-muted-foreground mt-2">Gestionează-ți profilul, preferințele și setările de securitate.</p>
                    </motion.div>

                    <SettingsCard>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><User /> Profil</CardTitle>
                            <CardDescription>Aceste informații vor fi afișate în întreaga aplicație.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24 border-2 border-primary/50 text-4xl">
                                        <AvatarImage src={avatarPreview || undefined} alt={displayName || 'Avatar'} />
                                        <AvatarFallback>{displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-transform hover:scale-110">
                                        {isLoading.avatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                        <Input id="avatar-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleAvatarChange} disabled={isLoading.avatar} />
                                    </Label>
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
                            <p className="text-xs text-muted-foreground">{isNameChanged ? "Ai modificări nesalvate." : "Numele este actualizat."}</p>
                        </CardFooter>
                    </SettingsCard>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <SettingsCard>
                            <CardHeader><CardTitle className="flex items-center gap-3"><Bell /> Notificări</CardTitle></CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <Label htmlFor="notif-switch" className="flex-grow pr-4 cursor-pointer">Notificări în browser</Label>
                                <Switch id="notif-switch" checked={notificationsEnabled} onCheckedChange={handleNotificationsToggle} />
                            </CardContent>
                        </SettingsCard>
                        <SettingsCard>
                            <CardHeader><CardTitle className="flex items-center gap-3"><Palette /> Aspect</CardTitle></CardHeader>
                            <CardContent className="flex items-center justify-between"><p className="font-medium">Temă</p><ThemeToggle /></CardContent>
                        </SettingsCard>
                    </div>

                    <motion.div variants={itemVariants}>
                        <Card className="border-destructive bg-destructive/5 dark:bg-destructive/10">
                            <CardHeader><CardTitle className="flex items-center gap-3 text-destructive"><Trash2 /> Zonă de Pericol</CardTitle></CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">Șterge contul permanent</p>
                                    <p className="text-sm text-muted-foreground">Toate datele tale vor fi eliminate.</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild><Button variant="destructive">Șterge</Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Ești sigur?</AlertDialogTitle><AlertDialogDescription>Această acțiune este ireversibilă.</AlertDialogDescription></AlertDialogHeader>
                                        <Dialog>
                                            <DialogTrigger asChild><Button variant="outline">Continuă spre ștergere</Button></DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader><DialogTitle>Confirmare Finală</DialogTitle><DialogDescription>Pentru a șterge contul, te rugăm să introduci parola.</DialogDescription></DialogHeader>
                                                <div className="space-y-2 py-4">
                                                    <Label htmlFor="password-delete">Parola</Label>
                                                    <Input id="password-delete" type="password" value={passwordForDelete} onChange={(e) => setPasswordForDelete(e.target.value)} placeholder="••••••••" />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="button" variant="destructive" onClick={handleAccountDeletion} disabled={isLoading.delete || !passwordForDelete}>{isLoading.delete && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Șterge Contul Definitiv</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <AlertDialogCancel className="mt-2 sm:mt-0">Anulează</AlertDialogCancel>
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