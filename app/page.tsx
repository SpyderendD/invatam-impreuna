'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Sparkles, 
  Rocket, 
  ArrowRight, 
  Zap, 
  Lock, 
  Star, 
  BrainCircuit, 
  ChevronRight, 
  GraduationCap,
  Flame,
  Compass,
  TrendingUp,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Lightbulb,
  Shield,
  Target,
  Award,
  BookMarked,
  BarChart3,
  HeartHandshake,
  BookOpen,
  Code2,
  Atom,
  Binary
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfettiButton } from '@/components/animations/confetti-button';
import HeartRating from '@/components/HeartRating';
import InteractiveHeroIllustration from '@/components/animations/InteractiveHeroIllustration';
import BlurText from '@/components/animations/BlurText';
import ScrollExpand from '@/components/animations/ScrollExpand';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } 
  }
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
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Modal Admin pentru resetare notă
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/rating?slug=home-feedback', {
        method: 'DELETE',
        headers: {
          'x-admin-secret': password.trim(),
        },
      });

      if (res.ok) {
        localStorage.removeItem('heart-rating-home-feedback');
        localStorage.removeItem('heart-rating-contact-feedback');
        setIsAdminOpen(false);
        window.location.reload();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Parolă incorectă!');
      }
    } catch {
      setErrorMsg('Eroare de conexiune la server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* Setare z-index pentru footerul global */}
      <style>{`
        footer {
          position: relative !important;
          z-index: 50 !important;
          pointer-events: auto !important;
        }
        .content-auto {
          content-visibility: auto;
          contain-intrinsic-size: 700px;
        }
      `}</style>

      {/* Bară scroll neon optimizată */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-[9999] h-[3px] origin-left bg-gradient-to-r from-primary via-cyan-400 to-indigo-500 pointer-events-none transform-gpu shadow-[0_0_12px_rgba(var(--primary-rgb,59,130,246),0.5)]" 
        style={{ scaleX }} 
      />

      {/* AMBIENT LIGHTS OPTIMIZATE (GPU Native, 0 lag) */}
      <div className="fixed inset-0 -z-50 opacity-25 pointer-events-none transform-gpu overflow-hidden">
        <div 
          className="absolute left-1/2 -top-28 h-[680px] w-[680px] -translate-x-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(var(--primary-rgb, 59, 130, 246), 0.28) 0%, transparent 68%)'
          }}
        />
        <div 
          className="absolute -right-24 top-1/3 h-[520px] w-[520px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, transparent 70%)'
          }}
        />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center pt-24 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }} 
              className="text-center lg:text-left lg:col-span-7"
            >
              {/* Badge Top */}
              <motion.div variants={fadeInUp} className="mb-6 sm:mb-8 inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/[0.08] backdrop-blur-md shadow-[0_0_20px_rgba(var(--primary-rgb,59,130,246),0.12)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.35em] text-primary">
                  Proiect Independent • 100% Gratuit
                </span>
              </motion.div>

              {/* Titlu Masiv */}
              <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl lg:text-8xl xl:text-[8.5rem] font-black tracking-[-0.05em] leading-[0.88] uppercase">
                Învață <br /> 
                <span className="italic bg-gradient-to-r from-primary via-sky-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(var(--primary-rgb,59,130,246),0.25)]">
                  Inteligent.
                </span>
              </motion.h1>

              {/* Descriere animată cu BlurText */}
              <motion.div variants={fadeInUp} className="max-w-2xl mx-auto lg:mx-0 mt-6 sm:mt-8 mb-8 sm:mb-10 font-normal leading-relaxed text-base sm:text-xl lg:text-2xl text-muted-foreground min-h-[5rem]">
                <BlurText
                  text="Învață inteligent. Dezvoltă abilități practice prin experiențe interactive moderne. Fără teorie de umplutură, fără timp pierdut. Doar logică și progres real."
                  effect="blur"
                  animateBy="words"
                  direction="top"
                  trigger="view"
                  startDelay={800}
                  delay={75}
                  stepDuration={0.3}
                  blur={12}
                  distance={25}
                  className="inline"
                />
              </motion.div>

              {/* Cluster Butoane */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3.5 sm:gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="h-16 sm:h-18 px-8 sm:px-10 rounded-full text-base sm:text-lg font-black uppercase shadow-[0_0_30px_rgba(var(--primary-rgb,59,130,246),0.35)] hover:shadow-[0_0_45px_rgba(var(--primary-rgb,59,130,246),0.55)] hover:scale-[1.02] active:scale-95 transition-all transform-gpu"
                >
                  <Link href="/register">Începe Acum <Rocket className="ml-2.5 w-5 h-5 sm:w-6 sm:h-6" /></Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="h-16 sm:h-18 px-7 sm:px-9 rounded-full text-base sm:text-lg font-black uppercase border-border/70 hover:bg-muted/40 hover:border-primary/40 transition-all"
                >
                  <Link href="/#materii">Materii <ArrowRight className="ml-2.5 w-5 h-5" /></Link>
                </Button>

                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="h-16 sm:h-18 px-7 sm:px-9 rounded-full text-base sm:text-lg font-black uppercase border-primary/30 bg-primary/[0.04] hover:bg-primary/[0.1] hover:border-primary/60 transition-all"
                >
                  <Link href="/#skills">Skill-uri <Compass className="ml-2.5 w-5 h-5 text-primary" /></Link>
                </Button>
              </motion.div>

              {/* Indicatori de încredere */}
              <motion.div variants={fadeInUp} className="mt-12 pt-8 border-t border-border/40 flex items-center justify-center lg:justify-start gap-8 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Fără reclame</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Explicații logice</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>În ritmul tău</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Ilustrația Hero */}
            <div className="hidden lg:flex items-center justify-center relative scale-105 transform-gpu lg:col-span-5">
              <InteractiveHeroIllustration />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MATERII - PUSE DIRECT SUS DUPĂ HERO */}
      {/* ========================================================================= */}
      <section id="materii" className="py-20 sm:py-28 border-t border-border/40 content-auto relative">
        <div className="container mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-2">Programă Școlară Oficială</p>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">Alege Materia</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Conținut condensat și structurat pe logică, pregătit special pentru examene.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* EVALUARE NAȚIONALĂ */}
            <div className="p-7 sm:p-10 rounded-[3rem] border border-border/80 bg-card/80 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-emerald-500">
                <GraduationCap size={150} />
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="text-sm sm:text-base font-black tracking-[0.35em] uppercase text-foreground">
                    Evaluare Națională
                  </h4>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Clasele VII - VIII
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { n: 'Limba Română', sub: 'Gramatică, text la prima vedere și compuneri', l: links.romana, icon: BookOpen }, 
                  { n: 'Matematică', sub: 'Algebră, geometrie plană și în spațiu', l: links.mate, icon: Binary }, 
                  { n: 'Informatică', sub: 'Algoritmică, C++ și gândire computațională', l: links.info, icon: Code2 }, 
                  { n: 'Chimie', sub: 'Reacții, tabelul periodic și calcule chimice', l: links.chimie, icon: Atom }, 
                  { n: 'Fizică', sub: 'Mecanică, optică, fenomene termice și electrice', l: links.fizica, icon: Zap }
                ].map((m) => (
                  <Link 
                    key={m.n} 
                    href={m.l} 
                    className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-border/60 bg-muted/20 hover:bg-emerald-500/[0.08] hover:border-emerald-500/40 transition-all group/item"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform">
                        <m.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-lg sm:text-xl font-black uppercase tracking-tight block">{m.n}</span>
                        <span className="text-xs text-muted-foreground">{m.sub}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-emerald-500 group-hover/item:translate-x-1.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            {/* BACALAUREAT */}
            <div className="p-7 sm:p-10 rounded-[3rem] border border-border/80 bg-card/80 backdrop-blur-md shadow-lg hover:border-blue-500/40 transition-colors">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <h4 className="text-sm sm:text-base font-black tracking-[0.35em] uppercase text-foreground">
                    Bacalaureat
                  </h4>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Clasele IX - XII
                </span>
              </div>

              <div className="space-y-3">
                {['Română (Eseuri)', 'Matematică (M1 / M2)'].map((m) => (
                  <div key={m} className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-border/40 opacity-40 cursor-not-allowed">
                    <div>
                      <span className="text-lg sm:text-xl font-black uppercase tracking-tight block">{m}</span>
                      <span className="text-xs text-muted-foreground">În curs de actualizare pentru sesiunea curentă</span>
                    </div>
                    <Lock size={18} />
                  </div>
                ))}
                {[
                  { n: 'Informatică', sub: 'Grafuri, recursivitate și algoritmi avansați', l: links.info, icon: Code2 }, 
                  { n: 'Chimie', sub: 'Chimie organică și anorganică pentru BAC', l: links.chimie, icon: Atom }, 
                  { n: 'Fizică', sub: 'Termodinamică, electricitate și mecanică avansată', l: links.fizica, icon: Zap }
                ].map((m) => (
                  <Link 
                    key={m.n} 
                    href={m.l} 
                    className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-border/60 bg-muted/20 hover:bg-blue-500/[0.08] hover:border-blue-500/40 transition-all group/item"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover/item:scale-110 transition-transform">
                        <m.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-lg sm:text-xl font-black uppercase tracking-tight block">{m.n}</span>
                        <span className="text-xs text-muted-foreground">{m.sub}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-500 group-hover/item:translate-x-1.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABILITĂȚI PENTRU VIAȚĂ (SKILLS HUB) */}
      {/* ========================================================================= */}
      <section id="skills" className="py-24 sm:py-32 border-t border-border/40 bg-muted/15 content-auto">
        <div className="container mx-auto px-4 sm:px-6">
          
          <div className="max-w-3xl mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/10 backdrop-blur-sm shadow-sm mb-4">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.35em] text-primary">
                Competențe Reale • Dincolo de Școală
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-6">
              Abilități Pentru <span className="bg-gradient-to-r from-primary via-sky-400 to-indigo-400 bg-clip-text text-transparent">Viață.</span>
            </h2>

            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
              Dezvoltă abilități practice prin experiențe interactive moderne. Fără teorie de umplutură, fără timp pierdut. Doar logică și progres real.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                tag: 'Finanțe',
                title: 'Educație Financiară',
                desc: 'Cum funcționează banii, investițiile timpurii, economisirea și inflația, fără jargon bancar.',
                href: '/abilitati/educatie-financiara', // LINK DIRECT CĂTRE PAGINĂ
                isHighlight: true
              },
              {
                icon: BrainCircuit,
                tag: 'Gândire & AI',
                title: 'Gândire Critică & AI',
                desc: 'Învață să folosești instrumentele AI în avantajul tău, să scrii prompturi bune și să filtrezi știrile false.',
                href: '#skills'
              },
              {
                icon: MessageSquare,
                tag: 'Comunicare',
                title: 'Public Speaking',
                desc: 'Depășește emoțiile, structurează argumente solide și vorbește convingător în fața oricărui public.',
                href: '#skills'
              },
              {
                icon: Clock,
                tag: 'Productivitate',
                title: 'Managementul Timpului',
                desc: 'Blocuri de concentrare profundă (Deep Work), prioritizare clară și scăparea definitivă de procrastinare.',
                href: '#skills'
              },
              {
                icon: HeartHandshake,
                tag: 'Mindset',
                title: 'Control Emoțional',
                desc: 'Gestionarea stresului și a fricii de eșec în timpul examenelor, reziliență și atitudine calmă.',
                href: '#skills'
              },
              {
                icon: Shield,
                tag: 'Securitate',
                title: 'Siguranță Digitală',
                desc: 'Protejarea conturilor, identității online, confidențialitatea datelor și evitarea fraudelor de pe internet.',
                href: '#skills'
              },
              {
                icon: Lightbulb,
                tag: 'Creativitate',
                title: 'Rezolvare de Probleme',
                desc: 'Deconstruirea provocărilor grele în pași simpli și găsirea soluțiilor inventive din unghiuri neașteptate.',
                href: '#skills'
              },
              {
                icon: Target,
                tag: 'Inițiativă',
                title: 'Antreprenoriat',
                desc: 'Cum transformi o idee într-un proiect funcțional, leadership de echipă și gândire orientată pe rezultate.',
                href: '#skills'
              }
            ].map((skill, idx) => (
              <Link
                key={idx}
                href={skill.href}
                className={`group relative p-7 sm:p-8 rounded-[2.5rem] border backdrop-blur-md shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 transform-gpu flex flex-col justify-between ${
                  skill.isHighlight 
                    ? 'border-emerald-500/40 bg-card/90 hover:border-emerald-500/70 hover:shadow-emerald-500/10' 
                    : 'border-border/80 bg-card/85 hover:border-primary/50 hover:shadow-primary/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-all duration-300 ${
                      skill.isHighlight 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20' 
                        : 'bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20'
                    }`}>
                      <skill.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                      skill.isHighlight
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-muted/60 text-muted-foreground border-border/40'
                    }`}>
                      {skill.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black uppercase mb-3 tracking-tight">
                    {skill.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {skill.desc}
                  </p>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-opacity ${
                  skill.isHighlight 
                    ? 'border-emerald-500/20 text-emerald-400 opacity-90 group-hover:opacity-100' 
                    : 'border-border/40 text-primary opacity-80 group-hover:opacity-100'
                }`}>
                  <span>{skill.isHighlight ? 'Deschide Modulul' : 'Ghid Practic'}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. UNELTE UTILE */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 border-t border-border/40 bg-muted/10 content-auto">
        <div className="container mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-2">Instrumente Utile</p>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">Unelte de Studiu</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Mici unelte create să-ți facă sesiunile de studiu mai ușoare și mai plăcute.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BarChart3,
                name: 'Subiecte de Antrenament',
                info: 'Exersezi pe modele de examen cu rezolvări pas cu pas și explicații pe înțelesul tău.'
              },
              {
                icon: BookMarked,
                name: 'Flashcard-uri',
                info: 'Carduri scurte pentru a repeta definițiile și formulele cheie fără stres.'
              },
              {
                icon: Clock,
                name: 'Timer de Concentrare',
                info: 'Sesiuni scurte de focus (tehnica Pomodoro) ca să nu obosești și să ai timp liber.'
              },
              {
                icon: Award,
                name: 'Sinteze Esențiale',
                info: 'Scheme curate pe o singură pagină cu esența materiei, ideale înainte de orice test.'
              }
            ].map((tool, i) => (
              <div 
                key={i}
                className="p-8 rounded-[2.5rem] border border-border/80 bg-card/85 backdrop-blur-md hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tool.info}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CUM ABORDĂM ÎNVĂȚAREA (3 PAȘI) */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 border-t border-border/40 content-auto">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Abordare Simplă</span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mt-2">Cum Învățăm Aici</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Vezi unde te împotmolești',
                desc: 'Teste scurte care îți arată direct noțiunile care îți pun probleme, fără să pierzi vremea cu ce știi deja.'
              },
              {
                step: '02',
                title: 'Înțelegi logica din spate',
                desc: 'Explicații condensate și exemple practice. Fără memorat pagini întregi pe de rost.'
              },
              {
                step: '03',
                title: 'Exersezi fără teamă',
                desc: 'Simulări fără notare punitivă. Înveți din greșeli într-un spațiu sigur și capeți încredere.'
              }
            ].map((p, idx) => (
              <div 
                key={idx}
                className="relative p-8 sm:p-10 rounded-[3rem] border border-border/70 bg-card/70 backdrop-blur-sm hover:border-primary/40 transition-colors"
              >
                <span className="text-5xl sm:text-6xl font-black italic text-primary/20 block mb-6">{p.step}</span>
                <h3 className="text-2xl font-black uppercase mb-3 tracking-tight">{p.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PRINCIPIILE PLATFORMEI */}
      {/* ========================================================================= */}
      <section className="py-16 border-t border-border/40 bg-muted/15 content-auto">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: 'În ritmul tău',
                desc: 'Fără presiune sau comparații. Înveți când vrei, reiei lecția de câte ori ai nevoie.',
              },
              {
                icon: CheckCircle2,
                title: '100% Deschis & Liber',
                desc: 'Fără conturi plătite sau conținut blocat. Toate resursele sunt accesibile tuturor.',
              },
              {
                icon: HeartHandshake,
                title: 'De la elev la elev',
                desc: 'Creat din experiența reală de învățare, nu din birourile vreunei companii.',
              },
              {
                icon: Lightbulb,
                title: 'Fiecare învață ceva',
                desc: 'Indiferent de unde pornești, fiecare temă este explicată pe o logică simplă și clară.',
              },
            ].map((p, i) => (
              <div 
                key={i} 
                className="flex items-start gap-4 p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary mt-0.5">
                  <p.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black uppercase tracking-tight">{p.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SCROLL EXPAND - POZA LUI DAVID 100% COMPLETĂ */}
      {/* ========================================================================= */}
      <section className="relative w-full border-t border-border/40">
        <ScrollExpand
          src="/images/SPY.png"
          alt="Mera Alin David"
          title="Învățăm Împreună"
          scrollHint="Derulează pentru poveste"
          useWindowScroll={true}
          startWidth={42}
          startHeight={58}
          startRadius={32}
          endRadius={0}
          mediaZoom={1.0}
          scrollDistance={1.6}
          holdDistance={0.8}
          smoothing={0.1}
        >
          <div className="max-w-2xl text-center p-6 sm:p-8 rounded-3xl bg-zinc-950/85 backdrop-blur-md border border-white/10 shadow-2xl mx-4 mb-4">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mb-3 text-white">
              &quot;Am făcut asta pentru noi.&quot;
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              Sunt David. Am creat această platformă pentru că educația merită să pară modernă, logică și captivantă. Vreau să ajutăm fiecare elev să învețe cu plăcere și încredere.
            </p>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center justify-center gap-1.5">
              Mera Alin David <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </p>
          </div>
        </ScrollExpand>
      </section>

      {/* ========================================================================= */}
      {/* 8. FEEDBACK & CTA SECTION */}
      {/* ========================================================================= */}
      <section className="py-28 container mx-auto flex flex-col items-center px-4 sm:px-6 relative z-10 content-auto">
        
        {/* Card Feedback */}
        <div className="mb-20 sm:mb-24 text-center space-y-7 sm:space-y-9 p-8 sm:p-14 md:p-18 rounded-[3.5rem] border border-border/80 bg-card/85 backdrop-blur-md w-full max-w-3xl relative overflow-hidden shadow-xl">
          
          <div className="relative z-10">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.5em] text-primary opacity-80 mb-2">
              Părerea ta contează
            </p>

            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-4">
              CE NOTĂ NE DAI?
            </h3>

            <div className="flex justify-center items-center py-3 relative">
              <HeartRating slug="home-feedback" />
            </div>
          </div>

          {/* Trigger Admin Camuflat */}
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setPassword('');
              setIsAdminOpen(true);
            }}
            className="absolute bottom-4 right-5 opacity-5 hover:opacity-75 transition-opacity p-2 text-muted-foreground hover:text-red-500 cursor-pointer z-30"
            title="Admin"
          >
            <Lock size={16} />
          </button>
        </div>

        {/* CTA BUTON ÎNSCRIE-TE */}
        <div className="relative group flex items-center justify-center">
          
          <div 
            className="absolute inset-0 rounded-full opacity-35 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none transform-gpu"
            style={{
              background: 'radial-gradient(circle, rgba(var(--primary-rgb, 59, 130, 246), 0.38) 0%, transparent 70%)'
            }}
          />
          
          <ConfettiButton
            type="button"
            onClick={() => window.location.assign('/register')}
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] rounded-full bg-foreground text-background shadow-2xl ring-1 ring-primary/20 ring-offset-4 ring-offset-background hover:scale-[1.03] active:scale-95 transition-all duration-300 flex flex-col items-center justify-center p-6 sm:p-8 cursor-pointer relative z-10 transform-gpu"
          >
            <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter italic uppercase leading-none mb-2 text-background">
              Înscrie-te.
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] opacity-60 text-background">
              Gratuit. Acum și mereu.
            </span>
          </ConfettiButton>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 9. POP-UP MODAL ADMIN PERSONALIZAT */}
      {/* ========================================================================= */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl border border-red-500/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
            
            <button
              onClick={() => setIsAdminOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <Lock size={18} />
              </div>
              <div>
                <h4 className="text-base font-black uppercase tracking-tight text-white">Resetare Notă</h4>
                <p className="text-xs text-zinc-400">Panou Securizat Administrator</p>
              </div>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Parolă Secretă
                </label>
                <input
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introdu parola..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-red-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-medium text-red-400 bg-red-950/40 border border-red-500/30 rounded-lg p-2">
                  {errorMsg}
                </p>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-900 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50"
                >
                  {loading ? 'Resetare...' : 'Resetează'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}