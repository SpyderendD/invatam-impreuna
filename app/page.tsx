'use client';

import Link from 'next/link';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

// --- Componente UI/Custom ---
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import CustomCursor from '@/components/animations/CustomCursor';
import { ConfettiButton } from '@/components/animations/confetti-button';
import HeartRating from '@/components/HeartRating';

// --- Iconițe ---
import { 
    BookOpen, Code, PenTool, Sparkles, Rocket, ArrowRight, 
    BookOpenCheck, Calculator, Lightbulb, FlaskConical, Leaf, ScrollText 
} from 'lucide-react'; 

// --- Varianțe de animație reutilizabile ---
const sectionFadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "circOut" }
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// =======================================================================
// Date Centralizate pentru o gestionare mai ușoară
// =======================================================================

const featuresData = [
  { 
    title: "Conținut Structurat", 
    description: "Lecții clare, la obiect, care urmăresc exact programa școlară.", 
    icon: <BookOpenCheck className="h-8 w-8 text-primary" /> 
  },
  { 
    title: "Metode Interactive", 
    description: "Teste, quiz-uri și exerciții practice pentru a-ți consolida cunoștințele.", 
    icon: <Sparkles className="h-8 w-8 text-primary" /> 
  },
  { 
    title: "Flexibilitate Totală", 
    description: "Învață în propriul tău ritm, oricând și de oriunde.", 
    icon: <Rocket className="h-8 w-8 text-primary" /> 
  },
];

