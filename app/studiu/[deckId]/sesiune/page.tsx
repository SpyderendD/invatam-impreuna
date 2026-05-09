// app/studiu/[deckId]/sesiune/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/components/study/Flashcard';
import { Timer } from '@/components/study/Timer';
import { useNotifications } from '@/hooks/useNotifications'; // Refolosim hook-ul tău!
import { Check, X, ArrowLeft, BellRing } from 'lucide-react';
import Link from 'next/link';

interface FlashcardData {
  id: string;
  front: string;
  back: string;
}

export default function StudySessionPage({ params }: { params: { deckId: string } }) {
  const { user, loading: authLoading } = useAuth();
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionState, setSessionState] = useState<'setup' | 'studying' | 'finished'>('setup');
  const [studyTime, setStudyTime] = useState(15);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  // Hook-ul pentru notificări
  const { permission, requestPermission, sendNotification } = useNotifications();

  const fetchCards = useCallback(async () => {
    if (!user) return;
    setIsLoadingCards(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/study/decks/${params.deckId}/cards`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Nu am putut prelua cardurile.');
      }
      // Amestecăm cardurile pentru o sesiune random
      setCards(data.sort(() => Math.random() - 0.5));
    } catch (err) {
      console.error("A apărut o eroare la preluarea cardurilor:", err);
    } finally {
      setIsLoadingCards(false);
    }
  }, [user, params.deckId]);

  useEffect(() => {
    if (user) {
      fetchCards();
    }
  }, [user, fetchCards]);

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      handleSessionComplete(); // Apelăm funcția de finalizare când nu mai sunt carduri
    }
  };

  const handleSessionComplete = useCallback(() => {
    // Trimitem o notificare de browser
    sendNotification("Sesiune de studiu finalizată!", {
      body: "Felicitări! Ai terminat sesiunea. Ia o pauză binemeritată.",
      tag: `session-complete-${params.deckId}`, // Un tag unic pentru a preveni duplicatele
    });
    setSessionState('finished');
  }, [sendNotification, params.deckId]);


  if (authLoading) {
    return <div className="flex h-screen items-center justify-center">Se încarcă...</div>;
  }
  if (!user) {
    // Redirecționare sau mesaj de login
    return <div className="container py-20 text-center">Trebuie să fii autentificat.</div>;
  }

  const card = cards[currentCardIndex];

  if (sessionState === 'setup') {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-4">Pregătește Sesiunea</h1>
          <p className="text-muted-foreground mb-8">Setează durata și începe să înveți.</p>
          
          {permission === 'default' && (
            <div className="mb-6 rounded-lg border bg-amber-50 border-amber-200 p-4 max-w-md mx-auto">
              <p className="text-sm text-amber-800">
                Vrei să primești o notificare audio și vizuală când se termină timpul?
              </p>
              <Button variant="link" className="mt-2 text-amber-900 h-auto p-0" onClick={requestPermission}>
                <BellRing className="mr-2 h-4 w-4" /> Activează notificările
              </Button>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="study-duration" className="block mb-2 font-medium">Durata (minute):</label>
            <input
              id="study-duration"
              type="number"
              value={studyTime}
              onChange={e => setStudyTime(Number(e.target.value))}
              className="w-40 text-center p-2 border rounded-md"
            />
          </div>
          <Button size="lg" onClick={() => setSessionState('studying')} disabled={isLoadingCards || cards.length === 0}>
            {isLoadingCards ? 'Se încarcă cardurile...' : `Începe Sesiunea (${cards.length} carduri)`}
          </Button>
          <Button asChild variant="link" className="block mx-auto mt-4">
            <Link href={`/studiu/${params.deckId}`}><ArrowLeft className="mr-2 h-4 w-4" /> Editează Pachetul</Link>
          </Button>
        </motion.div>
      </div>
    );
  }
  
  if (sessionState === 'finished') {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <h1 className="text-4xl font-bold mb-4">Felicitări! 🎉</h1>
          <p className="text-muted-foreground mb-8">Ai terminat sesiunea de studiu. Continuă tot așa!</p>
          <div className="flex gap-4">
            <Button onClick={() => { setCurrentCardIndex(0); fetchCards(); setSessionState('setup'); }}>Altă Sesiune</Button>
            <Button asChild variant="outline"><Link href="/studiu">Înapoi la Pachete</Link></Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-10 flex flex-col items-center">
      <Timer initialMinutes={studyTime} onComplete={handleSessionComplete} />
      <p className="text-muted-foreground mt-2 mb-8">Cardul {currentCardIndex + 1} din {cards.length}</p>

      <div className="w-full max-w-2xl h-64 md:h-80 mb-8">
        <AnimatePresence mode="wait">
          {card && (
            <motion.div
              key={card.id}
              className="w-full h-full"
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -300, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <Flashcard front={card.front} back={card.back} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Click pe card pentru a-l roti.</p>

      <div className="flex items-center gap-4">
        <Button variant="destructive" size="lg" onClick={nextCard}><X className="mr-2" /> Nu am știut</Button>
        <Button variant="default" size="lg" className="bg-green-600 hover:bg-green-700" onClick={nextCard}><Check className="mr-2" /> Am știut</Button>
      </div>
    </div>
  );
}