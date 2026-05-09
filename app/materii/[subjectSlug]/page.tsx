'use client'; 

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import React from 'react';
import { ALL_SUBJECTS_OBJECT, Chapter, Lesson } from '@/lib/lessons'; 
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookText, PencilRuler } from 'lucide-react';
import { ParticlesBackground } from '@/components/animations/ParticlesBackground';

// Tipul pentru params
type SubjectPageParams = {
  params: { subjectSlug: keyof typeof ALL_SUBJECTS_OBJECT };
};

// Variante de Animație
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 }}};
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 }}};
const titleVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 15 }}};

// ============================================================================
// == COMPONENTA CARD CAPITOL (SIMPLIFICATĂ, FĂRĂ 3D)
// ============================================================================
const AnimatedChapterCard = ({ chapter, subjectSlug }: { chapter: Chapter; subjectSlug: string }) => {
  return (
    <motion.div variants={itemVariants}>
        <Card className="flex flex-col border-border/60 shadow-lg bg-card/80 dark:bg-card/40 backdrop-blur-sm transition-shadow duration-300 hover:shadow-primary/20">
          <div className="p-6 flex items-center gap-4 border-b border-border/60">
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg border border-primary/20">{chapter.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{chapter.title}</h2>
              <p className="text-muted-foreground">{chapter.description}</p>
            </div>
          </div>
          <CardContent className="p-2">
            <ul className="divide-y divide-border/60">
              {chapter.lessons.map((lesson: Lesson) => (
                <li key={lesson.id}>
                  <Link href={`/materii/${subjectSlug}/${lesson.slug}`} className="group w-full flex items-center justify-between p-4 transition-colors duration-200 hover:bg-accent rounded-md">
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

// ============================================================================
// == COMPONENTA PRINCIPALĂ A PAGINII
// ============================================================================
export default function SubjectPage({ params }: SubjectPageParams) {
  const subjectData = ALL_SUBJECTS_OBJECT[params.subjectSlug];

  if (!subjectData) {
    notFound();
  }

  const { title, chapters } = subjectData;

  return (
    <div className="bg-background relative">
      <ParticlesBackground />
      <div className="container max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        
        {/* Titlul paginii */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center mb-20">
          <motion.h1 variants={titleVariants} className="text-5xl md:text-7xl font-bold font-lora bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Alege un capitol pentru a începe. Parcurge teoria și testează-ți cunoștințele.
          </motion.p>
        </motion.div>
        
        {/* ========================================================= */}
        {/* == LAYOUT MASONRY CU CSS COLUMNS (FĂRĂ SPAȚII GOALE) == */}
        {/* ========================================================= */}
        <motion.div 
          className="columns-1 lg:columns-2 gap-x-12 [&>*]:break-inside-avoid-column" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.1 }} 
          variants={containerVariants}
        >
          {chapters.map((chapter: Chapter) => (
            <div key={chapter.id} className="mb-12">
              <AnimatedChapterCard chapter={chapter} subjectSlug={params.subjectSlug} />
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );   
}