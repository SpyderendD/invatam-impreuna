// app/setari/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, updateEmail, sendPasswordResetEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

// Componente UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme/ThemeToggle'; // Asigură-te că ai această componentă
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

// Iconițe
import { User, Mail, KeyRound, Palette, Trash2, Loader2 } from 'lucide-react';

// Variante pentru animații
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 }}};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' }}};

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingEmail, setIsSavingEmail] = useState(false);
    const [isSendingReset, setIsSendingReset] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setNewEmail(user.email || '');
        }
    }, [user]);

    if (!user) {
        // Poți afișa un schelet de încărcare sau null până se încarcă user-ul
        // AuthProvider se va ocupa de redirect dacă nu e logat
        return null; 
    }

    const handleProfileUpdate = async () => {
        if (displayName === user.displayName) return;
        setIsSavingProfile(true);
        try {
            await updateProfile(user, { displayName });
            toast({ title: "Profil actualizat!", description: "Numele tău a fost schimbat cu succes." });
        } catch (error) {
            toast({ title: "Eroare", description: "Nu am putut actualiza profilul.", variant: "destructive" });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordReset = async () => {
        setIsSendingReset(true);
        try {
            await sendPasswordResetEmail(auth, user.email!);
            toast({ title: "Verifică emailul!", description: "Ți-am trimis un link pentru a-ți reseta parola." });
        } catch (error) {
            toast({ title: "Eroare", description: "Nu am putut trimite emailul de resetare.", variant: "destructive" });
        } finally {
            setIsSendingReset(false);
        }
    };

    const handleAccountDeletion = async () => {
        setIsDeleting(true);
        try {
            await deleteUser(user);
            toast({ title: "Cont șters", description: "Contul tău a fost șters permanent." });
            router.push('/'); // Redirecționare la pagina principală după ștergere
        } catch (error: any) {
            toast({ title: "Eroare de securitate", description: "Pentru a șterge contul, te rugăm să te deloghezi și să te loghezi din nou. " + error.message, variant: "destructive", duration: 7000 });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container max-w-4xl mx-auto px-4 py-16">
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.div variants={itemVariants} className="mb-10">
                        <h1 className="text-4xl font-bold font-lora">Setările Contului</h1>
                        <p className="text-muted-foreground mt-2">Gestionează-ți profilul, setările de securitate și preferințele.</p>
                    </motion.div>

                    {/* Card Setări Profil */}
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-sm">
                            <CardHeader><CardTitle className="flex items-center gap-3"><User /> Profil</CardTitle><CardDescription>Aceste informații vor fi afișate public.</CardDescription></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Nume de afișare</Label>
                                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={user.email || ''} disabled />
                                    <p className="text-xs text-muted-foreground">Emailul nu poate fi schimbat din motive de securitate.</p>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4"><Button onClick={handleProfileUpdate} disabled={isSavingProfile}>{isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvează Modificările</Button></CardFooter>
                        </Card>
                    </motion.div>
                    
                    <Separator className="my-8" />

                    {/* Card Securitate */}
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-sm">
                            <CardHeader><CardTitle className="flex items-center gap-3"><KeyRound /> Securitate</CardTitle><CardDescription>Gestionează-ți parola.</CardDescription></CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <p className="text-sm font-medium">Resetare parolă</p>
                                <Button variant="outline" onClick={handlePasswordReset} disabled={isSendingReset}>{isSendingReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Trimite link de resetare</Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <Separator className="my-8" />

                    {/* Card Aspect */}
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-sm">
                            <CardHeader><CardTitle className="flex items-center gap-3"><Palette /> Aspect Vizual</CardTitle><CardDescription>Personalizează aspectul platformei.</CardDescription></CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <p className="text-sm font-medium">Temă</p>
                                <ThemeToggle />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <Separator className="my-8" />

                    {/* Card Zonă de Pericol */}
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-sm border-destructive">
                            <CardHeader><CardTitle className="flex items-center gap-3 text-destructive"><Trash2 /> Zonă de Pericol</CardTitle><CardDescription>Aceste acțiuni sunt ireversibile. Te rugăm să fii precaut.</CardDescription></CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <p className="text-sm font-medium">Șterge contul</p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild><Button variant="destructive" disabled={isDeleting}>Șterge Contul</Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle><AlertDialogDescription>Această acțiune nu poate fi anulată. Toate datele tale, inclusiv progresul la materii, vor fi șterse permanent.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Anulează</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleAccountDeletion} disabled={isDeleting}>{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Da, șterge contul</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}