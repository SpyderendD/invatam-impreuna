'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// --- Componente UI/Custom ---
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import CustomCursor from '@/components/animations/CustomCursor';
import { ConfettiButton } from '@/components/animations/confetti-button';
import HeartRating from '@/components/HeartRating';
// Importul critic pentru animația cu cartea
import InteractiveHeroIllustration from '@/components/animations/InteractiveHeroIllustration'; 

// --- Iconițe ---
import { 
    Code, PenTool, Sparkles, Rocket, ArrowRight, 
    BookOpenCheck, Calculator, Lightbulb, FlaskConical,
    History, Lock, Zap, Layers, 
} from 'lucide-react'; 

// --- Varianțe de animație ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// =======================================================================
// Date
// =======================================================================

const featuresData = [
  { 
    title: "Structură Logică", 
    description: "Lecții clare care urmăresc exact programa școlară.", 
    icon: <BookOpenCheck className="h-6 w-6 text-white" />,
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    title: "Interactivitate", 
    description: "Teste și quiz-uri integrate pentru a învăța activ.", 
    icon: <Zap className="h-6 w-6 text-white" />,
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    title: "Acces Gratuit", 
    description: "Platforma este deschisă 24/7, fără costuri ascunse.", 
    icon: <Layers className="h-6 w-6 text-white" />,
    gradient: "from-orange-500 to-amber-500"
  },
];

// 1. Materii Evaluare Națională
const evaluationSubjects = [
  { 
    title: "Limba Română", 
    icon: <PenTool className="h-8 w-8" />, 
    href: "/materii/romana", 
    isActive: true 
  },
  { 
    title: "Matematică", 
    icon: <Calculator className="h-8 w-8" />, 
    href: "/materii/matematica", 
    isActive: true 
  },
  { 
    title: "Informatică", 
    icon: <Code className="h-8 w-8" />, 
    href: "/materii/informatica", 
    isActive: true 
  },
  { 
    title: "Chimie", 
    icon: <FlaskConical className="h-8 w-8" />, 
    href: "https://www.fizichim.ro/docs/chimie/clasa7/capitolul1-chimia-stiinta-a-naturii/I-1-ce-este-chimia/", 
    isActive: true, 
    openInNewTab: true 
  },
  { 
    title: "Fizică", 
    icon: <Lightbulb className="h-8 w-8" />,  
    href: "https://www.fizichim.ro/docs/fizica/clasa6/capitolul1-introducere-in-studiul-fizicii/I-1-ce-este-fizica", 
    isActive: true, 
    openInNewTab: true 
  },
];

// 2. Materii Bacalaureat (Configurația cerută)
const baccalaureateSubjects = [
  { 
    title: "Limba Română (BAC)", 
    icon: <PenTool className="h-8 w-8" />, 
    href: "#", 
    isActive: false 
  },
  { 
    title: "Matematică (BAC)", 
    icon: <Calculator className="h-8 w-8" />, 
    href: "#", 
    isActive: false 
  },
  { 
    title: "Informatică", 
    icon: <Code className="h-8 w-8" />, 
    href: "/materii/informatica", 
    isActive: true 
  },
  { 
    title: "Chimie", 
    icon: <FlaskConical className="h-8 w-8" />, 
    href: "https://www.fizichim.ro/docs/chimie/clasa7/capitolul1-chimia-stiinta-a-naturii/I-1-ce-este-chimia/", 
    isActive: true, 
    openInNewTab: true 
  },
  { 
    title: "Fizică", 
    icon: <Lightbulb className="h-8 w-8" />,  
    href: "https://www.fizichim.ro/docs/fizica/clasa6/capitolul1-introducere-in-studiul-fizicii/I-1-ce-este-fizica", 
    isActive: true, 
    openInNewTab: true 
  },
  { 
    title: "Contabilitate", 
    icon: <Calculator className="h-8 w-8" />, 
    href: "#", 
    isActive: false 
  },
];

// =======================================================================
// Componenta SubjectCard - Design "Glass"
// =======================================================================
interface SubjectCardProps {
  title: string;
  icon: ReactNode;
  href: string;
  isActive: boolean;
  delay: number;
  openInNewTab?: boolean;
}

