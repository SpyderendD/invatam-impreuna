// app/blog/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoCard } from '@/components/blog/VideoCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Sparkles, Youtube } from 'lucide-react';
import Link from 'next/link';

// --- Tipuri de date ---
interface YouTubeVideo {
  id: { videoId: string };
  snippet: { title: string };
}

// --- Animații ---
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// --- Componenta Skeleton (pentru loading) ---
const VideoCardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[150px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <Skeleton className="h-9 w-32 rounded-md" />
  </div>
);

// --- Componenta principală a paginii ---
export default function BlogPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestVideos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/youtube');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'A apărut o eroare necunoscută.');
      }
      
      if (!data.items || data.items.length === 0) {
        setError("Nu am găsit videouri recente. Te rugăm să încerci mai târziu.");
      } else {
        setVideos(data.items);
      }

    } catch (err: any) {
      setError(`A apărut o problemă la încărcarea videourilor: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestVideos();
  }, [fetchLatestVideos]);

  return (
    <>
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden bg-primary/5 py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container relative z-10">
          <motion.h1 variants={fadeIn} initial="hidden" animate="visible" className="font-lora text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Resurse Video Educative
          </motion.h1>
          <motion.p variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Explorează cele mai recente materiale video de pe canalul Spyderend, create pentru a te ajuta să înveți eficient și să excelezi.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content Section */}
      <main className="container py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Cele Mai Recente</h2>
          <Button onClick={fetchLatestVideos} disabled={isLoading} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Se încarcă...' : 'Actualizează'}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {Array.from({ length: 4 }).map((_, i) => <VideoCardSkeleton key={i} />)}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/5 p-12 text-center text-destructive"
            >
              <AlertCircle className="mb-4 h-12 w-12" />
              <h3 className="text-xl font-semibold">Oops! A apărut o eroare</h3>
              <p className="mt-2 max-w-md text-sm">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key="videos"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {videos.map((video, index) => (
                <VideoCard key={video.id.videoId} videoId={video.id.videoId} title={video.snippet.title} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action Section */}
        <motion.section 
          variants={fadeIn} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.5 }}
          className="mt-20"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white md:p-12">
            <div className="relative z-10 text-center">
              <Youtube className="mx-auto mb-4 h-12 w-12 opacity-80" />
              <h2 className="text-3xl font-bold text-white">Nu rata noile materiale!</h2>
              <p className="mx-auto mt-2 max-w-lg opacity-90">
                Apasă butonul de mai jos pentru a te abona direct pe YouTube și a fi la curent cu toate noutățile.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-6">
                <a href="https://www.youtube.com/channel/UCge2BVDGytK1o_OLwZadUEA?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Abonează-te la Canal
                </a>
              </Button>
            </div>
          </div>
        </motion.section>

      </main>
    </>
  );
}