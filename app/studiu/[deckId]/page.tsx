'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, Loader2, BookOpenCheck, Link as LinkIcon, FileText, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

interface Flashcard { id: string; front: string; back: string; }
interface Resource { id: string; title: string; url: string; }

// --- LIMITE PENTRU A PREVENI COSTURILE FIREBASE ---
const MAX_CARDS_PER_DECK = 50;
const MAX_RESOURCES_PER_DECK = 15;

// Componenta Flashcard
const FlashcardItem = ({ card, onDelete }: { card: Flashcard; onDelete: (id: string) => void; }) => (
  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
    <Card className="group relative border-border dark:border-white/10 bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 items-center">
        <p className="text-sm border-b md:border-b-0 md:border-r border-border dark:border-white/10 pb-2 md:pb-0 md:pr-4">{card.front}</p>
        <p className="text-sm font-semibold pt-2 md:pt-0 text-primary">{card.back}</p>
      </CardContent>
      <Button variant="ghost" size="icon" onClick={() => onDelete(card.id)} className="absolute top-1 right-1 h-7 w-7 text-muted-foreground md:opacity-0 md:group-hover:opacity-100 hover:text-rose-500 transition-opacity">
          <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  </motion.div>
);

// Componenta Resursă/Link (Îmbunătățită pentru acces ușor)
const ResourceItem = ({ resource, onDelete }: { resource: Resource; onDelete: (id: string) => void; }) => (
  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
    <Card className="group relative border-border dark:border-white/10 bg-card hover:border-blue-500/30 transition-all shadow-sm hover:shadow-md">
      <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
        <div className="flex items-center gap-3 overflow-hidden w-full">
           <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 shrink-0"><FileText className="h-5 w-5" /></div>
           <div className="truncate">
              <h4 className="font-bold text-sm text-foreground truncate">{resource.title}</h4>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{resource.url}</p>
           </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
           <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30">
               <a href={resource.url} target="_blank" rel="noopener noreferrer">
                   Deschide Link <ExternalLink className="ml-2 h-3 w-3" />
               </a>
           </Button>
           <Button variant="ghost" size="icon" onClick={() => onDelete(resource.id)} className="shrink-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">
               <Trash2 className="h-4 w-4" />
           </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function DeckEditPage({ params }: { params: { deckId: string } }) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for Forms
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newResTitle, setNewResTitle] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data Fetching
  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [cardsRes, resRes] = await Promise.all([
        fetch(`/api/study/decks/${params.deckId}/cards`, { headers }),
        fetch(`/api/study/decks/${params.deckId}/resources`, { headers })
      ]);

      if (cardsRes.ok) setCards(await cardsRes.json());
      if (resRes.ok) setResources(await resRes.json());
    } catch (err) {
      toast({ title: "Eroare la încărcare", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [user, params.deckId, toast]);

  useEffect(() => { if (!authLoading) fetchData(); }, [authLoading, fetchData]);

  // --- Handlers pentru Flashcards ---
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim() || !user) return;

    if (cards.length >= MAX_CARDS_PER_DECK) {
        toast({ title: "Limită atinsă", description: `Nu poți adăuga mai mult de ${MAX_CARDS_PER_DECK} carduri.`, variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/study/decks/${params.deckId}/cards`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ front: newFront, back: newBack }),
      });
      if (!res.ok) throw new Error();
      
      const newCard = await res.json();
      setCards(prev => [newCard, ...prev]);
      
      setNewFront(''); setNewBack('');
      toast({ title: "Card adăugat!" });
    } catch { toast({ title: "Eroare la adăugare", variant: "destructive"}); } 
    finally { setIsSubmitting(false); }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!user) return;
    const old = [...cards]; setCards(c => c.filter(x => x.id !== cardId));
    try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/study/decks/${params.deckId}/cards`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardId }),
        });
        if (!res.ok) throw new Error();
    } catch { setCards(old); toast({ title: "Eroare", variant: "destructive"}); }
  };

  // --- Handlers pentru Resurse ---
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() || !newResUrl.trim() || !user) return;
    
    if (resources.length >= MAX_RESOURCES_PER_DECK) {
        toast({ title: "Limită atinsă", description: `Nu poți adăuga mai mult de ${MAX_RESOURCES_PER_DECK} fișe.`, variant: "destructive" });
        return;
    }

    let finalUrl = newResUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/study/decks/${params.deckId}/resources`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newResTitle, url: finalUrl }),
      });
      if (!res.ok) throw new Error();
      
      const newResource = await res.json();
      setResources(prev => [newResource, ...prev]);
      
      setNewResTitle(''); setNewResUrl('');
      toast({ title: "Fișă atașată!" });
    } catch { toast({ title: "Eroare la atașare", variant: "destructive"}); } 
    finally { setIsSubmitting(false); }
  };

  const handleDeleteResource = async (resId: string) => {
    if (!user) return;
    const old = [...resources]; setResources(r => r.filter(x => x.id !== resId));
    try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/study/decks/${params.deckId}/resources`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ resourceId: resId }),
        });
        if (!res.ok) throw new Error();
    } catch { setResources(old); toast({ title: "Eroare", variant: "destructive"}); }
  };

  if (authLoading) return <div className="container py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  if (!user) return <div className="container py-20 text-center"><h1 className="text-3xl font-bold">Autentificare Necesară</h1><Button asChild className="mt-6"><Link href={`/login?next=/studiu/${params.deckId}`}>Autentifică-te</Link></Button></div>;

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      
      {/* Header navigare */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button asChild variant="outline" className="dark:border-white/10">
          <Link href="/studiu"><ArrowLeft className="mr-2 h-4 w-4" /> Înapoi la Dosare</Link>
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" disabled={cards.length === 0}>
            <Link href={`/studiu/${params.deckId}/sesiune`}>🚀 Începe Sesiunea (Memorează)</Link>
        </Button>
      </div>

      {/* TABS PENTRU CONȚINUT */}
      <Tabs defaultValue="flashcards" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50 border border-border dark:border-white/5 mb-8">
          <TabsTrigger value="flashcards" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <BookOpenCheck className="w-4 h-4 mr-2" /> Flashcarduri ({cards.length})
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-background data-[state=active]:text-blue-500 data-[state=active]:shadow-sm">
            <LinkIcon className="w-4 h-4 mr-2" /> Fișe ({resources.length})
          </TabsTrigger>
        </TabsList>

        {/* --- TAB: FLASHCARDURI --- */}
        <TabsContent value="flashcards" className="mt-0 focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Formular adăugare */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">
                <Card className="border-border dark:border-white/10 shadow-lg">
                    <CardHeader><CardTitle className="text-lg text-primary flex items-center gap-2"><Plus className="w-5 h-5"/> Adaugă Card</CardTitle></CardHeader>
                    <CardContent>
                    <form onSubmit={handleAddCard} className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Față (Întrebare)</label>
                           <Textarea placeholder="Ex: Când a avut loc Marea Unire?" value={newFront} onChange={e => setNewFront(e.target.value)} required rows={3} className="bg-background focus-visible:ring-primary" disabled={cards.length >= MAX_CARDS_PER_DECK} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spate (Răspuns)</label>
                           <Textarea placeholder="Ex: 1 Decembrie 1918" value={newBack} onChange={e => setNewBack(e.target.value)} required rows={3} className="bg-background focus-visible:ring-primary" disabled={cards.length >= MAX_CARDS_PER_DECK} />
                        </div>
                        <Button type="submit" className="w-full shadow-md" disabled={isSubmitting || cards.length >= MAX_CARDS_PER_DECK}>
                          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} 
                          {cards.length >= MAX_CARDS_PER_DECK ? 'Limită atinsă (50)' : 'Salvează Cardul'}
                        </Button>
                    </form>
                    </CardContent>
                </Card>
                </div>

                {/* Lista carduri */}
                <div className="lg:col-span-8">
                    <div className="space-y-3">
                    {isLoading ? ( Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />) ) : (
                        <AnimatePresence>
                        {cards.length > 0 ? (
                            cards.map(card => <FlashcardItem key={card.id} card={card} onDelete={handleDeleteCard} />)
                        ) : (
                            <div className="text-center py-20 px-4 border-2 border-dashed border-border dark:border-white/10 rounded-2xl bg-muted/20">
                                <BookOpenCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="text-xl font-bold text-foreground">Pachetul e gol</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Adaugă primul tău card (întrebare și răspuns) din panoul din stânga pentru a începe să memorezi.</p>
                            </div>
                        )}
                        </AnimatePresence>
                    )}
                    </div>
                </div>
            </div>
        </TabsContent>

        {/* --- TAB: RESURSE --- */}
        <TabsContent value="resources" className="mt-0 focus-visible:outline-none">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Partea Stângă: Info & Formular */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 self-start">
                    
                    {/* INFO BOX REPARAT PENTRU TEMA LUMINOASĂ */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10"><Info className="w-24 h-24 text-blue-500" /></div>
                        <h3 className="text-blue-800 dark:text-blue-300 font-bold text-lg mb-3 flex items-center gap-2 relative z-10"><Info className="w-5 h-5"/> Cum atașezi o fișă?</h3>
                        <p className="text-blue-700 dark:text-blue-100/70 text-sm mb-4 relative z-10">Pentru a păstra site-ul rapid și pentru a economisi spațiu, folosim link-uri externe.</p>
                        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside relative z-10 font-medium">
                            <li>Încarcă PDF-ul tău pe <strong className="text-foreground dark:text-white">Google Drive</strong>.</li>
                            <li>Dă click dreapta pe fișier: <strong className="text-foreground dark:text-white">Trimiteți (Share)</strong>.</li>
                            <li>La Acces general, alege <strong className="text-blue-600 dark:text-emerald-400">&quot;Oricine are linkul&quot;</strong>.</li>
                            <li>Copiază link-ul și lipește-l mai jos! 👇</li>
                        </ol>
                    </div>

                    <Card className="border-border dark:border-white/10 shadow-md">
                        <CardHeader><CardTitle className="text-lg text-blue-600 dark:text-blue-400 flex items-center gap-2"><LinkIcon className="w-5 h-5"/> Atașează Link</CardTitle></CardHeader>
                        <CardContent>
                        <form onSubmit={handleAddResource} className="space-y-4">
                            <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nume Fișă / Subiect</label>
                            <Input placeholder="Ex: Subiect Română 2024" value={newResTitle} onChange={e => setNewResTitle(e.target.value)} required className="bg-background focus-visible:ring-blue-500" disabled={resources.length >= MAX_RESOURCES_PER_DECK} />
                            </div>
                            <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Link (URL)</label>
                            <Input type="url" placeholder="https://drive.google.com/..." value={newResUrl} onChange={e => setNewResUrl(e.target.value)} required className="bg-background focus-visible:ring-blue-500" disabled={resources.length >= MAX_RESOURCES_PER_DECK} />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md" disabled={isSubmitting || resources.length >= MAX_RESOURCES_PER_DECK}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} 
                                {resources.length >= MAX_RESOURCES_PER_DECK ? 'Limită atinsă (15)' : 'Adaugă Resursa'}
                            </Button>
                        </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Partea Dreaptă: Lista cu Resurse */}
                <div className="lg:col-span-7">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">Materiale Atașate</h2>
                        <span className="text-sm font-medium text-muted-foreground">{resources.length} / {MAX_RESOURCES_PER_DECK}</span>
                    </div>
                    <div className="space-y-3">
                    {isLoading ? ( Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-[72px] w-full rounded-xl" />) ) : (
                        <AnimatePresence>
                        {resources.length > 0 ? (
                            resources.map(res => <ResourceItem key={res.id} resource={res} onDelete={handleDeleteResource} />)
                        ) : (
                            <div className="text-center py-20 px-4 border-2 border-dashed border-border dark:border-white/10 rounded-2xl bg-muted/20">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="text-xl font-bold text-foreground">Niciun material atașat</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Acesta e locul perfect pentru subiecte de examen, eseuri în Word sau tabele în PDF salvate pe Drive-ul tău.</p>
                            </div>
                        )}
                        </AnimatePresence>
                    )}
                    </div>
                </div>
             </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}