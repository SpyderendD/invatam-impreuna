'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Eye, EyeOff, Mail, Lock, Loader2, User } from 'lucide-react';

// --- COMPONENTA INTERNĂ PENTRU CHECKBOX ---
const StyledCheckbox = ({ 
  id, checked, onChange, label, linkUrl, linkText 
}: { 
  id: string; checked: boolean; onChange: (c: boolean) => void; 
  label: string; linkUrl?: string; linkText?: string; 
}) => {
  return (
    <div className="flex items-start gap-3 my-3 group">
      <style jsx>{`
        .check { cursor: pointer; position: relative; margin: 0; width: 18px; height: 18px; -webkit-tap-highlight-color: transparent; transform: translate3d(0, 0, 0); flex-shrink: 0; }
        .check:before { content: ""; position: absolute; top: -15px; left: -15px; width: 48px; height: 48px; border-radius: 50%; background: rgba(34,50,84,0.03); opacity: 0; transition: opacity 0.2s ease; }
        .check svg { position: relative; z-index: 1; fill: none; stroke-linecap: round; stroke-linejoin: round; stroke: #c8ccd4; stroke-width: 1.5; transform: translate3d(0, 0, 0); transition: all 0.2s ease; }
        .check svg path { stroke-dasharray: 60; stroke-dashoffset: 0; }
        .check svg polyline { stroke-dasharray: 22; stroke-dashoffset: 66; }
        .check:hover:before { opacity: 1; }
        .check:hover svg { stroke: #4285f4; }
        .dark .check:hover svg { stroke: #8ab4f8; }
        .dark .check svg { stroke: #5f6368; }
        .custom-input:checked + .check svg { stroke: #4285f4; }
        .dark .custom-input:checked + .check svg { stroke: #8ab4f8; }
        .custom-input:checked + .check svg path { stroke-dashoffset: 60; transition: all 0.3s linear; }
        .custom-input:checked + .check svg polyline { stroke-dashoffset: 42; transition: all 0.2s linear; transition-delay: 0.15s; }
      `}</style>
      <div className="relative pt-1">
        <input type="checkbox" id={id} className="custom-input" style={{ display: 'none' }} checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <label htmlFor={id} className="check">
          <svg width="18px" height="18px" viewBox="0 0 18 18">
            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
            <polyline points="1 9 7 14 15 4"></polyline>
          </svg>
        </label>
      </div>
      <label htmlFor={id} className="text-sm text-muted-foreground cursor-pointer select-none leading-tight transition-colors group-hover:text-foreground">
        {label} {' '}
        {linkUrl && linkText && (
          <Link href={linkUrl} target="_blank" className="text-primary hover:underline font-medium decoration-primary/30 underline-offset-4">
            {linkText}
          </Link>
        )}
      </label>
    </div>
  );
};

// --- PAGINA PRINCIPALĂ DE REGISTER ---
export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  const allAgreementsAccepted = termsAccepted && privacyAccepted && cookiesAccepted;
  const isFormValid = allAgreementsAccepted && email && password && name;

  async function createSessionCookie(user: any) {
    const idToken = await user.getIdToken(true);
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  }
  
  const handleAuthSuccess = async (user: any) => {
    await createSessionCookie(user);
    toast({ title: 'Autentificare reușită!' });
    router.push('/dashboard');
  };
  
  const handleAuthError = (error: any, provider: string) => {
    console.error(`Eroare la autentificarea cu ${provider}:`, error);
    let message = `Nu s-a putut efectua autentificarea cu ${provider}.`;
    if (error.code === 'auth/account-exists-with-different-credential') {
      message = 'Un cont există deja cu acest email, dar cu altă metodă de autentificare (ex: Google).';
    }
    toast({ title: 'Eroare', description: message, variant: 'destructive' });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await handleAuthSuccess(userCredential.user);
    } catch (error: any) {
      console.error(error);
      let message = 'A apărut o eroare la înregistrare.';
      if (error.code === 'auth/email-already-in-use') message = 'Acest email este deja folosit.';
      if (error.code === 'auth/weak-password') message = 'Parola trebuie să aibă minim 6 caractere.';
      toast({ title: 'Eroare', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (providerName: 'google' | 'yahoo') => {
    if (!allAgreementsAccepted) {
        toast({ title: 'Atenție', description: 'Te rog acceptă toți termenii înainte de a continua.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    try {
      let provider;
      if (providerName === 'google') {
        provider = new GoogleAuthProvider();
      } else {
        provider = new OAuthProvider('yahoo.com');
      }
      const userCredential = await signInWithPopup(auth, provider);
      await handleAuthSuccess(userCredential.user);
    } catch (error) {
      handleAuthError(error, providerName);
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
              <CardTitle className="mt-4 text-2xl font-bold">Creează Cont Gratuit</CardTitle>
              <CardDescription className="mt-2">
                Alătură-te comunității și începe să înveți.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume</Label>
                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="name" placeholder="Numele tău" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required disabled={isLoading} /></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" placeholder="nume@exemplu.ro" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required disabled={isLoading} /></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Parolă</Label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required disabled={isLoading} /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                </div>

                <div className="p-3 bg-muted/20 border border-border/50 rounded-lg">
                    <StyledCheckbox id="terms" checked={termsAccepted} onChange={setTermsAccepted} label="Sunt de acord cu" linkText="Termenii și Condițiile" linkUrl="/termeni" />
                    <StyledCheckbox id="privacy" checked={privacyAccepted} onChange={setPrivacyAccepted} label="Am citit și înțeleg" linkText="Politica de Confidențialitate" linkUrl="/politica-confidentialitate" />
                    <StyledCheckbox id="cookies" checked={cookiesAccepted} onChange={setCookiesAccepted} label="Accept utilizarea modulelor" linkText="Cookie" linkUrl="/cookies" />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !isFormValid} title={!isFormValid ? "Completează toate câmpurile și acceptă termenii" : ""}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Creează Cont
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Sau continuă cu</span></div></div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button variant="outline" className="w-full" onClick={() => handleOAuthSignIn('google')} disabled={isLoading || !allAgreementsAccepted}>
                        <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-label="Google"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                        Google
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleOAuthSignIn('yahoo')} disabled={isLoading || !allAgreementsAccepted}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 0C5.385 0 0 5.385 0 12.031s5.385 12.031 12.031 12.031 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm7.135 15.352c-.376.438-.938.6-1.531.6-.723 0-1.348-.3-1.781-.963l-3.375-5.188-3.375 5.188c-.434.662-1.058.963-1.781.963-.594 0-1.156-.162-1.531-.6-.563-.656-.656-1.631-.219-2.381l4.438-6.844-4.219-6.5c-.438-.75-.344-1.725.219-2.381.563-.656 1.481-.75 2.231-.219l.281.188 3.563 5.5 3.563-5.5.281-.188c.75-.531 1.669-.438 2.231.219.563.656.656 1.631.219 2.381l-4.219 6.5 4.438 6.844c.438.75.344 1.725-.219 2.381z"/></svg>
                        Yahoo
                    </Button>
                </div>
              </div>
              <div className="mt-6 text-center text-sm"><span className="text-muted-foreground">Ai deja un cont? </span><Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Conectare</Link></div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}