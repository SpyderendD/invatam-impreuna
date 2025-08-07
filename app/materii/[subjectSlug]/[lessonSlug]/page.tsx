'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ALL_SUBJECTS_OBJECT, Lesson } from '@/lib/lessons'; 
import { useLessonProgress } from '@/hooks/useLessonProgress'; 
import { ChevronLeft, CheckCircle, PencilRuler, Sparkles, Loader2 } from 'lucide-react';
import React from 'react'; // Asigură-te că React este importat pentru JSX

// ============================================================================
// == CONȚINUTUL PENTRU LECȚIILE DE ROMÂNĂ (trebuie să rămână aici)
// ============================================================================
const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-lora prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-ul:list-disc prose-li:my-1 prose-blockquote:border-l-blue-500"
    >
        {children}
    </motion.article>
);

const ComingSoonContent = () => <ContentWrapper><p>Conținutul pentru această lecție este în curs de pregătire.</p></ContentWrapper>;

const RezumatulContent = () => ( <ContentWrapper><h2>I. Redactarea Rezumatului</h2>{/* ... restul conținutului ... */}</ContentWrapper> );
const JurnalulContent = () => ( <ContentWrapper><h2>II. Redactarea unei pagini de jurnal</h2>{/* ... restul conținutului ... */}</ContentWrapper> );
const ScrisoareaContent = () => ( <ContentWrapper><h2>III. Redactarea unei scrisori</h2>{/* ... restul conținutului ... */}</ContentWrapper> );
const EmailContent = () => ( <ContentWrapper><h2>IV. Redactarea unui e-mail</h2>{/* ... restul conținutului ... */}</ContentWrapper> );
const TextArgumentativContent = () => ( <ContentWrapper><h2>V. Redactarea unui text argumentativ</h2>{/* ... restul conținutului ... */}</ContentWrapper> );
const TextNarativContent = () => ( <ContentWrapper><h2>VI. Redactarea unui text narativ</h2>{/* ... restul conținutului ... */}</ContentWrapper> );
const TextDialogatContent = () => ( <ContentWrapper><h2>VII. Redactarea unui text dialogat</h2>{/* ... restul conținutului ... */}</ContentWrapper> );
const TextDescriptivContent = () => ( <ContentWrapper><h2>VIII. Redactarea unui text descriptiv</h2>{/* ... restul conținutului ... */}</ContentWrapper> );


// ============================================================================
// == COMPONENTA DISPECER (LessonContent)
// ============================================================================
const LessonContent = ({ lesson }: { lesson: Lesson }) => {
    switch (lesson.slug) {
        // Capitolul I
        case 'redactarea-rezumatului': return <RezumatulContent />;
        case 'redactarea-paginii-de-jurnal': return <JurnalulContent />;
        case 'redactarea-scrisorii': return <ScrisoareaContent />;
        case 'redactarea-emailului': return <EmailContent />;
        case 'textul-argumentativ': return <TextArgumentativContent />;
        case 'textul-narativ': return <TextNarativContent />;
        case 'textul-dialogat': return <TextDialogatContent />;
        case 'textul-descriptiv': return <TextDescriptivContent />;
        
        // Alte capitole - Placeholder
        default: return <ComingSoonContent />;
    }
};

// ============================================================================
// == COMPONENTA PRINCIPALĂ A PAGINII - MODIFICATĂ ȘI CORECTATĂ
// ============================================================================
type LessonPageParams = {
  params: {
    subjectSlug: keyof typeof ALL_SUBJECTS_OBJECT;
    lessonSlug: string;
  };
};

export default function LessonPage({ params }: LessonPageParams) {
    const { completedLessons, toggleLesson, isLoading: isProgressLoading } = useLessonProgress();
    
    const subjectData = ALL_SUBJECTS_OBJECT[params.subjectSlug];
    const lesson = subjectData?.chapters.flatMap(c => c.lessons).find(l => l.slug === params.lessonSlug);

    if (!lesson) {
        notFound();
    }

    const isCompleted = completedLessons.has(lesson.id);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 pt-12 md:pt-20">
                <div className="container max-w-4xl mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Button asChild variant="outline" className="mb-8 group transition-all duration-300 hover:border-primary">
                            <Link href={`/materii/${params.subjectSlug}`}>
                                <ChevronLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" /> Înapoi la listă
                            </Link>
                        </Button>
                        <Badge variant="secondary" className="mb-2">{lesson.type}</Badge>
                        <h1 className="font-lora text-4xl md:text-5xl font-medium text-foreground">{lesson.title}</h1>
                        <p className="mt-4 text-lg text-muted-foreground">Durata estimată: {lesson.duration}.</p>
                    </motion.div>
                    
                    <Separator className="my-12" />

                    <LessonContent lesson={lesson} />

                    <Separator className="my-12" />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-accent/50 p-8 rounded-2xl text-center border"
                    >
                        <Sparkles className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground">Ai parcurs teoria!</h2>
                        <p className="text-muted-foreground mt-2">Marchează lecția ca terminată pentru a-ți urmări progresul.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                            <Button size="lg" variant={isCompleted ? "secondary" : "default"} onClick={() => toggleLesson(lesson.id)} disabled={isProgressLoading}>
                                {isProgressLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                                {isCompleted ? 'Lecție completată' : 'Marchează ca terminat'}
                            </Button>
                            {lesson.quizSlug && (
                                <Button size="lg" variant="outline" asChild className="group">
                                    <Link href={`/materii/${params.subjectSlug}/test/${lesson.quizSlug}`}>
                                        <PencilRuler className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-[-15deg]" /> Mergi la Test
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}