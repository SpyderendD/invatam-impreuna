'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Sparkles, Rocket, ArrowRight, Zap, Lock, Star, BrainCircuit, ChevronRight, GraduationCap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomCursor from '@/components/animations/CustomCursor';
import { ConfettiButton } from '@/components/animations/confetti-button';
import HeartRating from '@/components/HeartRating';
import InteractiveHeroIllustration from '@/components/animations/InteractiveHeroIllustration';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const links = {
  romana: '/materii/romana',
  mate: '/materii/matematica',
  info: '/materii/informatica',
  chimie: 'https://www.fizichim.ro/docs/chimie/clasa7/capitolul1-chimia-stiinta-a-naturii/I-1-ce-este-chimia',
  fizica: 'https://www.fizichim.ro/docs/fizica/clasa6/capitolul1-introducere-in-studiul-fizicii/I-1-ce-este-fizica'
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground font-sans">
      <CustomCursor />
      <motion.div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] origin-left bg-primary" style={{ scaleX }} />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 -z-50 opacity-20">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* HERO SECTION (ÎMBUNĂTĂȚITĂ) */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="text-center lg:text-left">
              <motion.div variants={fadeInUp} className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Platformă Next-Gen</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-6xl sm:text-8xl lg:text-[9rem] font-black tracking-[-0.06em] leading-[0.85] uppercase">
                Învață <br /> <span className="italic bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">Inteligent.</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mt-10 mb-12 font-medium">
                Am distilat materia în experiențe interactive moderne. Fără balast, fără timp pierdut. Doar logică și progres real.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
                <Button asChild size="lg" className="h-20 px-12 rounded-full text-xl font-black uppercase shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] hover:scale-105 transition-all">
                  <Link href="/register">Începe Acum <Rocket className="ml-3 w-6 h-6" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-20 px-12 rounded-full text-xl font-black uppercase hover:bg-primary/10 transition-all">
                  <Link href="/#materii">Materii <ArrowRight className="ml-3 w-6 h-6" /></Link>
                </Button>
              </motion.div>
            </motion.div>
            <div className="hidden lg:flex items-center justify-center relative scale-110">
              <InteractiveHeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-32 border-y border-border/30 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: BrainCircuit, title: 'Logică', desc: 'Înțelegi mecanismul din spatele exercițiilor, nu doar formulele.' },
              { icon: Zap, title: 'Viteză', desc: 'Lecții optimizate pentru a învăța mai mult în mai puțin timp.' },
              { icon: Star, title: 'Interactiv', desc: 'Quiz-uri și experiențe create să te țină concentrat și activ.' },
              { icon: Star, title: 'Personalizat', desc: 'Quiz-uri și experiențe create să te țină concentrat și activ.' },
            ].map((f, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="p-12 rounded-[3.5rem] border border-border bg-card shadow-sm group">
                <f.icon className="w-14 h-14 text-primary mb-8 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter">{f.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS (BAC MAPPED TO EN) */}
      <section id="materii" className="py-32">
        <div className="container mx-auto px-6">
          <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic opacity-5 leading-none mb-24">Materii.</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* EN */}
            <div className="p-10 md:p-14 rounded-[4rem] border border-border bg-card shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><GraduationCap size={150} /></div>
              <h4 className="text-[20px] font-black tracking-[0.5em] uppercase text-primary mb-12">Evaluare Națională</h4>
              <div className="space-y-3">
                {[{ n: 'Limba Română', l: links.romana }, { n: 'Matematică', l: links.mate }, { n: 'Informatică', l: links.info }, { n: 'Chimie', l: links.chimie }, { n: 'Fizică', l: links.fizica }].map((m) => (
                  <Link key={m.n} href={m.l} className="flex items-center justify-between p-7 rounded-3xl border border-border bg-muted/30 hover:bg-primary/5 hover:border-primary/30 transition-all group/item">
                    <span className="text-2xl md:text-4xl font-black uppercase tracking-tight">{m.n}</span>
                    <ChevronRight className="text-primary group-hover/item:translate-x-2 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
            {/* BAC */}
            <div className="p-10 md:p-14 rounded-[4rem] border border-border bg-card shadow-xl opacity-90">
              <h4 className="text-[20px] font-black tracking-[0.5em] uppercase text-blue-500 mb-12">Bacalaureat</h4>
              <div className="space-y-3">
                {['Română', 'Matematică'].map((m) => (
                  <div key={m} className="flex items-center justify-between p-7 rounded-3xl border border-border opacity-30 cursor-not-allowed">
                    <span className="text-2xl md:text-4xl font-black uppercase tracking-tight">{m}</span>
                    <Lock size={22} />
                  </div>
                ))}
                {[{ n: 'Informatică', l: links.info }, { n: 'Chimie', l: links.chimie }, { n: 'Fizică', l: links.fizica }].map((m) => (
                  <Link key={m.n} href={m.l} className="flex items-center justify-between p-7 rounded-3xl border border-border bg-muted/30 hover:bg-blue-500/5 hover:border-blue-500/30 transition-all group/item">
                    <span className="text-2xl md:text-4xl font-black uppercase tracking-tight">{m.n}</span>
                    <ChevronRight className="text-blue-500 group-hover/item:translate-x-2 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-40 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="flex justify-center relative">
            <div className="absolute h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px]" />
            <motion.div whileHover={{ scale: 1.02 }} className="relative w-80 h-[450px] md:w-[420px] md:h-[550px] rounded-[4rem] overflow-hidden border-8 border-muted shadow-2xl">
              <Image src="/images/SPY.png" alt="David" fill priority className="object-cover" unoptimized />
            </motion.div>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter italic">&quot;Am făcut asta <br/> pentru noi.&quot;</h2>
            <p className="mt-10 text-xl md:text-2xl leading-relaxed text-muted-foreground font-medium italic">Sunt David. Am creat această platformă pentru că educația merită să pară modernă, logică și captivantă, diferită şi chiar să ajute. Vreau să ajutăm elevii să învețe cu plăcere.</p>
            <div className="mt-12">
              <p className="text-3xl font-black uppercase tracking-tight text-primary">Mera Alin David</p>
              <p className="text-xs uppercase tracking-[0.5em] opacity-40 mt-2">Founder • Lead Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="pb-40 container mx-auto flex flex-col items-center px-6 relative z-10">

        <div
          className="
            mb-32
            text-center
            space-y-12
            p-16
            md:p-24
            rounded-[5rem]
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            w-full
            max-w-4xl
            relative
            overflow-hidden
            shadow-[0_0_80px_rgba(0,0,0,0.45)]
          "
        >

          {/* glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

          <div className="relative z-10">

            <p
              className="
                text-[11px]
                font-black
                uppercase
                tracking-[0.7em]
                text-primary
                opacity-70
              "
            >
              Părerea ta contează
            </p>

            <h3
              className="
                text-4xl
                md:text-7xl
                font-black
                uppercase
                tracking-tighter
                leading-none
              "
            >
              CE NOTĂ NE DAI?
            </h3>

            <div className="flex justify-center py-10 relative">

              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <HeartRating slug="contact-feedback" />
              </motion.div>

              {/* RESET */}
              <button
                onClick={() => {
                  localStorage.removeItem(
                    'heart-rating-contact-feedback'
                  );

                  window.location.reload();
                }}
                className="
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                  opacity-20
                  hover:opacity-100
                  transition-all
                "
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>


        {/* CTA */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/40 transition-all duration-700" />
          <ConfettiButton asChild className="w-80 h-80 md:w-[500px] md:h-[500px] rounded-full bg-foreground text-background shadow-2xl hover:scale-105 transition-transform relative z-10">
            <Link href="/register" className="flex flex-col items-center justify-center p-12">
              <span className="text-6xl md:text-[6rem] font-black tracking-tighter italic uppercase leading-none mb-4">Înscrie-te.</span>
              <span className="text-xs font-black uppercase tracking-[0.5em] opacity-50">Gratuit. Acum și mereu.</span>
            </Link>
          </ConfettiButton>
        </div>
      </section>

      <footer className="py-20 border-t border-border/20 text-center opacity-20 text-xs font-black uppercase tracking-[1.5em]">Învățăm Împreună</footer>
    </div>
  );
}