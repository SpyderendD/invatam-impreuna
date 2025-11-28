// app/studiu/[deckId]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Plus, Trash2, Loader2, BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

// Componenta pentru un singur card din listă (cu buton de ștergere)
const FlashcardItem = ({ card, onDelete }: { card: Flashcard; onDelete: (cardId: string) => void; }) => (
  <motion.div 
    layout 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, x: -30 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
  >
    <Card className="group relative">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 items-center">
        <p className="text-sm border-b md:border-b-0 md:border-r pb-2 md:pb-0 md:pr-4">{card.front}</p>
        <p className="text-sm font-semibold pt-2 md:pt-0">{card.back}</p>
      </CardContent>
      <Button variant="ghost" size="icon" onClick={() => onDelete(card.id)} className="absolute top-1 right-1 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive">
          <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  </motion.div>
);

// Componenta principală a paginii
export default function DeckEditPage({ params }: { params: { deckId: string } }) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCards = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/study/decks/${params.deckId}/cards`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Nu am putut prelua cardurile.');
      }
      setCards(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, params.deckId]);

  useEffect(() => {
    if (!authLoading) {
      fetchCards();
    }
  }, [authLoading, fetchCards]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/study/decks/${params.deckId}/cards`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ front: newFront, back: newBack }),
      });
      const newCard = await response.json();
      if (!response.ok) {
        throw new Error(newCard.error || 'Nu am putut adăuga cardul.');
      }
      setCards(prev => [newCard, ...prev]);
      setNewFront('');
      setNewBack('');
      toast({ title: "Succes!", description: "Cardul a fost adăugat." });
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive"});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!user) return;
    const originalCards = [...cards];
    setCards(currentCards => currentCards.filter(c => c.id !== cardId));

    try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/study/decks/${params.deckId}/cards`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardId }),
        });
        if (!response.ok) throw new Error("Eroare la ștergerea cardului de pe server.");
        toast({ title: "Succes", description: "Cardul a fost șters."});
    } catch (err: any) {
        toast({ title: "Eroare", description: err.message, variant: "destructive"});
        setCards(originalCards);
    }
  };

  if (authLoading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1"><Skeleton className="h-72 w-full" /></div>
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold">Autentificare Necesară</h1>
        <p className="mt-4 text-muted-foreground">Trebuie să fii autentificat pentru a edita acest pachet.</p>
        <Button asChild className="mt-6"><Link href={`/login?next=/studiu/${params.deckId}`}>Autentifică-te</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Button asChild variant="outline">
          <Link href="/studiu"><ArrowLeft className="mr-2 h-4 w-4" /> Înapoi la Pachete</Link>
        </Button>
        <Button asChild disabled={cards.length === 0}>
            <Link href={`/studiu/${params.deckId}/sesiune`}>Începe Sesiunea</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
          <Card>
            <CardHeader>
              <CardTitle>Adaugă un Card Nou</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCard} className="space-y-4">
                <Textarea placeholder="Fața cardului (Întrebare/Termen)" value={newFront} onChange={e => setNewFront(e.target.value)} required rows={3} />
                <Textarea placeholder="Spatele cardului (Răspuns/Definiție)" value={newBack} onChange={e => setNewBack(e.target.value)} required rows={3} />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Se adaugă...' : 'Adaugă Card'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Carduri în Pachet ({cards.length})</h2>
            <div className="space-y-4">
            {isLoading ? (
                Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-[76px] w-full" />)
            ) : error ? (
                <p className="text-destructive text-center py-8">{error}</p>
            ) : (
                <AnimatePresence>
                {cards.length > 0 ? (
                    cards.map(card => <FlashcardItem key={card.id} card={card} onDelete={handleDeleteCard} />)
                ) : (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <BookOpenCheck className="mx-auto h-12 w-12" />
                        <p className="mt-4 font-semibold">Pachetul este gol</p>
                        <p className="text-sm">Adaugă primul tău card folosind formularul.</p>
                    </div>
                )}
                </AnimatePresence>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}