const subjectsData = [
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


// =======================================================================
// 1. Componenta InteractiveHeroIllustration
// =======================================================================
function InteractiveHeroIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const parallax = (value: any, distance: number) => useTransform(value, [0, 1], [-distance, distance]);

  
 const icons = [
    { id: 1, icon: <PenTool size={24} />, color: 'text-amber-500', pos: 'top-[15%] left-[20%]', dist: 30, duration: 10 },
    { id: 2, icon: <Code size={24} />, color: 'text-sky-500', pos: 'top-[40%] left-[5%]', dist: 40, duration: 12 },
    { id: 3, icon: <Lightbulb size={24} />, color: 'text-yellow-500', pos: 'bottom-[15%] left-[25%]', dist: 25, duration: 11 },
    { id: 4, icon: <Calculator size={24} />, color: 'text-emerald-500', pos: 'top-[10%] right-[20%]', dist: 35, duration: 9 },
    { id: 5, icon: <FlaskConical size={24} />, color: 'text-red-500', pos: 'bottom-[10%] right-[25%]', dist: 20, duration: 13 }
  ];

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-96 w-full"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="absolute inset-10" style={{ x: parallax(mouseX, 5), y: parallax(mouseY, 5) }}>
        <div className="w-full h-full bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ x: parallax(mouseX, 15), y: parallax(mouseY, 15) }}
        animate={{ translateY: ["0%", "-10%", "0%"] }}
        transition={{
          translateY: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <BookOpen className="h-36 w-36 text-primary" />
      </motion.div>

      {icons.map((item, i) => (
        <motion.div
          key={item.id}
          className={`absolute p-4 rounded-full shadow-lg ${item.pos} ${item.color} bg-card/70 backdrop-blur-sm`}
          style={{ x: parallax(mouseX, item.dist), y: parallax(mouseY, item.dist) }}
          variants={{
            hidden: { opacity: 0, scale: 0 },
            visible: { opacity: 1, scale: 1, transition: { delay: 0.5 + i * 0.15 } },
          }}
          animate={{ translateY: ["0%", "15%", "0%"] }}
          transition={{
            translateY: {
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </motion.div>
  );
}


// =======================================================================
// 2. Componenta SubjectCard
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
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`p-6 h-full text-left flex flex-col justify-between relative overflow-hidden rounded-xl transition-shadow duration-300 shadow-md ${isActive ? 'bg-card shadow-foreground/10' : 'bg-muted shadow-transparent'}`}
    >
      <div>
        <div className={`text-primary bg-primary/10 rounded-lg p-3 mb-4 w-fit ${!isActive ? 'opacity-50' : ''}`}>
          {icon}
        </div>
        <CardTitle className={`text-lg font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</CardTitle>
      </div>
      <p className={`text-sm mt-4 flex items-center gap-1 transition-all ${isActive ? 'text-primary group-hover:gap-2' : 'font-semibold text-muted-foreground'}`}>
        {isActive ? 'Vezi lecțiile' : 'În curând'}
        {isActive && <ArrowRight className="h-4 w-4" />}
      </p>
    </motion.div>
  );
  
  const delayedFadeIn = {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { 
            duration: 0.8, 
            ease: "circOut",
            delay: delay / 1000 
        }
      },
  };
    
  return (
    <motion.div variants={delayedFadeIn} className="h-full">
      {isExternal ? (
        <a 
          href={href} 
          className={`block group h-full ${!isActive ? 'pointer-events-none' : ''}`}
          target="_blank" 
          rel="noopener noreferrer" 
        >
          {CardContent}
        </a>
      ) : (
        <Link 
          href={isActive ? href : '#'} 
          className={`block group h-full ${!isActive ? 'pointer-events-none' : ''}`}
        >
          {CardContent}
        </Link>
      )}
    </motion.div>
  );
};

// =======================================================================
// 3. Componenta principală Home (App)
// =======================================================================
export default function Home() {
  return (
    <>
      <CustomCursor />
      {/* Secțiunea Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32 bg-background">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div
              className="flex flex-col justify-center text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1
                className="font-lora text-5xl md:text-7xl font-medium tracking-tight text-foreground leading-tight"
                variants={sectionFadeIn}
              >
                Pregătire <br className="hidden md:block" /> pentru Succes
              </motion.h1>
              
              <motion.p variants={sectionFadeIn} className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Explorează, învață și excelează. Resurse complete pentru Evaluare Națională și alte materii esențiale.
              </motion.p>
              
              <motion.div variants={sectionFadeIn} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1">
                  <Link href="/register"><Rocket className="mr-2 h-5 w-5" /> Începe Gratuit</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#materii">Vezi Materiile</Link>
                </Button>
              </motion.div>
            </motion.div>

            <div className="hidden lg:flex items-center justify-center">
              <InteractiveHeroIllustration />
            </div>
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Îți place proiectul? Dă-i o notă (1 = slab, 10 = foarte bun):
            </p>
            <HeartRating slug="contact-feedback" />
          </div>
        </div>
      </section>

      {/* Secțiunea Features */}
      <section className="py-24 bg-background border-y border-border">
        <div className="container">
          <motion.div className="text-center mb-16 max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionFadeIn}>
            <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl text-foreground">O Experiență de Învățare Completă</h2>
            <p className="mt-4 text-lg text-muted-foreground">Oferim instrumentele de care ai nevoie pentru a învăța eficient și a obține rezultate maxime.</p>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
            {featuresData.map((feature) => (
              <motion.div key={feature.title} variants={sectionFadeIn}
                className="group relative p-8 rounded-xl transition-shadow duration-300 bg-card shadow-md shadow-foreground/10 text-center h-full overflow-hidden">
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 70%)', transform: 'scale(2.5)' }} />
                <div className="relative z-10">
                  <div className="bg-primary/10 text-primary rounded-full p-4 w-fit mx-auto mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Secțiunea Materii */}
      <section id="materii" className="py-24 bg-background">
        <div className="container">
          <motion.div className="text-center mb-16 max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionFadeIn}>
            <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl text-foreground">Alege-ți Drumul</h2>
            <p className="mt-4 text-lg text-muted-foreground">Fiecare materie este o nouă aventură. Începe cu cea care te pasionează cel mai mult.</p>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
            {subjectsData.map((subject, index) => (
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
      </section>

      {/* Secțiunea CTA */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={sectionFadeIn}>
            <div className="rounded-2xl bg-primary p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full opacity-50"></div>
              <div className="absolute -top-16 -left-16 w-40 h-40 bg-white/10 rounded-full opacity-50"></div>
              <h2 className="text-3xl sm:text-4xl font-bold">Ești gata să începi?</h2>
              <p className="mx-auto mt-4 max-w-xl opacity-80">Creează-ți contul gratuit în mai puțin de un minut și deblochează accesul la toate resursele noastre.</p>
              <div className="mt-8">
                <ConfettiButton asChild size="lg" variant="secondary" className="shadow-lg transform hover:scale-105">
                  <Link href="/register"><Sparkles className="mr-2 h-5 w-5" /> Înscrie-te Acum</Link>
                </ConfettiButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}