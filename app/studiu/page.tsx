// app/studiu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BookCopy, AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { CreateDeckDialog } from '@/components/study/CreateDeckDialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// --- Tipul de date pentru un pachet ---
interface Deck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
}

// --- Componenta Card pentru un pachet (cu buton de ștergere) ---
const DeckCard = ({ deck, onDelete }: { deck: Deck; onDelete: (deckId: string) => void; }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg"
  >
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
          <AlertDialogDescription>
            Această acțiune nu poate fi anulată. Vei șterge permanent pachetul &quot;{deck.name}&quot; și toate cardurile din el.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulează</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDelete(deck.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Da, șterge pachetul
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <BookCopy className="h-5 w-5" />
        </div>
        <Link href={`/studiu/${deck.id}`} className="flex-1">
          <h3 className="text-lg font-bold text-foreground hover:underline">{deck.name}</h3>
        </Link>
      </div>
      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
        {deck.description || 'Nicio descriere adăugată.'}
      </p>
    </div>
    <div className="mt-auto flex items-center justify-between border-t pt-4">
      <span className="text-sm font-medium text-muted-foreground">{deck.cardCount || 0} carduri</span>
      <Button asChild size="sm" className="transition-transform group-hover:scale-105" disabled={!deck.cardCount || deck.cardCount === 0}>
        <Link href={`/studiu/${deck.id}/sesiune`}>Studiază</Link>
      </Button>
    </div>
  </motion.div>
);

// --- Componenta Skeleton (pentru starea de încărcare) ---
const DeckSkeleton = () => (
    <div className="flex flex-col space-y-3 rounded-xl border bg-card p-5">
        <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
        </div>
        <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between border-t pt-4">
            <Skeleton className="h-5 w-16" /><Skeleton className="h-9 w-24 rounded-md" />
        </div>
    </div>
);

// --- Componenta Principală a Paginii ---
export default function StudyPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDeckCreated = (newDeck: Deck) => {
    setDecks(prevDecks => [newDeck, ...prevDecks]);
  };
  
  const handleDeleteDeck = async (deckId: string) => {
    if (!user) return;
    const originalDecks = [...decks];
    setDecks(currentDecks => currentDecks.filter(d => d.id !== deckId));

    try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/study/decks/${deckId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Eroare la ștergerea pachetului de pe server.");
        toast({ title: "Succes", description: "Pachetul a fost șters." });
    } catch (err: any) {
        toast({ title: "Eroare", description: err.message, variant: "destructive" });
        setDecks(originalDecks);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsLoading(false);
      return;
    }
    const fetchDecks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/study/decks', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Nu am putut prelua pachetele de studiu.');
        }
        setDecks(await response.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDecks();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="container py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-10 w-44" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <DeckSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold">Autentificare Necesară</h1>
        <p className="mt-4 text-muted-foreground">Trebuie să fii autentificat pentru a accesa zona de studiu.</p>
        <Button asChild className="mt-6"><Link href="/login?next=/studiu">Autentifică-te</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.section /* ... Hero Section ... */ >
        {/* ... */}
      </motion.section>

      <main className="container py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Pachetele Mele</h2>
          <CreateDeckDialog onDeckCreated={handleDeckCreated} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: decks.length || 3 }).map((_, i) => <DeckSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div /* ... Mesaj de eroare ... */ >
            {/* ... */}
          </div>
        ) : (
          <AnimatePresence>
            {decks.length === 0 ? (
              <motion.div /* ... Mesaj "Niciun pachet" ... */ >
                {/* ... */}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {decks.map((deck) => (
                  <DeckCard key={deck.id} deck={deck} onDelete={handleDeleteDeck} />
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}