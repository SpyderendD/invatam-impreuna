'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { romanaChapters, Lesson, Chapter } from '@/lib/lessons';
import { useTaskTracker } from '@/hooks/useTaskTracker';
import { Check, Lock, ChevronRight, Trophy, Sparkles, PencilRuler } from 'lucide-react';

const fadeInItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const AnimatedCheckbox = ({ checked, onToggle }: { checked: boolean, onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 border-2 ${checked ? 'bg-primary border-primary' : 'bg-gray-100 border-gray-300 hover:border-primary'}`}>
        <motion.div initial={false} animate={{ scale: checked ? 1 : 0 }}><Check className="w-5 h-5 text-white" /></motion.div>
    </button>
);

const LessonCard = ({ lesson, isCompleted, onToggle }: { lesson: Lesson; isCompleted: boolean; onToggle: () => void; }) => (
    <motion.div variants={fadeInItem} className={`p-5 rounded-2xl border-2 transition-all duration-300 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-transparent shadow-sm'}`}>
        <div className="flex items-start gap-4">
            <AnimatedCheckbox checked={isCompleted} onToggle={onToggle} />
            <div className="flex-grow">
                <h3 className={`font-bold text-gray-900 ${isCompleted ? 'line-through text-gray-500' : ''}`}>{lesson.title}</h3>
                <div className="flex items-center gap-2 mt-1"><Badge variant={lesson.type === 'Teorie' ? 'default' : 'secondary'}>{lesson.type}</Badge><span className="text-xs text-gray-500">{lesson.duration}</span></div>
            </div>
        </div>
        <div className="flex items-center gap-3 mt-4 pl-11">
            <Button asChild size="sm" variant={isCompleted ? "outline" : "default"}><Link href={`/materii/romana/${lesson.slug}`}>{isCompleted ? 'Recapitulează' : 'Începe Lecția'}</Link></Button>
            <AnimatePresence>
                {isCompleted && lesson.quizSlug && (
                    <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}>
                        <Button asChild size="sm" variant="secondary"><Link href={`/materii/romana/test/${lesson.quizSlug}`}><PencilRuler className="mr-2 h-4 w-4" /> Test</Link></Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </motion.div>
);

const ChapterSection = ({ chapter, completedTasks, onToggleTask }: { chapter: Chapter; completedTasks: Set<string>; onToggleTask: (id: string) => void; }) => {
    const { progress, completedCount } = useMemo(() => {
        const completed = chapter.lessons.filter(l => completedTasks.has(l.id)).length;
        const prog = chapter.lessons.length > 0 ? Math.round((completed / chapter.lessons.length) * 100) : 0;
        return { progress: prog, completedCount: completed };
    }, [chapter, completedTasks]);

    const handleToggle = (lessonId: string) => {
        const wasCompleted = completedTasks.has(lessonId);
        onToggleTask(lessonId);
        const newCompletedCount = wasCompleted ? completedCount - 1 : completedCount + 1;
        if (!wasCompleted && newCompletedCount === chapter.lessons.length) { confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } }); }
    };

    return (
        <motion.div className="relative pl-12 md:pl-16 py-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
            <div className="absolute top-[52px] left-[22px] w-0.5 h-[calc(100%-52px)] bg-gray-200" />
            <motion.div variants={fadeInItem} className="absolute top-10 left-0 w-11 h-11 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center">{chapter.icon}</motion.div>
            <motion.div variants={fadeInItem} className="mb-8"><h2 className="text-3xl font-bold">{chapter.title}</h2><p className="mt-1 text-gray-500">{chapter.description}</p>
                <div className="mt-4 max-w-sm"><div className="flex justify-between text-sm"><p>Progres Capitol</p><p>{progress}%</p></div><div className="w-full bg-gray-200 rounded-full h-2 mt-1"><motion.div className="bg-primary h-2 rounded-full" animate={{width: `${progress}%`}}/></div></div>
            </motion.div>
            <div className="flex flex-col gap-4">{chapter.lessons.map((lesson) => (<LessonCard key={lesson.id} lesson={lesson} isCompleted={completedTasks.has(lesson.id)} onToggle={() => handleToggle(lesson.id)} />))}</div>
        </motion.div>
    );
};

const ProgressDashboard = ({ completedTasks }: { completedTasks: Set<string> }) => {
    const { overallProgress, motivationalMessage } = useMemo(() => {
        const allLessons = romanaChapters.flatMap(c => c.lessons);
        const completedCount = allLessons.filter(l => completedTasks.has(l.id)).length;
        const progress = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
        let message = "Ești la început de drum.";
        if (progress > 50) message = "Ai trecut de jumătate! Continuă tot așa!";
        if (progress === 100) message = "Felicitări! Ai terminat toată materia!";
        return { overallProgress: progress, motivationalMessage: message };
    }, [completedTasks]);

    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white p-8 rounded-2xl border shadow-lg">
                <div className="flex items-center gap-6"><div className={`p-4 rounded-lg ${overallProgress === 100 ? 'bg-amber-100' : 'bg-primary/10'}`}>{overallProgress === 100 ? <Trophy className="h-10 w-10 text-amber-500" /> : <Sparkles className="h-10 w-10 text-primary" />}</div>
                    <div><h1 className="text-3xl font-bold">Progresul tău</h1><p className="text-gray-500">{motivationalMessage}</p></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-6"><motion.div className="bg-primary h-3 rounded-full" animate={{width: `${overallProgress}%`}}/></div>
            </div>
        </motion.div>
    );
};

export default function RomanaPage() {
    const { completedTasks, toggleTask, isLoading } = useTaskTracker();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><p>Se încarcă progresul...</p></div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 pt-24"><div className="container max-w-4xl mx-auto">
                <ProgressDashboard completedTasks={completedTasks} />
                <div className="mt-12">{romanaChapters.map((chapter) => (<ChapterSection key={chapter.id} chapter={chapter} completedTasks={completedTasks} onToggleTask={toggleTask} />))}</div>
            </div></main>
            <Footer />
        </div>
    );
}