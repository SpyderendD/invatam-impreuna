'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';

// --- Componente UI ---
import { Button } from '@/components/ui/button';
import CustomCursor from '@/components/animations/CustomCursor';
import { ConfettiButton } from '@/components/animations/confetti-button';
import HeartRating from '@/components/HeartRating';
import InteractiveHeroIllustration from '@/components/animations/InteractiveHeroIllustration'; 

// --- Iconițe ---
import { 
    Code, PenTool, Sparkles, Rocket, ArrowRight, 
    Zap, Lock, Laptop, Calculator, RotateCcw, 
    BrainCircuit, ClipboardCheck, BookOpenCheck, Check, Star, ShieldCheck
} from 'lucide-react'; 

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden font-sans">
      <CustomCursor />
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-[1000] origin-left" style={{ scaleX }} />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="text-center lg:text-left">
              <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                <Sparkles className="w-3 h-3" /> 
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase mb-8">
                Învață <br /> <span className="text-primary italic">Inteligent.</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10">
                Am luat tot continutul de la școală și l-am transformat în lecții interactive și concise și am mai pus și niște unelte folositoare pentru a te ajuta să înveți mai rapid și mai eficient. Fără să pierzi timp căutându-le.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
                <Button asChild size="lg" className="h-16 md:h-20 px-12 text-xl rounded-full shadow-2xl hover:scale-105 transition-all font-bold">
                  <Link href="/register">Vreau să încep <Rocket className="ml-3 w-6 h-6" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 md:h-20 px-12 text-xl rounded-full shadow-2xl hover:scale-105 transition-all font-bold ml-4">
                  <Link href="/#materii">Vezi materiile <ArrowRight className="ml-3 w-6 h-6" /></Link>
                </Button>
              </motion.div>
            </motion.div>
            <div className="hidden lg:flex items-center justify-center relative"><InteractiveHeroIllustration /></div>
          </div>
        </div>
      </section>

      {/* --- SECTION: CE ADUCEM NOU (Diferențierea) --- */}
      <section className="py-24 bg-muted/30">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">Cu ce suntem diferiți?</h2>
            <p className="text-muted-foreground italic text-lg">Toate lectiile la un loc și gratuit.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-sm group hover:border-primary transition-all">
                <BrainCircuit className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Logică, nu memorare</h3>
                <p className="text-muted-foreground leading-relaxed">Te învățăm mecanismul din spatele exercițiilor, ca să știi să rezolvi orice, nu doar să reții un șablon.</p>
            </div>
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-sm group hover:border-primary transition-all">
                <Zap className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Viteză de procesare</h3>
                <p className="text-muted-foreground leading-relaxed">Sintetizăm materia. Ceea ce în clasă durează 2 ore, aici înțelegi în 15 minute prin scheme vizuale.</p>
            </div>
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-sm group hover:border-primary transition-all">
                <Star className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Interactivitate</h3>
                <p className="text-muted-foreground leading-relaxed">Ai quiz-uri rapide, flashcard-uri, monitorizare a progresului și multe alte resurse. Înveți jucându-te.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MATERII SECTION --- */}
      <section id="materii" className="py-24">
        <div className="container px-6">
          <div className="mb-16">
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic opacity-1">Materiile.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="p-8 md:p-12 rounded-[3rem] border border-border bg-card">
              <h4 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-95 mb-10 text-primary">Evaluare Națională</h4>
              <div className="space-y-4">
                {['Limba Română'].map((m) => (
                  <Link key={m} href="/materii/romana" className="flex items-center justify-between py-6 border-b border-border group">
                    <span className="text-2xl md:text-4xl font-bold tracking-tighter group-hover:translate-x-2 transition-transform uppercase">{m}</span>
                    <ArrowRight className="opacity-20 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
                {['Matematică'].map((m) => (
                  <Link key={m} href="/materii/matematica" className="flex items-center justify-between py-6 border-b border-border group">
                    <span className="text-2xl md:text-4xl font-bold tracking-tighter group-hover:translate-x-2 transition-transform uppercase">{m}</span>
                    <ArrowRight className="opacity-20 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
                {['Informatică'].map((m) => (
                  <Link key={m} href="/materii/informatica" className="flex items-center justify-between py-6 border-b border-border group">
                    <span className="text-2xl md:text-4xl font-bold tracking-tighter group-hover:translate-x-2 transition-transform uppercase">{m}</span>
                    <ArrowRight className="opacity-20 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
                {['Chimie'].map((m) => (
                  <Link key={m} href="https://www.fizichim.ro/docs/chimie/clasa7/capitolul1-chimia-stiinta-a-naturii/I-1-ce-este-chimia" className="flex items-center justify-between py-6 border-b border-border group">
                    <span className="text-2xl md:text-4xl font-bold tracking-tighter group-hover:translate-x-2 transition-transform uppercase">{m}</span>
                    <ArrowRight className="opacity-20 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
                {['Fizică'].map((m) => (
                  <Link key={m} href="https://www.fizichim.ro/docs/fizica/clasa6/capitolul1-introducere-in-studiul-fizicii/I-1-ce-este-fizica" className="flex items-center justify-between py-6 border-b border-border group">
                    <span className="text-2xl md:text-4xl font-bold tracking-tighter group-hover:translate-x-2 transition-transform uppercase">{m}</span>
                    <ArrowRight className="opacity-20 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-8 md:p-12 rounded-[3rem] border border-border bg-card opacity-60">
              <h4 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-100 mb-10 text-primary">Bacalaureat</h4>
              <div className="space-y-4">
                {['Română', 'Matematică'].map((m) => (
                  <div key={m} className="flex items-center justify-between py-6 border-b border-border opacity-50">
                    <span className="text-2xl md:text-4xl font-bold tracking-tighter uppercase">{m}</span>
                    <Lock size={18} />
                  </div>
                ))}
                {['Informatică'].map((m) => (
                  <Link key={m} href="/materii/informatica" className="flex items-center justify-between py-6 border-b border-border group">
                    <span className="text-2xl md:text-4xl font-bold tracking-tighter group-hover:translate-x-2 transition-transform uppercase">{m}</span>
                    <ArrowRight className="opacity-20 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
                {['Chimie'].map((m) => (
                  <Link key={m} href="https://www.fizichim.ro/docs/chimie/clasa7/capitolul1-chimia-stiinta-a-naturii/I-1-ce-este-chimia" className="flex items-center justify-between py-6 border-b border-border group">
                    <span className="text-2xl md:text-4xl font-bold tracking-tighter group-hover:translate-x-2 transition-transform uppercase">{m}</span>
                    <ArrowRight className="opacity-20 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
                {['Fizică'].map((m) => (
                  <Link key={m} href="https://www.fizichim.ro/docs/fizica/clasa6/capitolul1-introducere-in-studiul-fizicii/I-1-ce-este-fizica" className="flex items-center justify-between py-6 border-b border-border group">
                    <span className="text-2xl md:text-4xl font-bold tracking-tighter group-hover:translate-x-2 transition-transform uppercase">{m}</span>
                    <ArrowRight className="opacity-20 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION: EU (REPARAT IMAGINEA) --- */}
      <section className="py-32 container px-6 flex flex-col items-center">
        <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-8 border-muted shadow-2xl">
                    <Image 
                      src="/images/SPY.jpeg"
                      alt="David" 
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      priority
                    />
                </div>
            </div>
            <div className="text-center lg:text-left space-y-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic">&quot;Am făcut asta pentru noi.&quot;</h2>
                <p className="text-lg text-muted-foreground font-medium italic">
                    Sunt David, fondatorul platformei și elev la rândul meu. Știu cum e să te simți pierdut printre manuale. De aceea, am creat acest loc unde materia are logică și învățatul nu e o povară.
                </p>
                <div className="pt-4">
                    <p className="font-bold text-xl uppercase tracking-widest text-primary">Mera Alin David </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA FINAL & FEEDBACK (REPARAT ALINIEREA) --- */}
      <section className="pb-40 container flex flex-col items-center px-6">
        <div className="mb-20 text-center space-y-8 p-12 rounded-[4rem] border border-border bg-card w-full max-w-3xl relative overflow-hidden">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Vrem să știm ce crezi:</p>
           
           {/* Containere forțate să rămână pe o singură linie */}
           <div className="flex flex-col items-center justify-center w-full">
              <div className="w-full overflow-hidden flex justify-center py-4">
                 <div className="flex flex-nowrap items-center justify-center">
                    <HeartRating slug="contact-feedback" />
                 </div>
              </div>
           </div>

           <button onClick={() => {}} className="absolute bottom-6 right-6 opacity-[0.02] hover:opacity-100 transition-opacity"><RotateCcw size={12} /></button>
        </div>

        <ConfettiButton asChild size="lg" className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-foreground text-background shadow-2xl group transition-transform hover:scale-105 active:scale-95">
            <Link href="/register" className="flex flex-col items-center justify-center gap-4">
                <span className="text-5xl md:text-7xl font-black tracking-tighter italic">Înscrie-te.</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Gratuit, pentru totdeauna</span>
            </Link>
        </ConfettiButton>
      </section>
    </div>
  );
}