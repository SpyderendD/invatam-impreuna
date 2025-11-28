// app/studiu/[deckId]/sesiune/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/components/study/Flashcard';
import { Timer } from '@/components/study/Timer';
import { Check, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FlashcardData {
  id: string;
  front: string;
  back: string;
}

export default function StudySessionPage({ params }: { params: { deckId: string } }) {
  const { user } = useAuth();
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionState, setSessionState] = useState<'setup' | 'studying' | 'finished'>('setup');
  const [studyTime, setStudyTime] = useState(15); // Timp default: 15 minute

 useEffect(() => {
    if (!user) return;
    
    const fetchCards = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/study/decks/${params.deckId}/cards`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json(); 

        if (!response.ok) {
          throw new Error(data.error || 'Nu am putut prelua cardurile.');
        }
        setCards(data.sort(() => Math.random() - 0.5)); 

      } catch (err: any) {
        console.error("A apărut o eroare la preluarea cardurilor:", err);
    
      }
    };

    fetchCards();
  }, [user, params.deckId]);
  
  const nextCard = () => {
    if(currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
    } else {
        setSessionState('finished');
    }
  };

  const handleSessionComplete = () => {
    alert("Sesiune terminată!");
    setSessionState('finished');
  }

  const card = cards[currentCardIndex];

  if (sessionState === 'setup') {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center">
             <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
                <h1 className="text-4xl font-bold mb-4">Pregătește Sesiunea</h1>
                <p className="text-muted-foreground mb-8">Setează durata și începe să înveți.</p>
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Durata (minute):</label>
                    <input type="number" value={studyTime} onChange={e => setStudyTime(Number(e.target.value))} placeholder="Introduceți durata în minute" className="w-40 text-center p-2 border rounded-md" />
                </div>
                <Button size="lg" onClick={() => setSessionState('studying')} disabled={cards.length === 0}>
                    {cards.length > 0 ? `Începe Sesiunea (${cards.length} carduri)` : 'Se încarcă cardurile...'}
                </Button>
                <Button asChild variant="link" className="block mx-auto mt-4">
                    <Link href={`/studiu/${params.deckId}`}><ArrowLeft className="mr-2 h-4 w-4" /> Editează Pachetul</Link>
                </Button>
            </motion.div>
        </div>
    )
  }
  
  if (sessionState === 'finished') {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center">
            <motion.div initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}}>
                <h1 className="text-4xl font-bold mb-4">Felicitări! 🎉</h1>
                <p className="text-muted-foreground mb-8">Ai terminat sesiunea de studiu. Continuă tot așa!</p>
                <div className="flex gap-4">
                    <Button onClick={() => { setCurrentCardIndex(0); setSessionState('setup'); }}>Altă Sesiune</Button>
                    <Button asChild variant="outline"><Link href="/studiu">Înapoi la Pachete</Link></Button>
                </div>
            </motion.div>
        </div>
    )
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