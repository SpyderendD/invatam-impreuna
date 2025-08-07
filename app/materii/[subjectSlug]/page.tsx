'use client'; 

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import React, { useRef, MouseEvent } from 'react';
import { ALL_SUBJECTS_OBJECT, Chapter, Lesson } from '@/lib/lessons'; 
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookText, PencilRuler } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { ParticlesBackground } from '@/components/animations/ParticlesBackground';

// Tipul pentru params trebuie să se potrivească cu cheile din obiectul nostru
type SubjectPageParams = {
  params: { subjectSlug: keyof typeof ALL_SUBJECTS_OBJECT };
};

// --- Variante de Animație ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 }}};
const itemVariants = { hidden: { y: 20, opacity: 0, filter: 'blur(5px)' }, visible: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 100, damping: 12 }}};
const titleVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 15, stiffness: 100 }}};

// --- Componenta Card Capitol cu Animație 3D ---
const AnimatedChapterCard = ({ chapter, subjectSlug }: { chapter: Chapter; subjectSlug: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30, restDelta: 0.001 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30, restDelta: 0.001 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      variants={itemVariants}
    >
        <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }} className="absolute inset-4"/>
        <Card 
          className="flex flex-col border-border/60 shadow-lg bg-card/80 dark:bg-card/40 backdrop-blur-sm transition-shadow duration-300 hover:shadow-primary/20"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="p-6 flex items-center gap-4 border-b border-border/60" style={{ transform: "translateZ(40px)"}}>
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg border border-primary/20">{chapter.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{chapter.title}</h2>
              <p className="text-muted-foreground">{chapter.description}</p>
            </div>
          </div>
          <CardContent className="p-2" style={{ transform: "translateZ(20px)"}}>
            <ul className="divide-y divide-border/60">
              {chapter.lessons.map((lesson: Lesson) => (
                <li key={lesson.id}>
                  <Link href={`/materii/${subjectSlug}/${lesson.slug}`} className="group flex items-center justify-between p-4 transition-colors duration-200 hover:bg-accent rounded-md">
                    <div className="flex items-center gap-4">
                      {lesson.type === 'Teorie' ? <BookText className="h-5 w-5 text-muted-foreground flex-shrink-0" /> : <PencilRuler className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground leading-tight group-hover:text-accent-foreground">{lesson.title}</span>
                        <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                      </div>
                    </div>
                    <motion.div initial={{ x: -5, opacity: 0 }} whileHover={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 400 }} >
                      <ArrowRight className="h-5 w-5 text-muted-foreground/50 transition-colors duration-300" />
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
    </motion.div>
  );
};


// --- COMPONENTA PRINCIPALĂ A PAGINII ---
export default function SubjectPage({ params }: SubjectPageParams) {
  const subjectData = ALL_SUBJECTS_OBJECT[params.subjectSlug];

  if (!subjectData) {
    notFound();
  }

  const { title, chapters } = subjectData;

  return (
    <div className="min-h-screen bg-background relative">
      <ParticlesBackground />
      <main className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center mb-20">
          <motion.h1 variants={titleVariants} className="text-5xl md:text-7xl font-bold font-lora bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Alege un capitol pentru a începe. Parcurge teoria și testează-ți cunoștințele.
          </motion.p>
        </motion.div>
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-20" style={{ perspective: "1200px" }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
          {chapters.map((chapter: Chapter) => (
            <AnimatedChapterCard key={chapter.id} chapter={chapter} subjectSlug={params.subjectSlug} />
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  );   
}