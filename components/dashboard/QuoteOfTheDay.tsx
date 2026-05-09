// components/dashboard/QuoteOfTheDay.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Definirea tipului pentru datele primite de la API
interface QuoteData {
  content: string;
  author: string;
  tags: string[];
}

interface StoredQuote {
  data: QuoteData;
  date: string; // Data la care a fost salvat citatul (ex: '2024-11-29')
}

export function QuoteOfTheDay() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0]; // Ia data de azi în format YYYY-MM-DD
      
      try {
        // Verificăm dacă avem deja un citat salvat pentru ziua de azi
        const storedQuoteJSON = localStorage.getItem('quoteOfTheDay');
        if (storedQuoteJSON) {
          const storedQuote: StoredQuote = JSON.parse(storedQuoteJSON);
          if (storedQuote.date === today && storedQuote.data) {
            setQuote(storedQuote.data);
            setIsLoading(false);
            return; // Oprim execuția, avem deja citatul
          }
        }

        // Dacă nu avem citat salvat, apelăm API-ul
        // Vom căuta citate cu tag-ul 'education' sau 'wisdom'
        const response = await fetch('https://api.quotable.io/random?tags=education|wisdom');
        if (!response.ok) {
          throw new Error('Nu am putut prelua citatul.');
        }
        const data: QuoteData = await response.json();

        // Salvăm noul citat și data în localStorage
        const newStoredQuote: StoredQuote = { data, date: today };
        localStorage.setItem('quoteOfTheDay', JSON.stringify(newStoredQuote));
        
        setQuote(data);

      } catch (error) {
        console.error("Eroare la preluarea citatului:", error);
        setQuote({
            content: "Educația este cea mai puternică armă pe care o poți folosi pentru a schimba lumea.",
            author: "Nelson Mandela",
            tags: ["fallback"]
        }); // Un citat de rezervă în caz de eroare
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, []); // Rulează o singură dată la montarea componentei

  if (isLoading) {
    return (
        <div className="space-y-3 rounded-lg border bg-card p-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/4 ml-auto" />
        </div>
    );
  }

  if (!quote) return null;

  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-lg border bg-card p-4"
    >
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 flex-shrink-0 text-amber-500 mt-1" />
        <div>
            <blockquote className="relative border-l-2 border-amber-500 pl-4">
                <p className="text-base font-medium text-foreground italic">{`"${quote.content}"`}</p>
            </blockquote>
            <p className="mt-2 text-right text-sm font-semibold text-muted-foreground">— {quote.author}</p>
        </div>
      </div>
    </motion.div>
  );
}