const SubjectCard = ({ title, icon, href, isActive, delay, openInNewTab = false }: SubjectCardProps) => {
  const isExternal = openInNewTab || href.startsWith('http') || href.startsWith('https');

  const CardContent = (
    <motion.div
      whileHover={isActive ? { y: -8, scale: 1.02 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className={`
        group relative h-full flex flex-col justify-between p-8 overflow-hidden rounded-3xl border transition-all duration-500
        ${isActive 
          ? 'bg-gradient-to-br from-card/90 to-card/40 backdrop-blur-md border-white/10 hover:border-primary/50 shadow-lg hover:shadow-2xl hover:shadow-primary/20' 
          : 'bg-muted/10 border-white/5 opacity-60 hover:opacity-80 cursor-not-allowed'}
      `}
    >
      {/* Glow effect fundal */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
            <div className={`
                p-4 rounded-2xl transition-all duration-500 relative shadow-sm
                ${isActive 
                    ? 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3' 
                    : 'bg-muted/50 text-muted-foreground'}
            `}>
                {icon}
            </div>
            
            {!isActive && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 text-muted-foreground text-[10px] font-bold border border-white/5 backdrop-blur-md uppercase tracking-wide">
                    <Lock className="w-3 h-3" /> În lucru
                </div>
            )}
        </div>
        
        <h3 className={`text-xl font-bold tracking-tight mb-2 ${isActive ? 'text-foreground group-hover:text-primary transition-colors' : 'text-muted-foreground'}`}>
            {title}
        </h3>
      </div>

      <div className="relative z-10 mt-6">
        {isActive ? (
            <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform duration-300">
                Accesează Lecțiile <ArrowRight className="ml-2 w-4 h-4" />
            </div>
        ) : (
            <div className="h-1 w-12 bg-muted-foreground/30 rounded-full"></div>
        )}
      </div>
    </motion.div>
  );
  
  return (
    <div className="h-full">
      {isActive ? (
        isExternal ? (
          <a href={href} className="block h-full outline-none" target="_blank" rel="noopener noreferrer">
            {CardContent}
          </a>
        ) : (
          <Link href={href} className="block h-full outline-none">
            {CardContent}
          </Link>
        )
      ) : (
        <div className="h-full select-none">
          {CardContent}
        </div>
      )}
    </div>
  );
};

// =======================================================================
// Componenta Principală
// =======================================================================
export default function Home() {
  return (
    <>
      <CustomCursor />
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 bg-background">
        
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
                animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px]" 
            />
            <motion.div 
                animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[100px]" 
            />
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div
              className="flex flex-col justify-center text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              

              <motion.h1
                className="font-lora text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
                variants={fadeInUp}
              >
                Pregătire <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary animate-gradient">
                  pentru Succes
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
                Platforma unde materia devine clară. Resurse complete pentru Evaluare Națională și Bacalaureat, explicate simplu și vizual.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Button asChild size="lg" className="h-14 px-8 text-base rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1 bg-primary text-primary-foreground border-0">
                  <Link href="/register"><Rocket className="mr-2 h-5 w-5" /> Începe Gratuit</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base rounded-2xl border-2 hover:bg-muted/50 backdrop-blur-sm">
                  <Link href="#materii">Vezi Materiile</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* AICI ESTE ILUSTRAȚIA JECHERA (FIXATĂ) */}
            {/* Am adăugat w-full și min-h-[500px] pentru a forța containerul să nu colapseze */}
            <motion.div 
                className="hidden lg:flex items-center justify-center relative z-20 w-full h-full min-h-[500px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
              <div className="scale-110 drop-shadow-2xl w-full h-full flex items-center justify-center">
                <InteractiveHeroIllustration />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Feedback-ul tău contează:
            </p>
            <HeartRating slug="contact-feedback" />
          </div>
      </section>

      

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-background relative z-10 border-y border-white/5">
        <div className="container">
          <motion.div className="text-center mb-16 max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">De ce să alegi platforma noastră?</h2>
            <p className="text-lg text-muted-foreground">Focus pe ce contează. Fără reclame, fără distragere.</p>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
            {featuresData.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}
                className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg shadow-black/10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- MATERII SECTION --- */}
      <section id="materii" className="py-32 relative overflow-hidden bg-background">
        <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute top-[20%] -right-[20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container relative z-10">
          <motion.div className="text-center mb-24 max-w-4xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">Explorează Materiile</h2>
            <p className="text-xl text-muted-foreground">Structurate perfect pentru nivelul tău.</p>
          </motion.div>
          
          {/* 1. EVALUARE NATIONALA */}
          <div className="mb-24 relative">
             <motion.div 
              className="flex items-center gap-6 mb-12 pl-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-1.5 bg-gradient-to-b from-primary to-transparent rounded-full shadow-[0_0_15px_hsl(var(--primary))]"></div>
              <div>
                <h3 className="text-3xl font-bold text-foreground">Evaluarea Națională</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Clasele V - VIII</p>
              </div>
            </motion.div>

            <motion.div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
              {evaluationSubjects.map((subject, index) => (
                <SubjectCard 
                  key={subject.title}
                  title={subject.title} 
                  icon={subject.icon} 
                  href={subject.href} 
                  isActive={subject.isActive} 
                  delay={index * 100}
                  openInNewTab={subject.openInNewTab}
                />
              ))}
            </motion.div>
          </div>

          {/* 2. BACALAUREAT */}
          <div className="relative">
            <div className="absolute -top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50"></div>

            <motion.div 
              className="flex items-center gap-6 mb-12 pl-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-1.5 bg-gradient-to-b from-blue-500 to-transparent rounded-full"></div>
              <div>
                <h3 className="text-3xl font-bold text-foreground">Bacalaureat</h3>
                <div className="flex items-center gap-3">
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Liceu (IX - XII)</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
              {baccalaureateSubjects.map((subject, index) => (
                <SubjectCard 
                  key={subject.title}
                  title={subject.title} 
                  icon={subject.icon} 
                  href={subject.href} 
                  isActive={subject.isActive} 
                  delay={index * 100}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeInUp}>
            <div className="relative rounded-3xl bg-primary p-12 md:p-20 text-center text-primary-foreground overflow-hidden shadow-2xl shadow-primary/25">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
              <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 blur-3xl rounded-full"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">Viitorul tău începe azi.</h2>
                <p className="mx-auto max-w-2xl text-lg sm:text-xl opacity-90 mb-10 font-medium leading-relaxed">
                    Alătură-te comunității noastre și transformă modul în care înveți. Totul este gratuit și la un click distanță.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <ConfettiButton asChild size="lg" variant="secondary" className="text-lg px-10 py-7 rounded-xl shadow-xl hover:scale-105 transition-transform font-bold text-primary">
                      <Link href="/register"><Sparkles className="mr-2 h-5 w-5" /> Creează Cont Gratuit</Link>
                    </ConfettiButton>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}