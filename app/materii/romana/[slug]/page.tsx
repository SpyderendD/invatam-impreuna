'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { romanaChapters, Lesson } from '@/lib/lessons';
import { useTaskTracker } from '@/hooks/useTaskTracker';
import { ChevronLeft, CheckCircle, PencilRuler, Sparkles, Lightbulb } from 'lucide-react';

// Conținutul pentru lecția "Substantivul"
const SubstantivulContent = () => (
    <article className="prose prose-lg max-w-none text-gray-800 prose-headings:font-lora">
        <p className="lead">Bun venit! Substantivul este piesa centrală a propoziției, denumind ființe, obiecte, locuri și concepte.</p>
        <h2>Definiție și Identificare</h2>
        <p><strong>Substantivul</strong> este partea de vorbire care răspunde la întrebările <em>"cine?"</em> și <em>"ce?"</em>.</p>
        <Alert className="bg-blue-50 border-blue-200 my-6"><Lightbulb className="h-4 w-4 text-blue-600" /><AlertTitle>Sfat</AlertTitle><AlertDescription>Testează un cuvânt încercând să-l numeri ("o casă, două case"). Dacă funcționează, este un substantiv!</AlertDescription></Alert>
        <h2>Clasificare</h2>
        <ul><li><strong>Comune:</strong> <em>elev, oraș</em>.</li><li><strong>Proprii:</strong> <em>Andrei, București</em>.</li></ul>
    </article>
);

// Conținutul pentru lecția "Adjectivul"
const AdjectivulContent = () => (
    <article className="prose prose-lg max-w-none">
        <p className="lead">Adjectivul oferă culoare și detalii substantivelor.</p>
        <h2>Definiție</h2><p><strong>Adjectivul</strong> este partea de vorbire care exprimă o însușire și se acordă cu substantivul.</p>
    </article>
);

const LessonContent = ({ lesson }: { lesson: Lesson }) => {
    switch (lesson.slug) {
        case 'substantivul': return <SubstantivulContent />;
        case 'adjectivul': return <AdjectivulContent />;
        default: return <p>Conținut în curând...</p>;
    }
};

export default function LessonPage({ params }: { params: { slug: string } }) {
    const { completedTasks, toggleTask } = useTaskTracker();
    const lesson = romanaChapters.flatMap(chapter => chapter.lessons).find(l => l.slug === params.slug);

    if (!lesson) { notFound(); }
    
    const isCompleted = completedTasks.has(lesson.id);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-1 pt-12 md:pt-20">
                <div className="container max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Button asChild variant="outline" className="mb-8"><Link href="/materii/romana"><ChevronLeft className="h-4 w-4 mr-2" /> Înapoi la listă</Link></Button>
                        <Badge variant="secondary" className="mb-2">{lesson.type}</Badge>
                        <h1 className="font-lora text-5xl font-medium">{lesson.title}</h1>
                        <p className="mt-4 text-lg text-muted-foreground">Durata estimată: {lesson.duration}.</p>
                    </motion.div>
                    <Separator className="my-12" />
                    <LessonContent lesson={lesson} />
                    <Separator className="my-12" />
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 p-8 rounded-2xl text-center border">
                        <Sparkles className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Ai parcurs teoria!</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                            <Button size="lg" variant={isCompleted ? "secondary" : "default"} onClick={() => toggleTask(lesson.id)}><CheckCircle className="h-5 w-5 mr-2" />{isCompleted ? 'Lecție completată' : 'Am terminat lecția'}</Button>
                            {lesson.quizSlug && (<Button size="lg" variant="outline" asChild><Link href={`/materii/romana/test/${lesson.quizSlug}`}><PencilRuler className="mr-2 h-5 w-5" /> Mergi la Test</Link></Button>)}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}